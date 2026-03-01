function GameOverScreen({ players }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center min-w-64">
        <h2 className="text-3xl font-bold mb-6">🏆 Game Over!</h2>
        {players.map((p, i) => (
          <div key={p.id} className="flex justify-between gap-8 py-2 border-b last:border-0">
            <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {p.username}</span>
            <span className="font-bold text-yellow-600">{p.score ?? 0} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameOverScreen;