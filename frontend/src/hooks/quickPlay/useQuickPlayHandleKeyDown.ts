import { useEffect } from "react";
import { socket } from "../../socket";

interface Props {
  lesson: string;
  isFinished: boolean;
  phase: "COUNTDOWN" | "PLAY";
  typedText: string;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setTypedText: React.Dispatch<React.SetStateAction<string>>;
  setErrors: React.Dispatch<React.SetStateAction<number>>;
  setTotalTyped: React.Dispatch<React.SetStateAction<number>>;
  setIsfinished: React.Dispatch<React.SetStateAction<boolean>>;
  gameData: any;
  currentUser: any;
  elapsedTime: number;
  wpm: number;
  accuracy: number | null;
  errors: number;
  totalTyped: number;
}

export const useQuickPlayHandleKeyDown = ({
  lesson,
  isFinished,
  phase,
  typedText,
  hasError,
  setHasError,
  setTypedText,
  setErrors,
  setTotalTyped,
  setIsfinished,
  gameData,
  currentUser,
  elapsedTime,
  wpm,
  accuracy,
  errors,
  totalTyped,
}: Props) => {
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
        const newTotal = totalTyped + 1;
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
            typedLength: nextText.length,
            totalTyped: newTotal,
            status: "FINISHED",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lesson, isFinished, typedText, phase, hasError, gameData?._id]);
};
