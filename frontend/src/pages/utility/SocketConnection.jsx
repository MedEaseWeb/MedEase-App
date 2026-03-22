// SocketConnection.jsx

import { io } from "socket.io-client";

const backendBaseUrl = import.meta.env.VITE_API_URL;

const socket = io(backendBaseUrl, {
  path: "/ws/socket.io",
  transports: ["websocket"],
  withCredentials: true, // sends the HttpOnly access_token cookie
  autoConnect: false,    // connect explicitly only from authenticated components
});

export default socket;
