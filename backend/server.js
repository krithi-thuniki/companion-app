// ✅ Load environment variables
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const Message = require("./models/message");
const Group = require("./models/group");

// ✅ Routes
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/groups");
const messageRoutes = require("./routes/messages");
const opportunitiesRoutes = require("./routes/opportunities");
const savedRoutes = require("./routes/saved");
const applicationsRoutes = require("./routes/applications");
const badgesRoutes = require("./routes/badges");
const tasksRoutes = require("./routes/tasks");
const pomodoroRoutes = require("./routes/pomodoro");
const journalRoutes = require("./routes/journalRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const mealRoutes = require("./routes/mealRoutes");
const progressRoutes = require("./routes/progressRoutes");
const profileRoutes = require("./routes/profileRoutes"); // ✅ NEW LINE — added

// ✅ Server Config
const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// 🧩 Debug incoming requests
app.use((req, res, next) => {
  console.log("📥 Incoming:", req.method, req.url);
  next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/opportunities", opportunitiesRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/badges", badgesRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/profile", profileRoutes); // ✅ NEW LINE — mount profile routes

// ✅ Connect to MongoDB
connectDB();

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

// ✅ JWT Auth for Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    socket.user = { id: null, username: "Guest" };
    return next();
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    socket.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    console.warn("❌ Socket auth failed:", err.message);
    socket.user = { id: null, username: "Guest" };
    next();
  }
});

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.user?.username);

  socket.on("join_group", async ({ groupId }) => {
    if (!groupId) return;
    socket.join(`group:${groupId}`);

    if (socket.user?.id) {
      try {
        await Group.updateOne(
          { _id: groupId },
          { $addToSet: { members: socket.user.id } }
        );
      } catch (err) {
        console.error("join_group error:", err);
      }
    }
  });

  socket.on("leave_group", ({ groupId }) => {
    if (!groupId) return;
    socket.leave(`group:${groupId}`);
  });

  socket.on("send_message", async ({ groupId, text }) => {
    if (!groupId || !text?.trim()) return;

    try {
      const userId = socket.user?.id || null;
      const senderName = socket.user?.username || "User";

      const msg = await Message.create({
        group: groupId,
        user: userId,
        senderName,
        text: text.trim(),
      });

      const payload = {
        id: msg._id,
        groupId,
        userId,
        senderName,
        text: msg.text,
        createdAt: msg.createdAt,
      };
      io.to(`group:${groupId}`).emit("new_message", payload);
    } catch (err) {
      console.error("send_message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❎ Client disconnected:", socket.user?.username);
  });
});

// ✅ Start Server
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
