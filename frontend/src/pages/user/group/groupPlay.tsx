import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../../../socket";
import { newGameAPI } from "../../../api/user/group";
import {
  Zap,
  Target,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Users,
  Crown,
  // Monitor,
  // CheckCircle2
} from "lucide-react";

interface Lesson {
  id: string;
  text: string;
  category: string;
  level: string;
}
type Status = "PLAYING" | "FINISHED"
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
  status: Status
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
  startTime: number;
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
  rank?: number
};

const GroupPlay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const gameData: GameData | undefined = location.state?.gameData;
  const [gameData, setGameData] = useState<GameData | undefined>(
    location.state?.gameData
  );


  const [chatMessage, setChatMessage] = useState("");
  const players = gameData?.participants || [];
  const lesson = gameData?.lesson;
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsfinished] = useState(false);

  const user = useSelector((state: any) => state.userAuth.user);
  const [countdown, setCountdown] = useState<number>(gameData?.startTime || 10);
  const [remainingTime, setRemainingTime] = useState<number>(gameData?.duration || 300);
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  const [hasError, setHasError] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [livePlayers, setLivePlayers] = useState<PlayerState[]>(players);
  const [leftPlayers, setLeftPlayers] = useState<GameData["participants"]>([]);
  const gameIdRef = useRef(gameData?._id);
  const userIdRef = useRef(user?._id);

  const [totalTyped, setTotalTyped] = useState(0);

  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    name: string;
    imageUrl?: string;
    isHost: boolean;
  } | undefined>(undefined);
  const hasJoinedRef = useRef(false);


  const [finalResult, setFinalResult] = useState<GamePlayerResult[]>([]);
  //send live stats,
  useEffect(() => {
    if (!gameData?._id || !currentUser) return;
    if (phase !== "PLAY") return;
    socket.emit("typing-progress", {
      gameId: gameData._id,
      userId: currentUser._id,
      typedLength: typedText.length,
      wpm,
      accuracy,
      errors,
    });
  }, [typedText, wpm, accuracy, errors, phase]);


  //set status of current user
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

  // 3. Handle Component Unmount (Navigation/Back Button)

  useEffect(() => {
    return () => {
      if (gameIdRef.current && userIdRef.current) {
        // Emit event to server that this user is leaving
        socket.emit("leave-game", {
          gameId: gameIdRef.current,
          userId: userIdRef.current
        });
      }
    };
  }, []);
  //typing progress update from other players
  
  useEffect(() => {
    const handler = (data: any) => {


      setLivePlayers(prev =>
        prev.map(p =>
          p._id === data.userId
            ? { ...p, ...data, progress: data.typedLength }
            : p
        )
      );
    };

    socket.off("typing-progress-update");
    socket.on("typing-progress-update", handler);

    return () => {
      socket.off("typing-progress-update", handler);
    };
  }, [gameData?._id]);


  //redirect to home if no game data
  useEffect(() => {
    if (!gameData) {
      navigate("/");
    }
  }, [gameData, navigate]);


  //set current user
  useEffect(() => {
    if (players) {
      setCurrentUser(players?.find((item: any) => item._id === user._id));
    }
  }, [players, user._id]);


  //auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Auto-scroll effect
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

  //countdown and game timer

  useEffect(() => {
    if (!gameData?.startedAt || !gameData?.duration || finalResult.length) return;
    const startTimesamp = new Date(gameData.startedAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimesamp) / 1000);
      if (elapsed < gameData.startTime) {
        setPhase("COUNTDOWN");
        setCountdown(gameData.startTime - elapsed);
      }
      else if (elapsed < gameData.startTime + gameData.duration) {
        setPhase("PLAY");
        setRemainingTime(gameData.startTime + gameData.duration - elapsed);

        setElapsedTime(elapsed - gameData.startTime);
      }
      else {
        setPhase("PLAY");
        setRemainingTime(0);
        setIsfinished(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameData?.startedAt, gameData?.duration, gameData?.startTime, isFinished, finalResult]);

  //wpm

  useEffect(() => {
    if (phase !== "PLAY" || isFinished) return;
    if (elapsedTime <= 0) return;

    const elapsedMinutes = elapsedTime / 60;
    const correctChars = Math.max(totalTyped - errors, 0);

    const calculatedWpm = Math.round((correctChars / 5) / elapsedMinutes);

    setWpm(calculatedWpm);
  }, [elapsedTime, totalTyped, errors, phase, isFinished]);


  // accuracy
  useEffect(() => {
    if (totalTyped === 0) {
      setAccuracy(null);
      return;
    }

    const correct = totalTyped - errors;
    const acc = Math.round((correct / totalTyped) * 100);
    setAccuracy(acc);
  }, [totalTyped, errors]);



  //format time

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  //render text with highlight

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

      // Cursor logic
      const isCurrentChar = index === typedText.length;
      const cursorClass = isCurrentChar && phase === "PLAY" && !isFinished
        ? "border-l-2 border-orange-500 animate-pulse -ml-[1px]"
        : "";

      // ** Ghost Cursors Logic **
      const playersHere = livePlayers.filter(
        (p) => p._id !== currentUser?._id && p.progress === index
      );

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
          {/* Ghost Cursor Overlay */}
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
                    {/* Name Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-900/90 text-white text-[10px] font-bold rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {p.name}
                      {/* Arrow */}
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

  //handle key down

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

        const expectedChar = lesson.text[typedText.length];
        setTotalTyped((prev) => prev + 1);

        if (e.key !== expectedChar) {
          setErrors((prev) => prev + 1);
          setHasError(true);
          setTypedText((prev) => prev + e.key);
          return;
        }

        const nextText = typedText + e.key;
        setTypedText(nextText);

        if (nextText.length === lesson.text.length) {
          setIsfinished(true);
          socket.emit("player-finished", {
            gameId: gameData?._id,
            userId: currentUser?._id,
            name: currentUser?.name,
            imageUrl: currentUser?.imageUrl,
            timeTaken: elapsedTime,
            wpm,
            accuracy,
            errors,
            typedLength: typedText.length,
            status: "finished",
          });
        }

      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [lesson, isFinished, typedText, phase, hasError, gameData?._id]);


  //realtime
  useEffect(() => {
    if (!gameData?._id || !currentUser?._id) return;
    socket.emit("group-play", {
      gameId: gameData._id,
      userId: currentUser._id,
    });


    hasJoinedRef.current = true;
  }, [gameData?._id, currentUser?._id]);


  //force exit
  useEffect(() => {
    socket.on("force-exit", () => {
      navigate("/");
    });

    return () => {
      socket.off("force-exit");
    };
  }, []);





  //handle leave
  useEffect(() => {
    const handleLeave = ({
      userId,
      newHostId,
    }: {
      userId: string;
      newHostId?: string;
    }) => {
      let leavingPlayer: any = null;
      setLivePlayers(prev => {
        leavingPlayer = prev.find(p => p._id === userId);
        if (!leavingPlayer) return prev;
        if (leavingPlayer) {
          setLeftPlayers(prev => {
            if (prev.some(p => p._id === leavingPlayer._id)) return prev;
            return [...prev, leavingPlayer];
          });
        }

        return prev
          .filter(p => p._id !== userId)
          .map(p => ({
            ...p,
            isHost: p._id === newHostId,
          }));
      });


    };

    socket.on("player-left", handleLeave);
    return () => {
      socket.off("player-left", handleLeave);
    };
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      setIsfinished(true);
      socket.emit("time-up", {
        gameId: gameData?._id,
        userId: currentUser?._id,
        name: currentUser?.name,
        imageUrl: currentUser?.imageUrl,
        timeTaken: elapsedTime,
        wpm,
        accuracy,
        errors,
        typedLength: typedText.length,
        status: "times-up",
      });
    }

    return () => {
      socket.off("time-up");
    };
  }, [remainingTime]);



  useEffect(() => {

    socket.on("game-finished", (data: GamePlayerResult[]) => {
      setFinalResult(data);
    });
    return () => {
      socket.off("game-finished");
    };

  }, [gameData?._id]);

  async function handleNewGame() {
    try {
      const currentUsers = await livePlayers.map(p => p._id);
      await newGameAPI(gameData?._id!, currentUsers);
    }
    catch (error) {
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
    setWpm(0);
    setAccuracy(null);
    setTotalTyped(0);
    setHasError(false);
    setIsfinished(false);
    setFinalResult([]);
    setPhase("COUNTDOWN");
    setElapsedTime(0);
    setCountdown(gameData.startTime);
    setRemainingTime(gameData.duration);

  }, [gameData?._id]);


  return (
    <div className="min-h-screen bg-[#FFF8EA] font-sans selection:bg-orange-200 selection:text-orange-900 overflow-hidden ">
      <Navbar />
      {/* Main Content */}
      <div className="pt-20 px-4 md:px-8 pb-4 max-h-screen flex flex-col max-w-[1920px] mx-auto h-screen box-border">

        {/* Top Bar - Tabs */}



        {/* 3-Column Layout */}
        <div className="flex-1 min-h-0 pb-4">

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_280px] items-stretch h-full">

            {/* LEFT COLUMN - Stats & Chat */}
            <div className="flex flex-col gap-4 h-full min-h-0">

              {/* User Stats Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-orange-100 p-5 rounded-3xl shadow-lg shadow-orange-900/5 group shrink-0 relative overflow-hidden">
                {/* Decorative background blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="relative hover:scale-105 transition-transform duration-300">
                    <img
                      src={currentUser?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                      alt="me"
                      className="w-16 h-16 rounded-2xl object-cover shadow-md shadow-orange-900/10 ring-4 ring-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-800 tracking-tight leading-tight">{currentUser?.name || "Guest"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-600 font-bold uppercase tracking-wider shadow-sm">
                        Online
                      </span>
                      {currentUser?.isHost && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-[10px] text-orange-600 font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Host
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Game Status Banner */}
                <div className={`mb-5 p-3 rounded-2xl border flex items-center gap-3 shadow-sm transition-all duration-300 ${isFinished ? "bg-emerald-50 border-emerald-100" : "bg-orange-50 border-orange-100"}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${isFinished ? "bg-emerald-500 text-white" : "bg-orange-500 text-white animate-bounce-subtle"}`}>
                    {isFinished ? <Crown className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isFinished ? "text-emerald-800" : "text-orange-800"}`}>
                      {phase == "COUNTDOWN" ? "wait to start" : isFinished ? " Complete" : "Race in Progress"}
                    </div>
                    <div className={`text-[10px] font-medium leading-tight ${isFinished ? "text-emerald-600" : "text-orange-600"}`}>
                      {isFinished ? "Waiting for others to finish..." : "Type correctly to win!"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 relative">
                  <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-white hover:shadow-md transition-all duration-300 group/stat">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-orange-100 text-orange-500 rounded-lg group-hover/stat:scale-110 transition-transform">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Speed</span>
                    </div>
                    <div className="text-2xl font-black text-gray-800 pl-1">{wpm}<span className="text-xs text-gray-400 font-bold ml-1">wpm</span></div>
                  </div>

                  <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-white hover:shadow-md transition-all duration-300 group/stat">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-emerald-100 text-emerald-500 rounded-lg group-hover/stat:scale-110 transition-transform">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accuracy</span>
                    </div>
                    <div className="text-2xl font-black text-gray-800 pl-1">{accuracy ?? "--"}<span className="text-xs text-gray-400 font-bold ml-1">%</span></div>
                  </div>

                  <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300 group/stat">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-blue-100 text-blue-500 rounded-lg group-hover/stat:scale-110 transition-transform">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time</span>
                    </div>
                    <div className="text-xl font-black text-gray-800 pl-1">{formatTime(elapsedTime)}</div>
                  </div>

                  <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-white hover:shadow-md transition-all duration-300 group/stat">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-red-100 text-red-500 rounded-lg group-hover/stat:scale-110 transition-transform">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Errors</span>
                    </div>
                    <div className="text-xl font-black text-gray-800 pl-1">{errors}</div>
                  </div>
                </div>
              </div>

              {/* Chat Box */}
              <div className="bg-[#FEFCE8] rounded-3xl p-5 shadow-xl shadow-orange-900/5 border border-orange-100 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-orange-100/50 shrink-0">
                  <h3 className="font-bold text-sm text-gray-700">Live Chat</h3>
                </div>

                <div className="flex-1 space-y-3 mb-3 overflow-y-auto pr-1 custom-scrollbar min-h-0">
                  <div className="flex flex-col gap-1 items-start">
                    <div className="bg-orange-50 text-orange-800 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[90%] font-medium">
                      Welcome to TypeGrid! Get ready to type.
                    </div>
                  </div>
                  <div ref={chatBottomRef} />
                </div>

                <div className="relative shrink-0">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-white border-0 rounded-xl pl-4 pr-10 py-3 text-xs focus:ring-2 focus:ring-orange-200 transition-all font-medium shadow-sm"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm shadow-orange-200">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* CENTRE COLUMN - Game Area */}
            <div className="flex flex-col h-full min-h-0">
              {/* Same styling as AssignedLessonTypingArea */}
              <div className="relative bg-[#FEFCE8] rounded-3xl p-1 shadow-xl shadow-orange-900/5 group flex-1 flex flex-col min-h-0">
                {/* Progress Bar Visual (Optional decorative) */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-orange-100/50 rounded-b-full overflow-hidden z-10">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300 ease-out"
                    style={{ width: `${(typedText.length / (lesson?.text.length || 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="bg-[#FEFCE8] rounded-[1.3rem] p-6 md:p-8 flex-1 border border-orange-50/50 relative overflow-hidden flex flex-col">

                  {/* Header inside card */}
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

                  {/* Text Content */}
                  <div
                    ref={snippetContainerRef}
                    className="relative font-mono text-xl md:text-2xl leading-loose tracking-wide text-gray-400 select-none outline-none overflow-y-auto custom-scrollbar flex-1 pt-12 px-4"
                    style={{ whiteSpace: "pre-wrap" }}
                    onClick={() => document.body.focus()}
                  >
                    {renderTextWithHighlight()}
                  </div>

                  {/* Status Overlay for Countdown */}
                  {phase === "COUNTDOWN" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-20">
                      <div className="text-center">
                        <div className="text-8xl font-black text-orange-500 animate-bounce mb-2 drop-shadow-sm">{countdown}</div>
                        <p className="text-orange-900/50 font-bold uppercase tracking-widest text-sm">Starting shortly</p>
                      </div>
                    </div>
                  )}

                  {/* Finished State */}

                  {/* Finished State - Leaderboard */}

                  {/* Finished State - Standard Leaderboard */}

                  {/* Finished State - Large Standard Leaderboard */}
                  {(isFinished && finalResult.length > 0) && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-orange-50/40 backdrop-blur-sm animate-fade-in">

                      <div className="w-[95%] max-w-7xl h-[85vh] bg-white rounded-[2.5rem] shadow-2xl border border-orange-100 overflow-hidden flex flex-col animate-zoom-in ring-1 ring-black/5">

                        {/* Top Header Section - Larger padding */}
                        <div className="bg-[#FFF8EA] px-10 py-8 border-b border-orange-100 flex items-center justify-between shrink-0">
                          <div>
                            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Game Results</h2>
                            <p className="text-gray-500 font-bold text-base mt-2 uppercase tracking-wide">
                              Final Standings & Statistics
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100 flex items-center gap-4 px-6">
                            <Crown className="w-10 h-10 text-orange-500 fill-orange-500" />
                            <div className="text-right">
                              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Top Speed</div>
                              <div className="text-xl font-black text-gray-800">
                                {Math.max(...(finalResult.length > 0 ? finalResult : livePlayers).map(p => p.wpm || 0), 0)} WPM
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Leaderboard Table Content */}
                        <div className="p-0 bg-white flex-1 overflow-y-auto custom-scrollbar">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                              <tr>
                                <th className="py-3 px-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center w-16">Rank</th>
                                <th className="py-3 px-6 text-xs font-black text-gray-400 uppercase tracking-widest w-full">Player</th>
                                <th className="py-3 px-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center w-24">WPM</th>
                                <th className="py-3 px-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center w-20">ACC</th>
                                <th className="py-3 px-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center w-24">Result</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {isFinished && finalResult.length > 0 && finalResult
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
                                              ${isMe ? "bg-orange-50/70" : "hover:bg-gray-50"}
                                            `}
                                    >
                                      {/* Rank Column */}
                                      <td className="py-3 px-6 text-center">
                                        <div className="flex justify-center">
                                          {rank === 1 ? (
                                            <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center font-black text-sm shadow-md shadow-orange-200">
                                              1
                                            </div>
                                          ) : rank === 2 ? (
                                            <div className="w-8 h-8 bg-gray-400 text-white rounded-lg flex items-center justify-center font-black text-sm">
                                              2
                                            </div>
                                          ) : rank === 3 ? (
                                            <div className="w-8 h-8 bg-orange-300 text-white rounded-lg flex items-center justify-center font-black text-sm">
                                              3
                                            </div>
                                          ) : (
                                            <div className="w-8 h-8 flex items-center justify-center text-gray-400 font-black text-sm">
                                              #{rank}
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      {/* Player Column - Compact Size */}
                                      <td className="py-3 px-6">
                                        <div className="flex items-center gap-3">
                                          <div className="relative shrink-0">
                                            <img
                                              src={p.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                                              className={`w-10 h-10 rounded-full object-cover ring-2 shadow-sm ${isWinner ? "ring-orange-400" : "ring-gray-100"}`}
                                              alt={p.name}
                                            />
                                            {isWinner && <Crown className="absolute -top-2 -right-1 w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-sm" />}
                                          </div>
                                          <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2">
                                              <span className={`font-bold text-base truncate ${isMe ? "text-gray-900" : "text-gray-700"}`}>
                                                {p.name}
                                              </span>
                                              {isMe && <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded uppercase tracking-wide">YOU</span>}
                                            </div>
                                            {isWinner ? (
                                              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Champion</span>
                                            ) : (
                                              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Player</span>
                                            )}
                                          </div>
                                        </div>
                                      </td>

                                      {/* WPM Column */}
                                      <td className="py-3 px-6 text-center">
                                        <div className="flex flex-col items-center">
                                          <div className="font-black text-xl text-gray-800">{p.wpm || 0}</div>
                                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">WPM</div>
                                        </div>
                                      </td>

                                      {/* Accuracy Column */}
                                      <td className="py-3 px-6 text-center">
                                        <div className="flex flex-col items-center">
                                          <div className="font-bold text-lg text-gray-600">{p.accuracy || 0}%</div>
                                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Acc</div>
                                        </div>
                                      </td>

                                      {/* Result badge Column */}
                                      <td className="py-3 px-6 text-center">
                                        {(p.wpm || 0) > 80 ? (
                                          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 font-bold text-xs border border-green-100">Legendary</span>
                                        ) : (p.wpm || 0) > 60 ? (
                                          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">Expert</span>
                                        ) : (p.wpm || 0) > 40 ? (
                                          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">Pro</span>
                                        ) : (
                                          <span className="inline-block px-3 py-1 rounded-full bg-gray-50 text-gray-500 font-bold text-xs border border-gray-100">Rookie</span>
                                        )}
                                      </td>

                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-gray-50 px-10 py-8 border-t border-gray-100 flex gap-5 justify-end items-center shrink-0">
                          <button
                            onClick={() => navigate("/user/dashboard")}
                            className="px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all text-base shadow-sm uppercase tracking-wide"
                          >
                            Exit
                          </button>
                          <button
                            disabled={!currentUser?.isHost}
                            onClick={handleNewGame}
                            className={`px-10 py-4 rounded-2xl font-bold uppercase tracking-wide
    ${currentUser?.isHost
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"}
  `}
                          >
                            Play Again
                          </button>

                        </div>

                      </div>
                    </div>
                  )}


                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Stats & Players */}
            <div className="flex flex-col gap-4 h-full min-h-0">

              {/* Timer Card */}
              <div className="bg-[#FEFCE8] border border-orange-50/50 p-6 rounded-2xl shadow-sm hover:scale-105 transition-transform duration-300 cursor-default group shrink-0">
                <div className="flex flex-col items-center gap-2">
                  <div className={"w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-500"}>
                    <Clock className={`w-6 h-6 ${remainingTime <= 10 ? "text-red-500" : "text-orange-500"}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-black ${remainingTime <= 10 ? "text-red-500" : "text-gray-800"} font-mono mt-2`}>
                      {remainingTime}
                      <span className="text-lg text-gray-400 font-medium ml-1">s</span>
                    </div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Time Left</div>
                  </div>
                </div>
              </div>

              {/* Players List */}
              <div className="bg-[#FEFCE8] rounded-3xl p-5 shadow-xl shadow-orange-900/5 border border-orange-100 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <h3 className="font-bold text-sm text-gray-700">Players</h3>
                  </div>
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-100">
                    {players?.length} / 4
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar min-h-0 flex-1">
                  {livePlayers.map((player) => {
                    // Determine status logic
                    const isPlayerFinished = player.progress === (lesson?.text.length || 0) && (lesson?.text.length || 0) > 0;
                    const progressPercent = Math.round((player?.progress || 0) / (lesson?.text.length || 1) * 100);

                    return (
                      <div key={player._id} className="bg-white rounded-xl p-3 border border-orange-100/60 shadow-[0_2px_8px_-2px_rgba(249,115,22,0.05)] hover:border-orange-200 hover:shadow-md transition-all group relative overflow-hidden">

                        {/* Hosting Badge if Host */}
                        {player.isHost && (
                          <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-bl-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 z-10">
                            <Crown className="w-2.5 h-2.5" /> HOST
                          </div>
                        )}

                        <div className="flex items-center gap-3 mb-3 mt-1">
                          <div className="relative shrink-0">
                            <img
                              src={player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                              className={`w-10 h-10 rounded-xl bg-gray-50 object-cover ring-2 ${isPlayerFinished ? "ring-emerald-400" : "ring-white shadow-sm"}`}
                              alt={player.name}
                            />
                            {/* Rank Badge */}
                            {player.rank && (
                              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-sm ring-2 ring-white z-10">
                                {player.rank}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between pr-8">
                              <div className="font-bold text-gray-800 text-sm truncate">{player.name}</div>
                            </div>

                            {/* Progress Status */}
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${isPlayerFinished ? "bg-emerald-500" : "bg-orange-400"}`}
                                  style={{ width: `${progressPercent}%` }}
                                ></div>
                              </div>
                              <span className={`text-[10px] font-bold uppercase ${isPlayerFinished ? "text-emerald-600" : "text-orange-400"}`}>
                                {isPlayerFinished ? "Done" : `${progressPercent}%`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mini Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 bg-gray-50/80 rounded-lg p-2 border border-gray-100">
                          <div className="text-center group-hover:bg-white rounded transition-colors duration-200 p-0.5">
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">WPM</div>
                            <div className="text-xs font-black text-gray-700">{player.wpm || "-"}</div>
                          </div>
                          <div className="text-center group-hover:bg-white rounded transition-colors duration-200 p-0.5">
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">ACC</div>
                            <div className="text-xs font-black text-gray-700">{player.accuracy ? player.accuracy + "%" : "-"}</div>
                          </div>
                          <div className="text-center group-hover:bg-white rounded transition-colors duration-200 p-0.5">
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">ERR</div>
                            <div className="text-xs font-black text-gray-700">{player.errors || "0"}</div>
                          </div>
                        </div>

                        {/* Status Text (User requested modification styled) */}
                        {!isPlayerFinished && (
                          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-400/20 animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}

                  {/* Left Players Section */}
                  {leftPlayers.length > 0 && (
                    <div className="pt-2 border-t border-orange-100/50 mt-2">
                      <div className="text-[10px] uppercase font-bold text-gray-400 mb-2 pl-1">Left Game</div>
                      {leftPlayers.map((player) => (
                        <div key={player._id} className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 mb-2 opacity-75 grayscale hover:grayscale-0 transition-all">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                              <img
                                src={player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
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
    </div>
  );
};

export default GroupPlay;
