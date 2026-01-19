import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/user/Navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaS } from "react-icons/fa6";
import { Clock, Zap, Target, AlertCircle } from "lucide-react";
import { saveSoloPlayResult } from "../../../api/user/solo";
const SoloPlay: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const gameData = location.state?.gameData;
    const lesson = gameData?.lesson;
    const [countdown, setCountdown] = useState<number>(gameData?.startTime || 10);
    const [remainingTime, setRemainingTime] = useState<number>(gameData?.duration || 300);
    const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
    const [hasError, setHasError] = useState(false);
    const [errors, setErrors] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [startTypingTime, setStartTypingTime] = useState(0)
    const [elapsedTime, setElapsedTime] = useState(0);
    const activeCharRef = useRef<HTMLSpanElement>(null);
    const [typedText, setTypedText] = useState("");
    const [isFinished, setIsfinished] = useState(false);
    const [space, setSpace] = useState(false)
    const startTimeRef = useRef<number | null>(null);
    const playStartRef = useRef<number | null>(null);




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

    useEffect(() => {
        if (!gameData?.startedAt || !gameData?.duration || isFinished) return
        if (!space || !startTimeRef.current) return;
        
        const startTime = startTimeRef.current;
        
        const interval = setInterval(() => {
            const now = Date.now()
            const elapsed = Math.floor((now - startTime) / 1000)
            setElapsedTime(elapsed)
            if (elapsed < gameData.startTime) {
                setPhase("COUNTDOWN")
                setCountdown(gameData.startTime - elapsed)
            }
            else if (elapsed < gameData.startTime + gameData.duration) {
                setPhase('PLAY')
                 if (playStartRef.current === null) {
    playStartRef.current = Date.now();
  }
                setRemainingTime(gameData.startTime + gameData.duration - elapsed)

                setElapsedTime(elapsed - gameData.startTime);
            }
            else {
                setPhase('PLAY')
                setRemainingTime(0)
                setIsfinished(true)
                clearInterval(interval)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [gameData?.startedAt, gameData?.duration, gameData?.startTime, isFinished, space])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key == " "&&!space) {
                setSpace(true)
                startTimeRef.current = Date.now();
            }
            
            if (!lesson || isFinished || phase !== "PLAY" || !space) return;
             
           
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

   //wpm
    useEffect(() => {
      let startTime= playStartRef.current;
      if(!startTime) return;
      if (phase !== "PLAY") return;
      const elapsedMs = Date.now() - startTime;
      const elapsedMinutes = elapsedMs / 60000;
   
      if (elapsedMinutes <= 0) return;
  
      const characters =  typedText.split("").filter(
  (char, i) => char === lesson?.text[i]
).length;
      const words = characters / 5;
  
      const calculatedWpm = Math.round(words / elapsedMinutes);
      setWpm(calculatedWpm);
    }, [typedText]);
  
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
  
  useEffect( ()=>{
    async function endGameHandler(){
        try{
            if(isFinished&&typedText.length===lesson?.text.length){
               const response=await saveSoloPlayResult(gameData._id,{wpm,accuracy,errors,time:elapsedTime})
               console.log(response)
            }

        }catch(err){
            console.log(err)
        }

    }
    endGameHandler()
  },[isFinished])


    return (
        <>

            <Navbar />

            <div className="min-h-screen bg-[#fff7e9] flex flex-col items-center px-4 pt-24 pb-12">

                {/* Header */}
                <h1 className="text-2xl font-bold">Solo Play</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Start typing to begin the test
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                    <StatCard icon={<Clock className="w-5 h-5 text-blue-500" />} label={timeLabel} value={timeDisplay} color="bg-blue-50" />
                    <StatCard icon={<Zap className="w-5 h-5 text-orange-500" />} label="WPM" value={wpm} color="bg-orange-50" />
                    <StatCard icon={<Target className="w-5 h-5 text-emerald-500" />} label="Accuracy" value={`${accuracy}%`} color="bg-emerald-50" />
                    <StatCard icon={<AlertCircle className="w-5 h-5 text-red-500" />} label="Errors" value={errors} color="bg-red-50" />
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
                    <div className=" mt-5 border-2 border-dashed border-gray-300 rounded-2xl p-8 
                text-left text-gray-600 text-base leading-relaxed 
                min-h-[220px]">
                        {renderTextWithHighlight() }
                    </div>


                    {/* Hint */}
                    <p className="mt-4 text-xs text-center text-gray-500">
                        Click here and start typing to begin the test
                    </p>
                </div>
            </div>
        </>
    );
};

export default SoloPlay;

/* Small reusable stat card */
/* Small reusable stat card */
interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatsCardProps> = ({ icon, label, value, color }) => {
    return (
        <div className={`flex flex-col items-center justify-center py-5 px-4 rounded-3xl border border-gray-100 shadow-sm ${color} bg-opacity-40 transition-transform hover:-translate-y-1 duration-300 group`}>
            <div className="flex items-center gap-2 mb-1.5 p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-xl font-extrabold text-gray-800 tracking-tight whitespace-nowrap">{value}</span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">{label}</span>
        </div>
    );
};
