import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignedLessonByAssignmentId } from "../../api/companyUser/lessons";
import {
    ArrowLeft,
    Clock,
    Zap,
    Target,
    AlertCircle,
    RotateCcw,
    Activity,
    CheckCircle2,
    Trophy
} from "lucide-react";
import { useParams } from "react-router-dom";
import { saveLessonResult } from "../../api/companyAdmin/lessons";
const AssignedLessonTypingArea: React.FC = () => {
    const navigate = useNavigate();

    type AssignmentStatus = "assigned" | "progress" | "completed" | "expired";

    interface Lesson {
        id: string;
        title: string;
        level: "beginner" | "intermediate" | "advanced";
        text: string;
        wpm: number;
        accuracy: number;
    }

    interface AssignedLesson {
        id: string;
        status: AssignmentStatus;
        deadlineAt: string; // ISO date string
        lesson: Lesson;
    }


    // State
    const [timeLeft, setTimeLeft] = useState(300);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errors, setErrors] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [assignedLesson, setAssignedLesson] = useState<AssignedLesson | null>(null);
    const [totalTyped, setTotalTyped] = useState(0);
    // const assignedData
    const inputRef = useRef<HTMLInputElement>(null);
    const { assignedLessonId } = useParams();
    const hasSavedRef = useRef(false);
    const [isTimeUp, setIsTimeUp] = useState(false);

  
    useEffect(() => {
        async function fectchAssignLesson() {
            const response = await getAssignedLessonByAssignmentId(assignedLessonId!);
            setAssignedLesson(response.data.data);
        }
        fectchAssignLesson();
    }, []);

    //wpm calculation
    useEffect(() => {
        if (!isActive || !startTime) return;

        const timeElapsedMin = (Date.now() - startTime) / 60000;
        const correctChars = Math.max(0, totalTyped - errors);

        const calculatedWpm =
            timeElapsedMin > 0
                ? Math.round((correctChars / 5) / timeElapsedMin)
                : 0;

        setWpm(calculatedWpm);
    }, [totalTyped, errors, isActive, startTime]);


    useEffect(() => {
        if (!isActive || !startTime || isFinished) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsTimeUp(true);
                    setIsActive(false);
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, startTime, isFinished]);


    // Finish Condition
    useEffect(() => {
        if (!assignedLesson) return;
        if (typedText.length === assignedLesson?.lesson.text.length || isTimeUp) {
            setIsFinished(true);
            setIsActive(false);
        }
    }, [typedText, assignedLesson?.lesson.text.length, isTimeUp]);

    // Start on Space key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isActive && !isFinished && e.code === "Space") {
                e.preventDefault();
                setIsActive(true);
                setStartTime(Date.now());
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isActive, isFinished]);


    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isFinished || !assignedLesson || !isActive || isTimeUp) return;

        const value = e.target.value;



        if (value.length > assignedLesson.lesson.text.length) return;

        if (value.length > typedText.length) {
            const index = value.length - 1;
            const isWrong = value[index] !== assignedLesson.lesson.text[index];

            const newTotal = totalTyped + 1;
            const newErrors = isWrong ? errors + 1 : errors;

            const correctChars = Math.max(0, newTotal - newErrors);
            const acc = Math.round((correctChars / newTotal) * 100);

            setTotalTyped(newTotal);
            setErrors(newErrors);
            setAccuracy(acc);
        }

        setTypedText(value);
    };

    const resetTest = () => {
        setIsActive(false);
        setIsFinished(false);
        setTypedText("");
        setTimeLeft(300);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setIsTimeUp(false);
        setTotalTyped(0);
        setStartTime(null);
        hasSavedRef.current = false;
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.blur();
        }
    };





    useEffect(() => {
        const keepFocus = (e: MouseEvent) => {
            if (!isActive || isFinished) return;
            const target = e.target as HTMLElement;

            if (target.closest("button") || target.closest("a")) {
                return;
            }
            e.preventDefault();
            inputRef.current?.focus();
        };
        document.addEventListener("mousedown", keepFocus);
        return () => document.removeEventListener("mousedown", keepFocus);
    }, [isActive, isFinished]);



    const getCharClass = (index: number) => {
        if (index >= typedText.length) return "text-gray-400";
        return typedText[index] === assignedLesson?.lesson.text[index]
            ? "text-emerald-600 bg-emerald-50/50"
            : "text-red-500 bg-red-100 underline decoration-red-400";
    };

    // Progress percentage
    const progress = Math.min(100, (typedText.length / assignedLesson?.lesson?.text.length!) * 100);


    //result save
    useEffect(() => {
        if (!isFinished) return;
        if (!assignedLesson) return;
        if (hasSavedRef.current) return;
        if (isTimeUp) {
            return;
        }
        hasSavedRef.current = true;
        async function saveResult() {
            let status: AssignmentStatus = "progress";

            if (
                wpm < assignedLesson?.lesson.wpm! ||
                accuracy < assignedLesson?.lesson.accuracy!
            ) {
                status = "progress";
            } else if (wpm >= assignedLesson?.lesson.wpm! && accuracy >= assignedLesson?.lesson.accuracy!) {
                status = "completed";
            }

            try {
                await saveLessonResult(
                    assignedLesson?.id!,
                    {
                        wpm,
                        accuracy,
                        errors,
                        totalTyped,
                        status,
                    }
                );

            } catch (error) {
                console.error("Failed to save lesson result", error);
            }
        }

        saveResult();
    }, [isFinished]);


    return (
        <div
            onClick={() => isActive && inputRef.current?.focus()}
            className="select-none min-h-screen bg-[#FFF8EA] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-200">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="relative">
                    <button
                        onClick={() => navigate("/company/user/lessons")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors px-4 py-2 rounded-lg hover:bg-black/5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{assignedLesson?.lesson.title}</h1>
                        <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full border border-orange-100">
                                <Activity className="w-3.5 h-3.5 text-orange-400" />
                                Level: <span className="font-semibold text-gray-700">{assignedLesson?.lesson.level}</span>
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full border border-orange-100">
                                <Target className="w-3.5 h-3.5 text-blue-400" />
                                Target: <span className="font-semibold text-gray-700">{assignedLesson?.lesson.wpm} WPM</span>
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full border border-orange-100">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Accuracy: <span className="font-semibold text-gray-700">{assignedLesson?.lesson.accuracy}%</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={<Clock className="w-5 h-5" />}
                        label="Time Left"
                        value={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        icon={<Zap className="w-5 h-5" />}
                        label="WPM"
                        value={wpm}
                        color="text-orange-500"
                        bgColor="bg-orange-50"
                    />
                    <StatCard
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        label="Accuracy"
                        value={`${accuracy}%`}
                        color="text-emerald-500"
                        bgColor="bg-emerald-50"
                    />
                    <StatCard
                        icon={<AlertCircle className="w-5 h-5" />}
                        label="Errors"
                        value={errors}
                        color="text-red-500"
                        bgColor="bg-red-50"
                    />
                </div>

                {/* Typing Area */}
                <div
                    className="relative bg-[#FFF3DB] rounded-3xl p-1 shadow-xl shadow-orange-900/5 group"
                    onClick={() => isActive && inputRef.current?.focus()}
                >
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-8 right-8 h-1 bg-orange-100/50 rounded-b-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="bg-[#FEFCE8] rounded-[1.3rem] p-8 md:p-12 min-h-[300px] border border-orange-50/50 relative overflow-hidden">

                        {/* Header inside card */}
                        <div className="flex justify-between items-center mb-8 border-b border-orange-100/50 pb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-8 bg-orange-400 rounded-full block"></span>
                                Typing Test
                            </h3>
                            <button
                                onClick={resetTest} className="flex items-center gap-2 px-4 py-2 bg-[#B09886] text-white rounded-xl hover:bg-[#967d6c] transition-all hover:scale-105 active:scale-95 text-sm font-semibold shadow-sm"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>

                        {/* Text Content */}
                        <div
                            className="relative font-mono text-xl md:text-2xl leading-relaxed tracking-wide text-gray-400 select-none outline-none"
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            {assignedLesson?.lesson.text.split("").map((char, index) => {
                                const isCurrent = index === typedText.length;
                                return (
                                    <span
                                        key={index}
                                        className={`
                                    relative transition-colors duration-100 
                                    ${getCharClass(index)} 
                                    ${isCurrent ? "bg-orange-200/50 text-gray-800" : ""}
                                `}
                                    >
                                        {/* Cursor Caret */}
                                        {isCurrent && !isFinished && isActive && (
                                            <span className="absolute -left-[1px] -top-1 h-8 w-0.5 bg-orange-500 animate-pulse z-10"></span>
                                        )}
                                        {char}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Overlay for "Start" */}
                        {!isActive && !isFinished && typedText.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] cursor-pointer transition-opacity duration-300 z-10">
                                <div className="text-center animate-bounce">
                                    <span className="text-orange-900/50 font-medium text-lg">Press Space key to start...</span>
                                </div>
                            </div>
                        )}

                        {/* Hidden Input */}
                        <div className="relative z-30 flex justify-between items-center mb-8 border-b border-orange-100/50 pb-4">
                            <input
                                ref={inputRef}
                                type="text"
                                className="absolute opacity-0 top-0 left-0 w-full h-full z-20 cursor-default"
                                value={typedText}
                                onChange={handleInput}
                            />

                        </div>


                        {/* Finished State Overlay */}
                        {isFinished && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-30 transition-all duration-500 animate-in fade-in">
                                {(() => {
                                    const isPassed = !isTimeUp && wpm >= (assignedLesson?.lesson.wpm || 0) && accuracy >= (assignedLesson?.lesson.accuracy || 0);

                                    return (
                                        <>
                                            <div className={`mb-6 p-4 rounded-full ${isPassed ? "bg-green-100" : "bg-red-100"}`}>
                                                {isPassed ? (
                                                    <Trophy className="w-12 h-12 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="w-12 h-12 text-red-600" />
                                                )}
                                            </div>

                                            <h2 className={`text-3xl font-bold mb-2 ${isPassed ? "text-gray-800" : "text-red-600"}`}>
                                                {isPassed ? "Lesson Passed!" : isTimeUp ? "Time's Up!" : "Lesson Failed"}
                                            </h2>

                                            <p className="text-gray-600 mb-8 text-center max-w-md">
                                                {isPassed
                                                    ? "Congratulations! You have completed the text."
                                                    : isTimeUp
                                                        ? "You ran out of time. Please try again."
                                                        : "You failed to meet the targets. Please try again."
                                                }
                                            </p>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={resetTest}
                                                    className={`px-6 py-2.5 rounded-xl border-2 font-bold transition-all ${isPassed
                                                        ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                        : "bg-red-500 text-white hover:bg-red-600 border-transparent shadow-lg shadow-red-200"
                                                        }`}
                                                >
                                                    {isPassed ? "Try Again" : "Try Again"}
                                                </button>

                                                {isPassed && (
                                                    <button
                                                        onClick={() => navigate("/company/user/lessons")}
                                                        className="px-6 py-2.5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all hover:-translate-y-0.5"
                                                    >
                                                        Continue
                                                    </button>
                                                )}

                                                {!isPassed && (
                                                    <button
                                                        onClick={() => navigate("/company/user/lessons")}
                                                        className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-400 font-bold hover:bg-gray-50 hover:text-gray-600 transition-all"
                                                    >
                                                        Exit
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-400 font-medium">{!isActive ? "Ready to type?" : "Keep going!"}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper Component for Stats
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string; bgColor: string }> = ({ icon, label, value, color, bgColor }) => (
    <div className="bg-[#FFF3DB] border border-orange-50/50 p-6 rounded-2xl hover:scale-105 transition-transform duration-300 shadow-sm cursor-default group">
        <div className="flex flex-col items-center gap-3">
            <div className={`w-10 h-10 ${bgColor} ${color} rounded-full flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500`}>
                {icon}
            </div>
            <div className="text-center">
                <div className={"text-2xl font-bold text-gray-800 group-hover:scale-110 transition-transform duration-300 origin-bottom"}>{value}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{label}</div>
            </div>
        </div>
    </div>
);

export default AssignedLessonTypingArea;