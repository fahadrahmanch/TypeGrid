import { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { getTypiingPracticeLessonById } from "../../../api/user/typingPracticeService";
import {
  Zap,
  Target,
  Clock,
  AlertCircle,
  RotateCcw,
  Trophy,
  ArrowLeft,
  Layout,
  BarChart3
} from "lucide-react";

const TypingPracticeArea = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const [Content, setContent] = useState<any>(null);
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsfinished] = useState(false);

  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    async function fetchLessonById() {
      if (lessonId) {
        try {
          const response = await getTypiingPracticeLessonById(lessonId);
          setContent(response.data.lesson);
        } catch (error) {
          console.error("Failed to load lesson", error);
        }
      }
    }
    fetchLessonById();
  }, [lessonId]);

  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setTime(elapsedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  useEffect(() => {
    if (!Content || !startTime) {
      return;
    }

    const orginalText = Content.text;
    let errorCount = 0;
    for (let i = 0; i < typedText.length; i++) {
      // Safe check for length
      if (i < orginalText.length && typedText[i] !== orginalText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    const elaspedTime = (Date.now() - startTime) / 1000;
    const minutes = elaspedTime / 60;
    const correctChars = typedText.length - errorCount;
    const calculatedWpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;

    setWpm(isFinite(calculatedWpm) && calculatedWpm > 0 ? calculatedWpm : 0);

    const calculatedAccuracy = typedText.length
      ? Math.floor((correctChars / typedText.length) * 100)
      : 100;
    setAccuracy(calculatedAccuracy);
  }, [typedText]);

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

  const renderTextWithHighlight = () => {
    if (!Content) return null;
    return Content.text.split("").map((char: string, index: number) => {
      let className = "text-gray-300"; // Default

      if (index < typedText.length) {
        if (typedText[index] === char) {
          className = "text-emerald-500 font-bold drop-shadow-sm";
        } else {
          className = "text-red-500 bg-red-100/50 rounded-sm decoration-red-500 underline decoration-4 underline-offset-4";
        }
      }

      // Cursor logic
      const isCurrentChar = index === typedText.length;
      const cursorClass = isCurrentChar && !isFinished
        ? "border-l-[3px] border-orange-500 animate-pulse -ml-[1.5px] pl-[1.5px]"
        : "";

      return (
        <span
          key={index}
          ref={isCurrentChar ? activeCharRef : null}
          className={`
                    ${className} ${cursorClass}
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

      if (!Content || isFinished) return;
      if (e.key === "Tab") {
        // Prevent tab from moving focus out if they are typing
        e.preventDefault();
      }

      if (!startTime && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setStartTime(Date.now());
      }

      if (e.key === "Backspace") {
        setTypedText((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault(); // Prevent scrolling space
        setTypedText((prev) => prev + e.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [Content, isFinished, startTime, typedText]); // Added dependencies

  // Check finish condition separately to avoid race conditions in keydown
  useEffect(() => {
    if (!Content) return;
    if (typedText.length === Content.text.length && Content.text.length > 0) {
      setIsfinished(true);
    }
  }, [typedText, Content]);

  const handleReset = () => {
    setTypedText("");
    setStartTime(null);
    setTime(0);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setIsfinished(false);
  }

  return (
    <div className="min-h-screen bg-[#FFF6E8] font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />

      <div className="pt-24 px-4 md:px-8 pb-12 max-w-[1600px] mx-auto min-h-screen flex flex-col">

        {/* Header / Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-orange-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wide uppercase">Back to Menu</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start flex-1">

          {/* LEFT COLUMN - Stats */}
          <div className="flex flex-col gap-6 sticky top-24">

            {/* Lesson Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-orange-100/50 border border-orange-100">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-orange-50 rounded-xl">
                  <Layout className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-gray-800 leading-tight">Practice</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Session Info</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Difficulty</span>
                  <span className={`
                                px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border
                                ${Content?.level === 'beginner' ? 'bg-green-50 text-green-600 border-green-100' :
                      Content?.level === 'intermediate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-red-50 text-red-600 border-red-100'}
                             `}>
                    {Content?.level || "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">
                    {Content?.category || "Types"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full mt-6 py-3 rounded-xl bg-orange-50 text-orange-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-100 hover:scale-[1.02] transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> Reset Lesson
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-orange-100/50 border border-orange-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-extrabold text-lg text-gray-800">Live Stats</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" /> Time
                    </span>
                    <span className="font-mono font-bold text-2xl text-gray-800">{time}<span className="text-sm text-gray-400 ml-1">s</span></span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 text-orange-400" /> WPM
                    </span>
                    <span className="font-bold text-xl text-gray-800">{wpm}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(251,146,60,0.3)]"
                      style={{ width: `${Math.min(wpm, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Target className="w-3.5 h-3.5 text-emerald-400" /> Accuracy
                    </span>
                    <span className="font-bold text-xl text-gray-800">{accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                      style={{ width: `${accuracy}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                  <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Errors
                  </span>
                  <span className="font-mono font-bold text-xl text-gray-800">{errors}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - Typing Area */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-orange-100/50 border border-orange-100 flex flex-col min-h-[600px]">

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Typing Practice</h2>
                {!isFinished && !startTime && (
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wide animate-pulse">Waiting to start...</span>
                )}
                {startTime && !isFinished && (
                  <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live
                  </span>
                )}
              </div>
            </div>

            <div
              ref={snippetContainerRef}
              className="bg-[#F8F9FA] p-8 md:p-10 rounded-2xl flex-1 overflow-y-auto custom-scrollbar border-2 border-transparent focus-within:border-orange-200 focus-within:bg-white transition-colors duration-300 shadow-inner relative scroll-smooth"
              onClick={() => document.body.focus()}
            >
              <div className="font-mono leading-relaxed tracking-wide select-none break-words whitespace-pre-wrap outline-none" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                {renderTextWithHighlight()}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
              <span>Press any key to start</span>
              <span className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 border border-gray-200 rounded bg-white shadow-sm">Tab</span> to reset focus
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Results Modal */}
      {isFinished && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl transform transition-all scale-100 border-4 border-[#FFF6E8]">

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                {accuracy > 90 ? <Trophy className="w-10 h-10 text-orange-500" /> : <CheckCircle className="w-10 h-10 text-emerald-500" />}
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Session Complete!</h2>
              <p className="text-gray-500 font-medium">Great work keeping up the pace.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-center">
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Speed</p>
                <p className="text-3xl font-black text-gray-800">{wpm} <span className="text-sm font-bold text-gray-400">WPM</span></p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-center">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Accuracy</p>
                <p className="text-3xl font-black text-gray-800">{accuracy}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Time</p>
                <p className="text-xl font-bold text-gray-800">{time}s</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Errors</p>
                <p className="text-xl font-bold text-gray-800">{errors}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5"
              >
                Retry Lesson
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl border-2 border-gray-100 transition-all"
              >
                Back to Menu
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TypingPracticeArea;
