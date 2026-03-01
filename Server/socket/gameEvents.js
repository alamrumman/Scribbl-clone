const rooms = require("../Memory/roomstore");

function getRandomWords(count) {
  const words = [
    "apple",
    "car",
    "tree",
    "house",
    "cat",
    "phone",
    "river",
    "mountain",
    "pizza",
    "guitar",
    "umbrella",
    "castle",
    "rocket",
    "penguin",
    "camera",
    "dragon",
    "laptop",
    "cookie",
    "rainbow",
    "volcano",
  ];
  return words.sort(() => 0.5 - Math.random()).slice(0, count);
}

function clearRoomTimers(room) {
  if (room.drawTimer) clearInterval(room.drawTimer);
  if (room.wordPickTimeout) clearTimeout(room.wordPickTimeout);
  if (room.nextTurnTimeout) clearTimeout(room.nextTurnTimeout);
  room.drawTimer = null;
  room.wordPickTimeout = null;
  room.nextTurnTimeout = null;
}

function startDrawingTurn(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  clearRoomTimers(room);
  room.currentWord = null;
  room.wordSelected = false;

  // ✅ Reset guess state for all players each turn
  room.players.forEach((p) => {
    p.guessedCorrectly = false;
  });

  const drawer = room.players.find((p) => p.id === room.currentDrawerId);
  if (!drawer?.socketId) return;

  // Tell everyone new turn started + who is drawing
  io.to(roomCode).emit("room-update", {
    players: room.players,
    status: room.status,
    currentDrawerId: room.currentDrawerId,
    currentRound: room.currentRound,
  });

  // Send word options only to drawer
  const wordOptions = getRandomWords(room.settings.wordCount);
  room.pendingWords = wordOptions;
  io.to(drawer.socketId).emit("word-options", wordOptions);
  console.log("📝 Word options sent to drawer:", drawer.username);

  // Auto pick after 15s if drawer doesn't choose
  room.wordPickTimeout = setTimeout(() => {
    if (!room.wordSelected) {
      console.log("⏰ Auto picking word for drawer");
      handleWordSelected(io, roomCode, wordOptions[0]);
    }
  }, 15000);
}

function handleWordSelected(io, roomCode, word) {
  const room = rooms.get(roomCode);
  if (!room) return;

  clearTimeout(room.wordPickTimeout);
  room.currentWord = word;
  room.wordSelected = true;

  const drawer = room.players.find((p) => p.id === room.currentDrawerId);
  const masked = word
    .split("")
    .map((c) => (c === " " ? " " : "_"))
    .join(" ");

  // Send masked word to everyone, real word only to drawer
  io.to(roomCode).emit("drawing-started", { maskedWord: masked });
  if (drawer?.socketId) {
    io.to(drawer.socketId).emit("your-word", word);
  }

  // Start countdown
  let timeLeft = room.settings.drawtime;
  room.currentTimeLeft = timeLeft;
  io.to(roomCode).emit("timer-tick", { timeLeft });

  room.drawTimer = setInterval(() => {
    timeLeft--;
    room.currentTimeLeft = timeLeft; // ✅ track for points calculation
    io.to(roomCode).emit("timer-tick", { timeLeft });

    if (timeLeft <= 0) {
      clearInterval(room.drawTimer);
      endTurn(io, roomCode);
    }
  }, 1000);
}

function endTurn(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  clearRoomTimers(room);

  console.log(`✅ Turn ended. Word was: ${room.currentWord}`);

  // Reveal correct word to everyone
  io.to(roomCode).emit("turn-ended", { correctWord: room.currentWord });

  // Clear canvas for everyone
  io.to(roomCode).emit("clear-canvas");

  // Advance after 3s
  room.nextTurnTimeout = setTimeout(() => {
    advanceTurn(io, roomCode);
  }, 3000);
}

