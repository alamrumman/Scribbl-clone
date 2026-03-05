const rooms = require("../Memory/roomstore");
const { v4: uuidv4 } = require("uuid");
const { endTurn, endGame } = require("./gameEvents");

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
    socket.data.roomCode = roomCode; //attaching room code along with join for handling disconnect properly

    io.to(roomCode).emit("room-update", {
      players: room.players,
      status: room.status,
      currentDrawerId: room.currentDrawerId ?? null,
    });
    callback?.({ success: true });
  });

  socket.on("disconnect", () => {
    // rather than looping we directly find the room to which the user belongs throught socket.join.roomdata = roomdata which is attached to join-game

    const roomCode = socket.data.roomCode; // ✅ O(1) lookup
    if (!roomCode) return;

    const room = rooms.get(roomCode); // finds the room without looping over all rooms
    if (!room) return;

    // ✅ find who left before removing them
    const leavingPlayer = room.players.find((p) => p.socketId === socket.id);

    // ✅ if drawer left mid-game, end the turn
    if (room.status === "live" && leavingPlayer?.id === room.currentDrawerId) {
      const currentIndex = room.players.findIndex(
        (p) => p.id === leavingPlayer.id,
      );
      const nextIndex = currentIndex + 1;

      if (nextIndex >= room.players.length-1) {
        endGame(io, roomCode); // ✅ reusing endGame
        return;
      }

      room.currentDrawerId = room.players[nextIndex].id;
      room.currentRound = 0;
      endTurn(io, roomCode);
    }

    // ✅now we remove them with the help of filter
    room.players = room.players.filter((p) => p.socketId !== socket.id);

    // ✅ if host left lobby, assign new host
    if (room.status === "waiting" && leavingPlayer?.role === "host") {
      if (room.players.length > 0) {
        room.players[0].role = "host"; // first remaining player becomes host
      }
    }
    // ✅ only emit to the one room
    io.to(roomCode).emit("room-update", {
      players: room.players,
      status: room.status,
      currentDrawerId: room.currentDrawerId ?? null,
      currentRound: room.currentRound ?? null,
    });
  });
}

module.exports = registerRoomEvents;
