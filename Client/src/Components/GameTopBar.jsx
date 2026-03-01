function GameTopBar({
  timeLeft,
  correctWord,
  isDrawer,
  yourWord,
  maskedWord,
  currentRound,
  totalRounds,
  status,
  roomCode,
}) {
  return (
    <div className="w-full bg-white h-12 flex justify-between items-center px-4">
      <div
        className={`text-lg font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-800"}`}
      >
        ⏱ {timeLeft ?? "--"}s
      </div>

      <div className="text-xl font-mono tracking-widest">
        {status !== "live" ? (
          <span className="font-semibold text-lg animate-pulse">{status}</span>
        ) : correctWord ? (
          <span className="text-green-600 font-bold">✅ {correctWord}</span>
        ) : isDrawer ? (
          <span className="text-blue-600 font-bold">{yourWord}</span>
        ) : (
          <span className="tracking-[0.3em]">
            {maskedWord || "⏳ Waiting..."}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-500">
        {status === "live" ? `Round ${currentRound}/${totalRounds}` : roomCode}
      </div>
    </div>
  );
}

export default GameTopBar;
