import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import StatCard from "../../../components/common/StatCard";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Clock, Zap, Target, AlertCircle, Trophy, Home, RotateCcw } from "lucide-react";
import { saveSoloPlayResult } from "../../../api/user/solo";
import { useTypingStats } from "../../../hooks/useTypingStats";
import { useSoloGameTimer } from "../../../hooks/soloPlay/useSoloGameTimer";
import { useSoloHandleKeyDown } from "../../../hooks/soloPlay/UseSoloHandleKeyDown";
import { createSoloRoom } from "../../../api/user/solo";
import { toast } from "react-toastify";
const SoloPlay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state?.gameData;
  const lesson = gameData?.lesson;
  const [countdown, setCountdown] = useState<number>(gameData?.startTime || 10);
  const [remainingTime, setRemainingTime] = useState<number>(gameData?.duration || 300);
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  const [hasError, setHasError] = useState(false);
  const [errors, setErrors] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsfinished] = useState(false);
  const [space, setSpace] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const playStartRef = useRef<number | null>(null);
  const [totalTyped, setTotalTyped] = useState(0);
  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  let timeDisplay: string;
  let timeLabel: string;

  if (!space) {
    timeDisplay = "Press space to start";
    timeLabel = "Status";
  } else if (phase === "COUNTDOWN") {
    timeDisplay = `${countdown}s`;
    timeLabel = "Starting in";
  } else {
    timeDisplay = `${remainingTime}s`;
    timeLabel = "Time Left";
  }

  useEffect(() => {
    if (!gameData) {
      navigate("/");
    }
  }, [gameData, navigate]);

  useSoloHandleKeyDown({
    lesson,
    isFinished,
    phase,
    space,
    hasError,
    typedText,
    startTimeRef,
    setSpace,
    setHasError,
    setTypedText,
    setErrors,
    setTotalTyped,
    setIsfinished,
  });

  const renderTextWithHighlight = () => {
    if (!lesson) return null;
    return lesson.text.split("").map((char: string, index: number) => {
      let className = "text-gray-300";

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
        isCurrentChar && phase === "PLAY" && !isFinished
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

  const { wpm, accuracy } = useTypingStats(totalTyped, errors, elapsedTime, phase, isFinished);
  useSoloGameTimer({
    gameData,
    isFinished,
    space,
    startTimeRef,
    playStartRef,
    setPhase,
    setCountdown,
    setRemainingTime,
    setElapsedTime,
    setIsfinished,
  });

  useEffect(() => {
    async function endGameHandler() {
      try {
        if (isFinished && typedText.length === lesson?.text.length) {
          await saveSoloPlayResult(gameData._id, {
            wpm,
            accuracy,
            errors,
            time: elapsedTime,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    endGameHandler();
  }, [isFinished]);

  async function handleNewGame() {
    try {
      const response = await createSoloRoom();
      if (!response) {
        throw new Error("Solo room ID missing");
      }
      const solo = response.data;
      if (response) {
        navigate(`/solo-play/${solo._id}`, {
          state: { gameData: solo },
        });
      }
    } catch (error) {
      toast.error("Failed to create solo room. Please try again.");
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#fff7e9] flex flex-col items-center px-4 pt-24 pb-12">
        {isFinished ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-in fade-in zoom-in duration-500 w-full max-w-4xl mx-auto mt-12">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center justify-center gap-3">
                <Trophy className="w-10 h-10 text-amber-500 fill-amber-500" />
                Test Complete!
                <Trophy className="w-10 h-10 text-amber-500 fill-amber-500" />
              </h1>
              <p className="text-gray-500 font-medium">Here are your final results</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <StatCard
                icon={<Clock className="w-5 h-5 text-blue-500" />}
                label="Time"
                value={`${elapsedTime}s`}
                color="bg-blue-50"
              />
              <StatCard
                icon={<Zap className="w-5 h-5 text-orange-500" />}
                label="WPM"
                value={wpm}
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

            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back Home
              </button>
              <button
                onClick={handleNewGame}
                className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <h1 className="text-2xl font-bold">Solo Play</h1>
            <p className="text-sm text-gray-500 mt-1">Start typing to begin the test</p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mt-6">
              <StatCard
                icon={<Clock className="w-5 h-5 text-blue-500" />}
                label={timeLabel}
                value={timeDisplay}
                color="bg-blue-50"
              />
              <StatCard
                icon={<Zap className="w-5 h-5 text-orange-500" />}
                label="WPM"
                value={wpm}
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

            {/* Divider */}
            <div className="w-full max-w-4xl h-2 bg-[#9b8a7a] rounded-full my-8" />

            {/* Typing Box */}
            <div className="w-full max-w-4xl bg-[#fffaf0] border border-gray-200 rounded-2xl p-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Typing Test</h3>
                <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">
                  Reset
                </button>
              </div>

              {/* Text Area */}
              {/* Text Area */}
              <div
                className=" mt-5 border-2 border-dashed border-gray-300 rounded-2xl p-8 
                    text-left text-gray-600 text-base leading-relaxed 
                    min-h-[220px]"
              >
                {renderTextWithHighlight()}
              </div>

              {/* Hint */}
              {/* <p className="mt-4 text-xs text-center text-gray-500">
                Click here and start typing to begin the test
              </p> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SoloPlay;
