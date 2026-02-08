import React, { useState, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../../socket";
import { startGame } from "../../../api/user/quick";
import {
    Zap,
    Target,
    Clock,
    AlertCircle,
    Send,
    Users,
    Trophy,
    Home,
    RotateCcw,

} from "lucide-react";
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

// interface Player {
//     id: string;
//     name: string;
//     avatar: string;
//     rank: number;
//     wpm: number;
//     accuracy: number;
//     time: string;
//     errors: number;
//     // status: "online" | "offline" | "playing";
//     isCurrentUser?: boolean;
// }
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
    //   status: Status
}
const QuickPlay: React.FC = () => {
    // Mock Data matching the image
    const location = useLocation();
    const navigate = useNavigate();
    const gameData = location.state?.gameData;
    const user = useSelector((state: any) => state.userAuth.user);
    const players = gameData?.participants;
    const [typedText, setTypedText] = useState("");
    const [isFinished, setIsfinished] = useState(false);
    const [countdown, setCountdown] = useState<number>(gameData?.startTime || 10);
    const [remainingTime, setRemainingTime] = useState<number>(gameData?.duration || 300);
    const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
    const [hasError, setHasError] = useState(false);
    const [errors, setErrors] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [livePlayers, setLivePlayers] = useState<Participant[]>(players || []);
    const [chatMessage, setChatMessage] = useState("");
    const lesson = gameData?.lesson?.text || "";
    const [hasSentStart, setHasSentStart] = useState(false);
    const [totalTyped, setTotalTyped] = useState(0);
    const activeCharRef = useRef<HTMLSpanElement>(null);
    const snippetContainerRef = useRef<HTMLDivElement>(null);
    const gameIdRef = useRef(gameData?._id);
    const userIdRef = useRef(user?._id);
    const [finalResult, setFinalResult] = useState<GamePlayerResult[]>([]);
    const [currentUser, setCurrentUser] = useState<{
        _id: string;
        name: string;
        imageUrl?: string;
        isHost: boolean;
    } | undefined>(undefined);
    useEffect(() => {
        if (!gameData) {
            navigate("/", { replace: true });
        }
    }, [gameData, navigate]);

    //send live stats,
    useEffect(() => {
        if (!gameData?._id || !currentUser) return;
        if (phase !== "PLAY") return;
        socket.emit("typing-progress-quick", {
            gameId: gameData._id,
            userId: currentUser._id,
            typedLength: typedText.length,
            wpm,
            status:'PLAYING',
            accuracy,
            errors,
        });
    }, [typedText, wpm, accuracy, errors, phase]);


    useEffect(() => {
        gameIdRef.current = gameData?._id;
        userIdRef.current = currentUser?._id;
    }, [gameData?._id, currentUser?._id]);

    // 3. Handle Component Unmount (Navigation/Back Button)
    useEffect(() => {
        return () => {
            if (gameIdRef.current && userIdRef.current) {
                // Emit event to server that this user is leaving
                socket.emit("leave-game-quick", {
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

        socket.off("typing-progress-update-quick");
        socket.on("typing-progress-update-quick", handler);

        return () => {
            socket.off("typing-progress-update-quick", handler);
        };
    }, [gameData?._id]);






    useEffect(() => {
        if (!gameData) return;

        socket.emit("quick-join", {
            competitionId: gameData._id,
            userId: currentUser?._id,
        });
    }, [gameData, currentUser]);


    //user join 
    useEffect(() => {
        const handleUserJoin = (data: any) => {
            console.log("user join", data);

            setLivePlayers((prev) => {
                const exists = prev.some(
                    (player) => player._id === data.member._id
                );

                if (exists) return prev;

                return [...prev, data.member];
            });
        };

        socket.on("user-join", handleUserJoin);

        return () => {
            socket.off("user-join", handleUserJoin);
        };
    }, []);



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
    }, [wpm, accuracy, errors, typedText, currentUser, gameData]);


    //current user
    useEffect(() => {
        if (players) {
            setCurrentUser(players?.find((item: any) => item._id === user._id));
        }
    }, [players, user._id]);


    //time

    useEffect(() => {
        if (!gameData?.startedAt || !gameData?.duration) return;
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
    }, [gameData?.startedAt, gameData?.duration, gameData?.startTime, isFinished]);

    const startGameAPI = async (competitionId: string) => {
        try {
            const response = await startGame(competitionId, "ongoing");
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    };


    useEffect(() => {
        if (phase === "PLAY" && !hasSentStart) {
            setHasSentStart(true);
            startGameAPI(gameData._id)
        }
    }, [phase, hasSentStart, currentUser, gameData?._id]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

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

            // Cursor logic
            const isCurrentChar = index === typedText.length;
            const cursorClass = isCurrentChar && phase === "PLAY" && !isFinished
                ? "border-l-2 border-orange-500 animate-pulse -ml-[1px]"
                : "";

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

                const expectedChar = lesson[typedText.length];
                setTotalTyped((prev) => prev + 1);

                if (e.key !== expectedChar) {
                    setErrors((prev) => prev + 1);
                    setHasError(true);
                    setTypedText((prev) => prev + e.key);
                    return;
                }

                const nextText = typedText + e.key;
                setTypedText(nextText);

                if (nextText.length === lesson.length) {
                    setIsfinished(true);
                    socket.emit("player-finished-quick-play", {
                        gameId: gameData?._id,
                        userId: currentUser?._id,
                        name: currentUser?.name,
                        imageUrl: currentUser?.imageUrl,
                        timeTaken: elapsedTime,
                        wpm,
                        accuracy,
                        errors,
                        typedLength: typedText.length,
                        status: "FINISHED",
                    });
                }

            }


        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);

    }, [lesson, isFinished, typedText, phase, hasError, gameData?._id]);


    useEffect(() => {
        if (remainingTime === 0) {
            setIsfinished(true);
            socket.emit("time-up-quick", {
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
            socket.off("time-up-quick");
        };
    }, [remainingTime]);

    useEffect(() => {

        socket.on("game-finished-quick", (data: GamePlayerResult[]) => {
            setFinalResult(data);
        });
        return () => {
            socket.off("game-finished-quick");
        };

    }, [gameData?._id]);


    //leave handles
    
      //force exit
      useEffect(() => {
        socket.on("force-exit", () => {
          navigate("/");
        });
    
        return () => {
          socket.off("force-exit");
        };
      }, []);


    return (
        <div className="min-h-screen bg-[#FFF8EA] font-sans text-gray-800 flex flex-col">
            <Navbar />

            <div className="flex-1 w-full max-w-[1440px] mx-auto pt-24 px-4 md:px-6 flex flex-col gap-6 pb-12">

                {finalResult.length > 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-in fade-in zoom-in duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center justify-center gap-3">
                                <Trophy className="w-10 h-10 text-amber-500 fill-amber-500" />
                                Race Results
                                <Trophy className="w-10 h-10 text-amber-500 fill-amber-500" />
                            </h1>
                            <p className="text-gray-500 font-medium">Top performers this round</p>
                        </div>

                        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border-4 border-orange-100 overflow-hidden">
                            {/* Header Row */}
                            <div className="grid grid-cols-[80px_1fr_100px_100px_100px] gap-4 p-4 bg-orange-50/50 border-b border-orange-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <div className="text-center">Rank</div>
                                <div>Player</div>
                                <div className="text-right">WPM</div>
                                <div className="text-right">Accuracy</div>
                                <div className="text-right">Time</div>
                            </div>

                            {/* Players List */}
                            <div className="divide-y divide-gray-50">
                                {finalResult
                                    .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                                    .map((result, index) => (
                                        <div key={result.userId} className={`grid grid-cols-[80px_1fr_100px_100px_100px] gap-4 p-4 items-center hover:bg-orange-50/30 transition-colors
                            ${result.userId === user?._id ? "bg-amber-50/60" : ""}
                        `}>
                                            <div className="flex justify-center">
                                                {result.rank === 1 ? (
                                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black shadow-sm ring-2 ring-amber-200">1</div>
                                                ) : result.rank === 2 ? (
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-black shadow-sm ring-2 ring-gray-200">2</div>
                                                ) : result.rank === 3 ? (
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black shadow-sm ring-2 ring-orange-200">3</div>
                                                ) : (
                                                    <span className="text-gray-400 font-bold">#{result.rank || index + 1}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <img src={result.imageUrl} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={result.name} />
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">{result.name} {result.userId === user?._id && "(You)"}</div>
                                                </div>
                                            </div>

                                            <div className="text-right font-black text-gray-800 text-lg">{result.wpm}</div>
                                            <div className="text-right font-bold text-emerald-600">{result.accuracy}%</div>
                                            <div className="text-right font-mono text-gray-500 text-xs">{formatTime(result.timeTaken)}</div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Back Home
                            </button>
                            <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Play Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Active Players Header */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-700">Active Players</h2>
                            <div className="px-3 py-1 bg-emerald-100/50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                                5 Online
                            </div>
                        </div>

                        {/* Players Cards Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {livePlayers.map((player) => (
                                <div
                                    key={player._id}
                                    className={`bg-white rounded-2xl p-4 shadow-sm border ${player.rank === 1 ? 'border-amber-200 shadow-amber-50 ring-1 ring-amber-100' :
                                        player.rank === 2 ? 'border-gray-200 shadow-gray-50 ring-1 ring-gray-100' :
                                            player.rank === 3 ? 'border-orange-200 shadow-orange-50 ring-1 ring-orange-100' :
                                                'border-gray-100'
                                        } flex flex-col gap-4 relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1`}
                                >
                                    {/* Rank Badge */}
                                    {player.rank && (
                                        <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm z-10
                                    ${player.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                                                player.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                                    player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            {player.rank}
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={player.imageUrl}
                                                alt={player.name}
                                                className="w-12 h-12 rounded-full bg-gray-50 border-2 border-white shadow-sm object-cover"
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-emerald-500"></div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-gray-800 line-clamp-1">{player.name}</div>
                                            <div className="text-[10px] items-center gap-1.5 flex font-medium text-emerald-600">
                                                Online
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Stats (WPM & Accuracy) */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-100">
                                            <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                                                <Zap className="w-3 h-3 text-amber-500" />
                                                <span className="text-[10px] font-bold uppercase">WPM</span>
                                            </div>
                                            <div className="text-xl font-black text-gray-800">{player.wpm || 0}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-100">
                                            <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                                                <Target className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[10px] font-bold uppercase">ACC</span>
                                            </div>
                                            <div className="text-xl font-black text-gray-800">{player.accuracy || 0}%</div>
                                        </div>
                                    </div>

                                    {/* Secondary Stats (Time & Errors) */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-gray-100">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                                                <Clock className="w-3 h-3" /> Time
                                            </div>
                                            <div className="text-xs font-bold text-gray-700">{player.time || "0:00"}</div>
                                        </div>
                                        <div className="flex items-center justify-between px-2 border-l border-gray-100 pl-2">
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                                                <AlertCircle className="w-3 h-3 text-red-400" /> Errors
                                            </div>
                                            <div className="text-xs font-bold text-gray-700">{player.errors || 0}</div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {/* Main 3-Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-6 items-start">

                            {/* Left: Looking for Players */}
                            <div className="bg-[#FFF8EA] border-2 border-dashed border-orange-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 mb-2">
                                    <Users className="w-7 h-7" />
                                </div>

                                <h3 className="font-bold text-gray-800 text-sm">
                                    {phase === "COUNTDOWN"
                                        ? `Game starts in ${countdown}s`
                                        : `Time left: ${formatTime(remainingTime)}`}
                                </h3>
                                <p className="text-[11px] text-gray-500 font-medium">
                                    {phase === "COUNTDOWN"
                                        ? "Waiting for players"
                                        : "Race in progress"}
                                </p>



                                <div className="mt-8 space-y-2 text-[10px] font-mono font-medium text-gray-400">
                                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-orange-100">
                                        <kbd className="bg-gray-100 px-1 rounded text-gray-600">Ctrl</kbd> + <kbd className="bg-gray-100 px-1 rounded text-gray-600">Esc</kbd> to exit
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-orange-100 justify-center">
                                        <kbd className="bg-gray-100 px-1 rounded text-gray-600">Tab</kbd> to focus input
                                    </div>
                                </div>
                            </div>

                            {/* Center: Snippet */}
                            <div className="flex flex-col gap-4">
                                <div className="bg-[#FEFCE8] relative rounded-3xl p-8 border border-orange-100 shadow-sm flex flex-col min-h-[300px]">

                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-gray-800">Snippet</h3>
                                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                                            Live
                                        </span>
                                    </div>

                                    <div
                                        ref={snippetContainerRef}
                                        className="font-mono text-gray-600 leading-relaxed text-sm md:text-base flex-1">
                                        <p>
                                            {renderTextWithHighlight()}
                                        </p>
                                    </div>

                                    {/* <div className="mt-8 pt-4 border-t border-orange-100/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-700 text-sm">Game of Thrones</span>
                                    <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        Live
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                    <Clock className="w-3 h-3" /> Added 5 years ago
                                </div>
                            </div> */}
                                </div>

                                {/* Typing Input Area */}
                                <div className="bg-[#FEFCE8] rounded-2xl p-6 border border-orange-50 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Type here when the game begins...</h4>
                                    <div className="font-mono text-gray-400 text-sm">
                                        Start typing when the race begins...
                                    </div>
                                </div>
                            </div>

                            {/* Right: Chat */}
                            <div className="bg-[#FEFCE8] rounded-3xl p-6 border border-orange-100 shadow-sm flex flex-col h-[400px]">
                                <div className="mb-4 pb-4 border-b border-orange-100/50">
                                    <h3 className="font-bold text-gray-800">Chat</h3>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-4 pr-2">
                                    <div className="text-xs">
                                        <span className="font-bold text-gray-500 mr-2">System:</span>
                                        <span className="text-gray-700">Welcome to TypeGrid!</span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-bold text-gray-400 mr-2">Mitu:</span>
                                        <span className="text-gray-700">Good luck everyone!</span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-bold text-gray-400 mr-2">Admi:</span>
                                        <span className="text-gray-700">gl hf</span>
                                    </div>
                                </div>

                                <div className="relative mt-auto">
                                    <input
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Message..."
                                        className="w-full bg-[#FFF8EA] border border-orange-100 rounded-lg pl-3 pr-10 py-2.5 text-xs focus:ring-1 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400"
                                    />
                                    <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-1.5 rounded-md hover:bg-black transition-colors">
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </>
                )}

            </div>

        </div>
    );
};

export default QuickPlay;