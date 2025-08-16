// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://your-server.com";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Avoids long-polling in production
  withCredentials: true,     // If you use cookies for auth
  reconnection: true,
  autoConnect: true,        // Connect manually when needed
});
