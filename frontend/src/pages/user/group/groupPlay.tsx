import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../../../socket";
import {
  Zap,
  Target,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Users,
  Crown
} from "lucide-react";

interface Lesson {
  id: string;
  text: string;
  category: string;
  level: string;
}

interface GameData {
  _id: string;
  mode: string;
  status: string;
  duration: number;
  lesson: Lesson;
  startTime: number;
  startedAt: string;
  participants: {
    _id: string;
    name: string;
    imageUrl?: string;
    isHost: boolean;
    wpm?: number;
    accuracy?: number;
    time?: string;
    errors?: number;
    rank?: number;
  }[];
}

const GroupPlay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData: GameData | undefined = location.state?.gameData;
  const [activeTab, setActiveTab] = useState<"LOBBY" | "NEW GAME">("LOBBY");
  const [chatMessage, setChatMessage] = useState("");
  const [players] = useState(gameData?.participants || []);
  const [lesson] = useState(gameData?.lesson)
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
  const [time, setTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTypingTime, setStartTypingTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0);
  const [livePlayers, setLivePlayers] = useState(players);
  const [leftPlayers, setLeftPlayers] = useState<GameData['participants']>([]);

  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    name: string;
    imageUrl?: string;
    isHost: boolean;
  } | undefined>(undefined)


  //send live stats,
  useEffect(() => {
    if (!gameData?._id || !currentUser) return
    if (phase !== 'PLAY') return

    socket.emit("typing-progress", {
      gameId: gameData._id,
      userId: currentUser._id,
      typedLength: typedText.length,
      wpm,
      accuracy,
      errors,
      // time
    })
  }, [typedText, wpm, accuracy, errors, phase]);

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
    socket.on("typing-progress-update", (data) => {
      setLivePlayers((prev) =>
        prev.map((p) =>
          p._id === data.userId
            ? {
              ...p,
              wpm: data.wpm,
              accuracy: data.accuracy,
              errors: data.errors,
              progress: data.typedLength,
            }
            : p
        )
      );
    });

    return () => {
      socket.off("typing-progress-update");
    };
  }, []);


  useEffect(() => {
    if (!gameData) {
      navigate("/");
    }
  }, [gameData, navigate]);

  useEffect(() => {
    if (players) {
      setCurrentUser(players?.find((item: any) => item._id === user._id))
    }
  }, [players, user._id])

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
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
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [typedText]);

  useEffect(() => {
    if (!gameData?.startedAt || !gameData?.duration || isFinished) return
    const startTimesamp = new Date(gameData.startedAt).getTime()

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTimesamp) / 1000)

      if (elapsed < gameData.startTime) {
        setPhase("COUNTDOWN")
        setCountdown(gameData.startTime - elapsed)
      }
      else if (elapsed < gameData.startTime + gameData.duration) {
        setPhase('PLAY')
        setRemainingTime(gameData.startTime + gameData.duration - elapsed)

        setElapsedTime(elapsed - gameData.startTime);
      }
      else {
        setPhase('PLAY')
        setRemainingTime(0)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [gameData?.startedAt, gameData?.duration, gameData?.startTime, isFinished])


  //wpm
  useEffect(() => {
    if (!startTypingTime) return;

    const elapsedMs = Date.now() - startTypingTime;
    const elapsedMinutes = elapsedMs / 60000;

    if (elapsedMinutes <= 0) return;

    const characters = typedText.length;
    const words = characters / 5;

    const calculatedWpm = Math.round(words / elapsedMinutes);
    setWpm(calculatedWpm);
  }, [typedText, startTypingTime]);

  // accuracy
  useEffect(() => {
    const correctChars = typedText.length;
    const totalAttempts = correctChars + errors;

    if (totalAttempts === 0) {
      setAccuracy(100);
      return;
    }

    const acc = Math.round((correctChars / totalAttempts) * 100);
    setAccuracy(acc);
  }, [typedText, errors]);


  useEffect(() => {
    console.log("error count", errors)
  }, [errors])


  //left players



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
          className = "text-emerald-500 font-bold drop-shadow-sm";
        } else {
          className = "text-red-500 bg-red-100/50 rounded-sm decoration-red-500 underline decoration-4 underline-offset-4";
        }
      }

      // Cursor logic
      const isCurrentChar = index === typedText.length;
      const cursorClass = isCurrentChar && phase === "PLAY" && !isFinished
        ? "border-l-[3px] border-orange-500 animate-pulse -ml-[1.5px] pl-[1.5px]"
        : "";

      return (
        <span
          key={index}
          ref={isCurrentChar ? activeCharRef : null}
          className={`
           ${cursorClass}
           ${className}
          inline-flex items-center justify-center
          h-[32px] min-w-[12px]
          transition-colors duration-75
          font-mono text-lg md:text-xl
        `}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lesson || isFinished || phase !== "PLAY") return;
      if (!startTypingTime) {
        setStartTypingTime(Date.now());
      }
      if (e.key === "Backspace") {
        setHasError(false)
        setTypedText((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();

        if (hasError) return

        const expectedChar = lesson.text[typedText.length];

        if (e.key !== expectedChar) {
          setErrors((prev) => prev + 1)
          setHasError(true)
          setTypedText((prev) => prev + e.key)
          return
        }

        const nextText = typedText + e.key;
        setTypedText(nextText);

        if (nextText.length === lesson.text.length) {
          setIsfinished(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [lesson, isFinished, typedText, phase, hasError]);


  //realtime
  useEffect(() => {
    if (!gameData?._id || !currentUser?._id) return;

    socket.emit("group-play", {
      gameId: gameData._id,
      userId: currentUser._id,
    });

    return () => {
      socket.emit("leave-group-play", {
        gameId: gameData._id,
        userId: currentUser._id,
      });
    };
  }, [gameData?._id, currentUser?._id]);

  useEffect(() => {
    const handleLeave = ({ userId }: { userId: string }) => {
      setLivePlayers(prev => {
        const leaveUser = prev.find(p => p._id === userId);
        if (!leaveUser) return prev;

        setLeftPlayers(prev => {
          if (prev.some(p => p._id === leaveUser._id)) {
            return prev;
          }
          return [...prev, leaveUser];
        });
        return prev.filter(p => p._id !== userId);
      });
    };

    socket.on("player-left", handleLeave);

    return () => {
      socket.off("player-left", handleLeave);
    };
  }, []);






  return (
    <div className="min-h-screen bg-[#FFF6E8] font-sans selection:bg-orange-200 selection:text-orange-900 overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 px-4 md:px-8 pb-4 max-h-screen flex flex-col max-w-[1920px] mx-auto h-screen box-border">

        {/* Top Bar - Tabs */}
        <div className="flex justify-center mb-4 shrink-0">
          <div className="bg-white/50 backdrop-blur-sm p-1 rounded-2xl shadow-sm border border-orange-100/50 flex gap-1">
            {["LOBBY", "NEW GAME"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                            px-6 py-2 rounded-xl font-bold text-xs tracking-wider transition-all duration-300
                            ${activeTab === tab
                    ? "bg-white text-orange-600 shadow-sm transform scale-100"
                    : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                  }
                        `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr_240px] items-stretch flex-1 min-h-0 pb-4">

          {/* LEFT COLUMN - Stats & Chat */}
          <div className="flex flex-col gap-4 h-full min-h-0">

            {/* User Stats Card */}
            <div className="bg-white rounded-3xl p-5 shadow-lg shadow-orange-100/50 border border-orange-100 transition-transform duration-300 shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={currentUser?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                    alt="me"
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-2 ring-[#FFF6E8]"
                  />
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-gray-700 to-gray-900 rounded-md flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 tracking-tight leading-tight">{currentUser?.name || "Guest"}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">online</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Zap className="w-3.5 h-3.5 text-orange-400" /> WPM
                    </span>
                    <span className="text-base font-bold text-gray-800">{wpm}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-400 to-amber-400 h-full rounded-full w-[45%] shadow-[0_0_10px_rgba(251,146,60,0.3)]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Target className="w-3.5 h-3.5 text-emerald-400" /> Accuracy
                    </span>
                    <span className="text-base font-bold text-gray-800">{accuracy}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full w-[98%] shadow-[0_0_10px_rgba(52,211,153,0.3)]"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-gray-100">
                <div className="text-center group">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-medium uppercase tracking-wider mb-0.5 group-hover:text-orange-500 transition-colors">
                    <Clock className="w-3 h-3" /> Time
                  </div>
                  <div className="font-bold text-base text-gray-800 font-mono">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
                <div className="w-px h-6 bg-gray-100"></div>
                <div className="text-center group">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-medium uppercase tracking-wider mb-0.5 group-hover:text-red-500 transition-colors">
                    <AlertCircle className="w-3 h-3" /> Errors
                  </div>
                  <div className="font-bold text-base text-gray-800 font-mono">{errors}</div>
                </div>
              </div>
            </div>

            {/* Chat Box - Fills remaining height */}
            <div className="bg-white rounded-3xl p-5 shadow-lg shadow-orange-100/50 border border-orange-100 flex-1 min-h-0 flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100 shrink-0">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-base text-gray-800">Live Chat</h3>
              </div>

              <div className="flex-1 space-y-3 mb-3 overflow-y-auto pr-1 custom-scrollbar min-h-0">
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-[10px] text-gray-400 font-bold ml-2">System</span>
                  <div className="bg-orange-50 text-orange-800 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[90%] font-medium">
                    Welcome to TypeGrid! Get ready to type.
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-[10px] text-gray-400 font-bold ml-2">Mitu</span>
                  <div className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[90%] font-medium">
                    Good luck everyone! 🔥
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
                  className="w-full bg-gray-50 border border-transparent rounded-xl pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-200 transition-all placeholder:text-gray-400 text-gray-700 font-medium"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm">
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* CENTRE COLUMN - Game Area */}
          <div className="flex flex-col h-full min-h-0">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl shadow-orange-100/50 border border-orange-100 flex flex-col relative flex-1 min-h-0">

              {/* Status Header */}
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex gap-2">
                  <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full animate-pulse shadow-md shadow-red-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Live
                  </span>
                  <span className="bg-gray-800 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-md shadow-gray-200">
                    {gameData?.mode || "Classic"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-orange-50 text-orange-600 uppercase tracking-wide border border-orange-100">{lesson?.category || "General"}</span>
                  <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wide border border-blue-100">{lesson?.level || "Medium"}</span>
                </div>
              </div>

              <div className="mb-2 shrink-0">
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Snippet</h2>
              </div>

              {/* Snippet Container - Flex Grow to take available space */}
              <div
                ref={snippetContainerRef}
                className="bg-[#F8F9FA] p-6 md:p-8 rounded-2xl flex-1 overflow-y-auto custom-scrollbar border-2 border-transparent focus-within:border-orange-200 focus-within:bg-white transition-colors duration-300 shadow-inner min-h-0 relative scroll-smooth"
                onClick={() => document.body.focus()}
              >
                {/*  Use a wrapper to help centering if needed, but direct mapping is fine */}
                <div className="font-mono leading-relaxed tracking-wide select-none break-words whitespace-pre-wrap outline-none relative" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                  {renderTextWithHighlight()}
                </div>
              </div>

              {/* Focus Instruction */}
              {phase === "PLAY" && !isFinished && (
                <div className="text-center mt-3 shrink-0">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-full">Type the text above</span>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN - Stats & Players */}
          <div className="flex flex-col gap-4 h-full min-h-0">

            {/* Timer Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-orange-100/50 border border-orange-100 flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <Clock className="absolute -right-6 -top-6 w-28 h-28 text-gray-50 opacity-50 rotate-12" />

              <div className="relative z-10 w-full px-4 text-center">
                {/* TIMER */}
                <div className="text-6xl font-mono font-bold tracking-tighter text-gray-800 mb-2 drop-shadow-sm">
                  {phase === "COUNTDOWN" && (
                    <span className="text-orange-500 animate-scale-in">
                      {countdown}<span className="text-2xl align-top opacity-50 font-sans font-medium ml-1">s</span>
                    </span>
                  )}

                  {phase === "PLAY" && (
                    <span className={`${remainingTime <= 10 ? "text-red-500 animate-pulse" : "text-emerald-500"}`}>
                      {remainingTime}<span className="text-2xl align-top opacity-50 font-sans font-medium ml-1">s</span>
                    </span>
                  )}
                </div>

                {/* LABEL */}
                <div className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-4">
                  {phase === "COUNTDOWN" ? "Starting in" : "Time Remaining"}
                </div>

                {/* FOOTER HELP */}
                <div className="flex justify-center items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                  <span className="bg-white px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-500 border border-gray-200 shadow-sm">CTRL</span>
                  <span className="text-gray-300 text-[9px]">+</span>
                  <span className="bg-white px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-500 border border-gray-200 shadow-sm">ESC</span>
                  <span className="text-[9px] text-gray-400 ml-1 font-medium">to exit</span>
                </div>
              </div>

            </div>

            {/* Players List - Fills remaining height */}
            <div className="bg-white rounded-3xl p-5 shadow-lg shadow-orange-100/50 border border-orange-100 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-700" />
                  <h3 className="font-bold text-base text-gray-800">Players</h3>
                </div>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {players?.length} / 4
                </span>
              </div>

              <input
                type="text"
                placeholder="Find player..."
                className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-2 text-xs mb-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all font-medium placeholder:text-gray-400 text-gray-700 shrink-0"
              />

              <div className="space-y-2.5 overflow-y-auto pr-1 custom-scrollbar min-h-0 flex-1">
                {livePlayers.map((player) => (
                  <div key={player._id} className="bg-white rounded-2xl p-2.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative">
                        <img
                          src={player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                          className="w-9 h-9 rounded-xl bg-gray-100 object-cover"
                          alt={player.name}
                        />
                        {player.rank && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-amber-300 to-orange-400 text-white text-[8px] flex items-center justify-center rounded-full font-bold border-2 border-white shadow-sm">
                            {player.rank === 1 ? <Crown className="w-2.5 h-2.5" /> : player.rank}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-800 text-sm truncate group-hover:text-orange-600 transition-colors">{player.name}</div>
                        <div className="text-[9px] text-emerald-600 flex items-center gap-1 font-medium">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> Ready
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1 bg-gray-50/80 p-1.5 rounded-lg">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-[8px] font-bold uppercase">WPM</span>
                        <span className="font-bold text-gray-700 text-[10px]">{player.wpm || '-'}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-[8px] font-bold uppercase">ACC</span>
                        <span className="font-bold text-gray-700 text-[10px]">{player.accuracy ? player.accuracy + '%' : '-'}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-[8px] font-bold uppercase">TIME</span>
                        <span className="font-bold text-gray-700 text-[10px]">{player.time || '-'}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-red-300 text-[8px] font-bold uppercase">ERR</span>
                        <span className="font-bold text-gray-700 text-[10px]">{player.errors || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* LEFT PLAYERS */}
              {leftPlayers.length > 0 && (
                <>
                  <div className="mt-4 mb-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    Left Players
                  </div>

                  <div className="space-y-2 opacity-70">
                    {leftPlayers.map((player) => (
                      <div
                        key={player._id}
                        className="bg-gray-50 rounded-xl p-2 border border-dashed border-gray-200 flex items-center gap-3"
                      >
                        <img
                          src={player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                          className="w-8 h-8 rounded-lg grayscale"
                          alt={player.name}
                        />

                        <div className="flex-1">
                          <div className="text-xs font-bold text-gray-500">
                            {player.name}
                          </div>
                          <div className="text-[9px] text-red-400 font-semibold uppercase">
                            Disconnected
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupPlay;
