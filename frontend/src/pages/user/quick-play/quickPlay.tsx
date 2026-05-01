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
import { Zap, Target, Clock, AlertCircle, Users, Trophy, Home, RotateCcw, Crown } from "lucide-react";

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
    userIdRef
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
    <div className="h-screen bg-[#FFF8EA] font-sans text-gray-800 flex flex-col overflow-hidden touch-none">
      <Navbar />

      <div className="flex-1 min-h-0 w-full max-w-[1440px] mx-auto pt-20 px-4 md:px-6 flex flex-col gap-6 pb-4 box-border overflow-hidden">
        {/* Active Players Row */}
        <div className="flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-gray-700 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Active Racers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
          {livePlayers.map((player) => {
            const progressPercent = Math.round(((player?.progress || 0) / (lesson?.length || 1)) * 100);
            return (
              <div
                key={player._id}
                className={`bg-[#FFF8EA] rounded-xl p-3 shadow-sm border transition-all hover:shadow-md ${player.rank === 1 ? "border-amber-200 ring-1 ring-amber-100" : "border-gray-100"
                  } flex flex-col gap-2 relative overflow-hidden`}
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={player.imageUrl}
                      alt={player.name}
                      className="w-10 h-10 rounded-lg bg-gray-50 border-2 border-white shadow-sm object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-gray-800 truncate">{player.name}</div>
                    <div className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Racing</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-gray-50 rounded-lg p-1.5 flex flex-col items-center border border-gray-100">
                    <span className="text-[8px] font-bold text-gray-400 uppercase">WPM</span>
                    <span className="text-sm font-black text-gray-800">{player.wpm || 0}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-1.5 flex flex-col items-center border border-gray-100">
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Acc</span>
                    <span className="text-sm font-black text-gray-800">{player.accuracy || 0}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase">
                    <span>Progress</span>
                    <span className="text-emerald-600">{progressPercent}%</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Challenge Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 min-h-0">
          <div className="bg-[#FFF8EA] border border-orange-100 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center gap-4 shadow-xl shadow-orange-900/5 relative overflow-hidden group">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1 shadow-inner group-hover:rotate-6 transition-transform ${remainingTime <= 10 ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
              }`}>
              <Clock className="w-6 h-6" />
            </div>

            <div className="space-y-0.5 relative z-10">
              <h3 className="font-black text-gray-800 text-lg tracking-tight">
                {phase === "COUNTDOWN" ? `Wait ${countdown}s` : formatTime(remainingTime)}
              </h3>
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em] opacity-60">
                {phase === "COUNTDOWN" ? "Prepare" : "Remaining"}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
               <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <div className="text-left">
                    <div className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Speed</div>
                    <div className="text-base font-black text-emerald-900">{wpm} WPM</div>
                  </div>
               </div>
               <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                  <Target className="w-4 h-4 text-blue-500" />
                  <div className="text-left">
                    <div className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">Accuracy</div>
                    <div className="text-base font-black text-blue-900">{accuracy || 0}%</div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-[#FFF8EA] rounded-[2rem] relative p-10 border border-orange-100 shadow-xl shadow-orange-900/5 flex flex-col min-h-0"
            onPaste={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight">Challenge Snippet</h3>
              </div>
              <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                Live Race
              </span>
            </div>

            <div
              ref={snippetContainerRef}
              className="font-mono text-gray-700 leading-loose text-xl md:text-2xl flex-1 pt-2 custom-scrollbar overflow-y-auto selection:bg-orange-100"
            >
              {renderTextWithHighlight()}
            </div>

            {phase === "COUNTDOWN" && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-20 rounded-[2rem]">
                <div className="text-center bg-white/95 p-12 rounded-[3rem] shadow-2xl border border-orange-100 animate-in zoom-in duration-300">
                  <div className="text-8xl font-black text-orange-500 animate-bounce mb-4 drop-shadow-sm font-mono">
                    {countdown}
                  </div>
                  <p className="text-orange-900/50 font-black uppercase tracking-[0.3em] text-sm">
                    Get Ready
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Final Game Results Overlay - Same as groupPlay */}
      {finalResult.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-orange-900/20 backdrop-blur-md animate-fade-in">
          <div className="w-[95%] max-w-7xl h-[85vh] bg-[#FFF8EA] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-orange-100 overflow-hidden flex flex-col animate-zoom-in">
            <div className="bg-[#FFF8EA] px-8 py-6 border-b border-orange-100 flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Trophy className="w-48 h-48 -rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Race Results</h2>
                <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-wide">
                  Final Standings
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-3 px-5 relative z-10">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                   <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Top Speed</div>
                  <div className="text-lg font-black text-gray-800">
                    {Math.max(...(finalResult.map((p) => p.wpm || 0)), 0)} WPM
                  </div>
                </div>
              </div>
            </div>

            <div className="p-0 bg-[#FFF8EA] flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-24">Rank</th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-full">Player</th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-32">WPM</th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-32">ACC</th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-40">Tier</th>
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
                          <td className="py-6 px-8 text-center">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm mx-auto ${isWinner ? "bg-amber-400 text-white rotate-12" : rank === 2 ? "bg-slate-300 text-white" : rank === 3 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-400"
                              }`}>
                              {rank}
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-5">
                              <div className="relative">
                                <img
                                  src={p.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                                  className={`w-16 h-16 rounded-[1.25rem] bg-gray-50 object-cover ring-4 ${isWinner ? 'ring-amber-200' : 'ring-white'} shadow-md`}
                                  alt={p.name}
                                />
                                {isWinner && (
                                  <div className="absolute -top-4 -left-4 animate-bounce">
                                    <div className="bg-amber-400 p-1.5 rounded-xl shadow-lg border-2 border-white">
                                      <Crown className="w-5 h-5 text-white fill-white" />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-black text-gray-800 text-xl">{p.name}</span>
                                  {isMe && <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">You</span>}
                                </div>
                                {isWinner && <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] mt-1">Race Winner</div>}
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-8 text-center">
                            <div className="font-black text-gray-800 text-3xl tracking-tighter">{p.wpm || 0}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">Words / Min</div>
                          </td>
                          <td className="py-6 px-8 text-center">
                            <div className="font-black text-emerald-600 text-3xl tracking-tighter">{p.accuracy || 0}%</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">Accuracy</div>
                          </td>
                          <td className="py-6 px-8 text-center">
                            {(p.wpm || 0) > 80 ? (
                              <span className="px-4 py-1.5 rounded-full bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest shadow-sm">Legendary</span>
                            ) : (p.wpm || 0) > 40 ? (
                              <span className="px-4 py-1.5 rounded-full bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest shadow-sm">Professional</span>
                            ) : (
                              <span className="px-4 py-1.5 rounded-full bg-gray-400 text-white font-black text-[10px] uppercase tracking-widest shadow-sm">Rookie</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="bg-[#FFF8EA]/50 backdrop-blur-sm px-10 py-8 border-t border-orange-100 flex gap-5 justify-center items-center shrink-0">
              <button
                onClick={() => navigate("/")}
                className="px-10 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-500 font-black hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-all text-base shadow-sm uppercase tracking-widest flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Exit Game
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-12 py-4 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-2"
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
