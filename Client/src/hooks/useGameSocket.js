import { useState, useEffect } from "react";
import { socket } from "@/socket";

export function useGameSocket() {
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("");
  const [currentDrawerId, setCurrentDrawerId] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [wordOptions, setWordOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [maskedWord, setMaskedWord] = useState("");
  const [yourWord, setYourWord] = useState("");
  const [correctWord, setCorrectWord] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const handleRoomUpdate = (data) => {
      setPlayers(data.players);
      setStatus(data.status);
      setCurrentDrawerId(data.currentDrawerId);
      if (data.currentRound !== undefined) setCurrentRound(data.currentRound);
    };

    socket.on("room-update", handleRoomUpdate);
    socket.on("word-options", (words) => setWordOptions(words));
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
    socket.on("game-state-restore", (data) => {
      setStatus(data.status);
      setCurrentDrawerId(data.currentDrawerId);
      setCurrentRound(data.currentRound);
      setTimeLeft(data.timeLeft);
      setMaskedWord(data.maskedWord);
      if (data.yourWord) setYourWord(data.yourWord);
    });

    // in cleanup

    return () => {
      socket.off("room-update", handleRoomUpdate);
      socket.off("word-options");
      socket.off("timer-tick");
      socket.off("drawing-started");
      socket.off("your-word");
      socket.off("turn-ended");
      socket.off("player-guessed");
      socket.off("chat-message");
      socket.off("game-over");
      socket.off("game-state-restore");
    };
  }, []);

  const myPlayer = players.find((p) => p.socketId === socket.id);
  const isDrawer = myPlayer?.id === currentDrawerId;
  const isHost = myPlayer?.role === "host";

  return {
    players,
    status,
    currentDrawerId,
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
  };
}
