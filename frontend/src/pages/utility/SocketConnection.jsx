// SocketConnection.jsx

import { io } from "socket.io-client";

const backendBaseUrl = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("access_token");
// (or whatever key you actually store your JWT under)
// console.log("JWT from localStorage:", token);

const socket = io(backendBaseUrl, {
  path: "/ws/socket.io",
  transports: ["websocket"], // force WebSocket (optional but reliable)
  auth: {
    token, // send your MedEase JWT here
  },
  withCredentials: true, // include cookies if you also use cookie auth
});

export default socket;
