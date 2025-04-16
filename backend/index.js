const express = require('express')
const dotenv = require("dotenv");
const mongoDB = require("./connectDb");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./routes/User.Auth.routes");
dotenv.config();

const app = express()

mongoDB();
const PORT = process.env.PORT || 3000;
// // Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());


const corsOptions = {
    origin: [
      "http://localhost:5173", 
    ],
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  };
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})