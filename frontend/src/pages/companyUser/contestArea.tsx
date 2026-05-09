import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../../socket";
import { fetchContestAreaDetails } from "../../api/companyAdmin/companyContextAPI";
import { getMappedKey } from "../../utils/keyboardLayouts";
import { Trophy, Users } from "lucide-react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
// type PlayerStatus = "PLAYING" | "DISCONNECTED" | "FINISHED" | "LEFT";
import { useContestSocket } from "../../hooks/companyUser/useContestAreaSocket";
import { useTypingSound } from "../../hooks/useTypingSound";
// import { LivePlayer ,PlayerStatus} from "../../types/contest";
interface ContestRecord {
  _id: string;
  title: string;
  startTime: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  status: string;
  contestText: string;
  startedAt: string;
  rewards: [{ rank: number; prize: number }];
  countDown: number;
}
import { GamePlayerResult, LivePlayer } from "../../types/contest";

const ContestArea: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [contestData, setContestData] = useState<ContestRecord | null>();

  const user = useSelector((state: any) => state.auth.user);
  const keyboardLayout = useSelector((state: any) => state.auth.keyboardLayout);

  const [hasError, setHasError] = useState(false);

  const [livePlayers, setLivePlayers] = useState<LivePlayer[]>([]);

  const gameIdRef = useRef(contestData?._id);
  const userIdRef = useRef(user?._id);
  // Prevent default interactions like zoom, copy, paste, and scroll
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<number>(10);
  const [remainingTime, setRemainingTime] = useState<number>(Number(contestData?.duration));
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [totalTyped, setTotalTyped] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const [lesson, setLesson] = useState<string>(contestData?.contestText || "");
  const [finalResult, setFinalResult] = useState<GamePlayerResult[]>([]);

  const [typedText, setTypedText] = useState("");
  const { playTyping, playTypingError } = useTypingSound();
  const navigate = useNavigate();
  useEffect(() => {
    gameIdRef.current = contestData?._id;
    userIdRef.current = user?._id;
  }, [contestData?._id, user?._id]);

  // fetch contets Details
  useEffect(() => {
    if (!contestId) return;
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await fetchContestAreaDetails(contestId);
        if (!response?.data?.data) {
          navigate("/company/user/contests", { replace: true });
          return;
        }
        const data = response.data.data;
        setLesson(data.contestText);
        setContestData(data);
      } catch (error) {
        console.error("Error fetching contest details:", error);
        navigate("/company/user/contests", { replace: true });
      } finally {
        setLoading(false); // stop loadin
      }
    };
    fetchContest();
  }, [contestId]);

  //socket
  useContestSocket({
    contestId,
    user,
    contestData,
    phase,
    typedText,
    wpm,
    accuracy,
    errors,
    remainingTime,
    elapsedTime,
    totalTyped,
    gameIdRef,
    userIdRef,
    setLivePlayers,
    setFinalResult,
    setContestData,
    setTypedText,
    setErrors,
    setTotalTyped,
    setElapsedTime,
    setIsFinished,
    isFinished,
    finalResult,
  });

  useEffect(() => {
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    const preventTouchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    window.addEventListener("wheel", preventZoom, { passive: false });
    window.addEventListener("touchmove", preventTouchZoom, { passive: false });
    window.addEventListener("copy", preventCopyPaste);
    window.addEventListener("paste", preventCopyPaste);

    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("wheel", preventZoom);
      window.removeEventListener("touchmove", preventTouchZoom);
      window.removeEventListener("copy", preventCopyPaste);
      window.removeEventListener("paste", preventCopyPaste);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (activeCharRef.current && snippetContainerRef.current) {
      const container = snippetContainerRef.current;
      const element = activeCharRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top;
      const relativeBottom = elementRect.bottom - containerRect.top;

      if (relativeBottom > containerRect.height / 2 || relativeTop < containerRect.height / 3) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [typedText]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!contestData?.startTime || !contestData?.duration) return;
    const startTimesamp = new Date(contestData.startTime).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimesamp) / 1000);

      if (elapsed < contestData.countDown) {
        setPhase("COUNTDOWN");
        setCountdown(contestData.countDown - elapsed);
      } else if (elapsed < contestData.countDown + contestData.duration) {
        setPhase("PLAY");
        setRemainingTime(contestData.countDown + contestData.duration - elapsed);

        setElapsedTime(elapsed - contestData.countDown);
      } else {
        setPhase("PLAY");
        setRemainingTime(0);
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [contestData?.startTime, contestData?.duration, contestData?.countDown, isFinished]);

  //wpm
  useEffect(() => {
    if (phase !== "PLAY" || isFinished) return;
    if (elapsedTime <= 0) return;

    const elapsedMinutes = elapsedTime / 60;
    const correctChars = Math.max(totalTyped - errors, 0);

    const calculatedWpm = Math.round(correctChars / 5 / elapsedMinutes);

    setWpm(calculatedWpm);
  }, [elapsedTime, totalTyped, errors, phase, isFinished]);
  //accuracy
  useEffect(() => {
    if (totalTyped === 0) {
      setAccuracy(null);
      return;
    }

    const correct = totalTyped - errors;
    const acc = Math.round((correct / totalTyped) * 100);
    setAccuracy(acc);
  }, [totalTyped, errors]);

  const renderTextWithHighlight = () => {
    if (!lesson) return null;

    return lesson.split("").map((char: string, index: number) => {
      let className = "text-gray-300";

      if (index < typedText.length) {
        const rawKey = typedText[index];
        const mappedKey = getMappedKey(rawKey, keyboardLayout);

        if (mappedKey === char) {
          className = "text-emerald-600 bg-emerald-100/20";
        } else {
          className = "text-red-500 bg-red-100/40 underline decoration-red-400";
        }
      }

      // Cursor logic
      const isCurrentChar = index === typedText.length;
      const cursorClass =
        isCurrentChar && phase === "PLAY" && !isFinished ? "border-l-2 border-orange-500 animate-pulse -ml-[1px]" : "";

      // ** Ghost Cursors Logic **
      //   const playersHere = livePlayers.filter(
      //     (p) => p._id !== currentUser?._id && p.progress === index
      //   );

      return (
        <span
          key={index}
          ref={isCurrentChar ? activeCharRef : null}
          className={`
           ${cursorClass}
           ${className}
          relative transition-colors duration-100
        `}
        >
          {char}
        </span>
      );
    });
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lesson || isFinished || phase !== "PLAY") return;
      if (e.key === "Backspace") {
        setHasError(false);
        setTypedText((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();

        if (hasError) return;

        const mappedKey = getMappedKey(e.key, keyboardLayout);
        const expectedChar = lesson[typedText.length];
        setTotalTyped((prev) => prev + 1);

        if (mappedKey !== expectedChar) {
          playTypingError();
          setErrors((prev) => prev + 1);
          setHasError(true);
          setTypedText((prev) => prev + e.key);
          return;
        }

        const nextText = typedText + e.key;
        playTyping();
        setTypedText(nextText);
        if (nextText.length === lesson.length) {
          setIsFinished(true);
          socket.emit("player-finished-contest", {
            contestId: contestData?._id,
            userId: user?._id,
            name: user?.name,
            imageUrl: user?.imageUrl,
            timeTaken: elapsedTime,
            wpm,
            accuracy,
            errors,
            typedLength: typedText.length,
            totalTyped,
            status: "FINISHED",
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lesson, isFinished, typedText, phase, hasError, contestData?._id, keyboardLayout]);

  useEffect(() => {
    if (!user) return;

    setLivePlayers((prev: any) =>
      prev.map((p: any) =>
        p._id === user._id
          ? {
              ...p,
              wpm,
              accuracy,
              errors,
              progress: typedText.length,
            }
          : p
      )
    );
  }, [wpm, accuracy, errors, typedText, user, contestData]);

  const progressPercentage = Math.round((typedText.length / (contestData?.contestText?.length || 0)) * 100);
  if (loading) {
    return <div className="h-screen flex items-center justify-center text-xl font-semibold">Loading Contest...</div>;
  }
  if (!contestData) return null;
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#FDF9F2] font-sans selection:bg-[#ECA468]/30 selection:text-[#ECA468] flex flex-col text-slate-800 overflow-hidden z-[100]">
      {/* Dynamic Background Glows for Light Theme */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ECA468]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8CA78A]/10 blur-[100px] pointer-events-none"></div>

      <CompanyUserNavbar />

      <main className="flex-1 flex flex-col pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 h-full relative">
        {finalResult.length > 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-in fade-in zoom-in duration-500 w-full">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
                <Trophy className="w-10 h-10 text-[#ECA468]" />
                Contest Results
                <Trophy className="w-10 h-10 text-[#ECA468]" />
              </h1>
              <p className="text-slate-500 font-medium">Top performers this contest</p>
            </div>

            <div className="w-full max-w-2xl bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(236,164,104,0.04)] border border-[#ECA468]/10 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#ECA468] to-[#8CA78A]"></div>
              {/* Header Row */}
              <div className="grid grid-cols-[80px_1fr_100px_100px_100px_80px] gap-4 p-4 bg-[#f8e8c8]/20 border-b border-[#f8e8c8]/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="text-center">Rank</div>
                <div>Player</div>
                <div className="text-right">WPM</div>
                <div className="text-right">Accuracy</div>
                <div className="text-right">Time</div>
                <div className="text-right">Reward</div>
              </div>

              {/* Players List */}
              <div className="divide-y divide-slate-100">
                {finalResult
                  .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                  .map((result, index) => (
                    <div
                      key={result.userId}
                      className={`grid grid-cols-[80px_1fr_100px_100px_100px_80px] gap-4 p-4 items-center hover:bg-[#FFF4EC]/50 transition-colors
                                            ${result.userId === user?._id ? "bg-[#FFF4EC]/80" : ""}
                                        `}
                    >
                      <div className="flex justify-center">
                        {result.rank === 1 ? (
                          <div className="w-8 h-8 rounded-full bg-[#ECA468]/20 text-[#D0864B] flex items-center justify-center font-black shadow-sm ring-2 ring-[#FADDB8]">
                            1
                          </div>
                        ) : result.rank === 2 ? (
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black shadow-sm ring-2 ring-slate-200">
                            2
                          </div>
                        ) : result.rank === 3 ? (
                          <div className="w-8 h-8 rounded-full bg-[#ECA468]/10 text-[#D0864B] flex items-center justify-center font-black shadow-sm ring-2 ring-[#ECA468]/30">
                            3
                          </div>
                        ) : (
                          <span className="text-slate-400 font-bold">#{result.rank || index + 1}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={result.imageUrl}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                          alt={result.name}
                        />
                        <div>
                          <div className="font-bold text-slate-800 text-sm">
                            {result.name} {result.userId === user?._id && "(You)"}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-black text-slate-800 text-lg">{result.wpm}</div>
                      <div className="text-right font-bold text-[#8CA78A]">{result.accuracy}%</div>
                      <div className="text-right font-mono text-slate-500 text-xs">{formatTime(result.timeTaken)}</div>
                      <div className="text-right font-bold text-[#ECA468]">
                        {contestData?.rewards?.find((r) => r.rank === result.rank)?.prize
                          ? `$${contestData.rewards.find((r) => r.rank === result.rank)?.prize}`
                          : "-"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => navigate("/company/user/contests")}
                className="px-6 py-3 rounded-xl bg-[#fff8ea]/60 border border-[#f8e8c8] text-slate-600 font-bold hover:bg-[#fff8ea]/80 hover:border-[#ECA468]/30 transition-all flex items-center gap-2"
              >
                Return to Contests
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 min-h-0 flex-1 h-full">
            {/* Left Column - Stats & Rankings */}
            <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6 h-auto lg:h-full min-h-0 overflow-visible lg:overflow-y-auto custom-scrollbar-hidden pb-2 lg:pb-8 shrink-0">
              {/* Stats Panel */}
              <div className="bg-white/40 backdrop-blur-md rounded-xl md:rounded-[1.5rem] p-3 md:p-5 shadow-[0_8px_30px_rgb(236,164,104,0.04)] border border-[#ECA468]/10 relative overflow-hidden shrink-0 group">
                <div className="absolute top-0 left-0 w-full h-[2px] md:h-[3px] bg-gradient-to-r from-[#ECA468] to-[#8CA78A]"></div>
                <h3 className="hidden md:flex text-[10px] md:text-sm font-bold text-slate-500 tracking-widest uppercase mb-4 items-center gap-2">
                  <Trophy className="w-3 h-3 md:w-4 h-4 text-[#ECA468]" />
                  Performance
                </h3>
                <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 md:gap-3">
                  {/* WPM */}
                  <div className="bg-[#f8e8c8]/20 rounded-lg md:rounded-xl p-1.5 md:p-3 flex flex-col relative overflow-hidden group-hover:bg-[#FFF4EC] transition-colors border border-[#f8e8c8]/40 group-hover:border-[#FADDB8]">
                    <span className="text-[7px] md:text-[10px] font-bold text-[#D0864B] uppercase tracking-widest mb-0.5 md:mb-1">
                      WPM
                    </span>
                    <div className="flex items-baseline gap-0.5 md:gap-1 relative z-10">
                      <span className="text-sm md:text-2xl font-black text-slate-800">{wpm}</span>
                    </div>
                  </div>
                  {/* Accuracy */}
                  <div className="bg-[#f8e8c8]/20 rounded-lg md:rounded-xl p-1.5 md:p-3 flex flex-col relative overflow-hidden group-hover:bg-[#F2F7F2] transition-colors border border-[#f8e8c8]/40 group-hover:border-[#C4E0C4]">
                    <span className="text-[7px] md:text-[10px] font-bold text-[#6D8A6B] uppercase tracking-widest mb-0.5 md:mb-1">
                      ACC
                    </span>
                    <div className="flex items-baseline gap-0.5 md:gap-1 relative z-10">
                      <span className="text-sm md:text-2xl font-black text-slate-800">{accuracy ?? 100}</span>
                      <span className="text-[7px] md:text-[10px] font-bold text-slate-400">%</span>
                    </div>
                  </div>
                  {/* Errors */}
                  <div className="bg-[#f8e8c8]/20 rounded-lg md:rounded-xl p-1.5 md:p-3 flex flex-col relative overflow-hidden group-hover:bg-rose-50 transition-colors border border-[#f8e8c8]/40 group-hover:border-rose-200">
                    <span className="text-[7px] md:text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-0.5 md:mb-1">ERR</span>
                    <div className="flex items-baseline gap-0.5 md:gap-1 relative z-10">
                      <span className="text-sm md:text-2xl font-black text-slate-800">{errors}</span>
                    </div>
                  </div>
                  {/* Time Left */}
                  <div className="bg-[#f8e8c8]/20 rounded-lg md:rounded-xl p-1.5 md:p-3 flex flex-col relative overflow-hidden group-hover:bg-indigo-50 transition-colors border border-[#f8e8c8]/40 group-hover:border-indigo-200">
                    <span className="text-[7px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5 md:mb-1">
                      TIME
                    </span>
                    <div className="flex items-baseline gap-0.5 md:gap-1 relative z-10">
                      <span className="text-[10px] md:text-xl font-black text-slate-800 tracking-wider">
                        {!isNaN(remainingTime) ? formatTime(remainingTime) : "00:00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Leaderboard */}
              <div className="bg-white/40 backdrop-blur-md rounded-xl md:rounded-[1.5rem] p-3 md:p-5 shadow-[0_8px_30px_rgb(236,164,104,0.04)] border border-[#ECA468]/10 flex flex-col flex-1 min-h-[120px] md:min-h-[300px]">
                <div className="flex justify-between items-center mb-2 md:mb-4 shrink-0">
                  <h3 className="text-[10px] md:text-sm font-bold text-slate-500 tracking-widest uppercase flex items-center gap-2">
                    <Users className="w-3 h-3 md:w-4 h-4 text-[#8CA78A]" />
                    Live Rank
                  </h3>
                  <span className="text-[8px] md:text-[10px] font-bold bg-[#ECA468]/10 text-[#D0864B] px-1.5 md:px-2 py-0.5 md:py-1 rounded-md border border-[#FADDB8]">
                    {livePlayers.length} Racing
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto lg:pr-1 space-y-2 custom-scrollbar min-h-0">
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                    {livePlayers.length === 0 ? (
                      <div className="col-span-3 lg:col-span-1 text-center text-slate-400 text-[10px] font-semibold py-4">
                        Waiting...
                      </div>
                    ) : (
                      livePlayers.map((player) => {
                        const isMe = player.userId === user?._id;
                        const isDisconnected = player.status === "DISCONNECTED";
                        const isLeft = player.status === "LEFT";
                        return (
                          <div
                            key={player.userId}
                            className={`flex flex-col lg:flex-row lg:items-center gap-1.5 md:gap-3 p-1.5 md:p-3 rounded-lg md:rounded-xl transition-all shadow-sm ${isMe ? "bg-[#FFF4EC]/60 border border-[#FADDB8] ring-1 ring-[#FADDB8]" : "bg-[#FDF9F2]/40 border border-[#ECA468]/5 hover:border-[#ECA468]/20 hover:shadow-md"} ${isDisconnected || isLeft ? "opacity-40 grayscale" : ""}`}
                          >
                            <div className="relative shrink-0 flex items-center lg:flex-col justify-between lg:justify-center px-1">
                              <p
                                className="text-[8px] md:text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0 lg:mb-1.5 truncate max-w-[40px] md:max-w-[60px]"
                                title={player.name}
                              >
                                {player.name.split(" ")[0]}
                              </p>
                              <div className="relative">
                                <img
                                  src={player.imageUrl}
                                  className={`w-7 h-7 md:w-10 md:h-10 rounded-full border-2 object-cover ${isMe ? "border-[#ECA468] shadow-[0_0_10px_rgba(236,164,104,0.3)]" : "border-white shadow-sm"}`}
                                  alt=""
                                />
                                {isMe && (
                                  <div className="absolute -bottom-1 lg:-bottom-2 left-1/2 -translate-x-1/2 text-[6px] lg:text-[8px] bg-[#ECA468] px-1 py-0.5 rounded text-white font-black uppercase z-10 whitespace-nowrap">
                                    Me
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0 bg-white/80 px-1.5 md:px-2.5 py-1 md:py-1.5 rounded-md md:rounded-lg border border-slate-100 shadow-sm flex items-center justify-around lg:justify-end gap-1.5 md:gap-2 xl:gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`text-[9px] md:text-xs font-black leading-tight ${isMe ? "text-[#D0864B]" : "text-slate-600"}`}>
                                  {player.wpm}
                                </div>
                                <div className="text-[6px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">WPM</div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`text-[9px] md:text-xs font-black leading-tight ${isMe ? "text-[#6D8A6B]" : "text-slate-600"}`}>
                                  {player.accuracy}%
                                </div>
                                <div className="text-[6px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">ACC</div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Typing Interface */}
            <div className="lg:col-span-3 flex flex-col h-full min-h-0 relative pb-4 lg:pb-0">
              {/* Visual Racing Track */}
              <div className="bg-white/40 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-4 shadow-[0_8px_30px_rgb(236,164,104,0.04)] border border-[#ECA468]/10 mb-3 md:mb-6 shrink-0 z-20">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Progress</span>
                  <span className="text-xs font-black text-[#ECA468]">{progressPercentage}%</span>
                </div>

                <div className="relative h-2 md:h-4 bg-[#f8e8c8]/30 rounded-full flex items-center px-1">
                  {livePlayers.map((player) => {
                    const isMe = player.userId === user?._id;
                    const pos = Math.round((player.progress / (contestData?.contestText?.length || 0)) * 100);
                    return (
                      <div
                        key={`track-${player.userId}`}
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 z-10 ${isMe ? "z-20" : "opacity-60"}`}
                        style={{ left: `${Math.max(2, Math.min(pos, 98))}%` }}
                      >
                        <img
                          src={player.imageUrl}
                          className={`w-4 h-4 md:w-6 md:h-6 rounded-full border ${isMe ? "border-[#ECA468] ring-1 ring-[#FADDB8]" : "border-white"} shadow-md`}
                          alt={player.name}
                        />
                      </div>
                    );
                  })}
                  <div
                    className="h-full bg-gradient-to-r from-[#ECA468]/20 to-[#ECA468]/40 absolute top-0 left-0 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Main Typing Area */}
              <div
                className="flex-1 bg-white/60 backdrop-blur-xl rounded-xl md:rounded-[2rem] p-4 md:p-10 shadow-[0_15px_40px_rgb(236,164,104,0.06)] border border-[#ECA468]/10 flex flex-col relative overflow-hidden group/typing z-10"
                onClick={() => document.body.focus()}
              >
                <div className="flex justify-between items-center mb-4 md:mb-8 shrink-0 relative z-10 border-b border-[#f8e8c8]/40 pb-2 md:pb-4">
                  <div>
                    <h2 className="text-base md:text-2xl font-black text-slate-800 tracking-tight">
                      {contestData?.title || "Contest"}
                    </h2>
                    <p className="text-[#8CA78A] text-[8px] md:text-xs font-semibold uppercase tracking-widest">
                      {contestData?.difficulty} Mode
                    </p>
                  </div>
                </div>

                <div
                  ref={snippetContainerRef}
                  className="flex-1 font-mono text-sm md:text-xl lg:text-2xl leading-[2] tracking-wide font-medium outline-none overflow-y-auto custom-scrollbar relative z-10 text-slate-500 break-words"
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {renderTextWithHighlight()}
                </div>

                {/* Countdown Overlay */}
                {phase === "COUNTDOWN" && (
                  <div className="absolute inset-0 bg-[#fff8ea]/40 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-24 md:w-48 h-24 md:h-48 bg-[#ECA468]/10 rounded-full blur-2xl animate-pulse"></div>
                      <span className="text-6xl md:text-9xl font-black text-slate-800 drop-shadow-md animate-pulse relative z-10">
                        {countdown}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ContestArea;
