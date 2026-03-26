import React, { useEffect, useState, useRef } from "react";
import { TodayChallenge } from "../../../api/user/dailyChallenge";
import Navbar from "../../../components/user/Navbar";
import { useTypingStats } from "../../../hooks/useTypingStats";
import { challengeFinished } from "../../../api/user/dailyChallenge";
import { ChallengeStatistics } from "../../../api/user/dailyChallenge";
import {
    ChevronLeft,
    ChevronRight,
    Trophy,
    Activity,
    Lock
} from "lucide-react";

interface IDailyChallenge {
    _id: string;
    challengeId: {
        _id: string;
        title: string;
        description: string;
        duration: number;
        lesson: string;
        difficulty: string;
        startedAt: string;
    };
    date: string;
    goal: {
        _id: string;
        title: string;
        wpm: number;
        accuracy: number;
        description: string;
    };
    reward: {
        _id: string;
        xp: number;
        description: string;
    };
}

interface IChallengeStats {
  calendarData: Record<string, "completed" | "missed">;
  streakTracker: {
    currentStreak: number;
    nextMilestone: number;
  };
  weeklyGoal: {
    completedSessions: number;
    targetSessions: number;
  };
  statistics: {
    longestStreak: number;
    totalCompleted: number;
    monthCompleted: number;
    monthTarget: number;
  };
}

