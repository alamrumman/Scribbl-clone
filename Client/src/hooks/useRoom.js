import { useState, useEffect } from "react";
import { socket } from "@/socket";

export function useRoom(roomCode) {
  const [showJoinGate, setShowJoinGate] = useState(false);

  useEffect(() => {
    if (!roomCode) return;

    const savedProfile = JSON.parse(localStorage.getItem(`room-${roomCode}`));
    if (!savedProfile) {
      setShowJoinGate(true);
      return;
    }

    socket.emit("join-room", { roomCode, player: savedProfile });
  }, [roomCode]);

  return { showJoinGate, setShowJoinGate };
}
