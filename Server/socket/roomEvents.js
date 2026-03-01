const rooms = require("../Memory/roomstore");
const { v4: uuidv4 } = require("uuid");
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
      const oldId = existing.id;
      existing.socketId = socket.id;
      existing.id = player.id;

      // ✅ if this player was the drawer, update currentDrawerId too
      if (room.currentDrawerId === oldId) {
        room.currentDrawerId = player.id;
      }
    } else {
      room.players.push({
        id: player.id || uuidv4(), // ✅ use client id first
        username: player.username.trim(),
        avatarIndex: player.avatarIndex ?? 0,
        socketId: socket.id,
        role: room.players.length === 0 ? "host" : "guest",
        score: 0,
      });
    }

    socket.join(roomCode);

    io.to(roomCode).emit("room-update", {
      players: room.players,
      status: room.status,
      currentDrawerId: room.currentDrawerId ?? null,
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
        currentDrawerId: room.currentDrawerId ?? null, // ✅ add this
        currentRound: room.currentRound ?? null,
      });
    });
  });
}

module.exports = registerRoomEvents;
