import { Zap, Target, Keyboard, AlertCircle, Clock, Timer } from "lucide-react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { ClipboardEvent, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getChallengeGameData } from "../../api/companyUser/challenge";
import { socket } from "../../socket";
import { useSelector } from "react-redux";
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
  rank?: number;
};
export interface ChallengeGame {
  id: string;
  startedAt: string;
  status: string;
  duration: number;
  companyId: string;
  countDown: number;

  lesson: {
    id: string;
    title: string;
    text: string;
  };

  players: {
    name: string;
    imageUrl: string;
    companyId: string;
    companyRole: string | null;
    bio: string | null;
  }[];
}
export interface LivePlayer {
  userId: string;
  name: string;
  imageUrl: string;
  companyId: string;
  companyRole: string | null;
  bio: string | null;
  typedLength: number;

  wpm: number;
  accuracy: number;
  errors: number;
  progress: number;
  timeTaken?: string;
  color?: string;
}
export default function ChallengeArea() {
  useEffect(() => {
    // Prevent default touch behaviors (like pinch-to-zoom and swipe-to-scroll)
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent multi-touch zoom
      }
    };

    const preventScroll = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent ctrl+scroll zoom
      }
    };

    // Add non-passive listeners to explicitly block default behavior
    document.addEventListener("touchmove", preventDefault, { passive: false });
    document.addEventListener("wheel", preventScroll, { passive: false });

    // Lock body overflow
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Cleanup on unmount
      document.removeEventListener("touchmove", preventDefault);
      document.removeEventListener("wheel", preventScroll);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const preventCopyPaste = (e: ClipboardEvent) => {
    e.preventDefault();
  };

  const { challengeId } = useParams();
  const [challengeData, setChallengeData] = useState<ChallengeGame | null>(
    null,
  );
  const [players, setPlayers] = useState<LivePlayer[] | null>(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  const [countdown, setCountdown] = useState(3);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [typedText, setTypedText] = useState("");
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const snippetContainerRef = useRef<HTMLDivElement>(null);
  const [totalTyped, setTotalTyped] = useState(0);
  const [finalResult, setFinalResult] = useState<GamePlayerResult[]>([]);
  const user = useSelector((state: any) => state.companyAuth.user);
  const [currentUser, setCurrentUser] = useState<
    | {
        _id: string;
        name: string;
        imageUrl?: string;
        isHost: boolean;
      }
    | undefined
  >(undefined);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!challengeData) return;

    socket.emit("challenge-join", {
      challengeId: challengeData.id,
      userId: currentUser?._id,
    });
  }, [challengeData, currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!challengeId) return;

        const response = await getChallengeGameData(challengeId);
        const data = response.data.data;
        const livePlayers: LivePlayer[] = data.players.map((player: any) => ({
          name: player.name,
          imageUrl: player.imageUrl,
          companyId: player.companyId,
          companyRole: player.companyRole,
          bio: player.bio,
          wpm: 0,
          accuracy: 0,
          errors: 0,
          progress: 0,
          typedLength: 0,
          userId: player.userId,
          timeTaken: player.timeTaken || "00:00",
          color: player.color || "bg-orange-400",
        }));
        setChallengeData(data);
        setPlayers(livePlayers);
      } catch (error) {
        console.error("Error fetching challenge game data:", error);
      }
    };

    fetchData();
  }, [challengeId]);

  //send live stats,
  useEffect(() => {
    if (!challengeData?.id || !currentUser) return;
    if (phase !== "PLAY") return;
    socket.emit("typing-progress-quick", {
      gameId: challengeData.id,
      userId: currentUser._id,
      typedLength: typedText.length,
      wpm,
      status: "PLAYING",
      accuracy,
      errors,
    });
  }, [typedText, wpm, accuracy, errors, phase]);

  //typing progress update from other players
  useEffect(() => {
    const handler = (data: any) => {
      setPlayers((prev: any) =>
        prev?.map((p: any) =>
          p.userId === data.userId
            ? { ...p, ...data, progress: data.typedLength }
            : p,
        ),
      );
    };

    socket.off("typing-progress-update-challenge");
    socket.on("typing-progress-update-challenge", handler);

    return () => {
      socket.off("typing-progress-update-challenge", handler);
    };
  }, [challengeData?.id]);

  useEffect(() => {
    if (!challengeData?.startedAt || !challengeData?.duration) return;
    const startTimesamp = new Date(challengeData.startedAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimesamp) / 1000);
      if (elapsed < challengeData.countDown) {
        setPhase("COUNTDOWN");
        setCountdown(challengeData.countDown - elapsed);
      } else if (elapsed < challengeData.countDown + challengeData.duration) {
        setPhase("PLAY");
        setRemainingTime(
          challengeData.countDown + challengeData.duration - elapsed,
        );

        setElapsedTime(elapsed - challengeData.countDown);
      } else {
        setPhase("PLAY");
        setRemainingTime(0);
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [
    challengeData?.startedAt,
    challengeData?.duration,
    challengeData?.countDown,
    isFinished,
  ]);

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

    const calculatedWpm = Math.round(correctChars / 5 / elapsedMinutes);

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
    if (!challengeData?.lesson?.text) return null;
    return challengeData?.lesson?.text
      .split("")
      .map((char: string, index: number) => {
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
        const cursorClass =
          isCurrentChar && phase === "PLAY" && !isFinished
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
  useEffect(() => {
    if (activeCharRef.current && snippetContainerRef.current) {
      const container = snippetContainerRef.current;
      const element = activeCharRef.current;

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const relativeTop = elementRect.top - containerRect.top;
      const relativeBottom = elementRect.bottom - containerRect.top;

      // Keep cursor in middle-ish of view
      if (
        relativeBottom > containerRect.height / 2 ||
        relativeTop < containerRect.height / 3
      ) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [typedText]);

  useEffect(() => {
    socket.on("game-finished-challenge", (data: GamePlayerResult[]) => {
      setFinalResult(data);
    });
    return () => {
      socket.off("game-finished-challenge");
    };
  }, [challengeData?.id]);

  //handle key down

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!challengeData?.lesson.text || isFinished || phase !== "PLAY") return;
      if (e.key === "Backspace") {
        setHasError(false);
        setTypedText((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();

        if (hasError) return;

        const expectedChar = challengeData?.lesson.text[typedText.length];
        setTotalTyped((prev) => prev + 1);

        if (e.key !== expectedChar) {
          setErrors((prev) => prev + 1);
          setHasError(true);
          setTypedText((prev) => prev + e.key);
          return;
        }

        const nextText = typedText + e.key;
        setTypedText(nextText);

        if (nextText.length === challengeData?.lesson.text.length) {
          setIsFinished(true);
          socket.emit("player-finished-challenge", {
            challengeId: challengeData?.id,
            userId: currentUser?._id,
            name: currentUser?.name,
            imageUrl: currentUser?.imageUrl,
            timeTaken: elapsedTime,
            wpm,
            accuracy,
            errors,
            typedLength: typedText.length,
            totalTyped,
            status: "FINISHED",
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    challengeData?.lesson.text,
    isFinished,
    typedText,
    phase,
    hasError,
    challengeData?.id,
  ]);

  return (
    <>
      {/* <div className="shrink-0 pointer-events-auto"> */}
      <CompanyUserNavbar />
      {/* </div> */}
      <div
        className="h-[100dvh] w-full bg-[#FFF8EA] text-gray-800 flex flex-col font-sans overflow-hidden select-none pt-20 md:pt-10"
        style={{ touchAction: "none" }}
        onCopy={preventCopyPaste}
        onCut={preventCopyPaste}
        onPaste={preventCopyPaste}
      >
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center px-4 md:px-8 max-w-7xl mx-auto w-full gap-3 md:gap-4 py-3 md:py-4 overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="flex justify-between items-center w-full shrink-0 mb-1 px-2 md:px-0">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-0.5 tracking-tight">
                Live Challenge
              </h1>
              <p className="text-gray-500 text-xs md:text-sm font-medium flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5" /> First to finish wins the
                match!
              </p>
            </div>
            <div className="bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-[1rem] border border-[#FDE6C6] shadow-sm flex items-center gap-2">
              <Timer className="w-4 h-4 md:w-5 md:h-5 text-orange-500 animate-pulse" />
              <span className="text-lg md:text-xl font-mono font-bold text-gray-800">
                {elapsedTime}
              </span>
            </div>
          </div>

          {/* Players Container */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full shrink-0">
            {players &&
              players.map((player, index) => (
                <div
                  key={index}
                  className="flex-1 bg-white border border-[#FDE6C6] rounded-[1.25rem] md:rounded-[1.5rem] p-4 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>

                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="relative">
                      <img
                        src={player.imageUrl}
                        alt="Avatar"
                        className="w-12 h-12 rounded-xl border-2 border-orange-100 bg-orange-50 object-cover"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight">
                        {player.name}
                      </h3>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 font-medium">
                        {player.companyRole}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 md:gap-3 mb-3 relative z-10">
                    <div className="bg-[#FFFDF9] rounded-xl p-1.5 md:p-2 border border-[#FDE6C6] flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-orange-500 mb-0.5 font-semibold text-[9px] md:text-[10px]">
                        <Zap className="w-3 h-3" /> WPM
                      </div>
                      <span className="text-lg md:text-xl font-extrabold text-gray-900 leading-none">
                        {player.wpm}
                      </span>
                    </div>
                    <div className="bg-[#FFFDF9] rounded-xl p-1.5 md:p-2 border border-[#FDE6C6] flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-green-500 mb-0.5 font-semibold text-[9px] md:text-[10px]">
                        <Target className="w-3 h-3" /> Acc
                      </div>
                      <span className="text-lg md:text-xl font-extrabold text-gray-900 leading-none">
                        {player.accuracy}
                        <span className="text-[9px] text-gray-400 font-bold">
                          %
                        </span>
                      </span>
                    </div>
                    <div className="bg-[#FFFDF9] rounded-xl p-1.5 md:p-2 border border-[#FDE6C6] flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-red-500 mb-0.5 font-semibold text-[9px] md:text-[10px]">
                        <AlertCircle className="w-3 h-3" /> Err
                      </div>
                      <span className="text-lg md:text-xl font-extrabold text-gray-900 leading-none">
                        {player.errors}
                      </span>
                    </div>
                    <div className="bg-[#FFFDF9] rounded-xl p-1.5 md:p-2 border border-[#FDE6C6] flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-blue-500 mb-0.5 font-semibold text-[9px] md:text-[10px]">
                        <Clock className="w-3 h-3" /> Time
                      </div>
                      <span className="text-lg md:text-xl font-extrabold text-gray-900 leading-none">
                        {player.timeTaken || "00:00"}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] md:text-[10px] font-bold text-gray-600">
                        Progress
                      </span>
                      <span className="text-[9px] md:text-[10px] font-bold text-orange-500">
                        {player.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden shadow-inner flex">
                      <div
                        className={`${player.color} h-1.5 rounded-full transition-all duration-500 relative`}
                        style={{ width: `${Math.max(player.progress, 5)}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 w-full h-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Typing Area Container - Uses flex-1 to fill remaining space without overflowing */}
          <div className="w-full bg-white rounded-[1.25rem] md:rounded-[1.5rem] border border-[#FDE6C6] p-4 shadow-sm flex flex-col gap-3 relative mt-0 flex-1 shrink min-h-0 overflow-hidden">
            {/* Decorative gradient top bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300"></div>

            {/* Text Display - Hidden overflow */}
            <div
              ref={snippetContainerRef}
              className="relative z-10 text-[#4A5568] text-base md:text-lg leading-[1.6] font-mono tracking-wide flex-1 min-h-[50px] overflow-hidden pr-2"
            >
              <span className="opacity-80 drop-shadow-sm pointer-events-none">
                {renderTextWithHighlight()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
