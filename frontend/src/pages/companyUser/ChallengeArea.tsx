import { Keyboard, Timer, Trophy } from "lucide-react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { ClipboardEvent, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeGameData } from "../../api/companyUser/challenge";
import { useSelector } from "react-redux";
import { useChallengeSocket } from "../../hooks/companyUser/useChallengeSocket";
import { useChallengeKeydown } from "../../hooks/companyUser/useChallengeKeydown";
import { useChallengeTimer } from "../../hooks/companyUser/useChallengeTimer";
import { useTypingStats } from "../../hooks/useTypingStats";
import { getMappedKey } from "../../utils/keyboardLayouts";
import { useTypingScroll } from "../../hooks/useTypingScroll";
export type GamePlayerResult = {
  userId: string;
  wpm: number;
  accuracy: number | null;
  errors: number;
  typedLength: number;
  status: "TIMES_UP" | "FINISHED" | "PLAYING" | "LEFT";
  updatedAt: number;
  name: string;
  imageUrl: string;
  timeTaken: number;
  rank?: number;
};
export interface ChallengeGame {
  id: string;
  startedAt: string;
  status: string;
  duration: number;
  companyId: string;
  countDown: number;

  lesson: {
    id: string;
    title: string;
    text: string;
  };

  players: {
    name: string;
    imageUrl: string;
    companyId: string;
    companyRole: string | null;
    bio: string | null;
  }[];
}
export interface LivePlayer {
  userId: string;
  name: string;
  imageUrl: string;
  companyId: string;
  companyRole: string | null;
  bio: string | null;
  typedLength: number;

