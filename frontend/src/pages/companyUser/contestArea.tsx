import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../../socket";
import { fetchContestAreaDetails } from "../../api/companyAdmin/companyContextAPI";
import { useLocation } from "react-router-dom";
import {

    Crown,
    Trophy,
    Users
} from "lucide-react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
type PlayerStatus = "PLAYING" | "DISCONNECTED" | "FINISHED" | "LEFT";
interface LivePlayer {
    userId: string;
    name: string;
    imageUrl: string;
    progress: number;
    wpm: number;
    accuracy: number;
    errors: number;
    timeTaken: number;
    status: PlayerStatus;
}
interface ContestRecord {
    _id: string;
    title: string;
    startTime: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    duration: number;
    status: string;
    contestText: string;
}


const ContestArea: React.FC = () => {
    const { contestId } = useParams<{ contestId: string }>();
    const [contestData, setContestData] = useState<ContestRecord | null>();

    const user = useSelector((state: any) => state.companyAuth.user);

    const [typedText, setTypedText] = useState("");
    const [isFinished, setIsFinished] = useState(false);
    const [phase, setPhase] = useState<"LOADING" | "COUNTDOWN" | "PLAY">("LOADING");
    const [countdown, setCountdown] = useState(10);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    const [hasError, setHasError] = useState(false);
    const [errors, setErrors] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [totalTyped, setTotalTyped] = useState(0);

    const [livePlayers, setLivePlayers] = useState<LivePlayer[]>([]);
    const activeCharRef = useRef<HTMLSpanElement>(null);
    const snippetContainerRef = useRef<HTMLDivElement>(null);
    const gameIdRef = useRef(contestData?._id);
    const userIdRef = useRef(user?._id);
    // Prevent default interactions like zoom, copy, paste, and scroll
    const [loading, setLoading] = useState(true);
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
                setContestData(response.data.data);

            } catch (error) {
                console.error("Error fetching contest details:", error);
                navigate("/company/user/contests", { replace: true });
            } finally {
            setLoading(false);  // stop loadin
        }
        };
        fetchContest();
    }, [contestId]); 
    useEffect(() => {
        if (!contestId || !user?._id) return;

        const handleLobbyUpdate = (data: any) => {
            setLivePlayers(data);
        };

        socket.on("contest-game-players", handleLobbyUpdate);

        // Join room
        socket.emit("join-companyContest-game", {
            contestId,
            user
        });

        return () => {
            socket.off("contest-game-players", handleLobbyUpdate);


        };
    }, [contestId, user?._id]);

    useEffect(() => {
        return () => {
            if (gameIdRef.current && userIdRef.current) {
                // Emit event to server that this user is leaving
                socket.emit("leave-companyContest-game", {
                    contestId: gameIdRef.current,
                    userId: userIdRef.current
                });
            }
        };
    }, []);
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





    useEffect(() => {
        if (!contestId || !user?._id) return;
        socket.on("contest-users-update", (data: any) => {
            setLivePlayers(data);

        });

        return () => {
            socket.off("contest-users-update");
        };
    }, [contestId, user?._id]);


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

    const renderTextWithHighlight = () => {
        const textContent = contestData?.contestText || "";

        return textContent.split("").map((char: string, index: number) => {
            let className = "text-slate-500 font-semibold"; // Default upcoming text

            if (index < typedText.length) {
                if (typedText[index] === char) {
                    className = "text-[#8CA78A] font-medium"; // Soft green for correct text
                } else {
                    className = "text-rose-500 bg-rose-100 rounded-sm font-medium"; // Red outline for incorrect
                }
            }

            const isCurrentChar = index === typedText.length;
            const cursorClass = isCurrentChar && phase === "PLAY" && !isFinished
                ? "border-l-[3px] border-[#ECA468] animate-pulse -ml-[3px] z-10 relative" // Orange cursor
                : "";

            return (
                <span
                    key={index}
                    ref={isCurrentChar ? activeCharRef : null}
                    className={`${cursorClass} ${className} transition-all duration-75 text-xl md:text-2xl`}
                >
                    {char}
                </span>
            );
        });
    };

    // if (phase === "LOADING") {
    //     return (
    //         <div className="h-screen flex items-center justify-center bg-[#FDF9F2]">
    //             <div className="w-12 h-12 border-4 border-slate-200 border-t-[#ECA468] rounded-full animate-spin"></div>
    //         </div>
    //     );
    // }
    const progressPercentage = Math.round((typedText.length / (contestData?.contestText?.length || 0)) * 100);
