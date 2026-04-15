import { useEffect } from "react";
import { socket } from "../../socket";
import { getMappedKey, KeyboardLayoutType } from "../../utils/keyboardLayouts";

interface UseChallengeKeydownProps {
  lessonText: string | undefined;
  challengeId: string | undefined;
  currentUserId: string | undefined;
  currentUserName: string | undefined;
  currentUserImageUrl: string | undefined;
  isFinished: boolean;
  phase: "COUNTDOWN" | "PLAY";
  hasError: boolean;
  typedText: string;
  elapsedTime: number;
  wpm: number;
  accuracy: number | null;
  errors: number;
  totalTyped: number;
  setHasError: (v: boolean) => void;
  setTypedText: React.Dispatch<React.SetStateAction<string>>;
  setTotalTyped: React.Dispatch<React.SetStateAction<number>>;
  setErrors: React.Dispatch<React.SetStateAction<number>>;
  setIsFinished: (v: boolean) => void;
  keyboardLayout: KeyboardLayoutType;
}

export function useChallengeKeydown({
  lessonText,
  challengeId,
  currentUserId,
  currentUserName,
  currentUserImageUrl,
  isFinished,
  phase,
  hasError,
  typedText,
  elapsedTime,
  wpm,
  accuracy,
  errors,
  totalTyped,
  setHasError,
  setTypedText,
  setTotalTyped,
  setErrors,
  setIsFinished,
  keyboardLayout,
}: UseChallengeKeydownProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lessonText || isFinished || phase !== "PLAY") return;

      const key = e.key;

      if (key === "Backspace") {
        setHasError(false);
        setTypedText((prev) => prev.slice(0, -1));
        setTotalTyped((prev) => Math.max(0, prev - 1));
        return;
      }

      if (key.length > 1 && key !== " ") return;

      e.preventDefault();

      if (hasError) return;

      const mappedKey = getMappedKey(key, keyboardLayout);

      const index = typedText.length;
      const expectedChar = lessonText[index];

      const newTotal = totalTyped + 1;

      if (mappedKey !== expectedChar) {
        setErrors((prev) => prev + 1);
        setHasError(true);
        setTotalTyped(newTotal);

        setTypedText((prev) => prev + key);
        return;
      }

      const nextText = typedText + key;

      setTypedText(nextText);
      setTotalTyped(newTotal);

      if (nextText.length === lessonText.length) {
        setIsFinished(true);

        socket.emit("player-finished-challenge", {
          challengeId,
          userId: currentUserId,
          name: currentUserName,
          imageUrl: currentUserImageUrl,
          timeTaken: elapsedTime,
          wpm,
          accuracy,
          errors,
          typedLength: nextText.length,
          totalTyped: newTotal,
          status: "FINISHED",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    lessonText,
    isFinished,
    typedText,
    phase,
    hasError,
    challengeId,
    keyboardLayout, 
  ]);
}