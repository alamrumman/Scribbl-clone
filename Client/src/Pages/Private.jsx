import Avatar from "@/Components/Avatar";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PlayerList from "@/Components/PlayerList";
import JoinGate from "@/Components/Joingate";
import { socket } from "@/socket";
import Settings from "@/Components/Settings";
import Canvas from "@/Components/Canvas";
function Private() {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");
  const [settings, setSettings] = useState({
    players: 2,
    drawtime: 50,
    rounds: 3,
    wordCount: 3,
  });
  const [currentRound, setcurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [maskedWord, setMaskedWord] = useState("");
  const [yourWord, setYourWord] = useState("");
  const [correctWord, setCorrectWord] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("");
  const [currentDrawerId, setCurrentDrawerId] = useState(null);
  const [showJoinGate, setShowJoinGate] = useState(false);
  const [wordOptions, setWordOptions] = useState([]);
  const inviteLink = `${window.location.origin}/room-code?code=${roomCode}`;

  useEffect(() => {
    socket.on("timer-tick", ({ timeLeft }) => setTimeLeft(timeLeft));

    socket.on("drawing-started", ({ maskedWord }) => {
      setMaskedWord(maskedWord);
      setCorrectWord("");
      setWordOptions([]);
    });

    socket.on("your-word", (word) => setYourWord(word));

    socket.on("turn-ended", ({ correctWord }) => {
      setCorrectWord(correctWord);
      setYourWord("");
      setMaskedWord("");
    });

    socket.on("player-guessed", ({ username, points, players }) => {
      setPlayers(players);
      setChatMessages((prev) => [
        ...prev,
        { username, message: `guessed the word! +${points} pts`, system: true },
      ]);
    });

    socket.on("chat-message", ({ username, message }) => {
      setChatMessages((prev) => [...prev, { username, message }]);
    });

    socket.on("game-over", ({ players }) => {
      setStatus("finished");
      setPlayers(players);
    });

    return () => {
      socket.off("timer-tick");
      socket.off("drawing-started");
      socket.off("your-word");
      socket.off("turn-ended");
      socket.off("player-guessed");
      socket.off("chat-message");
      socket.off("game-over");
    };
  }, []);
  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log("📡 Event received:", event, args);
    });

    return () => socket.offAny();
  }, []);
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
      setCurrentDrawerId(data.currentDrawerId);
      if (data.currentRound) setcurrentRound(data.currentRound);
    };

    socket.on("room-update", handleRoomUpdate);

    return () => {
      socket.off("room-update", handleRoomUpdate);
    };
  }, []);

  useEffect(() => {
    socket.on("word-options", (words) => {
      console.log("📝 Received word options:", words);

      setWordOptions(words);
    });

    return () => socket.off("word-options");
  }, []);
  const myPlayer = players.find((p) => p.socketId === socket.id);

  const isDrawer = myPlayer?.id === currentDrawerId;
  console.log("socket.id:", socket.id);
  console.log("players:", players);
  console.log("myPlayer:", myPlayer);
  console.log("currentDrawerId:", currentDrawerId);
  console.log("isDrawer:", isDrawer);
  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: "url(/Images/main_bg.jpg)" }}
    >
      {/* Top Bar */}
      <div className="w-full bg-white h-12 flex justify-between items-center px-4">
        <div>
          <img
            src="\Images\icons8-alarm-clock-50.png"
            alt=""
            className="size-3/4"
          />
        </div>
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
      {status === "waiting" && (
        <div className="bg-yellow-500 h-52">
          <Settings settings={settings} setSettings={setSettings} />
        </div>
      )}

      {status === "live" && (
        <>
          {/* Word Selection — drawer only, before word is picked */}
          {isDrawer && wordOptions.length > 0 && (
            <div className="flex gap-3 justify-center mt-4 p-2">
              <p className="font-semibold">Pick a word:</p>
              {wordOptions.map((word) => (
                <button
                  key={word}
                  className="bg-white px-4 py-2 rounded shadow border-black border hover:bg-gray-100"
                  onClick={() => {
                    socket.emit("select-word", { roomCode, word });
                    setWordOptions([]);
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
          )}

          {/* Timer + Word Display */}
          <div className="flex justify-between items-center px-4 py-2 bg-white mx-1 rounded mt-1">
            {/* Timer */}
            <div
              className={`text-lg font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-800"}`}
            >
              ⏱ {timeLeft ?? "--"}s
            </div>

            {/* Word */}
            <div className="text-xl font-mono tracking-widest">
              {correctWord ? (
                <span className="text-green-600 font-bold">
                  ✅ {correctWord}
                </span>
              ) : isDrawer ? (
                <span className="text-blue-600 font-bold">{yourWord}</span>
              ) : (
                <span className="tracking-[0.3em]">
                  {maskedWord || "⏳ Waiting..."}
                </span>
              )}
            </div>

            {/* Round */}
            <div className="text-sm text-gray-500">
              Round {currentRound ?? 1}/{settings.rounds}
            </div>
          </div>

          {/* Canvas — everyone sees it */}
          <div className="flex justify-center mt-2 mx-1">
            <Canvas isDrawer={isDrawer} roomCode={roomCode} />
          </div>
        </>
      )}

      {/* Game Over Screen */}
      {status === "finished" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center min-w-64">
            <h2 className="text-3xl font-bold mb-6">🏆 Game Over!</h2>
            {players.map((p, i) => (
              <div
                key={p.id}
                className="flex justify-between gap-8 py-2 border-b last:border-0"
              >
                <span>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {p.username}
                </span>
                <span className="font-bold text-yellow-600">
                  {p.score ?? 0} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {status === "finished" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center min-w-64">
            <h2 className="text-3xl font-bold mb-6">🏆 Game Over!</h2>
            {players.map((p, i) => (
              <div
                key={p.id}
                className="flex justify-between gap-8 py-2 border-b last:border-0"
              >
                <span>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {p.username}
                </span>
                <span className="font-bold text-yellow-600">
                  {p.score ?? 0} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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

        <div className="flex-[3] bg-white">
          <div className="flex-[3] bg-white flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.system
                      ? "text-green-600 font-semibold text-sm"
                      : "text-sm text-gray-700"
                  }
                >
                  <span className="font-bold">{msg.username}: </span>
                  {msg.message}
                </div>
              ))}
            </div>

            {/* Guess input — hidden for drawer */}
            {!isDrawer && status === "live" && (
              <div className="flex border-t">
                <input
                  type="text"
                  className="flex-1 p-2 text-sm outline-none"
                  placeholder="Type your guess..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      socket.emit("submit-guess", {
                        roomCode,
                        guess: e.target.value.trim(),
                      });
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex bg-white m-1">Enter guess</div>
    </div>
  );
}

export default Private;
