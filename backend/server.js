const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const connectDB = require("./config/database");

const PORT = process.env.PORT;

// Connect DB
connectDB();

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
