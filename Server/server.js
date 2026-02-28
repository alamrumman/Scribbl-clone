const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const connectDB = require("./configs/db");
const dotenv = require("dotenv");
const roomRoutes = require("./routes/roomRoutes");
const initSocket = require("./socket/index");
const server = http.createServer(app);

dotenv.config();
connectDB();

const corsOptions = {
  origin: "http://localhost:5173", // Allowed origin
  optionsSuccessStatus: 200,
};

app.use(cors());
app.use(express.json());

// 🔥 Attach socket layer
initSocket(server);

app.get("/", (req, res) => {});
app.use("/api/rooms", roomRoutes);
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
