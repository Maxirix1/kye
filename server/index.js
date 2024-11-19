const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(express.json());

app.use(cors({
    origin: '*', 
  }));

connectDB();

app.use('/api', authRoutes);

app.get("/", (req, res) => {
    res.send("Hello from Server!");
  });
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 30; 

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running on port 5000");
  });