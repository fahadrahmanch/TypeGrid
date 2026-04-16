import { useEffect } from "react";

export function useGameTimer(
  gameData: any,
  finalResult: any[],
  setPhase: any,
  setCountdown: any,
  setRemainingTime: any,
  setElapsedTime: any,
  setIsfinished: any
) {
  useEffect(() => {
    if (!gameData?.startedAt || !gameData?.duration || finalResult.length) return;

    const startTimestamp = new Date(gameData.startedAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimestamp) / 1000);

      if (elapsed < gameData.countDown) {
        setPhase("COUNTDOWN");
        setCountdown(gameData.countDown - elapsed);
      } else if (elapsed < gameData.countDown + gameData.duration) {
        setPhase("PLAY");
        setRemainingTime(gameData.countDown + gameData.duration - elapsed);
        setElapsedTime(elapsed - gameData.countDown);
      } else {
        setPhase("PLAY");
        setRemainingTime(0);
        setIsfinished(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameData?.startedAt, gameData?.duration, gameData?.countDown, finalResult]);
}
