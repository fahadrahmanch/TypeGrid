import { Server } from "socket.io";
import { injectGroupSocketController } from "../../presentation/DI/socketDI";
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

    socket.on("join-room", ({groupId,userId}: {groupId: string, userId: string}) => {

      socket.join(groupId); 

  socket.data.groupId = groupId;
  socket.data.userId = userId;
    });

    socket.on('group-play',(CompetitionId)=>{
      socket.join(CompetitionId)
    })
     socket.on("typing-progress", (data) => {
    const { gameId } = data;

    
    socket.to(gameId).emit("typing-progress-update", data);

  });
  
  socket.on("leave-group",async ()=>{
     console.log("leave-group",socket.data)
    await injectGroupSocketController.handleDisconnect(socket,io)
  })
  let count =1
  socket.on("leave-group-play",async()=>{
    count++
    console.log(`leave-group-play ${count}`,socket.data)
    // await injectGroupSocketController.handleLeaveGroupPlay(socket,io)
    socket.to(socket.data.groupId).emit("player-left", { userId:socket.data.userId });
  })

  socket.on("disconnect",async () => {
  // console.log("Disconnected:", socket.data);
  if(!socket.data.groupId || !socket.data.userId){
    return
  }
  await injectGroupSocketController.handleDisconnect(socket,io)
  })
  

  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
