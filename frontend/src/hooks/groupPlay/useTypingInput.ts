import { useEffect } from "react";
import { socket } from "../../socket";

export function useTypingInput({
  lesson,
  isFinished,
  phase,
  hasError,
  setHasError,
  typedText,
  setTypedText,
  setErrors,
  setTotalTyped,
  setIsfinished,
  gameId,
  currentUser,
  elapsedTime,
  wpm,
  accuracy,
  errors,
}: any) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lesson || isFinished || phase !== "PLAY") return;

      if (e.key === "Backspace") {
        setHasError(false);
        setTypedText((prev: string) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();

        if (hasError) return;

        const expectedChar = lesson.text[typedText.length];

        setTotalTyped((prev: number) => prev + 1);

        if (e.key !== expectedChar) {
          setErrors((prev: number) => prev + 1);
          setHasError(true);
          setTypedText((prev: string) => prev + e.key);
          return;
        }

        const nextText = typedText + e.key;
        setTypedText(nextText);

        if (nextText.length === lesson.text.length) {
          setIsfinished(true);

          socket.emit("player-finished", {
            gameId,
            userId: currentUser?._id,
            name: currentUser?.name,
            imageUrl: currentUser?.imageUrl,
            timeTaken: elapsedTime,
            wpm,
            accuracy,
            errors,
            typedLength: nextText.length,
            status: "finished",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    lesson,
    isFinished,
    phase,
    hasError,
    typedText,
    gameId,
    currentUser,
    elapsedTime,
    wpm,
    accuracy,
    errors,
  ]);
}