if (loading) {
    return (
        <div className="h-screen flex items-center justify-center text-xl font-semibold">
            Loading Contest...
        </div>
    );
}
if(!contestData) return null;
    return (
        <div className="fixed inset-0 w-screen h-screen bg-[#FDF9F2] font-sans selection:bg-[#ECA468]/30 selection:text-[#ECA468] flex flex-col text-slate-800 overflow-hidden z-[100]">
            {/* Dynamic Background Glows for Light Theme */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ECA468]/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8CA78A]/10 blur-[100px] pointer-events-none"></div>

            <CompanyUserNavbar />

            <main className="flex-1 flex flex-col pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 h-full relative">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 min-h-0 flex-1 h-full">

                    {/* Left Column - Stats & Rankings */}
                    <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0 overflow-y-auto custom-scrollbar-hidden pb-8">
                        {/* Stats Panel */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden shrink-0 group">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#ECA468] to-[#8CA78A]"></div>
                            <h3 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-[#ECA468]" />
                                Performance
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {/* WPM */}
                                <div className="bg-slate-50 rounded-xl p-3 flex flex-col relative overflow-hidden group-hover:bg-[#FFF4EC] transition-colors border border-slate-100 group-hover:border-[#FADDB8]">
                                    <span className="text-[10px] font-bold text-[#D0864B] uppercase tracking-widest mb-1">Speed (WPM)</span>
                                    <div className="flex items-baseline gap-1 relative z-10">
                                        <span className="text-2xl font-black text-slate-800">{wpm}</span>
                                    </div>
                                </div>
                                {/* Accuracy */}
                                <div className="bg-slate-50 rounded-xl p-3 flex flex-col relative overflow-hidden group-hover:bg-[#F2F7F2] transition-colors border border-slate-100 group-hover:border-[#C4E0C4]">
                                    <span className="text-[10px] font-bold text-[#6D8A6B] uppercase tracking-widest mb-1">Accuracy</span>
                                    <div className="flex items-baseline gap-1 relative z-10">
                                        <span className="text-2xl font-black text-slate-800">{accuracy ?? 100}</span>
                                        <span className="text-[10px] font-bold text-slate-400">%</span>
                                    </div>
                                </div>
                                {/* Errors */}
                                <div className="bg-slate-50 rounded-xl p-3 flex flex-col relative overflow-hidden group-hover:bg-rose-50 transition-colors border border-slate-100 group-hover:border-rose-200">
                                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Errors</span>
                                    <div className="flex items-baseline gap-1 relative z-10">
                                        <span className="text-2xl font-black text-slate-800">{errors}</span>
                                    </div>
                                </div>
                                {/* Time Left */}
                                <div className="bg-slate-50 rounded-xl p-3 flex flex-col relative overflow-hidden group-hover:bg-indigo-50 transition-colors border border-slate-100 group-hover:border-indigo-200">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Remaining Time</span>
                                    <div className="flex items-baseline gap-1 relative z-10">
                                        <span className="text-xl font-black text-slate-800 tracking-wider">{formatTime(remainingTime)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Leaderboard */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1 min-h-[300px]">
                            <div className="flex justify-between items-center mb-4 shrink-0">
                                <h3 className="text-sm font-bold text-slate-500 tracking-widest uppercase flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#8CA78A]" />
                                    Live Rank
                                </h3>
                                <span className="text-[10px] font-bold bg-[#ECA468]/10 text-[#D0864B] px-2 py-1 rounded-md border border-[#FADDB8]">
                                    {livePlayers.length} Racing
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar min-h-0">
                                {livePlayers.length === 0 ? (
                                    <div className="text-center text-slate-400 text-xs font-semibold py-6">Waiting for competitors...</div>
                                ) : (
                                    livePlayers.map((player, idx) => {
                                        const isMe = player.userId === user?._id;
                                        const isDisconnected = player.status === "DISCONNECTED";
                                        const isLeft = player.status === "LEFT";
                                        return (
                                            <div key={player.userId} className={`flex items-center gap-3 p-3 rounded-xl transition-all shadow-sm ${isMe ? "bg-[#FFF4EC] border border-[#FADDB8] ring-1 ring-[#FADDB8]" : "bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md"} ${isDisconnected || isLeft ? "opacity-40 grayscale" : ""}`}>

                                                {/* Left: Name above Avatar */}
                                                <div className="relative shrink-0 flex flex-col justify-center items-center px-1">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 truncate max-w-[60px] text-center" title={player.name}>
                                                        {player.name}
                                                    </p>
                                                    {isDisconnected && (
                                                        <div className="text-[8px] text-red-400 font-bold mb-1">
                                                            Disconnected
                                                        </div>
                                                    )}
                                                    {isLeft && (
                                                        <div className="text-[8px] text-red-500 font-bold mb-1">
                                                            Left
                                                        </div>
                                                    )}
                                                    <div className="relative">
                                                        <img
                                                            src={player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                                                            className={`w-10 h-10 rounded-full border-2 object-cover ${isMe ? "border-[#ECA468] shadow-[0_0_10px_rgba(236,164,104,0.3)] ring-2 ring-[#FADDB8]" : "border-white shadow-sm"}`}
                                                            alt=""
                                                        />
                                                        <div className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm ${idx === 0 ? "bg-amber-100 text-amber-600" : idx === 1 ? "bg-slate-200 text-slate-600" : idx === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}>
                                                            {idx + 1}
                                                        </div>
                                                        {isMe && (
                                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] bg-gradient-to-r from-[#D0864B] to-[#ECA468] px-1.5 py-0.5 rounded text-white font-black uppercase tracking-wider shadow-sm z-10 whitespace-nowrap">
                                                                You
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Middle: Progress bar */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-center pl-2">
                                                    <div className="flex justify-between items-baseline mb-1.5">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                                        <span className="text-xs font-black text-[#8CA78A] shrink-0 ml-2">
                                                            {Math.round((player.progress / (contestData?.contestText?.length || 0)) * 100)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-300 relative overflow-hidden ${isMe ? "bg-gradient-to-r from-[#ECA468] to-[#D0864B]" : "bg-slate-400"}`}
                                                            style={{ width: `${Math.max(2, Math.round((player.progress / (contestData?.contestText?.length || 0)) * 100))}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Right: Stats block */}
                                                <div className="text-right shrink-0 bg-white/80 px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm flex items-center gap-2 xl:gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`text-[11px] xl:text-xs font-black leading-tight ${isMe ? "text-[#D0864B]" : "text-slate-600"}`}>{player.wpm}</div>
                                                        <div className="text-[8px] xl:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">WPM</div>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <div className={`text-[11px] xl:text-xs font-black leading-tight ${isMe ? "text-[#6D8A6B]" : "text-slate-600"}`}>{player.accuracy}%</div>
                                                        <div className="text-[8px] xl:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">ACC</div>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <div className={`text-[11px] xl:text-xs font-black leading-tight ${isMe ? "text-rose-500" : "text-slate-600"}`}>{player.errors || 0}</div>
                                                        <div className="text-[8px] xl:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">ERR</div>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <div className={`text-[11px] xl:text-xs font-black leading-tight ${isMe ? "text-indigo-500" : "text-slate-600"}`}>{formatTime(player.timeTaken || 0)}</div>
                                                        <div className="text-[8px] xl:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">TIME</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Typing Interface */}
                    <div className="lg:col-span-3 flex flex-col h-full min-h-0 relative">

                        {/* Visual Racing Track at the top */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 shrink-0 z-20">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Your Progress</span>
                                <span className="text-sm font-black text-[#ECA468]">{progressPercentage}%</span>
                            </div>

                            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner flex items-center px-1">
                                {livePlayers.map((player) => {
                                    const isMe = player.userId === user?._id;
                                    const isDisconnected = player.status === "DISCONNECTED";
                                    const isLeft = player.status === "LEFT";
                                    const pos = Math.round((player.progress / (contestData?.contestText?.length || 0)) * 100);
                                    return (
                                        <div
                                            key={`track-${player.userId}`}
                                            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 z-10 ${isMe ? "z-20" : "opacity-60"} ${isDisconnected || isLeft ? "opacity-40 grayscale" : ""}`}
                                            style={{ left: `${Math.max(2, Math.min(pos, 98))}%` }}
                                        >
                                            <img
                                                src={player.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                                                className={`w-6 h-6 rounded-full border-2 ${isMe ? "border-[#ECA468] ring-2 ring-[#FADDB8]" : "border-white"} shadow-md`}
                                                alt={player.name}
                                            />
                                            {isMe && (
                                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#ECA468] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                    You
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {/* Progress fill */}
                                <div
                                    className="h-full bg-gradient-to-r from-[#ECA468]/20 to-[#ECA468]/40 absolute top-0 left-0 transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Main Typing Area */}
                        <div
                            className="flex-1 bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 shadow-[0_15px_40px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col relative overflow-hidden group/typing cursor-text focus-within:ring-2 focus-within:ring-[#ECA468]/30 transition-all duration-300 z-10"
                            onClick={() => document.body.focus()}
                        >
                            {/* Header Info */}
                            <div className="flex justify-between items-center mb-8 shrink-0 relative z-10 border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">{contestData?.title || "Contest"}</h2>
                                    <p className="text-[#8CA78A] text-xs font-semibold uppercase tracking-widest mt-1">{contestData?.difficulty} Mode</p>
                                </div>
                            </div>

                            {/* Typing Text Container */}
                            <div
                                ref={snippetContainerRef}
                                className="flex-1 font-mono text-lg md:text-xl lg:text-2xl leading-[2] tracking-[0.03em] font-medium outline-none overflow-hidden relative z-10 text-slate-500 break-words"
                                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                            >
                                {renderTextWithHighlight()}
                            </div>

                            {/* Countdown Overlay */}
                            {phase === "COUNTDOWN" && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-30 flex flex-col items-center justify-center animate-in fade-in duration-300">
                                    <div className="relative flex items-center justify-center group">
                                        <div className="absolute w-48 h-48 bg-[#ECA468]/10 rounded-full blur-2xl animate-pulse"></div>
                                        <div className="absolute w-32 h-32 bg-[#8CA78A]/10 rounded-full blur-xl animate-pulse delay-75"></div>
                                        <span className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-500 drop-shadow-md animate-pulse relative z-10">
                                            {countdown}
                                        </span>
                                    </div>
                                    <div className="mt-8 flex flex-col items-center gap-2">
                                        <p className="text-[#D0864B] font-bold uppercase tracking-[0.5em] text-sm animate-pulse">Prepare to type</p>
                                        <p className="text-slate-400 text-xs font-semibold">Place your hands on the keyboard</p>
                                    </div>
                                </div>
                            )}

                            {/* Finishing Overlay */}
                            {isFinished && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
                                    <div className="relative w-full max-w-lg bg-white rounded-[2rem] p-10 border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.1)] overflow-hidden text-center">
                                        {/* Decorative elements */}
                                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#ECA468]/10 rounded-full blur-3xl"></div>
                                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#8CA78A]/10 rounded-full blur-3xl"></div>

                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#FADDB8] to-[#ECA468] mb-6 shadow-lg ring-4 ring-[#FFF4EC] relative z-10">
                                            <Crown className="w-12 h-12 text-white drop-shadow-md" />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight relative z-10">Race Finished!</h2>
                                        <p className="text-slate-500 font-medium mb-8 relative z-10">Awesome job! Here's how you performed.</p>

                                        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:bg-[#FFF4EC] hover:border-[#FADDB8] transition-colors shadow-sm">
                                                <div className="text-xs font-bold text-[#D0864B] uppercase tracking-widest mb-1">Final Speed</div>
                                                <div className="flex items-baseline justify-center gap-1.5 mt-2">
                                                    <span className="text-4xl font-black text-slate-800">{wpm}</span>
                                                    <span className="text-xs font-bold text-slate-400">WPM</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:bg-[#F2F7F2] hover:border-[#C4E0C4] transition-colors shadow-sm">
                                                <div className="text-xs font-bold text-[#6D8A6B] uppercase tracking-widest mb-1">Final Accuracy</div>
                                                <div className="flex items-baseline justify-center gap-1.5 mt-2">
                                                    <span className="text-4xl font-black text-slate-800">{accuracy ?? 100}</span>
                                                    <span className="text-xs font-bold text-slate-400">%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <button
                                            onClick={() => navigate("/company/user/contests")}
                                            className="relative z-10 w-full py-4 bg-gradient-to-r from-[#D0864B] to-[#ECA468] text-white font-bold text-lg rounded-xl hover:shadow-[0_10px_20px_rgba(236,164,104,0.3)] hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-[#ECA468] focus:ring-offset-2 focus:ring-offset-white"
                                        >
                                            Return to Lobby
                                        </button> */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
      `}</style>
        </div>
    );
};

export default ContestArea;
