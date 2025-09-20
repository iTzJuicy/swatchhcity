import http from "http";
import { Server } from "socket.io";
import express from "express";
import app from "./app.js";
import connectDB from "./config/database.js";
import path from "path";
import fs from "fs"; // Add fs module for file system operations

const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT is not set

// Connect DB
connectDB();

// Ensure uploads folder exists
const uploadsDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads/ folder");
}

// Serve static files
app.use("/uploads", express.static(uploadsDir));

// Socket.io setup
const server = http.createServer(app);
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