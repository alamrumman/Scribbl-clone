import { socket } from "@/socket";

function WordSelector({ isDrawer, wordOptions, roomCode, onSelect }) {
  if (!isDrawer || wordOptions.length === 0) return null;

  return (
    <div className="flex gap-2 justify-center mt-4 p-1 bg-white">
      <p className="font-semibold">Pick a word:</p>
      {wordOptions.map((word) => (
        <button
          key={word}
          className="bg-white px-4 py-1 rounded shadow border-black border hover:bg-gray-100"
          onClick={() => {
            socket.emit("select-word", { roomCode, word });
            onSelect();
          }}
        >
          {word}
        </button>
      ))}
    </div>
  );
}

export default WordSelector;
