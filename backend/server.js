require('dotenv').config();


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const chatRoutes = require("./routes/chatRoutes")


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat",chatRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
