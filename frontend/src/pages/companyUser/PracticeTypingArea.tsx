import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { getMappedKey, KeyboardLayoutType } from "../../utils/keyboardLayouts";
import { ArrowLeft, RotateCcw, Zap, Target, AlertCircle, Keyboard, Trophy, Home, Sparkles } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import { useTypingStats } from "../../hooks/useTypingStats";

const PracticeTypingArea: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    text: initialText,
    title,
    type,
  } = location.state || {
    text: "The quick brown fox jumps over the lazy dog.",
    title: "Default Practice",
    type: "default",
  };

  const keyboardLayout = useSelector((state: any) => state.auth.keyboardLayout) as KeyboardLayoutType;
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { wpm, accuracy } = useTypingStats(
    totalTyped,
    errors,
    elapsedTime,
    isActive ? "PLAY" : "COUNTDOWN",
    isFinished
  );

  useEffect(() => {
    let interval: any;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        if (startTime) {
          setElapsedTime((Date.now() - startTime) / 1000);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished, startTime]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      // Start the timer on first character (excluding backspace)
      if (!isActive && e.key.length === 1) {
        setIsActive(true);
        setStartTime(Date.now());
      }

      if (!isActive && !isFinished && e.key === " ") {
        // If we want space to start, but here character starts.
        // Let's stick to "any character starts" as in previous logic.
      }

      const key = e.key;

      if (key === "Backspace") {
        setTypedText((prev) => prev.slice(0, -1));
        setTotalTyped((prev) => Math.max(0, prev - 1));
        return;
      }

      if (key.length > 1 && key !== " ") return;
      if (typedText.length >= initialText.length) return;

      e.preventDefault();

      const mappedKey = getMappedKey(key, keyboardLayout);
      const index = typedText.length;
      const expectedChar = initialText[index];

      const isCorrect = mappedKey === expectedChar;

      setTotalTyped((prev) => prev + 1);
      if (!isCorrect) {
        setErrors((prev) => prev + 1);
      }

      const nextText = typedText + key;
      setTypedText(nextText);

      // Finish condition
      if (nextText.length === initialText.length) {
        setIsFinished(true);
        setIsActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isFinished, typedText, initialText, keyboardLayout]);

  const resetPractice = () => {
    setTypedText("");
    setIsFinished(false);
    setIsActive(false);
    setErrors(0);
    setTotalTyped(0);
    setElapsedTime(0);
    setStartTime(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const getCharClass = (index: number) => {
    if (index >= typedText.length) return "text-gray-400";

    const rawKey = typedText[index];
    const mappedKey = getMappedKey(rawKey, keyboardLayout);

    return mappedKey === initialText[index]
      ? "text-emerald-600 bg-emerald-50/50"
      : "text-red-500 bg-red-100 underline decoration-red-200";
  };

  // Progress percentage
  const progress = (typedText.length / initialText.length) * 100;

  return (
    <div className="min-h-screen bg-[#FFF8EA] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-200">
      <CompanyUserNavbar />

      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/company/user/my-practice")}
              className="p-3 bg-white hover:bg-orange-50 rounded-2xl border border-orange-100 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {type === "custom" && <Sparkles className="w-5 h-5 text-orange-500" />}
                {title}
              </h1>
              <p className="text-sm text-gray-500">Typing Practice Session</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetPractice}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-orange-100 rounded-xl hover:bg-orange-50 transition-all font-semibold shadow-sm"
            >
              <RotateCcw className="w-4 h-4 text-orange-400" />
              Restart
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <StatCard
            icon={<Zap className="w-5 h-5 text-orange-500" />}
            label="Speed (WPM)"
            value={Math.round(wpm)}
            color="bg-orange-50"
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-emerald-500" />}
            label="Accuracy"
            value={`${accuracy}%`}
            color="bg-emerald-50"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5 text-red-500" />}
            label="Errors"
            value={errors}
            color="bg-red-50"
          />
        </div>

        {/* Typing Area */}
        <div
          className="relative bg-[#FFF3DB] rounded-[2.5rem] p-1 shadow-2xl shadow-orange-900/10 group"
          onClick={() => !isFinished && inputRef.current?.focus()}
        >
          {/* Progress Path */}
          <div className="absolute top-0 left-10 right-10 h-1.5 bg-orange-100/50 rounded-b-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 via-pink-400 to-orange-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="bg-[#FEFCE8] rounded-[2.3rem] p-8 md:p-12 min-h-[350px] border border-orange-50 relative overflow-hidden flex flex-col justify-center">
            {/* Main Text Content */}
            <div
              className="relative font-mono text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-wide text-gray-300 select-none outline-none z-10"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {initialText.split("").map((char: string, index: number) => {
                const isCurrent = index === typedText.length;
                return (
                  <span
                    key={index}
                    className={`
                      relative transition-all duration-100 rounded-sm
                      ${getCharClass(index)}
                      ${isCurrent && !isFinished ? "bg-orange-200 text-orange-900 shadow-[0_0_15px_rgba(251,146,60,0.3)] animate-pulse" : ""}
                    `}
                  >
                    {/* Visual Cursor */}
                    {isCurrent && !isFinished && isActive && (
                      <span className="absolute -left-[1px] -top-1 bottom-1 w-[2px] bg-orange-500 animate-[blink_1s_infinite] z-20"></span>
                    )}
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Start Overlay */}
            {!isActive && !isFinished && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px] z-20 pointer-events-none transition-opacity">
                <div className="text-center space-y-2 group-hover:scale-105 transition-transform duration-500">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg animate-bounce">
                    <Keyboard className="w-4 h-4" /> Start Typing to Begin
                  </div>
                </div>
              </div>
            )}

            {/* Typing Feedback Ripple */}
            <div className="absolute bottom-8 right-8 pointer-events-none opacity-10">
              <Keyboard className="w-48 h-48 text-orange-900" />
            </div>

            {/* Hidden Input field */}
            <input
              ref={inputRef}
              type="text"
              className="absolute inset-0 opacity-0 cursor-default"
              value={typedText}
              onChange={() => {}}
              onPaste={(e) => e.preventDefault()}
              disabled={isFinished}
            />

            {/* Success Overlay */}
            {isFinished && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-md z-30 transition-all duration-700 animate-in zoom-in-95 fade-in">
                <div className="text-center max-w-sm space-y-8 p-1">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl shadow-xl shadow-orange-200">
                      <Trophy className="w-16 h-16 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-gray-800">Excellent!</h2>
                    <p className="text-gray-500 font-medium">
                      You completed the practice session with {accuracy}% accuracy.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Final Speed</p>
                      <p className="text-2xl font-black text-orange-600">
                        {Math.round(wpm)} <span className="text-xs">WPM</span>
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Time Taken</p>
                      <p className="text-2xl font-black text-emerald-600">
                        {Math.round(elapsedTime)}
                        <span className="text-xs">s</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={resetPractice}
                      className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" /> Retry Practice
                    </button>
                    <button
                      onClick={() => navigate("/company/user/my-practice")}
                      className="w-full py-4 bg-white text-gray-700 rounded-2xl font-black border-2 border-orange-50 hover:bg-orange-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Home className="w-5 h-5" /> Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tip Card */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            <b>Tip:</b> Focus on accuracy first. Speed will naturally follow as you build muscle memory. Avoid looking
            at your keyboard!
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PracticeTypingArea;
