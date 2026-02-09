import { Server } from "socket.io";
import { injectGroupSocketController } from "../../presentation/DI/socketDI";
import { injectQuickSocketController } from "../../presentation/DI/socketDI";
import redis from "../../config/redis";
import { checkGameEndService,checkQuickGameEndService } from "../../application/services/gameResultService";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //group play and groups features

    socket.on(
      "join-room",
      ({ groupId, userId }: { groupId: string; userId: string }) => {
        socket.join(groupId);
        socket.data.groupId = groupId;
        socket.data.userId = userId;
      },
    );

    socket.on(
      "group-play",
      async (Competition: { gameId: string; userId: string }) => {
        if (socket.data.gameId) {
          socket.leave(socket.data.gameId);
        }
        const member = await injectGroupSocketController.getGroup(
          Competition.gameId,
          Competition.userId,
        );
        if (!member) {
          socket.emit("force-exit");
          return;
        }

        socket.join(Competition.gameId);
        socket.data.gameId = Competition.gameId;
      },
    );

    socket.on("typing-progress", async (data) => {
      const { userId, wpm, accuracy, errors, typedLength } = data;
      const gameId = socket.data.gameId;
      if (!gameId) return;

      const key = `game:${gameId}`;

      const raw = await redis.hget(key, userId);

      if (raw) {
        const existing = JSON.parse(raw);
        if (existing.status === "FINISHED" || existing.status === "TIMES_UP") {
          return;
        }
      }
      await redis.hset(
        key,
        userId,
        JSON.stringify({
          wpm,
          accuracy,
          errors,
          typedLength,
          status: "PLAYING",
          updatedAt: Date.now(),
        }),
      );
      await redis.expire(key, 600);

      socket.to(gameId).emit("typing-progress-update", data);
    });


    socket.on(
      "player-finished",
      async ({
        userId,
        name,
        imageUrl,
        timeTaken,
        wpm,
        accuracy,
        errors,
        typedLength,
      }) => {
        const gameId = socket.data.gameId;
        if (!gameId) return;
        const key = `game:${gameId}`;

        const raw = await redis.hget(key, userId);
        if (!raw) return;

        const data = JSON.parse(raw);

        await redis.hset(
          key,
          userId,
          JSON.stringify({
            ...data,
            name,
            imageUrl,
            status: "FINISHED",
            timeTaken,
            wpm,
            accuracy,
            errors,
            typedLength,
          }),
        );
        const isEnd = await checkGameEndService(gameId);
        if (isEnd) {
          const result = await redis.hgetall(key);
          const resultArray = Object.entries(result)
            .map(([userId, value]) => ({
              userId,
              ...JSON.parse(value),
            }))
            .sort((a, b) => {
              if (a.status !== b.status) {
                if (a.status === "FINISHED") return -1;
                if (b.status === "FINISHED") return 1;
              }

              if (a.status === "FINISHED" && b.status === "FINISHED") {
                if (a.timeTaken !== b.timeTaken) {
                  return a.timeTaken - b.timeTaken;
                }

                if ((a.accuracy ?? 0) !== (b.accuracy ?? 0)) {
                  return (b.accuracy ?? 0) - (a.accuracy ?? 0);
                }

                return 0;
              }

              if (a.status === "TIMES_UP" && b.status === "TIMES_UP") {
                if (a.typedLength !== b.typedLength) {
                  return b.typedLength - a.typedLength;
                }

                return (b.accuracy ?? 0) - (a.accuracy ?? 0);
              }

              return 0;
            })

            .map((player, index) => ({
              ...player,
              rank: index + 1,
            }));
          io.to(gameId).emit("game-finished", resultArray);
          await redis.del(key);
          await injectGroupSocketController.saveGroupPlayResult(
            gameId,
            resultArray,
          );
        }
      },
    );

    socket.on(
      "time-up",
      async ({
        userId,
        name,
        imageUrl,
        timeTaken,
        wpm,
        accuracy,
        errors,
        typedLength,
      }) => {
        const gameId = socket.data.gameId;
        if (!gameId) return;
        const key = `game:${gameId}`;
        const raw = await redis.hget(key, userId);
        if (!raw) return;

        const data = JSON.parse(raw);

        await redis.hset(
          key,
          userId,
          JSON.stringify({
            ...data,
            name,
            imageUrl,
            status: "TIMES_UP",
            timeTaken,
            wpm,
            accuracy,
            errors,
            typedLength,
          }),
        );
        const isEnd = await checkGameEndService(gameId);

        if (isEnd) {
          const result = await redis.hgetall(key);
          const resultArray = Object.entries(result)
            .map(([userId, value]) => ({
              userId,
              ...JSON.parse(value),
            }))
            .sort((a, b) => {
              if (a.status !== b.status) {
                if (a.status === "FINISHED") return -1;
                if (b.status === "FINISHED") return 1;
              }

              if (a.status === "FINISHED" && b.status === "FINISHED") {
                if (a.timeTaken !== b.timeTaken) {
                  return a.timeTaken - b.timeTaken;
                }

                if ((a.accuracy ?? 0) !== (b.accuracy ?? 0)) {
                  return (b.accuracy ?? 0) - (a.accuracy ?? 0);
                }

                return 0;
              }

              if (a.status === "TIMES_UP" && b.status === "TIMES_UP") {
                if (a.typedLength !== b.typedLength) {
                  return b.typedLength - a.typedLength;
                }

                return (b.accuracy ?? 0) - (a.accuracy ?? 0);
              }

              return 0;
            })

            .map((player, index) => ({
              ...player,
              rank: index + 1,
            }));
          io.to(gameId).emit("game-finished", resultArray);
          await redis.del(key);
          await injectGroupSocketController.saveGroupPlayResult(
            gameId,
            resultArray,
          );
        }
      },
    );

    // in group playp
    socket.on("leave-group", async ({ groupId, userId }) => {
      socket.data.groupId = groupId;
      socket.data.userId = userId;
      await injectGroupSocketController.groupLeave(socket, io);
      socket.leave(groupId);
    });
    socket.on("leave-game", async ({ gameId, userId }) => {
      await injectGroupSocketController.handleDisconnect(socket, io);
      socket.leave(gameId);
    });


  /* ===================== QUICK PLAY ===================== */

  //join quick play


