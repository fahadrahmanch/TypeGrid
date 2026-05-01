import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../../../socket";
import { newGameAPI } from "../../../api/user/group";
import { useTypingStats } from "../../../hooks/useTypingStats";
import { useGameTimer } from "../../../hooks/useGameTimer";
import { useTypingInput } from "../../../hooks/groupPlay/useTypingInput";
import { useGroupPlaySocket } from "../../../hooks/groupPlay/useGroupPlaySocket";
import { useTypingScroll } from "../../../hooks/useTypingScroll";
import {
  Zap,
  Target,
  Clock,
  AlertCircle,
  Users,
  Crown,
} from "lucide-react";

interface Lesson {
  id: string;
  text: string;
  category: string;
  level: string;
}
type Status = "PLAYING" | "FINISHED";
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
  status: Status;
}

interface PlayerState extends Participant {
  progress?: number;
}

interface GameData {
  _id: string;
  mode: string;
  status: string;
  duration: number;
  lesson: Lesson;
  countDown: number;
  startedAt: string;
  JoinLink?: string;
  participants: Participant[];
}
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

const GroupPlay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<GameData | undefined>(location.state?.gameData);

  const players = gameData?.participants || [];
  const lesson = gameData?.lesson;
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsfinished] = useState(false);

  const user = useSelector((state: any) => state.auth.user);
  const [countdown, setCountdown] = useState<number>(gameData?.countDown || 10);
  const [remainingTime, setRemainingTime] = useState<number>(gameData?.duration || 300);
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  const [hasError, setHasError] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [livePlayers, setLivePlayers] = useState<PlayerState[]>(players);
  const [leftPlayers, setLeftPlayers] = useState<GameData["participants"]>([]);
  const gameIdRef = useRef(gameData?._id);
  const userIdRef = useRef(user?._id);

  const [totalTyped, setTotalTyped] = useState(0);
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
  const hasJoinedRef = useRef(false);

  const [finalResult, setFinalResult] = useState<GamePlayerResult[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const preventDefault = (e: Event) => {
      // Allow scrolling ONLY inside the snippet container
      const isSnippetArea = snippetContainerRef.current?.contains(e.target as Node);
      if (!isSnippetArea) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl + and Ctrl - zoom
      if (e.ctrlKey && (e.key === "=" || e.key === "-" || e.key === "+" || e.key === "0")) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Prevent Ctrl + Wheel zoom globally, and all wheel scrolling outside snippet
      if (e.ctrlKey || !snippetContainerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      // Prevent pinch zoom (more than 1 finger)
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Use { passive: false } to allow e.preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("touchstart", handleTouch, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";
    document.body.style.userSelect = "none"; // Optional: prevent accidental text selection outside typing area

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
    if (!currentUser) return;

    setLivePlayers((prev) =>
      prev.map((p) =>
        p._id === currentUser._id
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
  }, [wpm, accuracy, errors, typedText, currentUser]);

  useEffect(() => {
    gameIdRef.current = gameData?._id;
    userIdRef.current = currentUser?._id;
  }, [gameData?._id, currentUser?._id]);

  useGroupPlaySocket({
    gameData,
    currentUser,
    typedText,
    wpm,
    accuracy,
    errors,
    phase,
    remainingTime,
    elapsedTime,
    navigate,
    gameIdRef,
    userIdRef,
    setLivePlayers,
    setLeftPlayers,
    setFinalResult,
    setIsfinished,
    hasJoinedRef,
  });

  useEffect(() => {
    if (!gameData) {
      navigate("/");
    }
  }, [gameData, navigate]);

  useEffect(() => {
    if (players) {
      setCurrentUser(players?.find((item: any) => item._id === user._id));
    }
  }, [players, user._id]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useTypingScroll({
    activeCharRef,
    snippetContainerRef,
    typedText,
  });

  useGameTimer(gameData, finalResult, setPhase, setCountdown, setRemainingTime, setElapsedTime, setIsfinished);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const renderTextWithHighlight = () => {
    if (!lesson) return null;
    return lesson.text.split("").map((char: string, index: number) => {
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

      const playersHere = livePlayers.filter((p) => p._id !== currentUser?._id && p.progress === index);

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
          {playersHere.length > 0 && (
            <div className="absolute -top-5 -left-1.5 z-20 flex flex-col items-center border-none select-none pointer-events-none transition-all duration-300 ease-out">
              <div className="flex -space-x-1 isolate">
                {playersHere.map((p) => (
                  <div key={p._id} className="relative group pointer-events-auto">
                    <img
                      src={p.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                      className="w-4 h-4 rounded-full border border-white/50 bg-gray-100 shadow-sm object-cover opacity-60 hover:opacity-100 hover:scale-125 transition-all cursor-help"
                      alt={p.name}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-900/90 text-white text-[10px] font-bold rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {p.name}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-0.5 h-6 bg-orange-500/50 rounded-full mt-0.5"></div>
            </div>
          )}
          {char}
        </span>
      );
    });
  };

  useTypingInput({
    lesson,
    isFinished,
    phase,
    hasError,
    setHasError,
    typedText,
    setTypedText,
    setErrors,
    setTotalTyped,
    setIsfinished,
    gameId: gameData?._id,
    currentUser,
    elapsedTime,
    wpm,
    accuracy,
    errors,
  });

  async function handleNewGame() {
    try {
      const currentUsers = await livePlayers.map((p) => p._id);
      await newGameAPI(gameData?._id!, currentUsers);
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    const handleNewGameStarted = ({ competition }: { competition: GameData }) => {
      navigate(`/group-play/game/${competition.JoinLink!}`, {
        state: { gameData: competition },
      });
    };

    socket.on("new-game-started", handleNewGameStarted);

    return () => {
      socket.off("new-game-started", handleNewGameStarted);
    };
  }, [navigate]);

  useEffect(() => {
    if (location.state?.gameData) {
      setGameData(location.state.gameData);
    }
  }, [location.state]);

  useEffect(() => {
    if (!gameData) return;

    setLivePlayers(gameData.participants);
    setLeftPlayers([]);
    setTypedText("");
    setErrors(0);
    setTotalTyped(0);
    setHasError(false);
    setIsfinished(false);
    setFinalResult([]);
    setPhase("COUNTDOWN");
    setElapsedTime(0);
    setCountdown(gameData.countDown);
    setRemainingTime(gameData.duration);
  }, [gameData?._id]);

  return (
    <div className="h-screen bg-[#FFF8EA] font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col overflow-hidden touch-none">
      <Navbar />
      <div className="flex-1 min-h-0 pt-20 px-4 md:px-8 pb-4 max-w-[1920px] mx-auto w-full box-border flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 pb-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr_320px] items-stretch h-full">
            <div className="flex flex-col gap-4 h-full min-h-0">
              <div className="bg-[#FFF8EA] border border-orange-100 p-4 rounded-3xl shadow-lg shadow-orange-900/5 group shrink-0 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-4 relative">
                  <div className="relative hover:scale-105 transition-transform duration-300">
                    <img
                      src={currentUser?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                      alt="me"
                      className="w-12 h-12 rounded-xl object-cover shadow-md shadow-orange-900/10 ring-4 ring-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[2px] border-white flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-lg text-gray-800 tracking-tight leading-tight truncate">
                      {currentUser?.name || "Guest"}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {currentUser?.isHost && (
                        <span className="px-1.5 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-[9px] text-orange-600 font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" /> Host
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`mb-4 p-2.5 rounded-2xl border flex items-center gap-3 shadow-sm transition-all duration-300 ${isFinished ? "bg-emerald-50 border-emerald-100" : "bg-orange-50 border-orange-100"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${isFinished ? "bg-emerald-500 text-white" : "bg-orange-500 text-white animate-bounce-subtle"}`}
                  >
                    {isFinished ? <Crown className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div
                      className={`text-[10px] font-bold uppercase tracking-wider ${isFinished ? "text-emerald-800" : "text-orange-800"}`}
                    >
                      {phase == "COUNTDOWN" ? "Waiting..." : isFinished ? " Complete" : "Racing..."}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 relative">
                  <div className="bg-orange-50/50 p-2.5 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all duration-300">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3 h-3 text-orange-500" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Speed</span>
                    </div>
                    <div className="text-xl font-black text-gray-800">
                      {wpm}
                      <span className="text-[10px] text-gray-400 font-bold ml-1">wpm</span>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all duration-300">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Accuracy</span>
                    </div>
                    <div className="text-xl font-black text-gray-800">
                      {accuracy ?? "--"}
                      <span className="text-[10px] text-gray-400 font-bold ml-1">%</span>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Time</span>
                    </div>
                    <div className="text-lg font-black text-gray-800">{formatTime(elapsedTime)}</div>
                  </div>

                  <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 hover:border-red-200 transition-all duration-300">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Errors</span>
                    </div>
                    <div className="text-lg font-black text-gray-800">{errors}</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF8EA] border border-orange-100 p-4 rounded-3xl shadow-lg shadow-orange-900/5 group shrink-0 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
                <div className="flex items-center justify-between gap-4 relative">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-colors duration-500 ${remainingTime <= 10 ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"}`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Time Left</div>
                      <div className={`text-2xl font-black font-mono leading-none mt-1 ${remainingTime <= 10 ? "text-red-500 animate-pulse" : "text-gray-800"}`}>
                        {remainingTime}s
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-orange-50/50 border border-orange-100 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${phase === "PLAY" ? "bg-emerald-500 animate-pulse" : "bg-orange-400"}`}></div>
                    <span className="text-[8px] font-bold text-orange-800 uppercase tracking-wider">{phase}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-4 rounded-3xl shadow-lg shadow-orange-500/20 text-white shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <Zap className="w-10 h-10" />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Quick Tip</h4>
                <p className="text-xs font-medium leading-relaxed relative z-10">
                  Focus on accuracy! Smooth typing is faster than fast typing with errors.
                </p>
              </div>
            </div>

            <div className="flex flex-col h-full min-h-0">
              <div className="relative bg-[#FFF8EA] rounded-3xl p-1 shadow-xl shadow-orange-900/5 group flex-1 flex flex-col min-h-0">
                <div className="absolute top-0 left-8 right-8 h-1 bg-orange-100/50 rounded-b-full overflow-hidden z-10">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300 ease-out"
                    style={{
                      width: `${(typedText.length / (lesson?.text.length || 1)) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="bg-[#FFF8EA] rounded-[1.3rem] p-6 md:p-8 flex-1 border border-orange-50/50 relative overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-6 border-b border-orange-100/50 pb-4 shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-6 bg-orange-400 rounded-full block"></span>
                      {gameData?.mode || "Classic Mode"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wide">
                        {lesson?.level}
                      </span>
                    </div>
                  </div>

                  <div
                    ref={snippetContainerRef}
                    className="relative font-mono text-xl md:text-2xl leading-loose tracking-wide text-gray-400 select-none outline-none overflow-y-auto custom-scrollbar flex-1 pt-12 px-4"
                    style={{ whiteSpace: "pre-wrap" }}
                    onClick={() => document.body.focus()}
                    onPaste={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {renderTextWithHighlight()}
                  </div>

                  {phase === "COUNTDOWN" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-20">
                      <div className="text-center">
                        <div className="text-8xl font-black text-orange-500 animate-bounce mb-2 drop-shadow-sm">
                          {countdown}
                        </div>
                        <p className="text-orange-900/50 font-bold uppercase tracking-widest text-sm">
                          Starting shortly
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 h-full min-h-0">
              <div className="bg-[#FFF8EA] rounded-3xl p-6 shadow-xl shadow-orange-900/5 border border-orange-100 flex-1 flex flex-col min-h-0 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-700">Competitors</h3>
                  </div>
                  <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm shadow-orange-200">
                    {players?.length} / 4
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar min-h-0 flex-1">
                  {livePlayers.map((player) => {
                    const isPlayerFinished =
                      player.progress === (lesson?.text.length || 0) && (lesson?.text.length || 0) > 0;
                    const progressPercent = Math.round(((player?.progress || 0) / (lesson?.text.length || 1)) * 100);

                    return (
                      <div
                        key={player._id}
                        className="bg-[#FFF8EA] rounded-xl p-2.5 border border-orange-100/60 shadow-sm hover:border-orange-200 transition-all group relative overflow-hidden"
                      >
                        {player.isHost && (
                          <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-bl-lg text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 z-10">
                            <Crown className="w-2.5 h-2.5" /> HOST
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-2 mt-1">
                          <div className="relative shrink-0">
                            <img
                              src={player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                              className={`w-8 h-8 rounded-lg bg-gray-50 object-cover ring-2 ${isPlayerFinished ? "ring-emerald-400" : "ring-white shadow-sm"}`}
                              alt={player.name}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-800 text-xs truncate pr-6">{player.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${isPlayerFinished ? "bg-emerald-500" : "bg-orange-400"}`}
                                  style={{ width: `${progressPercent}%` }}
                                ></div>
                              </div>
                              <span
                                className={`text-[8px] font-bold uppercase ${isPlayerFinished ? "text-emerald-600" : "text-orange-400"}`}
                              >
                                {isPlayerFinished ? "Done" : `${progressPercent}%`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 bg-gray-50/80 rounded-lg p-1.5 border border-gray-100">
                          <div className="text-center">
                            <div className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">WPM</div>
                            <div className="text-[11px] font-black text-gray-700">{player.wpm || "-"}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">ACC</div>
                            <div className="text-[11px] font-black text-gray-700">{player.accuracy ? player.accuracy + "%" : "-"}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">ERR</div>
                            <div className="text-[11px] font-black text-gray-700">{player.errors || "0"}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {leftPlayers.length > 0 && (
                    <div className="pt-2 border-t border-orange-100/50 mt-2">
                      <div className="text-[10px] uppercase font-bold text-gray-400 mb-2 pl-1">Left Game</div>
                      {leftPlayers.map((player) => (
                        <div
                          key={player._id}
                          className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 mb-2 opacity-75 grayscale hover:grayscale-0 transition-all"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                              <img
                                src={
                                  player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`
                                }
                                className="w-8 h-8 rounded-lg bg-gray-200 object-cover ring-2 ring-gray-100"
                                alt={player.name}
                              />
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="sr-only">Left</span>
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-gray-500 text-xs truncate line-through">{player.name}</div>
                              <div className="text-[9px] text-red-400 font-bold uppercase">Disconnected</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isFinished && finalResult.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-orange-900/20 backdrop-blur-md animate-fade-in">
          <div className="w-[95%] max-w-7xl h-[85vh] bg-[#FFF8EA] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-orange-100 overflow-hidden flex flex-col animate-zoom-in">
            <div className="bg-[#FFF8EA] px-8 py-6 border-b border-orange-100 flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Crown className="w-48 h-48 -rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Game Results</h2>
                <p className="text-gray-500 font-bold text-sm mt-1 uppercase tracking-wide">
                  Final Standings
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-3 px-5 relative z-10">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Match High</div>
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
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-24">
                      Rank
                    </th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-full">
                      Player
                    </th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-32">
                      WPM
                    </th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-32">
                      ACC
                    </th>
                    <th className="py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-40">
                      Tier
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {finalResult
                    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                    .map((p) => {
                      const rank = p.rank;
                      const isWinner = rank === 1;
                      const playerId = p.userId;
                      const isMe = playerId === currentUser?._id;

                      return (
                        <tr
                          key={playerId}
                          className={`
                                group transition-all duration-200
                                ${isMe ? "bg-orange-50/70" : "hover:bg-orange-50/30"}
                              `}
                        >
                          <td className="py-6 px-8 text-center">
                            <div
                              className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm mx-auto
                                    ${isWinner
                                  ? "bg-amber-400 text-white shadow-amber-200 rotate-12"
                                  : rank === 2
                                    ? "bg-slate-300 text-white shadow-slate-100"
                                    : rank === 3
                                      ? "bg-orange-300 text-white shadow-orange-100"
                                      : "bg-gray-100 text-gray-400"
                                }
                                  `}
                            >
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
                                  {isMe && (
                                    <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                                      You
                                    </span>
                                  )}
                                </div>
                                {isWinner && (
                                  <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] mt-1">
                                    Match Winner
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-6 px-8 text-center">
                            <div className="font-black text-gray-800 text-3xl tracking-tighter">
                              {p.wpm || 0}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">
                              Words / Min
                            </div>
                          </td>

                          <td className="py-6 px-8 text-center">
                            <div className="font-black text-emerald-600 text-3xl tracking-tighter">
                              {p.accuracy || 0}%
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">
                              Accuracy
                            </div>
                          </td>

                          <td className="py-6 px-8 text-center">
                            {(p.wpm || 0) > 80 ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="px-4 py-1.5 rounded-full bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                                  Legendary
                                </span>
                              </div>
                            ) : (p.wpm || 0) > 40 ? (
                              <span className="px-4 py-1.5 rounded-full bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                                Professional
                              </span>
                            ) : (
                              <span className="px-4 py-1.5 rounded-full bg-gray-400 text-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                                Rookie
                              </span>
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
                className="px-10 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-500 font-black hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-all text-base shadow-sm uppercase tracking-widest"
              >
                Exit Game
              </button>
              <button
                disabled={!currentUser?.isHost}
                onClick={handleNewGame}
                className={`px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95
                  ${currentUser?.isHost
                    ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPlay;
