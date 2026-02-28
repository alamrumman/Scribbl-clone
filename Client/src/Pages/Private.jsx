import Avatar from "@/Components/Avatar";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PlayerList from "@/Components/PlayerList";
import JoinGate from "@/Components/Joingate";
import { socket } from "@/socket";

function Private() {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");

  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("");
  const [showJoinGate, setShowJoinGate] = useState(false);

  const joinedRef = useRef(false); // 🔥 prevents double join

  const inviteLink = `${window.location.origin}/room-code?code=${roomCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // 🔥 Connect + Join Room
  useEffect(() => {
    if (!roomCode) return;

    const savedProfile = JSON.parse(localStorage.getItem(`room-${roomCode}`));

    if (!savedProfile) {
      setShowJoinGate(true);
      return;
    }

    const joinRoom = () => {
      if (joinedRef.current) return;

      joinedRef.current = true;

      socket.emit("join-room", {
        roomCode,
        player: savedProfile,
      });
    };

    socket.connect();

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.disconnect();
      joinedRef.current = false;
    };
  }, [roomCode]);

  // 🔥 Listen for Room Updates
  useEffect(() => {
    const handleRoomUpdate = (data) => {
      setPlayers(data.players);
      setStatus(data.status);
    };

    socket.on("room-update", handleRoomUpdate);

    return () => {
      socket.off("room-update", handleRoomUpdate);
    };
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: "url(/Images/main_bg.jpg)" }}
    >
      {/* Top Bar */}
      <div className="w-full bg-white h-12 flex justify-between items-center px-4">
        <div>Clock</div>
        <div className="font-semibold text-lg animate-pulse">{status}</div>
        <div>{roomCode}</div>
      </div>

      {/* Join Gate */}
      {showJoinGate && (
        <JoinGate
          roomCode={roomCode}
          onSuccess={() => setShowJoinGate(false)}
        />
      )}

      {/* Settings */}
      <div className="bg-yellow-500 h-56">All settings</div>

      <div className="h-40 bg-white">Custom words</div>

      {/* Buttons */}
      <div className="bg-white border my-1 flex gap-1 mx-1">
        <button className="p-2 flex-[7] bg-black text-white">Start</button>

        <button
          className="p-2 flex-[3] bg-blue-500 text-white"
          onClick={handleCopyLink}
        >
          Copy Link
        </button>
      </div>

      {/* Player List + Chat */}
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