const DailyChallengeArea: React.FC = () => {
    const [challenge, setChallenge] = useState<IDailyChallenge | null>(null);
    const [stats, setStats] = useState<IChallengeStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [phase, setPhase] = useState<"IDLE" | "COUNTDOWN" | "PLAY" | "FINISHED">("IDLE");
    const [typedText, setTypedText] = useState("");
    const [errors, setErrors] = useState(0);
    const [totalTyped, setTotalTyped] = useState(0);
    const [lesson, setLesson] = useState<string>("");
    const [countDown, setCountDown] = useState(10);
    const [hasError, setHasError] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const activeCharRef = useRef<HTMLSpanElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Performance Metrics Logic


    // Mock data for the calendar
    const marchDays = Array.from({ length: 31 }, (_, i) => i + 1);

    useEffect(() => {
        const fetchTodayChallenge = async () => {
            try {
                const response = await TodayChallenge();
                const data = response.data.data;
                setChallenge(data);
                setTimeRemaining(data.challengeId.duration || 120);
                setLesson(data.challengeId.lesson || "The quick brown fox jumps over the lazy dog.");
            } catch (error) {
                console.error("Failed to fetch challenge:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodayChallenge();

        // Prevent zooming and shortcuts
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) e.preventDefault();
        };
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "0" || e.key === "r")) {
                e.preventDefault();
            }
        };
        document.addEventListener("wheel", handleWheel, { passive: false });
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("wheel", handleWheel);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    useEffect(() => {
        if (phase === "COUNTDOWN") {
            timerRef.current = setInterval(() => {
                setCountDown((prev) => {
                    if (prev <= 1) {
                        setPhase("PLAY");
                        setElapsedTime(0);
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (phase === "PLAY") {
            timerRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setPhase("FINISHED");
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [phase]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (phase === "IDLE") {
                if (e.key === " ") {
                    e.preventDefault();
                    setPhase("COUNTDOWN");
                }
                return;
            }

            if (phase !== "PLAY") return;

            if (e.key === "Backspace") {
                setTypedText((prev) => {
                    const lastChar = prev[prev.length - 1];
                    const expectedChar = lesson[prev.length - 1];
                    if (lastChar !== expectedChar) {
                        setHasError(false);
                    }
                    return prev.slice(0, -1);
                });
                return;
            }

            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                setTotalTyped((prev) => prev + 1);

                if (hasError) return;

                const expectedChar = lesson[typedText.length];
                if (e.key !== expectedChar) {
                    setErrors((prev) => prev + 1);
                    setHasError(true);
                }
                
                setTypedText((prev) => prev + e.key);

                if (typedText.length + 1 === lesson.length) {
                    setPhase("FINISHED");
                    setIsFinished(true);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [phase, lesson, typedText, hasError]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} : ${secs.toString().padStart(2, "0")}`;
    };

    const renderTextWithHighlight = () => {
        if (!lesson) return null;
        return lesson.split("").map((char: string, index: number) => {
            let className = "text-gray-300";

            if (index < typedText.length) {
                if (typedText[index] === lesson[index]) {
                    className = "text-emerald-500 font-bold drop-shadow-sm";
                } else {
                    className = "text-red-500 bg-red-100/50 rounded-sm decoration-red-500 underline decoration-4 underline-offset-4";
                }
            }

            const isCurrentChar = index === typedText.length;
            const cursorClass = isCurrentChar && phase === "PLAY"
                ? "border-l-[3px] border-orange-500 animate-pulse -ml-[1.5px] pl-[1.5px]"
                : "";

            return (
                <span
                    key={index}
                    ref={isCurrentChar ? activeCharRef : null}
                    className={`${cursorClass} ${className} inline-flex items-center justify-center h-[32px] min-w-[12px] transition-colors duration-75 font-mono text-lg md:text-xl`}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            );
        });
    };


      const { wpm, accuracy} = useTypingStats(
      totalTyped,
      errors,
      elapsedTime,
      phase as any,
      isFinished
    );


    useEffect(()=>{
    if (!isFinished) return;
    const challengeCompleted=async()=>{
    const response=await challengeFinished({
        dailyChallengeId:challenge?._id,
        wpm:wpm,
        accuracy:accuracy,
        errors:errors,
        timeTaken:elapsedTime,
    });
    };
    challengeCompleted();
    },[isFinished]);
      useEffect(()=>{
        const fetchChallengeStatistics = async()=>{
          try{
            const response = await ChallengeStatistics();
            setStats(response.data.data);
          }catch(error){
            console.log(error);
          }
        };
        fetchChallengeStatistics();
      },[]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8EA] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400" />
            </div>
        );
    }

    return (
        <div 
            className="h-screen bg-[#FFF8EA] text-gray-900 font-sans flex flex-col select-none overflow-hidden outline-none relative" 
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
        >
            <Navbar />

            {/* Main Content Wrapper */}
            <div className="flex-1 overflow-hidden px-8 pt-16 pb-4">
                <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-6">

                    {/* Main Area */}
                    <div className="flex-[2.5] flex flex-col gap-4 overflow-hidden">
                        <header className="flex-shrink-0 flex justify-between items-end bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-orange-100/20 shadow-sm">
                            <div className="text-left">
                                <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">Daily Challenge</h1>
                                <p className="text-gray-400 font-bold text-[9px] mt-1.5 uppercase tracking-widest">Master your speed</p>
                            </div>
                            
                            {/* LIVE PERFORMANCE METRICS DIV */}
                            <div className={`flex gap-8 transition-all duration-500 ${phase === "IDLE" ? "opacity-20 translate-y-1" : "opacity-100 translate-y-0"}`}>
                                <div className="flex flex-col items-center">
                                    <span className="text-xl font-black text-orange-500 leading-none">{wpm}</span>
                                    <span className="text-[8px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">Words/M</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xl font-black text-emerald-500 leading-none">{accuracy}%</span>
                                    <span className="text-[8px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">Accuracy</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xl font-black text-red-500 leading-none">{errors}</span>
                                    <span className="text-[8px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">Errors</span>
                                </div>
                            </div>
                        </header>

                        {/* Challenge Info Card */}
                        <div className="bg-white/40 backdrop-blur-md rounded-[1.5rem] border border-orange-100/50 p-4 shadow-sm relative overflow-hidden flex-shrink-0">
                            <div className="absolute top-0 right-0 p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${challenge?.challengeId.difficulty === "hard" ? "bg-red-100 text-red-600" :
                                    challenge?.challengeId.difficulty === "medium" ? "bg-orange-100 text-orange-600" :
                                        "bg-emerald-100 text-emerald-600"
                                    }`}>
                                    {challenge?.challengeId.difficulty || "Medium"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Activity className="w-3.5 h-3.5 text-orange-500" />
                                </div>
                                <h2 className="text-lg font-black text-gray-800 tracking-tight">
                                    {challenge?.challengeId.title || "Speed Challenge"}
                                </h2>
                            </div>

                            <div className="bg-white/60 shadow-sm border border-orange-50/50 rounded-lg p-3 mb-3 text-center max-w-lg mx-auto backdrop-blur-sm">
                                <p className="text-gray-600 text-[11px] font-medium leading-relaxed">
                                    {challenge?.challengeId.description || "Test your speed and accuracy in today's specially curated typing lesson."}
                                </p>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                <div className="flex flex-col items-center gap-0 border-r border-gray-100">
                                    <span className="text-base font-black text-gray-800 leading-none">{challenge?.goal.wpm}</span>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Goal WPM</span>
                                </div>
                                <div className="flex flex-col items-center gap-0 border-r border-gray-100">
                                    <span className="text-base font-black text-gray-800 leading-none">{challenge?.goal.accuracy || "95"}%</span>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Goal Acc.</span>
                                </div>
                                <div className="flex flex-col items-center gap-0 border-r border-gray-100">
                                    <span className="text-base font-black text-gray-800 leading-none">{challenge?.reward.xp}</span>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">XP Reward</span>
                                </div>
                                <div className="flex flex-col items-center gap-0">
                                    <span className="text-base font-black text-gray-800 leading-none">{formatTime(challenge?.challengeId?.duration || 0)}</span>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Limit</span>
                                </div>
                            </div>
                        </div>

                        {/* Typing Area */}
                        <div className="bg-white/40 backdrop-blur-md rounded-[1.5rem] border border-orange-100/50 p-5 shadow-sm relative grow flex flex-col overflow-hidden">
                            <h3 className="text-[9px] font-black text-gray-800 uppercase tracking-widest mb-2 opacity-60">Challenge Input</h3>
                            <div className="bg-orange-50/20 border border-orange-100/50 rounded-xl p-6 relative flex-1 overflow-hidden flex flex-col">
                                {phase === "IDLE" && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 rounded-xl">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                                            <Lock className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <h4 className="text-base font-black text-gray-800 mb-0.5 uppercase tracking-tighter">Ready?</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Press <span className="text-orange-500">Space</span></p>
                                    </div>
                                )}

                                {phase === "COUNTDOWN" && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#ECA468]/5 rounded-xl backdrop-blur-[2px]">
                                        <div className="text-7xl font-black text-[#ECA468] relative">
                                            {countDown}
                                        </div>
                                        <p className="text-[9px] font-black text-[#ECA468] uppercase tracking-[0.3em] mt-2">Get Ready!</p>
                                    </div>
                                )}

                                {phase === "FINISHED" && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md bg-white/60 rounded-xl">
                                        <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
                                        <h4 className="text-lg font-black text-gray-800 mb-4">Complete!</h4>
                                        <button 
                                            onClick={() => window.location.reload()}
                                            className="px-5 py-2 bg-gray-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-lg font-mono leading-relaxed tracking-wider select-none relative z-10 break-words whitespace-pre-wrap">
                                  {renderTextWithHighlight()}
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="absolute inset-0 opacity-0 cursor-default"
                                    autoFocus
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="flex-1 flex flex-col gap-5 overflow-hidden">
                        {/* Timer Card */}
                        <div className="bg-white/80 rounded-[1.5rem] p-5 border border-emerald-100/50 flex flex-col items-center shadow-sm backdrop-blur-sm flex-shrink-0">
                            <div className={`text-4xl font-mono font-black mb-2 drop-shadow-sm transition-colors duration-500 ${phase === "IDLE" ? "text-gray-300" : "text-emerald-500"}`}>
                                {phase === "COUNTDOWN" ? formatTime(countDown) : formatTime(timeRemaining)}
                            </div>
                            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-60 uppercase">Seconds Left</div>
                        </div>

                        {/* Calendar Card */}
                        <div className="bg-white/40 backdrop-blur-sm rounded-[1.5rem] border border-orange-100/50 p-4 shadow-sm flex-shrink-0">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <button className="p-0.5 hover:bg-white rounded transition-colors text-gray-400">
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[9px] font-black text-gray-800 uppercase tracking-widest">March 2022</span>
                                <button className="p-0.5 hover:bg-white rounded transition-colors text-gray-400">
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
                                {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                                    <span key={d} className="text-[7px] font-black uppercase text-gray-400 tracking-[0.2em]">{d}</span>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 2 }).map((_, i) => <div key={`empty-${i}`} />)}
                                {marchDays.slice(0, 24).map(d => {
                                    const dateStr = `2026-03-${d.toString().padStart(2, "0")}`;
                                    const status = stats?.calendarData[dateStr];
                                    const isSuccess = status === "completed";
                                    const isFail = status === "missed";
                                    return (
                                        <div key={d} className={`aspect-square flex items-center justify-center text-[7px] font-black rounded-md transition-all
                                          ${isSuccess ? "bg-emerald-500 text-white shadow-sm" :
                                                isFail ? "bg-red-500 text-white shadow-sm" :
                                                    "text-gray-600 hover:bg-white/60"}`}
                                        >
                                            {d}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Statistics Card */}
                        <div className="bg-white/40 backdrop-blur-sm rounded-[1.5rem] p-5 border border-orange-100/50 shadow-sm grow overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-orange-200/20 flex-shrink-0">
                                <Trophy className="w-3 h-3 text-orange-400" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#9C7F60]">Statistics</span>
                            </div>

                            <div className="space-y-3 overflow-y-auto pr-1">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-gray-400">Longest Streak</span>
                                    <span className="font-black text-gray-800">{stats?.statistics.longestStreak || 0} days</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-gray-400">Completed</span>
                                    <span className="font-black text-gray-800">{stats?.statistics.totalCompleted || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-gray-400">This Month</span>
                                    <span className="font-black text-gray-800">{stats?.statistics.monthCompleted || 0} / {stats?.statistics.monthTarget || 31}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyChallengeArea;