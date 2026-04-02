import { useEffect } from "react";
type UseSoloGameTimerProps = {
  gameData: any;
  isFinished: boolean;
  space: boolean;
  startTimeRef: React.MutableRefObject<number | null>;
  playStartRef: React.MutableRefObject<number | null>;
  setPhase: React.Dispatch<React.SetStateAction<"COUNTDOWN" | "PLAY">>;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
  setIsfinished: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useSoloGameTimer = ({
  gameData,
  isFinished,
  space,
  startTimeRef,
  playStartRef,
  setPhase,
  setCountdown,
  setRemainingTime,
  setElapsedTime,
  setIsfinished,
}: UseSoloGameTimerProps) => {
  useEffect(() => {
    if (!gameData?.startedAt || !gameData?.duration || isFinished) return;
    if (!space || !startTimeRef.current) return;

    const startTime = startTimeRef.current;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);

      setElapsedTime(elapsed);

      if (elapsed < gameData.countDown) {
        setPhase("COUNTDOWN");
        setCountdown(gameData.countDown - elapsed);
      } else if (elapsed < gameData.countDown + gameData.duration) {
        setPhase("PLAY");

        if (playStartRef.current === null) {
          playStartRef.current = Date.now();
        }

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
  }, [
    gameData?.startedAt,
    gameData?.duration,
    gameData?.countDown,
    isFinished,
    space,
  ]);
};
