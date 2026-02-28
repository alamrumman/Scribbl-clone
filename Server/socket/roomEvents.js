const rooms = require("../Memory/roomstore");

function registerRoomEvents(io, socket) {
  socket.on("join-room", ({ roomCode, player }, callback) => {
    const room = rooms.get(roomCode);

    if (!room) {
      return callback?.({ success: false, message: "Room not found" });
    }

    if (!player?.username?.trim()) {
      return callback?.({ success: false, message: "Invalid username" });
    }

    const existing = room.players.find((p) => p.username === player.username);

    if (existing) {
      existing.socketId = socket.id;
    } else {
      room.players.push({
        username: player.username.trim(),
        avatarIndex: player.avatarIndex ?? 0,
        socketId: socket.id,
      });
    }

    socket.join(roomCode);

    io.to(roomCode).emit("room-update", {
      players: room.players,
      status: room.status,
    });
    callback?.({ success: true });
  });

  socket.on("disconnect", () => {
    rooms.forEach((room, roomCode) => {
      // ✅ Remove player safely
      room.players = room.players.filter((p) => p.socketId !== socket.id);

      io.to(roomCode).emit("room-update", {
        players: room.players,
        status: room.status,
      });
    });
  });
}

module.exports = registerRoomEvents;
