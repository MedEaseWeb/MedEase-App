import { io } from "socket.io-client";

const backendBaseUrl = import.meta.env.VITE_API_URL;
const socket = io(backendBaseUrl, { path: "/ws/socket.io" });

export default socket;
