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

function Private() {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");

  const [settings, setSettings] = useState({
    players: 2,
    drawtime: 50,
    rounds: 3,
    wordCount: 3,
  });

  const { showJoinGate, setShowJoinGate } = useRoom(roomCode);

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
  } = useGameSocket();

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/room-code?code=${roomCode}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Invite link copied!");
    } catch (err) {
      console.error(err);
    }
  };

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

      {showJoinGate && (
        <JoinGate
          roomCode={roomCode}
          onSuccess={() => setShowJoinGate(false)}
        />
      )}

      {status === "waiting" && (
        <div className="bg-yellow-500 h-52">
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
        <div className="bg-white border my-1 flex gap-1 mx-1">
          <button
            className="p-2 flex-[7] bg-black text-white"
            onClick={() => socket.emit("start-game", { roomCode, settings })}
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
      )}

      {/* Player List + Chat */}
      <div className="flex justify-center h-64 gap-1 p-1">
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
