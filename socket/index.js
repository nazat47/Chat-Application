require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello ");
});

let users = [];

const addUser = (userId, socketId, userInfo) => {
  const userExists = users.some((u) => u.userId === userId);
  if (!userExists) {
    users.push({ userId, socketId, userInfo });
  }
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const findFriend = (receiverId) => {
  return users.find((u) => u.userId === receiverId);
};

io.on("connection", (socket) => {
  console.log("A user in connected");
  socket.on("addUser", (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit("getUsers", users);
    const us = users.filter((u) => u.userId !== userId);
    const con = "newUserAdd";
    for (var i=0;i<us.length;i++) {
      socket.to(us[i].socketId).emit("newUserAdd", con);
    }
  });
  socket.on("sendMessage", (data) => {
    const receiver = findFriend(data.receiverId);
    if (receiver !== undefined) {
      socket.to(receiver.socketId).emit("getMessage", data);
    }
  });
  socket.on("messageSeen", (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("getMessageSeen", msg);
    }
  });
  socket.on("messageDeliver", (msg) => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("getMessageDeliver", msg);
    }
  });
  socket.on("seen", (data) => {
    const user = findFriend(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("seenSuccess", data);
    }
  });

  socket.on("typingMessage", (data) => {
    const receiver = findFriend(data.receiverId);
    if (receiver !== undefined) {
      socket.to(receiver.socketId).emit("getTypingMessage", {
        senderId: data.senderId,
        receiverId: data.receiverId,
        msg: data.msg,
      });
    }
  });
  socket.on("logout", (userId) => {
    const user = findFriend(userId);
    if (user !== undefined) {
      removeUser(user.socketId);
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const port = process.env.PORT || 4001;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
