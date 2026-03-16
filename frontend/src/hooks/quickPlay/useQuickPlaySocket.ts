import { useEffect, useRef } from "react";
import { socket } from "../../socket";
import { GamePlayerResult } from "../../pages/user/quick-play/quickPlay";
import { current } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const useQuickPlaySocket = (
  gameData: any,
  // currentUser: any,
  typedText: string,
  wpm: number,
  accuracy: number | null,
  errors: number,
  phase: "COUNTDOWN" | "PLAY",
  setLivePlayers: any,
  setFinalResult: React.Dispatch<React.SetStateAction<GamePlayerResult[]>>,
  navigate: any,
  remainingTime: number,
  setIsfinished: React.Dispatch<React.SetStateAction<boolean>>,
  elapsedTime: number,
  totalTyped: number,
  gameIdRef: React.MutableRefObject<string | undefined>,
  userIdRef: React.MutableRefObject<string | undefined>,
) => {
    const user = useSelector((state: any) => state.userAuth.user);


  // send live stats
  useEffect(() => {
    if (!gameData?._id || !user) return;
    if (phase !== "PLAY") return;

    socket.emit("typing-progress-quick", {
      gameId: gameData._id,
      userId: user._id,
      typedLength: typedText.length,
      wpm,
      status: "PLAYING",
      accuracy,
      errors,
    });
  }, [typedText, wpm, accuracy, errors, phase]);

  // typing progress update
  useEffect(() => {
    const handler = (data: any) => {
      setLivePlayers((prev: any) =>
        prev.map((p: any) =>
          p._id === data.userId
            ? { ...p, ...data, progress: data.typedLength }
            : p
        )
      );
    };

    socket.off("typing-progress-update-quick");
    socket.on("typing-progress-update-quick", handler);

    return () => {
      socket.off("typing-progress-update-quick", handler);
    };
  }, [gameData?._id]);

  // quick join
  useEffect(() => {
    if (!gameData) return;
  
    socket.emit("quick-join", {
      competitionId: gameData._id,
      userId: user?._id,
    });
  }, [gameData, user]);
  useEffect(() => {
    socket.on("force-exit-quick", () => {
      navigate('/', { replace: true });
    });

    return () => {socket.off("force-exit-quick")};
}, []);

  // user join
  useEffect(() => {
    const handleUserJoin = (data: any) => {
      setLivePlayers((prev: any) => {
        const exists = prev.some(
          (player: any) => player._id === data.member._id
        );

        if (exists) return prev;

        return [...prev, data.member];
      });
    };

    socket.on("user-join", handleUserJoin);

    return () => {
      socket.off("user-join", handleUserJoin);
    };
  }, []);

  // game finished
  useEffect(() => {
    socket.on("game-finished-quick", (data: GamePlayerResult[]) => {
      setFinalResult(data);
    });

    return () => {
      socket.off("game-finished-quick");
    };
  }, [gameData?._id]);

  // force exit
  // useEffect(() => {
  //   socket.on("force-exit-quick", () => {
  //     navigate("/");
  //   });

  //   return () => {
  //     socket.off("force-exit-quick");
  //   };
  // }, []);
  useEffect(() => {
    if (remainingTime === 0) {
      setIsfinished(true);
      socket.emit("time-up-quick", {
        gameId: gameData?._id,
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
      socket.off("time-up-quick");
    };
  }, [remainingTime]);

  // 3. Handle Component Unmount (Navigation/Back Button)
  const mountedRef = useRef(false);

  useEffect(() => {
     if (!mountedRef.current) {
    mountedRef.current = true;
    return;
  }
    return () => {
       if (!mountedRef.current) return;
      if (gameIdRef.current && userIdRef.current) {
        // Emit event to server that this user is leaving
        socket.emit("leave-game-quick", {
          gameId: gameIdRef.current,
          userId: userIdRef.current,
        });
      }
    };
  }, []);
const userRef = useRef(user);
const gameDataRef = useRef(gameData);

useEffect(() => {
  userRef.current = user;
}, [user]);

useEffect(() => {
  gameDataRef.current = gameData;
}, [gameData]);

useEffect(() => {
  const handler = ({ userId }: any) => {

    setLivePlayers((prev: any) =>
      prev.filter((p: any) => p._id !== userId)
    );
    if(userId === user?._id){
      navigate('/', { replace: true });
    }
  };
  

  socket.on("player-left-quick", handler);

  return () => {
    socket.off("player-left-quick", handler);
  };
}, []);


};
