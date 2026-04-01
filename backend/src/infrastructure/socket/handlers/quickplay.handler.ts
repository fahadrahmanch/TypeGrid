import { Socket, Server } from "socket.io";
import { injectQuickSocketController } from "../../../presentation/DI/socket.di";
import redis from "../../../config/redis";
import { checkQuickGameEndService } from "../../../application/services/game-result.service";

function calculateStats({
  totalTyped,
  errors,
  timeTaken,
}: {
  totalTyped: number;
  errors: number;
  timeTaken: number;
}) {
  const correctChars = Math.max(totalTyped - errors, 0);
  const minutes = Math.max(timeTaken / 60, 0.01);

  const wpm = Math.round(correctChars / 5 / minutes);
  const accuracy =
    totalTyped === 0 ? 0 : Math.round((correctChars / totalTyped) * 100);

  return { wpm, accuracy };
}

export const quickplayHandlers = (socket: Socket, io: Server) => {
  /* ===================== QUICK PLAY ===================== */

  socket.on("quick-join", async ({ competitionId, userId }) => {
    if (!competitionId || !userId) {
      socket.emit("quick-join-error", { message: "Invalid data" });
      socket.emit("force-exit-quick");
      return;
    }

    // ← ADD THIS BLOCK
    const key = `quick:game:${competitionId}`;
    const raw = await redis.hget(key, userId);

    if (raw) {
      const data = JSON.parse(raw);
      if (data.status === "LEFT") {
        socket.emit("force-exit-quick");
        return;
      }
    }
    // ← END OF NEW BLOCK

    if (socket.data.quickGameId && socket.data.quickGameId !== competitionId) {
      socket.leave(socket.data.quickGameId);
    }
    socket.join(competitionId);
    socket.data.quickGameId = competitionId;
    socket.data.userId = userId;

    let member;
    try {
      member = await injectQuickSocketController.getQuickPlayData(
        competitionId,
        userId,
      );
      const existing = await redis.hget(key, userId);
      if (!existing) {
        await redis.hset(
          key,
          userId,
          JSON.stringify({
            wpm: 0,
            accuracy: 100,
            errors: 0,
            typedLength: 0,
            status: "PLAYING",
            updatedAt: Date.now(),
          }),
        );
        await redis.expire(key, 3600);
      }
    } catch (error) {
      socket.emit("quick-join-error", {
        message: "Unable to join quick play",
      });
      return;
    }

    io.to(competitionId).emit("user-join", { member });
  });

  socket.on("typing-progress-quick", async (data) => {
    const { userId, wpm, accuracy, errors, typedLength } = data;
    const gameId = socket.data.quickGameId;
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
      const gameId = socket.data.quickGameId;
      if (!gameId) return;
      const key = `quick:game:${gameId}`;

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
      const gameId = socket.data.quickGameId;
      if (!gameId) return;
      const key = `quick:game:${gameId}`;
      const raw = await redis.hget(key, userId);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.status === "FINISHED") return;
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

  socket.on("leave-game-quick", async ({ gameId, userId }) => {
    socket.data.quickGameId = undefined;
    const key = `quick:game:${gameId}`;

    await redis.hdel(key, userId);

    socket.leave(gameId);
    io.to(gameId).emit("player-left-quick", { userId });

    const players = await redis.hlen(key);
    await injectQuickSocketController.leaveQuickPlay(gameId, userId);
    if (players === 0) {
      await redis.del(key);
    }
  });

  socket.on("disconnect", async () => {
    if (socket.data.quickGameId && socket.data.userId) {
      const gameId = socket.data.quickGameId;
      const userId = socket.data.userId;
      const key = `quick:game:${gameId}`;
      const raw = await redis.hget(key, userId);
      if (raw) {
        const data = JSON.parse(raw);
        await redis.hset(
          key,
          userId,
          JSON.stringify({ ...data, status: "LEFT" }),
        );
      }
      io.to(gameId).emit("player-left-quick", { userId });

      const all = await redis.hgetall(key);
      const activePlayers = Object.values(all)
        .map((v) => JSON.parse(v))
        .filter((p) => p.status !== "LEFT");
      await injectQuickSocketController.leaveQuickPlay(gameId, userId);
      if (activePlayers.length === 0) {
        await redis.expire(key, 60);
      }
    }
  });
};
