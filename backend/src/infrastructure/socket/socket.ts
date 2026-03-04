import { Server } from "socket.io";
import { injectGroupSocketController } from "../../presentation/DI/socketDI";
import { injectQuickSocketController } from "../../presentation/DI/socketDI";
import redis from "../../config/redis";
import { checkGameEndService,checkQuickGameEndService ,checkCompanyContestGameEndService} from "../../application/services/gameResultService";
import { injectContestSocketController } from "../../presentation/DI/socketDI";
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
    socket.on('register-user',async(userId:string)=>{
    socket.data.userId=userId
    socket.join(`user:${userId}`);
    await redis.sadd("online:users",userId)
      io.emit("user-status-changed", {
      userId,
      status: "online",
    });


    })

  socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err);
  });

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
  let member;
  try {
     member =
      await injectQuickSocketController.getQuickPlayData(
        competitionId,
        userId
      );

  

  } catch (error) {
    socket.emit("quick-join-error", {
      message: "Unable to join quick play",
    });
    return;
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
        const gameId = socket.data.gameId;
        if (!gameId) return;
        const key = `quick:game:${gameId}`;
        const raw = await redis.hget(key, userId);
        if (!raw) return;
        const data = JSON.parse(raw);
if(data.status==="FINISHED")return;
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


    //here need to implement leave game for quick play




//company contest  admin and user
socket.on("contest-status-updated", async ({ contestId, status }) => {

  const lobbyKey = `company:lobby:${contestId}`;
  const gameKey = `company:game:${contestId}`;

  if (status === "ongoing") {

    const lobbyUsers = await redis.hgetall(lobbyKey);

    for (const [userId, value] of Object.entries(lobbyUsers)) {

      const user = JSON.parse(value);

      await redis.hset(
        gameKey,
        userId,
        JSON.stringify({
          userId,
          name: user.name,
          imageUrl: user.imageUrl,
          progress: 0,
          wpm: 0,
          accuracy: 100,
          typedLength:0,
          errors: 0,
          timeTaken: 0,
          status: "PLAYING"
        })
      );
    }

    await redis.del(lobbyKey);

    const gameUsers = await redis.hgetall(gameKey);

    io.to(contestId).emit("contest-status-changed", {
      contestId,
      status,
      activeUsers: Object.values(gameUsers).map(v => JSON.parse(v))
    });

  } else {

    const all = await redis.hgetall(lobbyKey);

    io.to(contestId).emit("contest-status-changed", {
      contestId,
      status,
      activeUsers: Object.values(all).map(v => JSON.parse(v))
    });
  }
});


// 1 company contest lobby join

socket.on(
  "join-companyContest-lobby",
  async ({ contestId, user }) => {


    if (socket.data.contestId) {
      socket.leave(socket.data.contestId);
    }
      socket.data.contestId = contestId;   
    socket.data.userId = user.userId;
     socket.join(contestId);
  const key = `company:lobby:${contestId}`;

  await redis.hset(
    key,
    user.userId,
    JSON.stringify(user)
  );
   const all = await redis.hgetall(key);

  const users = Object.values(all).map(u => JSON.parse(u));
  io.to(contestId).emit(
    "lobby-users-update",
    users
  );


  }
);

//leave contest lobby
socket.on("leave-companyContest-lobby", async({ contestId, userId }) => {

   const key = `company:lobby:${contestId}`;

  await redis.hdel(key, userId);

  const all = await redis.hgetall(key);

  const users = Object.values(all).map(u => JSON.parse(u));
  io.to(contestId).emit("lobby-users-update", users);


});

// lobby admin side
socket.on("admin-join-companyContest-lobby", async ({ contestId }) => {
  socket.join(contestId);

  const key = `company:lobby:${contestId}`;
  const all = await redis.hgetall(key);
  const users = Object.values(all).map(u => JSON.parse(u));

  socket.emit("lobby-users-update", users);
});

//company contest area
socket.on("join-companyContest-game", async({ contestId ,user}) => {

    if(socket.data.gamecontestId&&socket.data.userId){
      socket.leave(socket.data.gamecontestId);
    }
    const userId=user?._id;
    socket.data.gamecontestId=contestId;
    socket.data.userId=userId;
    socket.join(contestId);
     const key = `company:game:${contestId}`;

 const raw = await redis.hget(key, userId);

if (raw) {
  const player = JSON.parse(raw);

  player.status = "PLAYING";
  player.socketId = socket.id;

  await redis.hset(key, userId, JSON.stringify(player));
}

  const all = await redis.hgetall(key);
  const users = Object.values(all).map(u => JSON.parse(u));
    io.to(contestId).emit("contest-game-players",users);


});


  socket.on("typing-progress-contest", async (data) => {
      const { userId, wpm, accuracy, errors, typedLength } = data;
      const { contestId } = data;
      if (!contestId) return;

      const key = `company:game:${contestId}`;

      const raw = await redis.hget(key, userId);
      let existing
      if (raw) {
         existing = JSON.parse(raw);
        if (existing.status === "FINISHED" || existing.status === "TIMES_UP") {
          return;
        }
      }
      
      await redis.hset(
        key,
        userId,
        JSON.stringify({
          ...existing,
          wpm,
          accuracy,
          errors,
          typedLength,
          status: "PLAYING",
          updatedAt: Date.now(),
        }),
      );
      const dta=await redis.hget(key,userId)
      await redis.expire(key, 600);

      io.to(contestId).emit("typing-progress-update-contest", data);
    });


     socket.on(
      "player-finished-contest",
      async ({
        userId,
        name,
        imageUrl,
        timeTaken,
        totalTyped,
        errors,
        typedLength,
      }) => {
        const contestId = socket.data.gamecontestId;
        if (!contestId) return;
        const key = `company:game:${contestId}`;

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
        const isEnd = await checkCompanyContestGameEndService(contestId);
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
          io.to(contestId).emit("game-finished-contest", resultArray);
          await redis.del(key);
          await injectContestSocketController.saveContestResult(contestId,resultArray)
          // await injectQuickSocketController.saveQuickPlayResult(
          //   gameId,
          //   resultArray,
          // );
        }
      },
    );


         socket.on(
      "time-up-contest",
      async ({
        userId,
        name,
        imageUrl,
        timeTaken,
        totalTyped,
        errors,
        typedLength,
      }) => {
        const contestId = socket.data.gamecontestId;
        if (!contestId) return;
        const key = `company:game:${contestId}`;
        const raw = await redis.hget(key, userId);
        if (!raw) return;
        const data = JSON.parse(raw);
if(data.status==="FINISHED")return;
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
        const isEnd = await checkCompanyContestGameEndService(contestId);
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
          io.to(contestId).emit("game-finished-contest", resultArray);
          await redis.del(key);
          await injectContestSocketController.saveContestResult(
            contestId,
            resultArray,
          );
        }
      },
    ); 

