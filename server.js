const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  socket.on("ping", (data) => {
    console.log("ping received", data);
    io.emit("pong", { 
      from: socket.id, 
      message: "pong from server to everyone" 
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello from Express + Socket.io server!");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
