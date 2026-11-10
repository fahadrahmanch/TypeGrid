
import { Server, Socket } from "socket.io";
import redis from "../../../config/redis";

export const registerChatHandler = (
  socket: Socket,
  io: Server
) => {
  // Join chat room
  socket.on("join-chat-room", async ({ groupId, user }: { groupId: string; user?: any }) => {
    try {
      if (!groupId) return;

      if (user) {
        const uid = user.id || user._id;
        if (uid) socket.data.userId = uid;
        if (user.name) socket.data.userName = user.name;
        if (user.avatar || user.imageUrl) socket.data.avatar = user.avatar || user.imageUrl;
      }

      const room = `chat:${groupId}`;

      socket.join(room);

      // Fetch latest 50 messages
      const messages = await redis.lrange(room, 0, 49);

      socket.emit(
        "chat-history",
        messages.map((message: string) => JSON.parse(message)).reverse()
      );
    } catch (error) {
      console.error("Join chat error:", error);
      socket.emit("chat-error", {
        message: "Unable to load chat history",
      });
    }
  });

  // Send message
  socket.on("send-message", async ({ groupId, content, sender }: { groupId: string; content: string; sender?: any }) => {
    try {
      if (
        !groupId ||
        typeof content !== "string" ||
        !content.trim() ||
        content.length > 1000
      ) {
        return;
      }

      const senderId = sender?.id || sender?._id || socket.data.userId;
      const senderName = sender?.name || socket.data.userName || "Player";
      const avatar = sender?.imageUrl || sender?.avatar || socket.data.avatar || null;

      if (senderId) socket.data.userId = senderId;
      if (senderName && senderName !== "Player") socket.data.userName = senderName;
      if (avatar) socket.data.avatar = avatar;

      const message = {
        id: crypto.randomUUID(),
        senderId: senderId || socket.id,
        senderName: senderName,
        avatar: avatar,
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const room = `chat:${groupId}`;

      // Store message in Redis
      await redis.rpush(room, JSON.stringify(message));

      // Keep latest 50 messages
      await redis.ltrim(room, -50, -1);

      // Expire after 1 hour
      await redis.expire(room, 3600);

      // Broadcast to group
      io.to(room).emit("new-message", message);

    } catch (error) {
      console.error("Send message error:", error);

      socket.emit("chat-error", {
        message: "Message could not be sent",
      });
    }
  });

  // Leave chat room
  socket.on("leave-chat-room", ({ groupId }) => {
    if (!groupId) return;

    socket.leave(`chat:${groupId}`);
  });
};
