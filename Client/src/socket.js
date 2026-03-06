import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io("http://localhost:5000");
