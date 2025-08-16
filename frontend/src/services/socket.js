// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Avoids long-polling in production
  withCredentials: false,     // If you use cookies for auth no cookie = false
  reconnection: true,
  autoConnect: true,      
});
