import { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useTypingSound } from "../../../hooks/useTypingSound";
import { useTypingScroll } from "../../../hooks/useTypingScroll";
import { getTypiingPracticeLessonById } from "../../../api/user/typingPracticeService";
import { Zap, Target, Clock, AlertCircle, RotateCcw, Trophy, ArrowLeft, Layout, BarChart3, CheckCircle } from "lucide-react";

const TypingPracticeArea = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const [Content, setContent] = useState<any>(null);
  const [typedText, setTypedText] = useState("");
  const [countDown, setCountDown] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsfinished] = useState(false);
  const { playTyping, playTypingError } = useTypingSound();

  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  useTypingScroll({ activeCharRef, snippetContainerRef, typedText });

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
    if (!countDown || isFinished) return;

    const interval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - countDown) / 1000);
      setTime(elapsedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown, isFinished]);

  useEffect(() => {
    if (!Content || !countDown) {
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

    const elaspedTime = (Date.now() - countDown) / 1000;
    const minutes = elaspedTime / 60;
    const correctChars = typedText.length - errorCount;
    const calculatedWpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;

    setWpm(isFinite(calculatedWpm) && calculatedWpm > 0 ? calculatedWpm : 0);

    const calculatedAccuracy = typedText.length ? Math.floor((correctChars / typedText.length) * 100) : 100;
    setAccuracy(calculatedAccuracy);
  }, [typedText]);



  const renderTextWithHighlight = () => {
    if (!Content) return null;
    return Content.text.split("").map((char: string, index: number) => {
      let className = "text-gray-300"; // Default

      if (index < typedText.length) {
        if (typedText[index] === char) {
          className = "text-emerald-500 font-bold drop-shadow-sm";
        } else {
          className =
            "text-red-500 bg-red-100/50 rounded-sm decoration-red-500 underline decoration-4 underline-offset-4";
        }
      }

      // Cursor logic
      const isCurrentChar = index === typedText.length;
      const cursorClass =
        isCurrentChar && !isFinished ? "border-l-[3px] border-orange-500 animate-pulse -ml-[1.5px] pl-[1.5px]" : "";

      return (
        <span
          key={index}
          ref={isCurrentChar ? activeCharRef : null}
          className={`
                    ${className} ${cursorClass}
                    inline-flex items-center justify-center
                    h-[32px] min-w-[12px]
                    transition-colors duration-75
                    font-mono text-base md:text-xl
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

      if (!countDown && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setCountDown(Date.now());
      }

      if (e.key === "Backspace") {
        setTypedText((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault(); // Prevent scrolling space

        const expectedChar = Content.text[typedText.length];
        if (e.key !== expectedChar) {
          playTypingError();
        } else {
          playTyping();
        }

        setTypedText((prev) => prev + e.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [Content, isFinished, countDown, typedText]); // Added dependencies

  // Check finish condition separately to avoid race conditions in keydown
  useEffect(() => {
    if (!Content) return;
    if (typedText.length === Content.text.length && Content.text.length > 0) {
      setIsfinished(true);
    }
  }, [typedText, Content]);

  const handleReset = () => {
    setTypedText("");
    setCountDown(null);
    setTime(0);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setIsfinished(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8EA] font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col overflow-x-hidden">
      <Navbar />

      <div className="flex-1 pt-24 px-4 md:px-8 pb-12 max-w-[1600px] mx-auto w-full flex flex-col">
        {/* Header / Breadcrumb */}
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-orange-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-black text-[10px] md:text-xs tracking-widest uppercase">Practice Menu</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start flex-1">
          {/* LEFT COLUMN - Stats */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 order-2 lg:order-1">
            {/* Stats Card */}
            <div className="bg-[#FFF8EA] rounded-[2rem] p-6 shadow-xl shadow-orange-900/5 border border-orange-100 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-8 relative">
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-orange-50">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-black text-lg text-gray-800 tracking-tight">Performance</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" /> Elapsed Time
                    </span>
                    <span className="font-mono font-black text-2xl text-gray-800">
                      {time}
                      <span className="text-xs text-gray-300 ml-1">s</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-orange-50">
                     <div className="h-full bg-gray-200 w-full opacity-20"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Zap className="w-3.5 h-3.5 text-orange-400" /> Typing Speed
                    </span>
                    <span className="font-black text-2xl text-gray-800">{wpm}<span className="text-[10px] ml-1 opacity-30">WPM</span></span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-orange-50">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(wpm, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Target className="w-3.5 h-3.5 text-emerald-400" /> Accuracy
                    </span>
                    <span className="font-black text-2xl text-gray-800">{accuracy}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-orange-50">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${accuracy}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-6 border-t border-orange-100 flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Mistakes
                  </span>
                  <span className="font-mono font-black text-xl text-red-500">{errors}</span>
                </div>
              </div>
            </div>

            {/* Reset / Lesson Info */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-orange-900/5 border border-orange-100">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2.5 bg-orange-50 rounded-xl">
                   <Layout className="w-5 h-5 text-orange-500" />
                 </div>
                 <div>
                   <h4 className="font-black text-gray-800 text-sm leading-none">{Content?.category || "Practice"}</h4>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Difficulty: {Content?.level || "..."}</p>
                 </div>
               </div>
               
               <button
                onClick={handleReset}
                className="w-full py-4 rounded-2xl bg-[#7A6A5D] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> Reset Lesson
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - Typing Area */}
          <div className="bg-[#FFF8EA] rounded-[2.5rem] p-6 md:p-12 shadow-xl shadow-orange-900/5 border border-orange-100 flex flex-col h-[350px] md:h-[600px] order-1 lg:order-2 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100/50 overflow-hidden">
               <div 
                 className="h-full bg-orange-500 transition-all duration-300"
                 style={{ width: `${(typedText.length / (Content?.text.length || 1)) * 100}%` }}
               ></div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                <h2 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tight">Active Session</h2>
              </div>
              
              {!isFinished && !countDown && (
                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">
                    Awaiting input...
                  </span>
                </div>
              )}
              {countDown && !isFinished && (
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Timer Running
                  </span>
                </div>
              )}
            </div>

            <div
              ref={snippetContainerRef}
              className="flex-1 overflow-hidden pr-4 relative"
              onClick={() => document.body.focus()}
            >
              <div
                className="font-mono leading-relaxed md:leading-[1.6] select-none break-words whitespace-pre-wrap outline-none text-base md:text-xl text-gray-400 text-left"
                style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
              >
                {renderTextWithHighlight()}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-orange-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Start typing to begin
              </span>
              <div className="flex items-center gap-4">
                {/* <span className="flex items-center gap-2">
                   <kbd className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-800 font-mono shadow-sm">Tab</kbd>
                   to Reset
                </span>
                <span className="flex items-center gap-2">
                   <kbd className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-800 font-mono shadow-sm">Backspace</kbd>
                   to Edit
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {isFinished && (
        <div className="fixed inset-0 bg-orange-900/20 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
          <div className="bg-[#FFF8EA] rounded-[2.5rem] p-6 md:p-10 w-full max-w-xl shadow-2xl border border-orange-100 animate-zoom-in relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
            
            <div className="text-center mb-10 relative z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-900/5 border border-orange-50">
                {accuracy > 90 ? (
                  <Trophy className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />
                ) : (
                  <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-500" />
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-2 tracking-tight">Practice Complete!</h2>
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Excellent progress on this lesson</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
              <div className="bg-white p-5 rounded-[1.5rem] border border-orange-100 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Final Speed</p>
                <p className="text-4xl font-black text-gray-800 leading-none">
                  {wpm}<span className="text-xs ml-1 opacity-30">WPM</span>
                </p>
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] border border-orange-100 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Precision</p>
                <p className="text-4xl font-black text-gray-800 leading-none">{accuracy}<span className="text-xs ml-1 opacity-30">%</span></p>
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] border border-orange-100 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Duration</p>
                <p className="text-2xl font-black text-gray-800 leading-none">{time}<span className="text-xs ml-1 opacity-30">SEC</span></p>
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] border border-orange-100 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Misses</p>
                <p className="text-2xl font-black text-red-500 leading-none">{errors}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Retry Lesson
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-black py-4 rounded-2xl border-2 border-orange-100 transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Practice Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingPracticeArea;
