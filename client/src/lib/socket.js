import { io } from 'socket.io-client';
export const socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, { autoConnect: false });
export const connectSocket = token => { socket.auth = { token }; socket.connect(); return socket; };
export const disconnectSocket = () => socket.disconnect();
