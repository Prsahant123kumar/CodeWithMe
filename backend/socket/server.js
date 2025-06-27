const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Update with your client URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// User socket mapping
const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user joins
  socket.on("setup", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
    socket.emit("connected");
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove user from mapping
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
  });

  // Error handling
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

module.exports = { app, server, io, getReceiverSocketId };


  // console.log("a user connected", socket.id);
  // const userId = socket.handshake.query.userId;
  // if (userId) {
  //   users[userId] = socket.id;
  //   console.log("Hello ", users);
  // }
  // // used to send the events to all connected users
  // io.emit("getOnlineUsers", Object.keys(users));

  // // used to listen client side events emitted by server side (server & client)
  // socket.on("disconnect", () => {
  //   console.log("a user disconnected", socket.id);
  //   delete users[userId];
  //   io.emit("getOnlineUsers", Object.keys(users));
  // });
