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
const PORT = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// 🔥 Attach socket layer
initSocket(server);

app.get("/", (req, res) => {});
app.use("/api/rooms", roomRoutes);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
