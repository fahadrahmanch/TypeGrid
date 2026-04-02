import { useState, useEffect } from "react";

export function useContestTimer(
  startTime: string | undefined,
  duration: number | undefined,
  countDownDuration: number | undefined,
  isFinished: boolean,
) {
  const [countdown, setCountdown] = useState<number>(countDownDuration || 10);
  const [remainingTime, setRemainingTime] = useState<number>(
    Number(duration || 0),
  );
  const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    if (!startTime || duration === undefined || countDownDuration === undefined)
      return;
    const startTimesamp = new Date(startTime).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimesamp) / 1000);

      if (elapsed < countDownDuration) {
        setPhase("COUNTDOWN");
        setCountdown(countDownDuration - elapsed);
      } else if (elapsed < countDownDuration + duration) {
        setPhase("PLAY");
        setRemainingTime(countDownDuration + duration - elapsed);
        setElapsedTime(elapsed - countDownDuration);
      } else {
        setPhase("PLAY");
        setRemainingTime(0);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, duration, countDownDuration, isFinished]);

  return { countdown, remainingTime, phase, elapsedTime, setElapsedTime };
}
