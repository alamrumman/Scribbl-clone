const rooms = require("../Memory/roomstore");

function registerRoomEvents(io, socket) {
  socket.on("join-room", ({ roomCode, player }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    socket.join(roomCode);

    // 🔥 Prevent duplicate joins
    const exists = room.players.some((p) => p.username === player.username);

    if (exists) return;

    room.players.push({
      ...player,
      socketId: socket.id,
    });

    io.to(roomCode).emit("room-update", {
      players: room.players,
      status: room.status,
    });
  });
  socket.on("disconnect", () => {
    rooms.forEach((room, roomCode) => {
      const index = room.players.findIndex((p) => p.socketId === socket.id);

      if (index !== -1) {
        room.players.splice(index, 1);

        io.to(roomCode).emit("room-update", {
          players: room.players,
          status: room.status,
        });
      }
    });
  });
}

module.exports = registerRoomEvents;
