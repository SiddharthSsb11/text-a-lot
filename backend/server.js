const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


dotenv.config();
connectDB(); //mongodb connection
const app = express();

app.use(express.json()); // to accept json data from req body sent from fe 

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


//deployment
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

/* NODE_ENV=production *///add it in env

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);
 
/* app.get('/', (req, res) => {
    //console.log('hello from server');
    res.send('Api running');
}) */

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));


const io = require("socket.io")(server, {
  pingTimeout: 120000,
  cors: {
    //origin: "http://localhost:3000", //development
    origin: "https://textalot.herokuapp.com", //deployment
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`Logged in user ${userData.name} joined the created room`);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined the selectedChat Room: " + room);//room-selectedChatId
  });
  
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
      //.in-- inside user._id exclusive socket room joined-- emit this "message recieved" event ////mern-docs

    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

});  

////////////////////////////////////////////////////////////////
////////////////////////////////
//call join to subscribe the socket to a given channel/room

/* io.on("connection", (socket) => {
  socket.join("some room");
}); */

//broadcast to a room from a given socket --  every socket in the room excluding the sender will get the event.

/* io.on("connection", (socket) => {
  socket.to("some room").emit("some event");
}); */