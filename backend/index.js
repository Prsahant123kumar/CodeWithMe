const express = require('express');
const dotenv = require("dotenv");
const mongoDB = require("./connectDb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { app, server } = require("./socket/server.js");

const contestDetails = require('./routes/Contest.Details.routes');
const userRoute = require("./routes/User.Auth.routes");
const eventsDetails = require('./routes/Events.routes');
const FindUser = require("./routes/FindUser.routes.js");
const message = require("./routes/message.routes");

dotenv.config();

// 🟢 Connect to MongoDB
mongoDB();

// 🟢 Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ Correct CORS setup to allow cookies from frontend
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // ✅ Required for cookies to work
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// 🟢 Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/contests", eventsDetails);
app.use("/api/v1/", contestDetails);
app.use("/api/v1/user", FindUser);
app.use("/api/v1/message", message);

// 🟢 Server Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
