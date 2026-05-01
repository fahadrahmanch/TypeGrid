import { useEffect } from "react";
import { useTypingSound } from "../useTypingSound";
type UseSoloHandleKeyDownProps = {
  lesson: any;
  isFinished: boolean;
  phase: "COUNTDOWN" | "PLAY";
  space: boolean;
  hasError: boolean;
  typedText: string;
  startTimeRef: React.MutableRefObject<number | null>;

  setSpace: React.Dispatch<React.SetStateAction<boolean>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setTypedText: React.Dispatch<React.SetStateAction<string>>;
  setErrors: React.Dispatch<React.SetStateAction<number>>;
  setTotalTyped: React.Dispatch<React.SetStateAction<number>>;
  setIsfinished: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useSoloHandleKeyDown = ({
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
}: UseSoloHandleKeyDownProps) => {
  const { playTyping, playTypingError } = useTypingSound();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && !space) {
        e.preventDefault();
        setSpace(true);
        startTimeRef.current = Date.now();
      }

      if (!lesson || isFinished || phase !== "PLAY" || !space) return;

      if (e.key === "Backspace") {
        setHasError(false);
        setTypedText((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();

        setTotalTyped((prev) => prev + 1);

        if (hasError) return;

        const expectedChar = lesson.text[typedText.length];

        if (e.key !== expectedChar) {
          playTypingError()
          setErrors((prev) => prev + 1);
          setHasError(true);
          setTypedText((prev) => prev + e.key);
          return;
        }

        const nextText = typedText + e.key;
        playTyping();
        setTypedText(nextText);

        if (nextText.length === lesson.text.length) {
          setIsfinished(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lesson, isFinished, typedText, phase, hasError]);
};
