import { Server } from "socket.io";

let io: Server;
export const initSocket=(server:any)=>{
    io=new Server(server,{
        cors:{origin:"*"}
    })
    io.on("connection", (socket) => {
    socket.on("join-room", (groupId) => {
      socket.join(groupId);
    });
  });
}