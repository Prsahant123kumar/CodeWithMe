const express = require('express');
const dotenv = require("dotenv");
const mongoDB = require("./connectDb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const Message = require('./models/Message.js');
const contestDetails=require('./routes/Contest.Details.routes')
const userRoute = require("./routes/User.Auth.routes");
const eventsDetails=require('./routes/Events.routes')
const FindUser=require("./routes/FindUser.routes.js")
const message=require("./routes/message.routes")
const { app, server } =require("./socket/server.js");
dotenv.config();

// const app = express();

mongoDB();

const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// ✅ API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/contests", eventsDetails);
app.use("/api/v1/", contestDetails);
app.use("/api/v1/user",FindUser);
app.use("/api/v1/message",message);

// ✅ Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});