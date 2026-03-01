// 2 methods - Joining a room using a given code , creating a code.
const Room = require("../models/RoomSchmea");
const generateRoomCode = require("../utils/generateRoom");
const rooms = require("../Memory/roomstore");

exports.createRoom = async (req, res) => {
  try {
    const { username, avatarIndex } = req.body;

    const word = null;
    if (!username || username.trim().length < 2) {
      return res.status(400).json({
        message: "Valid username required",
      });
    }

    let roomCode;
    let exists;

    do {
      roomCode = generateRoomCode();
      exists = await Room.findOne({ roomCode });
    } while (exists);

    await Room.create({
      roomCode,
      playersCount: 1,
      status: "waiting",
    });

    rooms.set(roomCode, {
      players: [
        {
          id: "player-" + Date.now(),
          username: username.trim(),
          avatarIndex: avatarIndex ?? 0,
          role: "host",
        },
      ],
      settings: {
        mode: "classic",
        maxPlayers: 2,
      },
      gameState: {},
      status: "waiting",
      currentRound: 0,
      currentDrawerId: null,
      drawerIndex: 0,
      word: null,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    });

    res.status(201).json({
      success: true,
      roomCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating room" });
  }
};
exports.joinRoom = async (req, res) => {
  try {
    const { roomCode, username } = req.body;

    const roomDoc = await Room.findOne({ roomCode });

    if (!roomDoc || roomDoc.status !== "waiting") {
      return res.status(404).json({
        message: "Room not available",
      });
    }

    if (roomDoc.playersCount >= 2) {
      return res.status(400).json({
        message: "Room full",
      });
    }

    return res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Join failed" });
  }
};

exports.getRoomState = (req, res) => {
  const { roomCode } = req.params;

  const room = rooms.get(roomCode);

  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  res.json({
    players: room.players,
    status: room.status,
    currentRound: room.currentRound,
    currentDrawerId: room.currentDrawerId,
    drawerIndex: room.drawerIndex,
    word: room.word,
    settings: room.settings,
  });
};
