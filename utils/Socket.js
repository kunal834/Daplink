// utils/socket.js

import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  // 1. Initialize the Socket.IO server
  const io = new Server(res.socket.server);
  res.socket.server.io = io; // Attach it to the server object

  // 2. Define connection listeners
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Example: Listen for a 'send-message' event from the client
    socket.on('send-message', (data) => {
      console.log('Message received:', data);
      
      // Emit the message to all connected clients (broadcast)
      io.emit('receive-message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  console.log('Setting up socket');
  res.end();
};

export default SocketHandler;