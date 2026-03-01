import Avatar from "@/Components/Avatar";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PlayerList from "@/Components/PlayerList";
import JoinGate from "@/Components/Joingate";
import { socket } from "@/socket";
import Settings from "@/Components/Settings";

function Private() {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");
  const [settings, setSettings] = useState({
    players: 2,
    drawtime: 50,
    rounds: 3,
    wordCount: 3,
  });

  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("");
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

  // 🔥 Connect + Join Room
  useEffect(() => {
    if (!roomCode) return;

    const savedProfile = JSON.parse(localStorage.getItem(`room-${roomCode}`));

    if (!savedProfile) {
      setShowJoinGate(true);
      return;
    }
    // ✅ Auto join if already saved
    socket.emit("join-room", {
      roomCode,
      player: savedProfile,
    });
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
      <div className="bg-yellow-500 h-52">
        <Settings settings={settings} setSettings={setSettings} />
      </div>

      {/* Buttons */}
      <div className="bg-white border my-1 flex gap-1 mx-1">
        <button
          className="p-2 flex-[7] bg-black text-white"
          onClick={() => {
            console.log("Starting with settings:", settings);
            socket.emit("start-game", {
              roomCode,
              settings,
            });
          }}
        >
          Start
        </button>

        <button
          className="p-2 flex-[3] bg-blue-500 text-white"
          onClick={handleCopyLink}
        >
          Copy Link
        </button>
      </div>

      {/* Player List + Chat */}
      <div className="flex justify-center h-64 gap-1">
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
