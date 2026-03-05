// routes/roomRoutes.js

const express = require("express");
const router = express.Router();

const { createRoom, getRoomState } = require("../controllers/Rooms");

// Create new room
router.post("/create", createRoom);

//Room details

router.get("/:roomCode", getRoomState);

module.exports = router;
