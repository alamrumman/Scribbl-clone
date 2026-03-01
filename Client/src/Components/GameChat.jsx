import { useRef, useEffect } from "react";
import { socket } from "@/socket";

function GameChat({ chatMessages, isDrawer, status, roomCode }) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div
      className="flex flex-col flex-[3] overflow-hidden"
      style={{
        maxHeight: "14rem",
        background: "#fffef7",
        border: "2px solid #1a1a1a",
        borderRadius: "8px",
        boxShadow: "3px 3px 0px #1a1a1a",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1.5px solid #e5e5e5",
          padding: "5px 12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "14px" }}>✏️</span>
        <span style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a1a" }}>
          Chat & Guess
        </span>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex flex-col gap-1 overflow-y-auto p-2"
        style={{ flex: 1, minHeight: 0 }}
      >
        {chatMessages.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#ccc",
              fontSize: "14px",
              marginTop: "12px",
            }}
          >
            no messages yet...
          </p>
        )}
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              fontSize: "15px",
              padding: "2px 6px",
              borderRadius: "6px",
              background: msg.system ? "#f0fdf4" : "transparent",
              color: msg.system ? "#16a34a" : "#333",
            }}
          >
            {msg.system && <span className="mr-1">🎉</span>}
            <span style={{ fontWeight: "700" }}>{msg.username}: </span>
            {msg.message}
          </div>
        ))}
      </div>

      {/* Input */}
      {!isDrawer && status === "live" && (
        <div
          style={{
            borderTop: "1.5px solid #e5e5e5",
            padding: "5px 10px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <input
            type="text"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "15px",
              fontFamily: "'Caveat', cursive",
              color: "#1a1a1a",
            }}
            placeholder="type your guess..."
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

      {isDrawer && status === "live" && (
        <div
          style={{
            borderTop: "1.5px solid #e5e5e5",
            padding: "5px 12px",
            fontSize: "13px",
            color: "#aaa",
            textAlign: "center",
          }}
        >
          you're drawing 🎨
        </div>
      )}
    </div>
  );
}

export default GameChat;
