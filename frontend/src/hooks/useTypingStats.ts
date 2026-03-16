import { useEffect, useState } from "react";

export function useTypingStats(
  totalTyped: number,
  errors: number,
  elapsedTime: number,
  phase: "COUNTDOWN" | "PLAY",
  isFinished: boolean
) {
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState<number>(100);

  useEffect(() => {
    if (phase !== "PLAY" || isFinished) return;
    if (elapsedTime <= 0) return;

    const elapsedMinutes = elapsedTime / 60;
    const correctChars = Math.max(totalTyped - errors, 0);

    const calculatedWpm = Math.round(correctChars / 5 / elapsedMinutes);
    setWpm(calculatedWpm);
  }, [elapsedTime, totalTyped, errors, phase, isFinished]);

  useEffect(() => {
    if (totalTyped === 0) {
      setAccuracy(100);
      return;
    }

    const correct = totalTyped - errors;
    const acc = Math.round((correct / totalTyped) * 100);
    setAccuracy(acc);
  }, [totalTyped, errors]);

  return { wpm, accuracy };
}