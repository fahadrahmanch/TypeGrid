import { appEvents } from "../../../application/events/AppEvents";
import { getIO } from "../../socket/socket";

appEvents.on("challenge.created", (challenge) => {
  const io = getIO();
  io.to(`user:${challenge.receiverId}`).emit("challenge-received", challenge);
});

appEvents.on("challenge.rejected", (challenge) => {
  const io = getIO();
  io.to(`user:${challenge.senderId}`).emit("challenge-rejected", challenge);
});
