import { io } from "socket.io-client";

const socket = io("pollingbackend-production-6d6b.up.railway.app"); // change to your backend URL if deployed
// const socket = io("http://localhost:5000"); // change to your backend URL if deployed

export default socket;