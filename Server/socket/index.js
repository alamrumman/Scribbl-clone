const { Server } = require("socket.io");
const registerRoomEvents = require("./roomEvents");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(
        Boolean,
      ),
      methods: ["GET", "POST"],

    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    registerRoomEvents(io, socket);
  });
}

module.exports = initSocket;
