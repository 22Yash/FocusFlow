require('dotenv').config();


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const chatRoutes = require("./routes/chatRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const analyticsRoute = require('./routes/analyticsRoutes');


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat",chatRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions",sessionRoutes);
app.use('/api/analytics', analyticsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