socket.on("quick-join", async ({ competitionId, userId }) => {
    if (!competitionId || !userId) {
    socket.emit("quick-join-error", { message: "Invalid data" });
    return;
  }
   if (socket.data.gameId && socket.data.gameId !== competitionId) {
      socket.leave(socket.data.gameId);
    }
  // 1. join room first
  socket.join(competitionId);
  socket.data.gameId = competitionId;
  socket.data.userId = userId;
  let member
  try {
     member =
      await injectQuickSocketController.getQuickPlayData(
        competitionId,
        userId
      );

  

  } catch (error) {
    console.log("Error in quick-join:", error);
    socket.emit("quick-join-error", {
      message: "Unable to join quick play",
    });
    return
  }

    // socket.emit("quick-join-success", { member });

  socket.to(competitionId).emit("user-join", { member });
});



    socket.on("typing-progress-quick", async (data) => {
      const { userId, wpm, accuracy, errors, typedLength } = data;
      const gameId = socket.data.gameId;
      if (!gameId) return;

      const key = `quick:game:${gameId}`;

      const raw = await redis.hget(key, userId);

      if (raw) {
        const existing = JSON.parse(raw);
        if (existing.status === "FINISHED" || existing.status === "TIMES_UP") {
          return;
        }
      }
      await redis.hset(
        key,
        userId,
        JSON.stringify({
          wpm,
          accuracy,
          errors,
          typedLength,
          status: "PLAYING",
          updatedAt: Date.now(),
        }),
      );
      await redis.expire(key, 600);

      socket.to(gameId).emit("typing-progress-update-quick", data);
    });


  socket.on(
      "player-finished-quick-play",
      async ({
        userId,
        name,
        imageUrl,
        timeTaken,
        totalTyped,
        errors,
        typedLength,
      }) => {
        const gameId = socket.data.gameId;
        if (!gameId) return;
        const key = `quick:game:${gameId}`

        const raw = await redis.hget(key, userId);
        if (!raw) return;

        const data = JSON.parse(raw);
  const { wpm, accuracy } = calculateStats({
      totalTyped,
      errors,
      timeTaken,
    });
        await redis.hset(
          key,
          userId,
          JSON.stringify({
            ...data,
            name,
            imageUrl,
            status: "FINISHED",
            timeTaken,
            wpm,
            accuracy,
            errors,
            typedLength,
          }),
        );
        const isEnd = await checkQuickGameEndService(gameId);
        if (isEnd) {
          const result = await redis.hgetall(key);
          const resultArray = Object.entries(result)
            .map(([userId, value]) => ({
              userId,
              ...JSON.parse(value),
            }))
            .sort((a, b) => {
              if (a.status !== b.status) {
                if (a.status === "FINISHED") return -1;
                if (b.status === "FINISHED") return 1;
              }

              if (a.status === "FINISHED" && b.status === "FINISHED") {
                if (a.timeTaken !== b.timeTaken) {
                  return a.timeTaken - b.timeTaken;
                }

                if ((a.accuracy ?? 0) !== (b.accuracy ?? 0)) {
                  return (b.accuracy ?? 0) - (a.accuracy ?? 0);
                }

                return 0;
              }

              if (a.status === "TIMES_UP" && b.status === "TIMES_UP") {
                if (a.typedLength !== b.typedLength) {
                  return b.typedLength - a.typedLength;
                }

                return (b.accuracy ?? 0) - (a.accuracy ?? 0);
              }

              return 0;
            })

            .map((player, index) => ({
              ...player,
              rank: index + 1,
            }));
          io.to(gameId).emit("game-finished-quick", resultArray);
          await redis.del(key);
          await injectQuickSocketController.saveQuickPlayResult(
            gameId,
            resultArray,
          );
        }
      },
    );

      socket.on(
      "time-up-quick",
      async ({
        userId,
        name,
        imageUrl,
        timeTaken,
        totalTyped,
        errors,
        typedLength,
      }) => {
        const gameId = socket.data.gameId;
        if (!gameId) return;
        const key = `quick:game:${gameId}`
        const raw = await redis.hget(key, userId);
        if (!raw) return;
        const data = JSON.parse(raw);
if(data.status==="FINISHED")return
          const { wpm, accuracy } = calculateStats({
      totalTyped, 
      errors,
      timeTaken,
    });

        await redis.hset(
          key,
          userId,
          JSON.stringify({
            ...data,
            name,
            imageUrl,
            status: "TIMES_UP",
            timeTaken,
            wpm,
            accuracy,
            errors,
            typedLength,
          }),
        );
        const isEnd = await checkQuickGameEndService(gameId);
        if (isEnd) {
          const result = await redis.hgetall(key);
          const resultArray = Object.entries(result)
            .map(([userId, value]) => ({
              userId,
              ...JSON.parse(value),
            }))
            .sort((a, b) => {
              if (a.status !== b.status) {
                if (a.status === "FINISHED") return -1;
                if (b.status === "FINISHED") return 1;
              }

              if (a.status === "FINISHED" && b.status === "FINISHED") {
                if (a.timeTaken !== b.timeTaken) {
                  return a.timeTaken - b.timeTaken;
                }

                if ((a.accuracy ?? 0) !== (b.accuracy ?? 0)) {
                  return (b.accuracy ?? 0) - (a.accuracy ?? 0);
                }

                return 0;
              }

              if (a.status === "TIMES_UP" && b.status === "TIMES_UP") {
                if (a.typedLength !== b.typedLength) {
                  return b.typedLength - a.typedLength;
                }

                return (b.accuracy ?? 0) - (a.accuracy ?? 0);
              }

              return 0;
            })

            .map((player, index) => ({
              ...player,
              rank: index + 1,
            }));
          io.to(gameId).emit("game-finished-quick", resultArray);
          await redis.del(key);
          await injectQuickSocketController.saveQuickPlayResult(
            gameId,
            resultArray,
          );
        }
      },
    );








    socket.on("disconnect", async () => {
      // if (!socket.data.groupId || !socket.data.userId) {
      //   return;
      // }
      // await injectGroupSocketController.handleDisconnect(socket, io);
      if (socket.data.groupId && socket.data.userId) {
        await injectGroupSocketController.handleDisconnect(socket, io);
      }

    });
  });
};
export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

function calculateStats({
  totalTyped,
  errors,
  timeTaken,
}: {
  totalTyped: number;
  errors: number;
  timeTaken: number; // seconds
}) {
  const correctChars = Math.max(totalTyped - errors, 0);
  const minutes = Math.max(timeTaken / 60);

  const wpm = Math.round((correctChars / 5) / minutes);
  const accuracy =
    totalTyped === 0
      ? 0
      : Math.round((correctChars / totalTyped) * 100);

  return { wpm, accuracy };
}
 
  // useEffect(() => {
  //       if (phase !== "PLAY" || isFinished) return;
  //       if (elapsedTime <= 0) return;

  //       const elapsedMinutes = elapsedTime / 60;
  //       const correctChars = Math.max(totalTyped - errors, 0);

  //       const calculatedWpm = Math.round((correctChars / 5) / elapsedMinutes);

  //       setWpm(calculatedWpm);
  //   }, [elapsedTime, totalTyped, errors, phase, isFinished]);