  wpm: number;
  accuracy: number;
  errors: number;
  progress: number;
  timeTaken?: string;
  color?: string;
}
export default function ChallengeArea() {
  useEffect(() => {
    // Prevent default touch behaviors (like pinch-to-zoom and swipe-to-scroll)
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent multi-touch zoom
      }
    };

    const preventScroll = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent ctrl+scroll zoom
      }
    };

    // Add non-passive listeners to explicitly block default behavior
    document.addEventListener("touchmove", preventDefault, { passive: false });
    document.addEventListener("wheel", preventScroll, { passive: false });

    // Lock body overflow
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Cleanup on unmount
      document.removeEventListener("touchmove", preventDefault);
      document.removeEventListener("wheel", preventScroll);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const preventCopyPaste = (e: ClipboardEvent) => {
    e.preventDefault();
  };

  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challengeData, setChallengeData] = useState<ChallengeGame | null>(null);
  const [players, setPlayers] = useState<LivePlayer[] | null>(null);
  const [errors, setErrors] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY" | "TIMES_UP">("COUNTDOWN");
  const [countdown, setCountdown] = useState(3);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [typedText, setTypedText] = useState("");
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const [totalTyped, setTotalTyped] = useState(0);
  const [finalResult, setFinalResult] = useState<GamePlayerResult[]>([]);
  const user = useSelector((state: any) => state.auth.user);

  const [hasError, setHasError] = useState(false);
  const keyboardLayout = useSelector((state: any) => state.auth.keyboardLayout);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!challengeId) return;

        const response = await getChallengeGameData(challengeId);
        const data = response.data.data;
        const livePlayers: LivePlayer[] = data.players.map((player: any) => ({
          name: player.name,
          imageUrl: player.imageUrl,
          companyId: player.companyId,
          companyRole: player.companyRole,
          bio: player.bio,
          wpm: 0,
          accuracy: 0,
          errors: 0,
          progress: 0,
          typedLength: 0,
          userId: player.id || player._id,
          timeTaken: player.timeTaken || "00:00",
          color: player.color || "bg-orange-400",
        }));
        setChallengeData(data);
        setPlayers(livePlayers);
      } catch (error) {
        console.error("Error fetching challenge game data:", error);
      }
    };

    fetchData();
  }, [challengeId]);

  const { wpm, accuracy } = useTypingStats(totalTyped, errors, elapsedTime, phase, isFinished);

  useTypingScroll({
    activeCharRef,
    snippetContainerRef,
    typedText,
  });

  useChallengeTimer({
    startedAt: challengeData?.startedAt,
    duration: challengeData?.duration,
    countDown: challengeData?.countDown,
    isFinished,
    setPhase,
    setCountdown,
    setRemainingTime,
    setElapsedTime,
    setIsFinished,
  });

  useEffect(() => {
    if (!user?._id || !challengeData?.lesson?.text?.length) return;
    setPlayers(
      (prev) =>
        prev?.map((p) =>
          p.userId === (user?._id || user?.id)
            ? {
              ...p,
              typedLength: typedText.length,
              wpm: wpm || 0,
              accuracy: accuracy || 0,
              errors: errors,
              progress: isFinished
                ? 100
                : Math.min(100, Math.round((typedText.length / challengeData.lesson.text.length) * 100)),
            }
            : p
        ) ?? null
    );
  }, [typedText.length, wpm, accuracy, errors, isFinished, challengeData?.lesson?.text?.length, user?._id]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const renderTextWithHighlight = () => {
    if (!challengeData?.lesson?.text) return null;

    return challengeData.lesson.text.split("").map((char, index) => {
      let className = "text-gray-400"; // Untyped

      if (index < typedText.length) {
        const rawKey = typedText[index];
        const mappedKey = getMappedKey(rawKey, keyboardLayout);

        if (mappedKey === char) {
          className = "text-emerald-500"; // Correct
        } else {
          className = "text-rose-500 bg-rose-50 rounded-sm"; // Error
        }
      }

      const isCurrentChar = index === typedText.length;

      const cursorClass =
        isCurrentChar && phase === "PLAY" && !isFinished
          ? "after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[2px] after:bg-orange-500 after:animate-cursor-blink"
          : "";

      return (
        <span
          key={index}
          ref={isCurrentChar ? activeCharRef : null}
          className={`${className} relative inline-block transition-all duration-75 ${cursorClass}`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  //handle key down

  useChallengeKeydown({
    lessonText: challengeData?.lesson.text,
    challengeId: challengeId,
    currentUserId: user?._id,
    currentUserName: user?.name,
    currentUserImageUrl: user?.imageUrl,
    isFinished,
    phase,
    hasError,
    typedText,
    elapsedTime,
    wpm,
    accuracy,
    errors,
    totalTyped,
    setHasError,
    setTypedText,
    setTotalTyped,
    setErrors,
    setIsFinished,
    keyboardLayout,
  });
  useChallengeSocket({
    challengeId: challengeId,
    currentUserId: user?._id,
    user,
    phase,
    isFinished,
    typedText,
    wpm,
    accuracy,
    errors,
    elapsedTime,
    totalTyped: totalTyped,
    totalLength: challengeData?.lesson?.text?.length || 0,
    onPlayersUpdate: setPlayers,
    onGameFinished: setFinalResult,
  });
  if (finalResult.length > 0) {
    return (
      <>
        <CompanyUserNavbar />
        <div className="min-h-screen bg-[#FFF8EA] font-sans text-gray-800 flex flex-col pt-20 md:pt-24 px-2 md:px-4 pb-8 md:pb-12 overflow-y-auto">
          <div className="flex flex-col items-center justify-center gap-4 md:gap-8 animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto w-full">
            <div className="text-center space-y-1 md:space-y-2">
              <h1 className="text-2xl md:text-4xl font-black text-[#111827] tracking-tight flex items-center justify-center gap-2 md:gap-3">
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-orange-500 filter drop-shadow-lg" />
                Race Results
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-orange-500 filter drop-shadow-lg" />
              </h1>
              <p className="text-xs md:text-lg text-gray-500 font-bold uppercase tracking-[0.2em] opacity-60">The race has ended!</p>
            </div>

            <div className="w-full bg-white/90 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-orange-100 border border-orange-50 overflow-hidden transition-all duration-500">
              {/* Table Header */}
              <div className="grid grid-cols-[50px_1fr_60px_60px_60px] md:grid-cols-[100px_1fr_120px_120px_120px] gap-2 md:gap-4 p-5 md:p-8 bg-orange-50/30 border-b border-orange-50 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                <div className="text-center">Rank</div>
                <div>Player</div>
                <div className="text-right">WPM</div>
                <div className="text-right">ACC</div>
                <div className="text-right">Time</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-orange-50/50 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {finalResult
                  .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                  .map((result, index) => (
                    <div
                      key={result.userId}
                      className={`grid grid-cols-[50px_1fr_60px_60px_60px] md:grid-cols-[100px_1fr_120px_120px_120px] gap-2 md:gap-4 p-5 md:p-8 items-center transition-all duration-300
                      ${result.userId === user?._id ? "bg-orange-50/50 relative after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-orange-500" : "hover:bg-gray-50/50"}
                      ${result.status === "LEFT" ? "opacity-40 grayscale-[0.5]" : ""}
                    `}
                    >
                      {/* Rank */}
                      <div className="flex justify-center">
                        {result.status === "LEFT" ? (
                          <span className="text-[10px] text-red-400 font-black tracking-tighter uppercase rotate-[-15deg]">Quit</span>
                        ) : (
                          <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black shadow-lg border-2 text-xs md:text-xl transition-transform hover:scale-110 ${
                            result.rank === 1 ? "bg-gradient-to-br from-amber-100 to-orange-100 text-orange-600 border-orange-200" :
                            result.rank === 2 ? "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 border-slate-200" :
                            result.rank === 3 ? "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 border-amber-200" :
                            "bg-white text-gray-400 border-gray-50"
                          }`}>
                            {result.rank || index + 1}
                          </div>
                        )}
                      </div>

                      {/* Player */}
                      <div className="flex items-center gap-3 md:gap-5 overflow-hidden">
                        <div className="relative shrink-0">
                          <img
                            src={result.imageUrl}
                            alt={result.name}
                            className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 border-orange-50 bg-orange-50 object-cover shadow-sm"
                          />
                          {result.rank === 1 && (
                             <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-lg shadow-lg">
                                <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                             </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-gray-900 text-sm md:text-xl truncate flex items-center gap-2">
                            {result.name}
                            {result.userId === (user?._id || user?.id) && (
                              <span className="text-[10px] md:text-xs font-black bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">You</span>
                            )}
                          </p>
                          <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase truncate opacity-70">Racer</p>
                        </div>
                      </div>

                      {/* WPM */}
                      <div className="text-right font-black text-gray-900 text-sm md:text-3xl tracking-tight">
                        {result.status === "LEFT" ? "—" : result.wpm}
                      </div>

                      {/* Accuracy */}
                      <div className="text-right font-black text-emerald-500 text-sm md:text-2xl tracking-tight">
                        {result.status === "LEFT" ? "—" : `${result.accuracy}%`}
                      </div>

                      {/* Time */}
                      <div className="text-right font-mono font-black text-gray-400 text-[10px] md:text-lg">
                        {result.status === "LEFT" ? "—" : formatTime(result.timeTaken)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                onClick={() => navigate("/company/user/challenges")}
                className="px-8 py-4 rounded-2xl bg-white border-2 border-orange-100 text-gray-600 font-black hover:bg-orange-50 hover:border-orange-200 transition-all flex items-center gap-3 shadow-xl shadow-orange-100/50 text-sm md:text-base group"
              >
                <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                   </svg>
                </div>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CompanyUserNavbar />
      <div
        className="h-[100dvh] w-full bg-[#FFF8EA] text-gray-800 flex flex-col font-sans overflow-hidden select-none"
        style={{ touchAction: "none" }}
        onCopy={preventCopyPaste}
        onCut={preventCopyPaste}
        onPaste={preventCopyPaste}
      >
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center px-4 md:px-8 max-w-7xl mx-auto w-full gap-4 md:gap-6 py-4 md:py-8 overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="flex justify-between items-end w-full shrink-0 mb-2">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                  <Keyboard className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl md:text-4xl font-black text-gray-900 tracking-tight">
                  Live Challenge
                </h1>
              </div>
              <p className="text-gray-500 text-xs md:text-base font-medium flex items-center gap-1.5 ml-10">
                Race to the finish line!
              </p>
            </div>
            <div className="bg-[#FFFDF9] px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-[#FDE6C6] shadow-xl shadow-orange-100/50 flex items-center gap-3">
              <Timer className="w-5 h-5 md:w-6 md:h-6 text-orange-500 animate-pulse" />
              <h3 className="font-black text-gray-800 text-sm md:text-xl font-mono">
                {phase === "COUNTDOWN" ? `${countdown}s` : formatTime(remainingTime)}
              </h3>
            </div>
          </div>

          {/* Players Container */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-6 w-full shrink-0">
            {players &&
              players.map((player, index) => (
                <div
                  key={index}
                  className="flex-1 bg-[#FFFDF9] border border-[#FDE6C6] rounded-2xl md:rounded-[2rem] p-3 md:p-5 shadow-xl shadow-gray-200/50 relative overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.01]"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-3 md:mb-5 relative z-10">
                    <div className="relative shrink-0">
                      <img
                        src={player.imageUrl}
                        alt="Avatar"
                        className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 border-orange-100 bg-orange-50 object-cover shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-5 md:h-5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-black text-xs md:text-xl text-gray-900 leading-tight truncate">{player.name}</h3>
                      <p className="text-[10px] md:text-sm text-gray-500 mt-0.5 font-bold uppercase tracking-wider truncate opacity-70">{player.companyRole || "Racer"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-5 relative z-10">
                    {[
                      { label: "WPM", value: player.wpm, color: "text-orange-500", bg: "bg-orange-50" },
                      { label: "ACC", value: `${player.accuracy}%`, color: "text-emerald-500", bg: "bg-emerald-50" },
                      { label: "ERR", value: player.errors, color: "text-rose-500", bg: "bg-rose-50" },
                      { label: "TIME", value: player.timeTaken || "0:00", color: "text-blue-500", bg: "bg-blue-50" },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.bg} rounded-xl md:rounded-2xl p-2 md:p-3 border border-white/50 flex flex-col items-center justify-center`}>
                        <span className={`${stat.color} font-black text-[10px] md:text-xs mb-0.5 uppercase`}>{stat.label}</span>
                        <span className="text-sm md:text-2xl font-black text-gray-900 leading-none">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 mt-auto">
                    <div className="flex justify-between items-end mb-1.5 px-1">
                      <span className="text-[10px] md:text-xs font-black text-gray-400">PROGRESS</span>
                      <span className="text-[10px] md:text-xs font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{Math.round(player.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-100/50 rounded-full h-2 md:h-3 overflow-hidden border border-gray-50">
                      <div
                        className={`${player.color || "bg-orange-500"} h-full rounded-full transition-all duration-700 ease-out shadow-sm`}
                        style={{ width: `${Math.max(player.progress, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Decorative Background Element */}
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                </div>
              ))}
          </div>

          {/* Typing Area */}
          <div className="w-full bg-[#FFFDF9] rounded-2xl md:rounded-[2.5rem] border border-[#FDE6C6] p-6 md:p-12 shadow-2xl shadow-orange-100/30 flex flex-col relative flex-1 shrink min-h-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400"></div>
            <div
              ref={snippetContainerRef}
              className="relative z-10 text-gray-800 text-lg md:text-3xl lg:text-4xl leading-[1.6] md:leading-[1.8] font-mono tracking-tight flex-1 overflow-y-auto scroll-smooth custom-scrollbar pr-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style dangerouslySetInnerHTML={{ __html: ".custom-scrollbar::-webkit-scrollbar { display: none; }" }} />
              <div className="py-4 md:py-10">
                {renderTextWithHighlight()}
              </div>
            </div>
            
            {/* Overlay Gradients for smooth fade at top/bottom */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent z-20 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </>
  );
}
