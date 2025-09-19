// src/services/socket.js
/*import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

// ✅ Create socket connection
const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"], // better performance
});

// ✅ Debug logs
socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from socket server");
});

export default socket;

*/

const socket = {
  on: () => {},
  emit: () => {},
  disconnect: () => {}
};

export default socket;