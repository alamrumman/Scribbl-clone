// 2 methods - Joining a room using a given code , creating a code.
const Room = require("../models/RoomSchmea");
const generateRoomCode = require("../utils/generateRoom");
const rooms = require("../Memory/roomstore");
const { v4: uuidv4 } = require("uuid");
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
    const hostId = uuidv4();

    rooms.set(roomCode, {
      players: [
        {
          id: hostId,
          username: username.trim(),
          avatarIndex: avatarIndex ?? 0,
          role: "host",
          score: 0,
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
      playerId: hostId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating room" });
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
    settings: room.settings,
  });
};
