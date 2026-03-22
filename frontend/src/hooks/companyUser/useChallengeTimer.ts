import { useEffect } from "react";

interface UseChallengeTimerProps {
  startedAt: string | undefined;
  duration: number | undefined;
  countDown: number | undefined;
  isFinished: boolean;
  setPhase: (phase: "COUNTDOWN" | "PLAY") => void;
  setCountdown: (v: number) => void;
  setRemainingTime: (v: number) => void;
  setElapsedTime: (v: number) => void;
  setIsFinished: (v: boolean) => void;
}

export function useChallengeTimer({
  startedAt,
  duration,
  countDown,
  isFinished,
  setPhase,
  setCountdown,
  setRemainingTime,
  setElapsedTime,
  setIsFinished,
}: UseChallengeTimerProps) {
  useEffect(() => {
    if (!startedAt || !duration || countDown === undefined) return;

    const startTimestamp = new Date(startedAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimestamp) / 1000);

      if (elapsed < countDown) {
        setPhase("COUNTDOWN");
        setCountdown(countDown - elapsed);
      } else if (elapsed < countDown + duration) {
        setPhase("PLAY");
        setRemainingTime(countDown + duration - elapsed);
        setElapsedTime(elapsed - countDown);
      } else {
        setPhase("PLAY");
        setRemainingTime(0);
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, duration, countDown, isFinished]);
}