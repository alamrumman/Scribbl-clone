// routes/roomRoutes.js

const express = require("express");
const router = express.Router();

const { createRoom, joinRoom, getRoomState } = require("../controllers/Rooms");

// Create new room
router.post("/create", createRoom);

// Join random room
router.post("/random-join", joinRoom);

//Room details

router.get("/:roomCode", getRoomState);

module.exports = router;
