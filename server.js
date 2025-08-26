const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    io.emit('chat message', msg); 
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});