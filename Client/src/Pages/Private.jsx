import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { socket } from "@/socket";
import { useRoom } from "@/hooks/useRoom";
import { useGameSocket } from "@/hooks/useGameSocket";
import JoinGate from "@/Components/Joingate";
import Settings from "@/Components/Settings";
import Canvas from "@/Components/Canvas";
import PlayerList from "@/Components/PlayerList";
import GameTopBar from "@/Components/GameTopBar";
import WordSelector from "@/Components/WordSelector";
import GameChat from "@/Components/GameChat";
import GameOver from "@/Components/GameOver";
import { toast } from "react-toastify";

function Private() {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");

  const [settings, setSettings] = useState({
    players: 2,
    drawtime: 50,
    rounds: 3,
    wordCount: 3,
  });

  const { showJoinGate, setShowJoinGate, roomError } = useRoom(roomCode);

  const {
    players,
    status,
    currentRound,
    wordOptions,
    setWordOptions,
    timeLeft,
    maskedWord,
    yourWord,
    correctWord,
    chatMessages,
    isDrawer,
    isHost,
    drawerSelectingMsg,
  } = useGameSocket();

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/room-code?code=${roomCode}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.info("Invite link copied!");
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleStartGame = () => {
    socket.emit("start-game", { roomCode, settings }, (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Failed to start game"); // ✅ you already have toast imported
      }
    });
  };
  if (roomError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl font-bold">{roomError}</p>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: "url(/Images/main_bg.jpg)" }}
    >
      <GameTopBar
        timeLeft={timeLeft}
        correctWord={correctWord}
        isDrawer={isDrawer}
        yourWord={yourWord}
        maskedWord={maskedWord}
        currentRound={currentRound}
        totalRounds={settings.rounds}
        status={status}
        roomCode={roomCode}
      />

      {drawerSelectingMsg && (
        <p className="text-center text-lg font-bold py-2 bg-white">
          {drawerSelectingMsg}
        </p>
      )}

      {showJoinGate && (
        <JoinGate
          roomCode={roomCode}
          onSuccess={() => setShowJoinGate(false)}
        />
      )}

      {status === "waiting" && (
        <div className="p-1">
          <Settings settings={settings} setSettings={setSettings} />
        </div>
      )}

      {status === "live" && (
        <>
          <WordSelector
            isDrawer={isDrawer}
            wordOptions={wordOptions}
            roomCode={roomCode}
            onSelect={() => setWordOptions([])}
          />
          <div className="flex justify-center mt-2 mx-1">
            <Canvas isDrawer={isDrawer} roomCode={roomCode} />
          </div>
        </>
      )}

      {status === "finished" && <GameOver players={players} />}

      {/* Start + Copy */}

      {status === "waiting" && (
        <div
          style={{
            background: "#fffef7",
            border: "2px solid #1a1a1a",
            borderRadius: "8px",
            boxShadow: "3px 3px 0px #1a1a1a",
            display: "flex",
            gap: "8px",
            padding: "8px",
            margin: "4px",
          }}
        >
          {isHost ? (
            <button
              style={{
                flex: 7,
                padding: "10px 12px",
                background: "#84cc16",
                color: "#1a1a1a",
                border: "2px solid #1a1a1a",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "700",

                cursor: "pointer",
                boxShadow: "3px 3px 0px #1a1a1a",
                letterSpacing: "0.5px",
                transition: "all 0.1s ease",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.cssText +=
                  "transform:translate(2px,2px);box-shadow:1px 1px 0px #1a1a1a")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.cssText +=
                  "transform:translate(0,0);box-shadow:3px 3px 0px #1a1a1a")
              }
              onClick={handleStartGame}
            >
              🚀 Start Game
            </button>
          ) : (
            <div
              style={{
                flex: 7,
                padding: "10px 12px",
                background: "#f3f4f6",
                color: "#9ca3af",
                border: "2px solid #1a1a1a",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              ⏳ Waiting for host to start...
            </div>
          )}
          <button
            style={{
              flex: 3,
              padding: "10px 12px",
              background: "#06b6d4",
              color: "#1a1a1a",
              border: "2px solid #1a1a1a",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "700",

              cursor: "pointer",
              boxShadow: "3px 3px 0px #1a1a1a",
              letterSpacing: "0.5px",
              transition: "all 0.1s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.cssText +=
                "transform:translate(2px,2px);box-shadow:1px 1px 0px #1a1a1a")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.cssText +=
                "transform:translate(0,0);box-shadow:3px 3px 0px #1a1a1a")
            }
            onClick={handleCopyLink}
          >
            🔗 Copy
          </button>
        </div>
      )}

      {/* Player List + Chat */}
      <div className="flex justify-center gap-1 p-1">
        <div className="flex-[3]">
          <PlayerList players={players} />
        </div>
        <GameChat
          chatMessages={chatMessages}
          isDrawer={isDrawer}
          status={status}
          roomCode={roomCode}
        />
      </div>
    </div>
  );
}

export default Private;
