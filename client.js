const io = require("socket.io-client");
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
  socket.emit("ping", { message: "Ping!" });
});

socket.on("pong", (data) => {
  console.log("Broadcast received:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