function advanceTurn(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  if (room.players.length === 0) return;

  // ✅ Increment round first
  room.currentRound += 1;

  // ✅ Current player has finished all their rounds, move to next player
  if (room.currentRound > room.settings.rounds) {
    const currentIndex = room.players.findIndex(
      (p) => p.id === room.currentDrawerId,
    );

    const nextIndex = currentIndex + 1; // ✅ no looping, just next player

    // ✅ All players have drawn — game over
    if (nextIndex >= room.players.length) {
      room.status = "finished";
      const sorted = [...room.players].sort((a, b) => b.score - a.score);
      io.to(roomCode).emit("game-over", { players: sorted });
      console.log("🏆 Game over!");
      return;
    }

    // ✅ Move to next player, reset round to 1
    room.currentDrawerId = room.players[nextIndex].id;
    room.currentRound = 1;
    console.log(`👤 Next drawer: ${room.players[nextIndex].username}`);
  }

  console.log(
    `🔄 Round ${room.currentRound} for drawer ${room.currentDrawerId}`,
  );
  startDrawingTurn(io, roomCode);
}
function registerGameevents(io, socket) {
  console.log("🎮 Game events registered for socket:", socket.id);

  socket.on("start-game", ({ roomCode, settings }) => {
    console.log("🚀 start-game received");

    const room = rooms.get(roomCode);
    if (!room) return;

    const hostPlayer = room.players.find((p) => p.role === "host");
    if (!hostPlayer)
      return res.status(400).json({ message: "Only Host can start the game" });

    if (hostPlayer.socketId !== socket.id) {
      console.log("⛔ Not host. Start denied.");
      return;
    }

    console.log("👑 Host verified. Starting game...");

    room.settings = settings;
    room.status = "live";
    room.currentRound = 1;
    room.currentDrawerId = hostPlayer.id;

    startDrawingTurn(io, roomCode);
  });

  socket.on("select-word", ({ roomCode, word }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const drawer = room.players.find((p) => p.id === room.currentDrawerId);
    if (drawer?.socketId !== socket.id) return; // only drawer can select

    handleWordSelected(io, roomCode, word);
  });

  socket.on("submit-guess", ({ roomCode, guess }) => {
    const room = rooms.get(roomCode);
    if (!room || !room.currentWord || !room.wordSelected) return;

    const player = room.players.find((p) => p.socketId === socket.id);
    if (!player) return;

    // Drawer can't guess
    if (player.id === room.currentDrawerId) return;

    // Already guessed correctly
    if (player.guessedCorrectly) return;

    const isCorrect =
      guess.trim().toLowerCase() === room.currentWord.toLowerCase();

    if (isCorrect) {
      // Time-based points: faster guess = more points (max 500)
      const timeLeft = room.currentTimeLeft ?? 0;
      const points = Math.max(
        50, // minimum 50 points for correct guess
        Math.round((timeLeft / room.settings.drawtime) * 500),
      );

      player.score += points;
      player.guessedCorrectly = true;

      console.log(`🎉 ${player.username} guessed correctly! +${points} pts`);

      io.to(roomCode).emit("player-guessed", {
        username: player.username,
        points,
        players: room.players, // updated scores
      });

      // End turn early if all guessers got it
      const guessers = room.players.filter(
        (p) => p.id !== room.currentDrawerId,
      );
      const allGuessed = guessers.every((p) => p.guessedCorrectly);
      if (allGuessed) {
        console.log("🎊 All players guessed! Ending turn early.");
        clearInterval(room.drawTimer);
        endTurn(io, roomCode);
      }
    } else {
      // Wrong guess — show in chat
      io.to(roomCode).emit("chat-message", {
        username: player.username,
        message: guess,
        correct: false,
      });
    }
  });

  socket.on("draw-stroke", ({ roomCode, stroke }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const drawer = room.players.find((p) => p.id === room.currentDrawerId);
    if (drawer?.socketId !== socket.id) return; // only drawer can draw

    // Broadcast to everyone except the drawer
    socket.to(roomCode).emit("draw-stroke", stroke);
  });
}

module.exports = registerGameevents;
