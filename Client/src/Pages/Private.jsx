import Avatar from "@/Components/Avatar";
import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PlayerList from "@/Components/PlayerList";
import JoinGate from "@/Components/Joingate";
import { socket } from "@/socket";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
function Private() {
  const [searchParams] = useSearchParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const roomCode = searchParams.get("code");
  const [showJoinGate, setShowJoinGate] = useState(false);

  const inviteLink = `${window.location.origin}/room-code?code=${roomCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    if (!roomCode) return;

    // ✅ Attach listener once
    const handleRoomUpdate = (data) => {
      setPlayers(data.players);
      setStatus(data.status);
    };

    socket.on("room-update", handleRoomUpdate);

    return () => {
      socket.off("room-update", handleRoomUpdate);
    };
  }, []);

  useEffect(() => {
    if (!roomCode) return;

    const savedProfile = JSON.parse(localStorage.getItem(`room-${roomCode}`));

    if (savedProfile) {
      socket.emit("join-room", {
        roomCode,
        player: savedProfile,
      });
    } else {
      setShowJoinGate(true);
    }
  }, [roomCode]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: "url(/Images/main_bg.jpg)" }}
    >
      <div className="w-full bg-white h-12 flex justify-between">
        <div className="p-2">Clock</div>
        <div className="p-2 font-serif font-semibold text-xl animate-pulse">
          {status}
        </div>
        <div className="p-2">{roomCode}</div>
      </div>
      {showJoinGate && (
        <JoinGate
          roomCode={roomCode}
          onSuccess={() => setShowJoinGate(false)}
        />
      )}
      <div className="bg-yellow-500 h-56">All settings</div>

      <div className="h-40 bg-white">Custom words</div>

      <div className="bg-white border my-1 flex gap-1 mx-1">
        <button className="p-2 flex-[7] bg-black text-white">Start</button>

        <button
          className="p-2 flex-[3] bg-blue-500 text-white"
          onClick={handleCopyLink}
        >
          Copy Link
        </button>
      </div>

      <div className="flex justify-center h-64">
        <div className="flex-[3]">
          <PlayerList players={players} />
        </div>

        <div className="flex-[3] bg-white">Chat side</div>
      </div>

      <div className="flex bg-white m-1">Enter guess</div>
    </div>
  );
}

export default Private;
