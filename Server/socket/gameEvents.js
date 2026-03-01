const rooms = require("../Memory/roomstore");

function registerGameevents(io, socket) {
  console.log("🎮 Game events registered for socket:", socket.id);

  socket.on("start-game", ({ roomCode, settings }) => {
    console.log("🚀 start-game received");

    const room = rooms.get(roomCode);
    if (!room) {
      console.log("❌ Room not found");
      return;
    }

    // 🔥 Find host player
    const hostPlayer = room.players.find((player) => player.role === "host");

    if (!hostPlayer) {
      console.log("❌ No host found in room");
      return;
    }

    console.log("Host socketId:", hostPlayer.socketId);
    console.log("Current socketId:", socket.id);

    // 🔒 Validate host by socketId
    if (hostPlayer.socketId !== socket.id) {
      console.log("⛔ Not host. Start denied.");
      return;
    }

    console.log("👑 Host verified. Starting game...");

    // Save settings
    room.settings = settings;

    // Update status
    room.status = "live";
    room.currentRound = 1;
    room.currentDrawerId = room.players[0].id;

    // Broadcast update
    io.to(roomCode).emit("room-update", {
      players: room.players,
      status: room.status,
      settings: room.settings,
      currentDrawerId: room.currentDrawerId,
    });

    console.log("✅ room-update emitted");
  });
}

module.exports = registerGameevents;
