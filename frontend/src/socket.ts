import { io } from "socket.io-client";
const env=import.meta.env
console.log(env.VITE_API_URL)
export const socket = io(env.VITE_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