//leave company contest game
socket.on("leave-companyContest-game",async({contestId,userId})=>{
const key = `company:game:${contestId}`;
   const raw = await redis.hget(key, userId);

 if (!raw) return;
  const player = JSON.parse(raw);
 player.status = "LEFT";
  player.disconnectedAt = Date.now();
  await redis.hset(key, userId, JSON.stringify(player));

  const all = await redis.hgetall(key);

  const users = Object.values(all).map(u => JSON.parse(u));
  io.to(contestId).emit("contest-users-update", users);
});

//contest live monitor admin
socket.on("admin-join-live-monitor", async ({ contestId }) => {
  const key = `company:game:${contestId}`;

  socket.join(contestId);
  socket.data.monitorContestId = contestId;

  const players = await redis.hgetall(key);

  const parsedPlayers = Object.values(players).map((p) =>
    JSON.parse(p)
  );

  socket.emit("admin-live-data", parsedPlayers);
});

//restart contest 
socket.on("restart-contest", async ({ contestId }) => {
  const gameKey = `company:game:${contestId}`;
  const lobbyKey = `company:lobby:${contestId}`;

  const players = await redis.hgetall(gameKey);

  if (!players || Object.keys(players).length === 0) {
    return;
  }

  for (const [userId, value] of Object.entries(players)) {
    const user = JSON.parse(value);

    await redis.hset(
      gameKey,
      userId,
      JSON.stringify({
        ...user,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        typedLength: 0,
        errors: 0,
        timeTaken: 0,
        status: "PLAYING",
      })
    );
  }

  const updated = await redis.hgetall(gameKey);

  const users = Object.values(updated).map(v => JSON.parse(v));

  io.to(contestId).emit("contest-restarted",{  newStartTime: new Date(),users});
});

//end contest 
socket.on("end-contest", async ({ contestId }) => {
  const key = `company:game:${contestId}`;

  const allPlayers = await redis.hgetall(key);
  if (!allPlayers || Object.keys(allPlayers).length === 0) return;

  const resultArray = Object.entries(allPlayers)
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
        return (b.accuracy ?? 0) - (a.accuracy ?? 0);
      }

      if (a.status !== "FINISHED" && b.status !== "FINISHED") {
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

  io.to(contestId).emit("game-finished-contest", resultArray);

  await injectContestSocketController.saveContestResult(
    contestId,
    resultArray
  );

  await redis.del(key);
});


//company challenge
socket.on("challenge-accepted", ({ challengeId, senderId }) => {

  io.to(`user:${senderId}`).emit("challenge-status-updated", {
    challengeId,
    status: "accepted"
  })

})

socket.on("join-match", async ({ challengeId }) => {

    socket.join(challengeId)

    const room = io.sockets.adapter.rooms.get(challengeId)
    console.log("room in join room",room)
    if (room && room.size === 2) {

        io.to(challengeId).emit("start-match", { challengeId })

    }

})



  socket.on("disconnect", async () => {
    // if (!socket.data.groupId || !socket.data.userId) {
    //   return;
    // }
    // await injectGroupSocketController.handleDisconnect(socket, io);

    if (socket.data.userId) {
  const userId = socket.data.userId;

  await redis.srem("online:users", userId);

  io.emit("user-status-changed", {
    userId,
    status: "offline",
  });
}

    if (socket.data.contestId && socket.data.userId) {
      const contestId = socket.data.contestId;
      const userId = socket.data.userId;

      const key = `company:lobby:${contestId}`;

      await redis.hdel(key, userId);

      const all = await redis.hgetall(key);
      const users = Object.values(all).map(u => JSON.parse(u));

      io.to(contestId).emit(
        "lobby-users-update",
        users
      );
    }
    if (socket.data.gamecontestId && socket.data.userId) {

  const contestId = socket.data.gamecontestId;
  const userId = socket.data.userId;

  const gameKey = `company:game:${contestId}`;

   const raw = await redis.hget(gameKey, userId);
  if (!raw) return;
  const player = JSON.parse(raw);
 player.status = "DISCONNECTED";
  player.disconnectedAt = Date.now();
  await redis.hset(gameKey, userId, JSON.stringify(player));
  const all = await redis.hgetall(gameKey);
const users = Object.values(all).map(v => JSON.parse(v));

io.to(contestId).emit("contest-users-update", users);
}

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

