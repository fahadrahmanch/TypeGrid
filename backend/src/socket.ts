import { Server } from "socket.io";
import { Competition } from "./infrastructure/db/models/user/competitionSchema";

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
    console.log(" Socket connected:", socket.id);

    socket.on("join-room", (roomName: string) => {
      console.log(" Joined room:", roomName);
      socket.join(roomName); 
    });

    socket.on('group-play',(CompetitionId)=>{
      console.log("group play socket connected",CompetitionId)
      socket.join(CompetitionId)
    })
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
