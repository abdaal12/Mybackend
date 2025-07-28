const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http"); 
const { Server } = require("socket.io");

const app = express();
dotenv.config();
const connectDB = require("./config/db");
connectDB();

app.use(cors({
  origin: ["https://m-yfrontend.vercel.app"],
  credentials: true,
}));

app.use(express.json());

// ==== ROUTES ====
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send("API is running...");
});

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Database Connected..."))
.catch(err => console.error("Database Error:", err.message));

// ====== SOCKET.IO SETUP ======
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://m-yfrontend.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Start server with socket
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
