import { useState, useEffect } from "react";
import { socket } from "@/socket";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function useRoom(roomCode) {
  const [showJoinGate, setShowJoinGate] = useState(false);
  const [roomError, setRoomError] = useState(null);

  useEffect(() => {
    if (!roomCode) return;

    fetch(`${BASE_URL}/api/rooms/${roomCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.message === "Room not found") {
          setRoomError("Room not found or expired"); // ✅ only block this
          return;
        }

        // ✅ room exists regardless of status → check saved profile
        const savedProfile = JSON.parse(
          localStorage.getItem(`room-${roomCode}`),
        );
        if (!savedProfile) {
          setShowJoinGate(true);
          return;
        }

        socket.emit("join-room", { roomCode, player: savedProfile });
      })
      .catch(() => setRoomError("Could not connect to server"));
  }, [roomCode]);

  return { showJoinGate, setShowJoinGate, roomError };
}
