import { useEffect } from "react";
import { socket } from "../../socket";

interface Props {
  gameData: any;
  currentUser: any;

  typedText: string;
  wpm: number;
  accuracy: number | null;
  errors: number;

  phase: "COUNTDOWN" | "PLAY";
  remainingTime: number;
  elapsedTime: number;

  navigate: any;

  gameIdRef: React.MutableRefObject<string | undefined>;
  userIdRef: React.MutableRefObject<string | undefined>;

  setLivePlayers: any;
  setLeftPlayers: any;
  setFinalResult: any;
  setIsfinished: React.Dispatch<React.SetStateAction<boolean>>;
  hasJoinedRef: React.MutableRefObject<boolean>;
}

export const useGroupPlaySocket = ({
  gameData,
  currentUser,
  typedText,
  wpm,
  accuracy,
  errors,
  phase,
  remainingTime,
  elapsedTime,
  navigate,
  gameIdRef,
  userIdRef,
  setLivePlayers,
  setLeftPlayers,
  setFinalResult,
  setIsfinished,
  hasJoinedRef,
}: Props) => {
  // leave game when component unmounts
  useEffect(() => {
    return () => {
      if (gameIdRef.current && userIdRef.current) {
        socket.emit("leave-game", {
          gameId: gameIdRef.current,
          userId: userIdRef.current,
        });
      }
    };
  }, []);

  // typing progress update from other players
  useEffect(() => {
    const handler = (data: any) => {
      setLivePlayers((prev: any) =>
        prev.map((p: any) =>
          p._id === data.userId
            ? { ...p, ...data, progress: data.typedLength }
            : p,
        ),
      );
    };

    // socket.off("typing-progress-update");
    socket.on("typing-progress-update", handler);

    return () => {
      socket.off("typing-progress-update", handler);
    };
  }, [gameData?._id]);

  // join game room
  useEffect(() => {
    if (!gameData?._id || !currentUser?._id) return;

    socket.emit("group-play", {
      gameId: gameData._id,
      userId: currentUser._id,
    });
    hasJoinedRef.current = true;
  }, [gameData?._id, currentUser?._id]);

  // force exit
  useEffect(() => {
    socket.on("force-exit", () => {
      navigate("/");
    });

    return () => {
      socket.off("force-exit");
    };
  }, []);

  // handle player leave
  useEffect(() => {
    const handleLeave = ({
      userId,
      newHostId,
    }: {
      userId: string;
      newHostId?: string;
    }) => {
      let leavingPlayer: any = null;

      setLivePlayers((prev: any) => {
        leavingPlayer = prev.find((p: any) => p._id === userId);

        if (!leavingPlayer) return prev;

        if (leavingPlayer) {
          setLeftPlayers((prev: any) => {
            if (prev.some((p: any) => p._id === leavingPlayer._id)) return prev;
            return [...prev, leavingPlayer];
          });
        }

        return prev
          .filter((p: any) => p._id !== userId)
          .map((p: any) => ({
            ...p,
            isHost: p._id === newHostId,
          }));
      });
    };

    socket.on("player-left", handleLeave);

    return () => {
      socket.off("player-left", handleLeave);
    };
  }, []);

  // time up
  useEffect(() => {
    if (remainingTime === 0) {
      setIsfinished(true);

      socket.emit("time-up", {
        gameId: gameData?._id,
        userId: currentUser?._id,
        name: currentUser?.name,
        imageUrl: currentUser?.imageUrl,
        timeTaken: elapsedTime,
        wpm,
        accuracy,
        errors,
        typedLength: typedText.length,
        status: "times-up",
      });
    }

    return () => {
      socket.off("time-up");
    };
  }, [remainingTime]);

  // game finished
  useEffect(() => {
    socket.on("game-finished", (data: any) => {
      setFinalResult(data);
    });

    return () => {
      socket.off("game-finished");
    };
  }, [gameData?._id]);

  // send typing progress
  useEffect(() => {
    if (!gameData?._id || !currentUser) return;
    if (phase !== "PLAY") return;

    socket.emit("typing-progress", {
      gameId: gameData._id,
      userId: currentUser._id,
      typedLength: typedText.length,
      wpm,
      accuracy,
      errors,
    });
  }, [typedText, wpm, accuracy, errors, phase]);
};
