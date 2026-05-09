import React, { useState, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { statusChange } from "../../../api/user/quick";
import { useGameTimer } from "../../../hooks/useGameTimer";
import { useTypingScroll } from "../../../hooks/useTypingScroll";
import { useTypingStats } from "../../../hooks/useTypingStats";
import { useQuickPlaySocket } from "../../../hooks/quickPlay/useQuickPlaySocket";
import { useQuickPlayHandleKeyDown } from "../../../hooks/quickPlay/useQuickPlayHandleKeyDown";
import { toast } from "react-toastify";
import { Zap, Target, Clock, Users, Trophy, Home, RotateCcw, Crown } from "lucide-react";

export type GamePlayerResult = {
  userId: string;
  wpm: number;
  accuracy: number | null;
  errors: number;
  typedLength: number;
  status: "times-up" | "finished" | "playing";
  updatedAt: number;
  name: string;
  imageUrl: string;
  timeTaken: number;
  rank?: number;
};

interface Participant {
  _id: string;
  name: string;
  imageUrl?: string;
  isHost: boolean;
  wpm?: number;
  accuracy?: number | null;
  time?: string;
  errors?: number;
  rank?: number;
  progress?: number;
}

const QuickPlay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state?.gameData;
  const user = useSelector((state: any) => state.auth.user);
  const players = gameData?.participants;
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsfinished] = useState(false);
  const [countdown, setCountdown] = useState<number>(gameData?.countDown || 10);
  const [remainingTime, setRemainingTime] = useState<number>(gameData?.duration || 300);
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  const [hasError, setHasError] = useState(false);
  const [errors, setErrors] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [livePlayers, setLivePlayers] = useState<Participant[]>(players || []);

  const lesson = gameData?.lesson?.text || "";
  const [hasSentStart, setHasSentStart] = useState(false);
  const [totalTyped, setTotalTyped] = useState(0);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const gameIdRef = useRef(gameData?._id);
  const userIdRef = useRef(user?._id);
  const [finalResult, setFinalResult] = useState<GamePlayerResult[]>([]);
  const { wpm, accuracy } = useTypingStats(totalTyped, errors, elapsedTime, phase, isFinished);
  const [currentUser, setCurrentUser] = useState<
    | {
      _id: string;
      name: string;
      imageUrl?: string;
      isHost: boolean;
    }
    | undefined
  >(undefined);

  useQuickPlaySocket(
    gameData,
    typedText,
    wpm,
    accuracy,
    errors,
    phase,
    setLivePlayers,
    setFinalResult,
    navigate,
    remainingTime,
    setIsfinished,
    elapsedTime,
    totalTyped,
    gameIdRef,
    userIdRef,
    isFinished
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const preventDefault = (e: Event) => {
      const isSnippetArea = snippetContainerRef.current?.contains(e.target as Node);
      if (!isSnippetArea) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "=" || e.key === "-" || e.key === "+" || e.key === "0")) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || !snippetContainerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("touchstart", handleTouch, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
      document.body.style.userSelect = "auto";
    };
  }, []);

  useEffect(() => {
    if (!gameData) {
      navigate("/", { replace: true });
    }
  }, [gameData, navigate]);

  useEffect(() => {
    if (!user) return;

    setLivePlayers((prev) =>
      prev.map((p) =>
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
  }, [wpm, accuracy, errors, typedText, user?._id]);

  useEffect(() => {
    if (players) {
      setCurrentUser(players?.find((item: any) => item._id === user?._id));
    }
  }, [players, user?._id]);

  useGameTimer(gameData, finalResult, setPhase, setCountdown, setRemainingTime, setElapsedTime, setIsfinished);

  const startGameAPI = async (competitionId: string) => {
    try {
      await statusChange(competitionId, "ongoing");
    } catch (error) {
      toast.error("Failed to start game");
    }
  };

  const completeGameAPI = async (competitionId: string) => {
    try {
      await statusChange(competitionId, "completed");
    } catch (error) {
      toast.error("Failed to complete game");
    }
  };

  useEffect(() => {
    if (isFinished || remainingTime === 0) {
      if (gameData?._id) completeGameAPI(gameData._id);
    }
  }, [isFinished, gameData?._id, remainingTime]);

  useEffect(() => {
    if (phase === "PLAY" && !hasSentStart && gameData?._id) {
      setHasSentStart(true);
      startGameAPI(gameData._id);
    }
  }, [phase, hasSentStart, gameData?._id]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const renderTextWithHighlight = () => {
    if (!lesson) return null;
    return lesson.split("").map((char: string, index: number) => {
      let className = "text-gray-300";

      if (index < typedText.length) {
        if (typedText[index] === char) {
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

  useTypingScroll({
    activeCharRef,
    snippetContainerRef,
    typedText,
  });

  useQuickPlayHandleKeyDown({
    lesson,
    isFinished,
    phase,
    typedText,
    hasError,
    setHasError,
    setTypedText,
    setErrors,
    setTotalTyped,
    setIsfinished,
    gameData,
    currentUser,
    elapsedTime,
    wpm,
    accuracy,
    errors,
    totalTyped,
  });

  return (
    <div className="min-h-screen bg-[#FFF8EA] font-sans text-gray-800 flex flex-col overflow-x-hidden">
      <Navbar />

      <div className="flex-1 w-full max-w-[1600px] mx-auto pt-24 px-4 md:px-8 flex flex-col gap-6 pb-8">
        {/* Active Players Row */}
        <div className="flex justify-between items-center shrink-0">
          <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-orange-500" />
            Active Racers
          </h2>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
             <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Live Match</span>
          </div>
        </div>

        <div className="flex flex-nowrap lg:grid lg:grid-cols-5 gap-3 md:gap-4 overflow-x-auto lg:overflow-visible pb-4 md:pb-0 custom-scrollbar shrink-0">
          {livePlayers.map((player) => {
            const progressPercent = Math.round(((player?.progress || 0) / (lesson?.length || 1)) * 100);
            return (
              <div
                key={player._id}
                className={`min-w-[160px] sm:min-w-[200px] lg:min-w-0 bg-white rounded-2xl p-3 md:p-4 shadow-lg shadow-orange-900/5 border-2 transition-all hover:scale-[1.02] ${player.rank === 1 ? "border-amber-200" : "border-white"
                  } flex flex-col gap-2 md:gap-3 relative overflow-hidden shrink-0`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                      alt={player.name}
                      className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-gray-50 border-2 border-white shadow-sm object-cover"
                    />
                    {player.rank === 1 && (
                      <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-0.5 rounded-lg shadow-lg border border-white">
                         <Crown size={6} className="fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-[10px] md:text-sm text-gray-800 truncate">{player.name}</div>
                    <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
                       <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Racing</span>
                       <span className="hidden md:block text-[10px] font-black text-gray-400">|</span>
                       <span className="text-[9px] md:text-[10px] font-black text-gray-800">{player.wpm || 0} <span className="text-[7px] md:text-[8px] opacity-40 uppercase">WPM</span></span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <div className="h-1.5 md:h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <span>Progress</span>
                    <span className="text-emerald-500">{progressPercent}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Challenge Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Stats Column */}
          <div className="flex flex-col gap-4 order-2 lg:order-1">
            <div className="bg-[#FFF8EA] border border-orange-100 rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center justify-center text-center gap-6 shadow-xl shadow-orange-900/5 relative overflow-hidden group">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-1 shadow-inner group-hover:scale-110 transition-transform ${remainingTime <= 10 ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
                }`}>
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-1 relative z-10">
                <div className={`text-4xl md:text-5xl font-black font-mono tracking-tighter ${remainingTime <= 10 ? "text-red-500 animate-pulse" : "text-gray-800"}`}>
                  {phase === "COUNTDOWN" ? countdown : formatTime(remainingTime)}
                </div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] opacity-60">
                  {phase === "COUNTDOWN" ? "Prepare to Launch" : "Seconds Remaining"}
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                 <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-orange-500" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Speed</span>
                    </div>
                    <div className="text-xl font-black text-gray-800">{wpm}<span className="text-[10px] ml-1 opacity-30 uppercase">WPM</span></div>
                 </div>
                 <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-emerald-500" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accuracy</span>
                    </div>
                    <div className="text-xl font-black text-gray-800">{accuracy || 0}<span className="text-[10px] ml-1 opacity-30">%</span></div>
                 </div>
              </div>
            </div>

            <div className="hidden lg:block bg-gradient-to-br from-[#7A6A5D] to-gray-800 p-6 rounded-[2rem] text-white relative overflow-hidden">
               <Trophy className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
               <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Match Note</h4>
               <p className="text-xs font-bold leading-relaxed relative z-10">
                 Quick Play mode ranks you against live typists globally. Stay focused!
               </p>
            </div>
          </div>

          {/* Typing Area */}
          <div className="bg-[#FFF8EA] rounded-[2.5rem] relative p-6 md:p-12 border border-orange-100 shadow-xl shadow-orange-900/5 flex flex-col min-h-[400px] lg:min-h-0 overflow-hidden order-1 lg:order-2"
            onPaste={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50 overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-orange-400 to-emerald-400 transition-all duration-300"
                 style={{ width: `${(typedText.length / (lesson?.length || 1)) * 100}%` }}
               ></div>
            </div>

            <div className="flex justify-between items-center mb-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                <h3 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Challenge Snippet</h3>
              </div>
              <div className="flex items-center gap-2">
                 <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-orange-200">
                   Level {gameData?.lesson?.level || 1}
                 </span>
              </div>
            </div>

            <div
              ref={snippetContainerRef}
              className="font-mono text-gray-400 leading-relaxed md:leading-loose text-xl md:text-3xl flex-1 pt-2 custom-scrollbar overflow-y-auto select-none outline-none"
            >
              {renderTextWithHighlight()}
            </div>

            {phase === "COUNTDOWN" && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md z-30">
                <div className="text-center animate-in zoom-in duration-300">
                  <div className="text-[120px] md:text-[180px] font-black text-orange-500 animate-bounce leading-none drop-shadow-2xl font-mono">
                    {countdown}
                  </div>
                  <p className="text-orange-900/30 font-black uppercase tracking-[0.5em] text-sm md:text-base mt-4">
                    Ready... Set...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Final Game Results Overlay - Same as groupPlay */}
      {finalResult.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-orange-900/20 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-7xl h-[90vh] md:h-[85vh] bg-[#FFF8EA] rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-orange-100 overflow-hidden flex flex-col animate-zoom-in">
            <div className="bg-[#FFF8EA] px-4 md:px-8 py-4 md:py-6 border-b border-orange-100 flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 hidden md:block">
                <Trophy className="w-48 h-48 -rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl md:text-3xl font-black text-gray-800 tracking-tight">Race Results</h2>
                <p className="text-gray-500 font-bold text-[10px] md:text-sm mt-0.5 uppercase tracking-wide">
                  Final Standings
                </p>
              </div>
              <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm border border-orange-100 flex items-center gap-2 md:gap-3 px-3 md:px-5 relative z-10">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg md:rounded-xl flex items-center justify-center">
                   <Crown className="w-4 h-4 md:w-6 md:h-6 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-right">
                  <div className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">Best</div>
                  <div className="text-sm md:text-lg font-black text-gray-800 leading-none mt-1">
                    {Math.max(...(finalResult.map((p) => p.wpm || 0)), 0)} <span className="text-[10px] md:text-xs">WPM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-0 bg-[#FFF8EA] flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b border-gray-100">
                  <tr>
                    <th className="py-3 md:py-4 px-3 md:px-8 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-16 md:w-24">#</th>
                    <th className="py-3 md:py-4 px-3 md:px-8 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-full">Player</th>
                    <th className="py-3 md:py-4 px-3 md:px-8 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-20 md:w-32">WPM</th>
                    <th className="hidden sm:table-cell py-3 md:py-4 px-3 md:px-8 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-20 md:w-32">ACC</th>
                    <th className="hidden md:table-cell py-3 md:py-4 px-3 md:px-8 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-32 md:w-40">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {finalResult
                    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                    .map((p) => {
                      const rank = p.rank;
                      const isWinner = rank === 1;
                      const isMe = p.userId === user?._id;

                      return (
                        <tr key={p.userId} className={`group transition-all duration-200 ${isMe ? "bg-orange-50/70" : "hover:bg-orange-50/30"}`}>
                          <td className="py-4 md:py-6 px-3 md:px-8 text-center">
                            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center font-black text-sm md:text-xl shadow-sm mx-auto ${isWinner ? "bg-amber-400 text-white rotate-12" : rank === 2 ? "bg-slate-300 text-white" : rank === 3 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-400"
                              }`}>
                              {rank}
                            </div>
                          </td>
                          <td className="py-4 md:py-6 px-3 md:px-8">
                            <div className="flex items-center gap-3 md:gap-5">
                              <div className="relative shrink-0">
                                <img
                                  src={p.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                                  className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.25rem] bg-gray-50 object-cover ring-2 md:ring-4 ${isWinner ? "ring-amber-200" : "ring-white"} shadow-md`}
                                  alt={p.name}
                                />
                                {isWinner && (
                                  <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 animate-bounce">
                                    <div className="bg-amber-400 p-1 md:p-1.5 rounded-lg md:rounded-xl shadow-lg border border-white">
                                      <Crown className="w-3 h-3 md:w-5 md:h-5 text-white fill-white" />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-black text-gray-800 text-sm md:text-xl truncate">{p.name}</span>
                                  {isMe && <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-sm">You</span>}
                                </div>
                                {isWinner && <div className="text-[8px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mt-0.5">Winner</div>}
                                <div className="sm:hidden text-[9px] font-bold text-emerald-600 mt-1 uppercase">
                                  Acc: {p.accuracy || 0}%
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 md:py-6 px-3 md:px-8 text-center">
                            <div className="font-black text-gray-800 text-xl md:text-3xl tracking-tighter">{p.wpm || 0}</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 md:mt-1">WPM</div>
                          </td>
                          <td className="hidden sm:table-cell py-4 md:py-6 px-3 md:px-8 text-center">
                            <div className="font-black text-emerald-600 text-xl md:text-3xl tracking-tighter">{p.accuracy || 0}%</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 md:mt-1">Accuracy</div>
                          </td>
                          <td className="hidden md:table-cell py-4 md:py-6 px-3 md:px-8 text-center">
                            {(p.wpm || 0) > 80 ? (
                              <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-orange-500 text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest shadow-sm">Legendary</span>
                            ) : (p.wpm || 0) > 40 ? (
                              <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-indigo-500 text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest shadow-sm">Pro</span>
                            ) : (
                              <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-gray-400 text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest shadow-sm">Rookie</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="bg-[#FFF8EA]/50 backdrop-blur-sm px-4 md:px-10 py-6 md:py-8 border-t border-orange-100 flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center shrink-0">
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-gray-100 text-gray-500 font-black hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all text-xs md:text-base shadow-sm uppercase tracking-widest flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Exit Game
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-10 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-2 text-xs md:text-base"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickPlay;
