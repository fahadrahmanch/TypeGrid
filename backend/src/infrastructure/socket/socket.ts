import { Server, Socket } from 'socket.io';
import logger from '../../utils/logger';
import redis from '../../config/redis';
import { groupHandlers } from './handlers/group.handler';
import { quickplayHandlers } from './handlers/quickplay.handler';
import { contestHandlers } from './handlers/contest.handler';
import { challengeHandlers } from './handlers/challenge.handler';

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    /* ===================== USER CONNECTION ===================== */
    socket.on('register-user', async (userId: string) => {
      socket.data.userId = userId;
      socket.join(`user:${userId}`);
      await redis.sadd('online:users', userId);
      io.emit('user-status-changed', {
        userId,
        status: 'online',
      });
    });

    socket.on('connect_error', (err) => {
      logger.error('Socket connection error', {
        error: err.message,
        stack: err.stack,
      });
    });

    groupHandlers(socket, io);
    quickplayHandlers(socket, io);
    contestHandlers(socket, io);
    challengeHandlers(socket, io);

    /* ===================== DISCONNECT ===================== */
    socket.on('disconnect', async () => {
      if (socket.data.userId) {
        const userId = socket.data.userId;
        await redis.srem('online:users', userId);
        io.emit('user-status-changed', {
          userId,
          status: 'offline',
        });
      }
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};

// function calculateStats({
//   totalTyped,
//   errors,
//   timeTaken,
// }: {
//   totalTyped: number;
//   errors: number;
//   timeTaken: number;
// }) {
//   const correctChars = Math.max(totalTyped - errors, 0);
//   const minutes = Math.max(timeTaken / 60, 0.01);

//   const wpm = Math.round(correctChars / 5 / minutes);
//   const accuracy =
//     totalTyped === 0 ? 0 : Math.round((correctChars / totalTyped) * 100);

//   return { wpm, accuracy };
// }
