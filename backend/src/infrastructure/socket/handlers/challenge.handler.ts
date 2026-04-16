import { Socket, Server } from 'socket.io';
import { injectChallengeSocketController } from '../../../presentation/DI/socket.di';
import redis from '../../../config/redis';
import { checkChallengeGameEndService } from '../../../application/services/game-result.service';

function calculateStats({ totalTyped, errors, timeTaken }: { totalTyped: number; errors: number; timeTaken: number }) {
  const correctChars = Math.max(totalTyped - errors, 0);
  const minutes = Math.max(timeTaken / 60, 0.01);

  const wpm = Math.round(correctChars / 5 / minutes);
  const accuracy = totalTyped === 0 ? 0 : Math.round((correctChars / totalTyped) * 100);

  return { wpm, accuracy };
}

export const challengeHandlers = (socket: Socket, io: Server) => {
  /* ===================== 1V1 CHALLENGE ===================== */

  socket.on('challenge-accepted', ({ challengeId, senderId }) => {
    io.to(`user:${senderId}`).emit('challenge-status-updated', {
      challengeId,
      status: 'accepted',
    });
  });

  socket.on('join-match', async ({ challengeId, receiverId }) => {
    if (socket.data.challengeId) {
      socket.leave(socket.data.challengeId);
    }
    socket.data.challengeId = challengeId;
    socket.join(challengeId);
    const room = io.sockets.adapter.rooms.get(challengeId);
    if (room && room.size === 2) {
      await injectChallengeSocketController.execute(challengeId);
      io.to(challengeId).emit('start-match', { challengeId });
    } else {
      io.to(`user:${receiverId}`).emit('waiting-for-opponent', { challengeId });
    }
  });

  /* ===================== 1V1 CHALLENGE AREA ===================== */
  socket.on('challenge-join', async ({ challengeId, userId, name, imageUrl }) => {
    const key = `challenge:game:${challengeId}`;

    const isFinished = await redis.exists(`challenge:finished:${challengeId}`);
    if (isFinished) {
      socket.emit('challenge-already-finished');
      return;
    }

    if (socket.data.challengeId) {
      socket.leave(socket.data.challengeId);
    }
    socket.data.challengeId = challengeId;
    socket.data.userId = userId;
    socket.join(challengeId);

    const existing = await redis.hget(key, userId);
    if (!existing) {
      await redis.hset(
        key,
        userId,
        JSON.stringify({
          name,
          imageUrl,
          wpm: 0,
          accuracy: 0,
          errors: 0,
          typedLength: 0,
          status: 'PLAYING',
          updatedAt: Date.now(),
        })
      );
      await redis.expire(key, 600);
    }
  });

  socket.on('typing-progress-challenge', async (data) => {
    const { userId, wpm, accuracy, errors, typedLength, timeTaken } = data;
    const gameId = socket.data.challengeId;
    if (!gameId) return;

    const key = `challenge:game:${gameId}`;

    const raw = await redis.hget(key, userId);
    if (raw) {
      const existing = JSON.parse(raw);
      if (existing.status === 'FINISHED' || existing.status === 'TIMES_UP') {
        return;
      }
      await redis.hset(
        key,
        userId,
        JSON.stringify({
          ...existing,
          wpm,
          accuracy,
          timeTaken,
          errors,
          typedLength,
          status: 'PLAYING',
          updatedAt: Date.now(),
        })
      );
    }
    await redis.expire(key, 600);
    io.to(gameId).emit('typing-progress-update-challenge', data);
  });

  socket.on(
    'player-finished-challenge',
    async ({ userId, name, imageUrl, timeTaken, totalTyped, errors, typedLength }) => {
      const gameId = socket.data.challengeId;
      if (!gameId) return;
      const key = `challenge:game:${gameId}`;

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
          status: 'FINISHED',
          timeTaken,
          wpm,
          accuracy,
          errors,
          typedLength,
        })
      );
      const isEnd = await checkChallengeGameEndService(gameId);
      if (isEnd) {
        const result = await redis.hgetall(key);
        const resultArray = Object.entries(result)
          .map(([userId, value]) => ({
            userId,
            ...JSON.parse(value),
          }))
          .sort((a, b) => {
            if (a.status !== b.status) {
              if (a.status === 'FINISHED') return -1;
              if (b.status === 'FINISHED') return 1;
            }

            if (a.status === 'FINISHED' && b.status === 'FINISHED') {
              if (a.timeTaken !== b.timeTaken) {
                return a.timeTaken - b.timeTaken;
              }

              if ((a.accuracy ?? 0) !== (b.accuracy ?? 0)) {
                return (b.accuracy ?? 0) - (a.accuracy ?? 0);
              }

              return 0;
            }

            if (a.status === 'TIMES_UP' && b.status === 'TIMES_UP') {
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
        io.to(gameId).emit('game-finished-challenge', resultArray);
        await redis.del(key);
        await injectChallengeSocketController.saveChallengePlayResult(gameId, resultArray);
      }
    }
  );
  socket.on('time-up-challenge', async ({ userId, name, imageUrl, timeTaken, totalTyped, errors, typedLength }) => {
    const gameId = socket.data.challengeId;
    if (!gameId) return;
    const key = `challenge:game:${gameId}`;
    const raw = await redis.hget(key, userId);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.status === 'FINISHED') return;
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
        status: 'TIMES_UP',
        timeTaken,
        wpm,
        accuracy,
        errors,
        typedLength,
      })
    );
    const isEnd = await checkChallengeGameEndService(gameId);
    if (isEnd) {
      const result = await redis.hgetall(key);
      const resultArray = Object.entries(result)
        .map(([userId, value]) => ({
          userId,
          ...JSON.parse(value),
        }))
        .sort((a, b) => {
          if (a.status !== b.status) {
            if (a.status === 'FINISHED') return -1;
            if (b.status === 'FINISHED') return 1;
          }

          if (a.status === 'FINISHED' && b.status === 'FINISHED') {
            if (a.timeTaken !== b.timeTaken) {
              return a.timeTaken - b.timeTaken;
            }

            if ((a.accuracy ?? 0) !== (b.accuracy ?? 0)) {
              return (b.accuracy ?? 0) - (a.accuracy ?? 0);
            }

            return 0;
          }

          if (a.status === 'TIMES_UP' && b.status === 'TIMES_UP') {
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
      io.to(gameId).emit('game-finished-challenge', resultArray);
      await redis.del(key);
      await injectChallengeSocketController.saveChallengePlayResult(gameId, resultArray);
    }
  });
  socket.on('leave-challenge', async ({ challengeId, userId }) => {
    const key = `challenge:game:${challengeId}`;

    const raw = await redis.hget(key, userId);
    if (raw) {
      const data = JSON.parse(raw);
      await redis.hset(key, userId, JSON.stringify({ ...data, status: 'LEFT' }));
    }

    const allEntries = await redis.hgetall(key);
    const resultArray = Object.entries(allEntries)
      .map(([userId, value]) => ({
        userId,
        ...JSON.parse(value),
      }))
      .sort((a, b) => {
        if (a.status === 'LEFT' && b.status !== 'LEFT') return 1;
        if (b.status === 'LEFT' && a.status !== 'LEFT') return -1;
        if (a.status === 'LEFT' && b.status === 'LEFT') return 0;

        if (a.status === 'FINISHED' && b.status !== 'FINISHED') return -1;
        if (b.status === 'FINISHED' && a.status !== 'FINISHED') return 1;

        if (a.status === 'FINISHED' && b.status === 'FINISHED') {
          if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken;
          return (b.accuracy ?? 0) - (a.accuracy ?? 0);
        }
        if (a.typedLength !== b.typedLength) return b.typedLength - a.typedLength;
        return (b.accuracy ?? 0) - (a.accuracy ?? 0);
      })
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
    await redis.set(`challenge:finished:${challengeId}`, '1', 'EX', 3600);
    io.to(challengeId).emit('game-finished-challenge', resultArray);

    await redis.del(key);
    await injectChallengeSocketController.saveChallengePlayResult(challengeId, resultArray);
  });
};
