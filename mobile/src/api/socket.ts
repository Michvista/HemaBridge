import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './client';

let socket: Socket | null = null;

export const getSocket = (userId?: string): Socket => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Socket.io connected to Hemabridge server');
      if (userId) {
        socket?.emit('registerUser', { userId });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });
  }

  if (userId && socket.connected) {
    socket.emit('registerUser', { userId });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
