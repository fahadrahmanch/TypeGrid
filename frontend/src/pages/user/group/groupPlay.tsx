import React, { useState, useEffect } from "react";
import Navbar from "../../../components/user/Navbar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../../../socket";

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
  const { joinLink } = useParams<{ joinLink: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const gameData: GameData | undefined = location.state?.gameData;
  const [activeTab, setActiveTab] = useState<"LOBBY" | "NEW GAME">("LOBBY");
  const [chatMessage, setChatMessage] = useState("");
  const [players, setPlayers] = useState(gameData?.participants || []);
  const [lesson, setLesson] = useState(gameData?.lesson)
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsfinished] = useState(false);
  const [errors, setErrors] = useState(0);
  const user = useSelector((state: any) => state.userAuth.user);
  const [countdown, setCountdown] = useState<number>(gameData?.startTime || 10);
  const [remainingTime, setRemainingTime] = useState<number>(gameData?.duration || 300);
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    name: string;
    imageUrl?: string;
    isHost: boolean;
  } | undefined>(undefined)

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
    if (!gameData?.startedAt || !gameData?.duration) return

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
      }
      else {
        setPhase('PLAY')
        setRemainingTime(0)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [gameData?.startedAt, gameData?.duration, gameData?.startTime, phase])

  const renderTextWithHighlight = () => {
    if (!lesson) return null;
    return lesson.text.split("").map((char: string, index: number) => {
      let color = "text-gray-400";
      let bg = "";
      if (index < typedText.length) {
        if (typedText[index] == char) {
          bg = "bg-green-200";
          color = "text-green-600";

        } else {
          bg = "bg-red-200";
          color = "text-red-500";
        }
      }

      return (
        <span
          key={index}
          className={`
          ${bg} ${color}
          inline-flex items-center justify-center
           h-[24px]
           mx-[1px]
          rounded-sm
          font-mono
        `}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
    
      if (!lesson || isFinished || phase !== "PLAY") return;

      e.preventDefault();

      if (e.key === "Backspace") {

        setTypedText((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1) {
        setTypedText((prev) => prev + e.key);
        if (typedText.length + 1 === lesson.text.length) {
          setIsfinished(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [lesson, isFinished, typedText, phase]);
  useEffect(() => {
    if (!lesson) {
      return;
    }

    const orginalText = lesson.text;
    let errorCount = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] != orginalText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

  }, [typedText]);


  //realtime
  useEffect(() => {
    if (!gameData?._id) return;
    socket.emit("group-play", gameData._id);
  }, [gameData?._id]);



  return (
    <div className="min-h-screen bg-[#FFF6E8] font-sans">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 px-2 md:px-4 pb-8 max-w-[1920px] mx-auto">

        {/* Top Bar - Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("LOBBY")}
            className={`px-8 py-2 rounded-lg font-bold text-sm tracking-wider shadow-sm transition-colors ${activeTab === "LOBBY" ? "bg-[#F3E6D5] text-black" : "bg-transparent text-gray-500 hover:bg-[#F3E6D5]/50"
              }`}
          >
            LOBBY
          </button>
          <button
            onClick={() => setActiveTab("NEW GAME")}
            className={`px-8 py-2 rounded-lg font-bold text-sm tracking-wider shadow-sm transition-colors ${activeTab === "NEW GAME" ? "bg-[#F3E6D5] text-black" : "bg-transparent text-gray-500 hover:bg-[#F3E6D5]/50"
              }`}
          >
            NEW GAME
          </button>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_260px] xl:grid-cols-[300px_1fr_300px]">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* User Stats Card */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 shadow-sm border border-[#EAEaea]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-3">
                  <div className="relative">
                    <img src={currentUser?.imageUrl} alt="me" className="w-12 h-12 rounded-full object-cover" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#FAF9F6]">2</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{currentUser?.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-green-600 font-medium">online</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  ⚡ WPM
                </span>
                <span className="text-xl font-bold text-gray-800">45</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
                <div className="bg-[#FAF9F6] h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  🎯 Accuracy
                </span>
                <span className="text-xl font-bold text-gray-800">98%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
                <div className="bg-[#FAF9F6] h-1.5 rounded-full" style={{ width: '98%' }}></div>
              </div>


              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                    ⏱ Time
                  </div>
                  <div className="font-bold text-lg text-gray-800">3:12</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                    <span className="text-red-500">x</span> Errors
                  </div>
                  <div className="font-bold text-lg text-gray-800">7</div>
                </div>
              </div>
            </div>

            {/* Chat Box */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 shadow-sm border border-[#EAEaea] flex-1 min-h-[400px] flex flex-col">
              <h3 className="font-bold text-lg text-gray-800 mb-6">Chat</h3>

              <div className="flex-1 space-y-4 mb-4 overflow-y-auto text-sm text-gray-600">
                <p><span className="text-gray-400">System:</span> Welcome to TypeGrid!</p>
                <p><span className="text-gray-400">Mitu:</span> Good luck everyone!</p>
                <p><span className="text-gray-400">Admi:</span> gl hf</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 bg-[#F9F4EC] border border-[#EAEaea] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
                  Send
                </button>
              </div>
            </div>

          </div>

          {/* CENTRE COLUMN */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#FAF9F6] rounded-2xl p-8 shadow-sm border border-[#EAEaea] min-h-[450px] flex flex-col relative">

              <div className="absolute top-6 right-6 bg-[#FF4444] text-white text-[10px] font-bold px-2 py-1 rounded">
                LIVE
              </div>
              <div className="absolute top-6 left-6 bg-black/80 text-white text-xs p-2 rounded z-50 whitespace-pre font-mono">
                DEBUG:
                Phase: {phase}
                Countdown: {countdown}
                Elapsed: {Math.floor((Date.now() - new Date(gameData?.startedAt || 0).getTime()) / 1000)}
                StartTime: {gameData?.startTime}
                StartedAt: {gameData?.startedAt}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-1">Snippet</h2>

              <div className="bg-[#F3F8F5] p-8 rounded-xl my-6 font-mono text-lg leading-relaxed text-gray-500 tracking-wide flex-1 overflow-y-auto custom-scrollbar max-h-[400px]">
                <span className="text-green-600">
                  {renderTextWithHighlight()}
                </span>
              </div>

              <div className="mb-4">
                {/* <h3 className="font-bold text-gray-800">Game of Thrones</h3> */}
                {/* <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <span className="block w-3 h-3 border border-gray-400 rounded-full border-l-transparent animate-spin"></span>
                        Added 5 years ago
                    </div> */}
              </div>

            </div>

            <div className="bg-[#FAF9F6] rounded-2xl p-6 shadow-sm border border-[#EAEaea]">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Type here when the game begins...</h3>
              <div className="bg-[#F9F4EC] rounded-lg p-4 font-mono text-gray-400 text-sm mb-2">
                Start typing when the race begins...
              </div>
              <p className="text-xs text-gray-500">Escape to reset</p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* Timer Card */}
            <div className="bg-[#FAF9F6] rounded-2xl p-8 shadow-sm border border-[#EAEaea] flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-6xl font-normal text-[#00A34D] mb-4 font-mono tracking-wider">

              </div>
              <div className="w-full px-4 text-center">
                {/* TIMER */}
                <div className="text-6xl font-mono font-semibold tracking-wider text-gray-800 mb-2">
                  {phase === "COUNTDOWN" && (
                    <span className="text-orange-500">
                      {countdown}s
                    </span>
                  )}

                  {phase === "PLAY" && (
                    <span className={remainingTime <= 10 ? "text-red-500" : "text-green-600"}>
                      {remainingTime}s
                    </span>
                  )}
                </div>

                {/* LABEL */}
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                  {phase === "COUNTDOWN" ? "Starting in" : "Time Left"}
                </div>

                {/* FOOTER HELP */}
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 border rounded font-sans text-[10px]">Ctrl</kbd>
                    +
                    <kbd className="px-1.5 py-0.5 border rounded font-sans text-[10px]">Esc</kbd>
                  </span>
                  <span>to exit</span>
                </div>
              </div>

            </div>

            {/* Players List */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 shadow-sm border border-[#EAEaea] flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">Players({players?.length})</h3>
              </div>

              <input
                type="text"
                placeholder="Filter by name..."
                className="w-full bg-[#F9F4EC] border border-transparent rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:bg-white focus:border-gray-200"
              />

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {players.map((player, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <img src={player.imageUrl || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full bg-gray-200 object-cover" alt={player.name} />
                        {player.rank && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#E69B00] text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                            {player.rank}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{player.name}</div>
                        <div className="text-[10px] text-green-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> online
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">⚡ WPM</span>
                        <span className="font-bold text-gray-800 text-sm">{player.wpm}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">🎯 Accuracy</span>
                        <span className="font-bold text-gray-800 text-sm">{player.accuracy}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">⏱ Time</span>
                        <span className="font-bold text-gray-800 text-sm">{player.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 text-xs">x Errors</span>
                        <span className="font-bold text-gray-800 text-sm">{player.errors}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupPlay;
