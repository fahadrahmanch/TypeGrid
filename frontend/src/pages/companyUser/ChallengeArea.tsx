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
      let className = "text-gray-300";

      if (index < typedText.length) {
        const rawKey = typedText[index];
        const mappedKey = getMappedKey(rawKey, keyboardLayout);

        if (mappedKey === char) {
          className = "text-emerald-600 bg-emerald-50/50";
        } else {
          className = "text-red-500 bg-red-100 underline decoration-red-400";
        }
      }

      const isCurrentChar = index === typedText.length;

      const cursorClass =
        isCurrentChar && phase === "PLAY" && !isFinished ? "border-l-2 border-orange-500 animate-pulse -ml-[1px]" : "";

      return (
        <span
          key={index}
          ref={isCurrentChar ? activeCharRef : null}
          className={`${cursorClass} ${className} relative transition-colors duration-100`}
        >
          {char}
        </span>
      );
    });
  };
  useEffect(() => {
    if (activeCharRef.current && snippetContainerRef.current) {
      const container = snippetContainerRef.current;
      const element = activeCharRef.current;

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const relativeTop = elementRect.top - containerRect.top;
      const relativeBottom = elementRect.bottom - containerRect.top;

      // Keep cursor in middle-ish of view
      if (relativeBottom > containerRect.height / 2 || relativeTop < containerRect.height / 3) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [typedText]);

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
                <Trophy className="w-6 h-6 md:w-10 md:h-10 text-orange-500" />
                Results
                <Trophy className="w-6 h-6 md:w-10 md:h-10 text-orange-500" />
              </h1>
              <p className="text-[10px] md:text-sm text-gray-500 font-medium italic">The race has ended!</p>
            </div>

            <div className="w-full bg-white rounded-2xl md:rounded-[2rem] shadow-xl border border-[#FDE6C6] overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[40px_1fr_45px_45px_45px] md:grid-cols-[60px_1fr_80px_100px_100px] gap-2 md:gap-4 p-3 md:p-5 bg-orange-50/50 border-b border-[#FDE6C6] text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <div className="text-center">Rank</div>
                <div>Player</div>
                <div className="text-right">WPM</div>
                <div className="text-right">ACC</div>
                <div className="text-right">Time</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-orange-50">
                {finalResult
                  .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                  .map((result, index) => (
                    <div
                      key={result.userId}
                      className={`grid grid-cols-[40px_1fr_45px_45px_45px] md:grid-cols-[60px_1fr_80px_100px_100px] gap-2 md:gap-4 p-3 md:p-5 items-center hover:bg-orange-50/20 transition-colors
                      ${result.userId === user?._id ? "bg-orange-50/40" : ""}
                      ${result.status === "LEFT" ? "opacity-50" : ""}
                    `}
                    >
                      {/* Rank */}
                      <div className="flex justify-center">
                        {result.status === "LEFT" ? (
                          <span className="text-[8px] text-red-400 font-bold">LEFT</span>
                        ) : (
                          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center font-black shadow-sm border text-[10px] md:text-base ${
                            result.rank === 1 ? "bg-orange-100 text-orange-600 border-orange-200" :
                            result.rank === 2 ? "bg-slate-100 text-slate-600 border-slate-200" :
                            result.rank === 3 ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-white text-gray-400 border-gray-100"
                          }`}>
                            {result.rank || index + 1}
                          </div>
                        )}
                      </div>

                      {/* Player */}
                      <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                        <img
                          src={result.imageUrl}
                          alt={result.name}
                          className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-orange-100 bg-orange-50 object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-900 text-[10px] md:text-sm truncate">
                            {result.name}
                            {result.userId === (user?._id || user?.id) && (
                              <span className="text-[8px] text-orange-500 ml-1">(You)</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* WPM */}
                      <div className="text-right font-black text-gray-900 text-xs md:text-lg">
                        {result.status === "LEFT" ? "—" : result.wpm}
                      </div>

                      {/* Accuracy */}
                      <div className="text-right font-bold text-emerald-600 text-xs md:text-base">
                        {result.status === "LEFT" ? "—" : `${result.accuracy}%`}
                      </div>

                      {/* Time */}
                      <div className="text-right font-mono text-gray-500 text-[9px] md:text-xs">
                        {result.status === "LEFT" ? "—" : formatTime(result.timeTaken)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/company/user/challenges")}
              className="px-6 py-2.5 rounded-xl bg-white border border-[#FDE6C6] text-gray-600 font-bold hover:bg-orange-50 transition-all flex items-center gap-2 shadow-sm text-xs md:text-sm"
            >
              Back to Challenges
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CompanyUserNavbar />
      <div
        className="h-[100dvh] w-full bg-[#FFF8EA] text-gray-800 flex flex-col font-sans overflow-hidden select-none pt-20 md:pt-10"
        style={{ touchAction: "none" }}
        onCopy={preventCopyPaste}
        onCut={preventCopyPaste}
        onPaste={preventCopyPaste}
      >
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center px-3 md:px-8 max-w-7xl mx-auto w-full gap-3 md:gap-4 py-3 md:py-4 overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="flex justify-between items-center w-full shrink-0 mb-1">
            <div className="text-left">
              <h1 className="text-lg md:text-3xl font-extrabold text-[#111827] mb-0.5 tracking-tight">
                Live Challenge
              </h1>
              <p className="text-gray-500 text-[9px] md:text-sm font-medium flex items-center gap-1">
                <Keyboard className="w-3 h-3 md:w-3.5 md:h-3.5" /> Race to the finish!
              </p>
            </div>
            <div className="bg-white px-2 md:px-4 py-1.5 md:py-2 rounded-xl border border-[#FDE6C6] shadow-sm flex items-center gap-1.5 md:gap-2">
              <Timer className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-500 animate-pulse" />
              <h3 className="font-bold text-gray-800 text-[10px] md:text-sm">
                {phase === "COUNTDOWN" ? `${countdown}s` : formatTime(remainingTime)}
              </h3>
            </div>
          </div>

          {/* Players Container - Responsive Grid */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-4 w-full shrink-0">
            {players &&
              players.map((player, index) => (
                <div
                  key={index}
                  className="flex-1 bg-white border border-[#FDE6C6] rounded-xl md:rounded-[1.5rem] p-2.5 md:p-4 shadow-sm relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 md:mb-3 relative z-10">
                    <div className="relative shrink-0">
                      <img
                        src={player.imageUrl}
                        alt="Avatar"
                        className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl border border-orange-100 bg-orange-50 object-cover"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border border-white rounded-full"></div>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-[10px] md:text-base text-gray-900 leading-tight truncate">{player.name}</h3>
                      <p className="text-[8px] md:text-xs text-gray-500 mt-0.5 font-medium truncate">{player.companyRole}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-3 mb-2 md:mb-3 relative z-10">
                    <div className="bg-[#FFFDF9] rounded-lg md:rounded-xl p-1 md:p-2 border border-[#FDE6C6] flex flex-col items-center">
                      <span className="text-orange-500 font-bold text-[8px] md:text-[10px]">WPM</span>
                      <span className="text-xs md:text-xl font-extrabold text-gray-900 leading-none mt-1">{player.wpm}</span>
                    </div>
                    <div className="bg-[#FFFDF9] rounded-lg md:rounded-xl p-1 md:p-2 border border-[#FDE6C6] flex flex-col items-center">
                      <span className="text-green-500 font-bold text-[8px] md:text-[10px]">ACC</span>
                      <span className="text-xs md:text-xl font-extrabold text-gray-900 leading-none mt-1">{player.accuracy}%</span>
                    </div>
                    <div className="bg-[#FFFDF9] rounded-lg md:rounded-xl p-1 md:p-2 border border-[#FDE6C6] flex flex-col items-center">
                      <span className="text-red-500 font-bold text-[8px] md:text-[10px]">ERR</span>
                      <span className="text-xs md:text-xl font-extrabold text-gray-900 leading-none mt-1">{player.errors}</span>
                    </div>
                    <div className="bg-[#FFFDF9] rounded-lg md:rounded-xl p-1 md:p-2 border border-[#FDE6C6] flex flex-col items-center">
                      <span className="text-blue-500 font-bold text-[8px] md:text-[10px]">TIME</span>
                      <span className="text-xs md:text-xl font-extrabold text-gray-900 leading-none mt-1 truncate max-w-full">
                        {player.timeTaken || "0:00"}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                      <div
                        className={`${player.color} h-1 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(player.progress, 5)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                       <span className="text-[8px] font-bold text-orange-500">{Math.round(player.progress)}%</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Typing Area */}
          <div className="w-full bg-white rounded-xl md:rounded-[1.5rem] border border-[#FDE6C6] p-4 md:p-6 shadow-sm flex flex-col relative flex-1 shrink min-h-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300"></div>
            <div
              ref={snippetContainerRef}
              className="relative z-10 text-[#4A5568] text-sm md:text-lg lg:text-xl leading-[1.6] md:leading-[1.8] font-mono tracking-wide flex-1 overflow-hidden"
            >
              <span className="opacity-80 pointer-events-none">{renderTextWithHighlight()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
