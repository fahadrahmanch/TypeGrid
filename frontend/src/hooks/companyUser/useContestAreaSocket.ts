import { useEffect, Dispatch, SetStateAction, MutableRefObject } from "react";
import { socket } from "../../socket";
import { LivePlayer, GamePlayerResult } from "../../types/contest";
interface UseContestSocketProps {
  contestId?: string;
  user: any;

  contestData: any;
  phase: "COUNTDOWN" | "PLAY";
  typedText: string;
  wpm: number;
  accuracy: number | null;
  errors: number;
  remainingTime: number;
  elapsedTime: number;
  totalTyped: number;

  gameIdRef: MutableRefObject<string | undefined>;
  userIdRef: MutableRefObject<string | undefined>;

  setLivePlayers: Dispatch<SetStateAction<LivePlayer[]>>;
  setFinalResult: Dispatch<SetStateAction<GamePlayerResult[]>>;
  setContestData: Dispatch<SetStateAction<any>>;

  setTypedText: Dispatch<SetStateAction<string>>;
  setErrors: Dispatch<SetStateAction<number>>;
  setTotalTyped: Dispatch<SetStateAction<number>>;
  setElapsedTime: Dispatch<SetStateAction<number>>;
  setIsFinished: Dispatch<SetStateAction<boolean>>;
  finalResult: GamePlayerResult[];
}

export const useContestSocket = ({
  contestId,
  user,
  contestData,
  phase,
  typedText,
  wpm,
  accuracy,
  errors,
  remainingTime,
  elapsedTime,
  totalTyped,
  gameIdRef,
  userIdRef,
  setLivePlayers,
  setFinalResult,
  setContestData,
  setTypedText,
  setErrors,
  setTotalTyped,
  setElapsedTime,
  setIsFinished,
  finalResult,
}: UseContestSocketProps) => {
  // join contest
  useEffect(() => {
    if (!contestId || !user?._id) return;

    const handleLobbyUpdate = (data: LivePlayer[]) => {
      setLivePlayers(data);
    };

    socket.on("contest-game-players", handleLobbyUpdate);

    socket.emit("join-companyContest-game", {
      contestId,
      user,
    });

    return () => {
      socket.off("contest-game-players", handleLobbyUpdate);
    };
  }, [contestId, user?._id]);

  // leave contest
  useEffect(() => {
    return () => {
      if (gameIdRef.current && userIdRef.current) {
        socket.emit("leave-companyContest-game", {
          contestId: gameIdRef.current,
          userId: userIdRef.current,
        });
      }
    };
  }, []);

  // users update
  useEffect(() => {
    if (!contestId || !user?._id) return;

    const handler = (data: LivePlayer[]) => {
      setLivePlayers(data);
    };

    socket.on("contest-users-update", handler);

    return () => {
      socket.off("contest-users-update", handler);
    };
  }, [contestId, user?._id]);

  // typing progress update from other players
  useEffect(() => {
    const handler = (data: any) => {
      setLivePlayers((prev) =>
        prev.map((p) => (p.userId === data.userId ? { ...p, ...data, progress: data.typedLength } : p))
      );
    };

    socket.off("typing-progress-update-contest");
    socket.on("typing-progress-update-contest", handler);

    return () => {
      socket.off("typing-progress-update-contest", handler);
    };
  }, []);

  // game finished
  useEffect(() => {
    socket.on("game-finished-contest", (data: GamePlayerResult[]) => {
      setFinalResult(data);
    });

    return () => {
      socket.off("game-finished-contest");
    };
  }, []);

  useEffect(() => {
    if (finalResult.length > 0) {
      setIsFinished(true);
    }
  }, [finalResult]);

  // restart contest
  useEffect(() => {
    const handleRestart = (data: any) => {
      setFinalResult([]);

      setTypedText("");
      setErrors(0);
      setTotalTyped(0);
      setElapsedTime(0);
      setIsFinished(false);

      if (Array.isArray(data.users)) {
        setLivePlayers(data.users);
      }

      if (data.newStartTime) {
        setContestData((prev: any) => ({
          ...prev,
          startTime: data.newStartTime,
        }));
      }
    };

    socket.on("contest-restarted", handleRestart);

    return () => {
      socket.off("contest-restarted", handleRestart);
    };
  }, []);

  // send typing progress
  useEffect(() => {
    if (!contestData?._id || !user) return;
    if (phase !== "PLAY") return;

    socket.emit("typing-progress-contest", {
      contestId: contestData._id,
      userId: user._id,
      typedLength: typedText.length,
      wpm,
      status: "PLAYING",
      accuracy,
      errors,
    });
  }, [typedText, wpm, accuracy, errors, phase]);

  // time up
  useEffect(() => {
    if (remainingTime === 0) {
      setIsFinished(true);

      socket.emit("time-up-contest", {
        contestId: contestData?._id,
        userId: user?._id,
        name: user?.name,
        imageUrl: user?.imageUrl,
        timeTaken: elapsedTime,
        wpm,
        accuracy,
        errors,
        typedLength: typedText.length,
        totalTyped,
        status: "times-up",
      });
    }

    return () => {
      socket.off("time-up-contest");
    };
  }, [remainingTime]);
};
