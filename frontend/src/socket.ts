// import { io } from "socket.io-client";
// const env = import.meta.env;
// export const socket = io(env.VITE_API_URL, {
//   transports: ["websocket"],
//   withCredentials: true,
// });
import { io } from "socket.io-client";

export const socket = io("https://api.typegrid.in", {
  transports: ["websocket"],
  withCredentials: true,
});