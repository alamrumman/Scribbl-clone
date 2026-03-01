import { useEffect, useRef, useState } from "react";
import { socket } from "@/socket";

function Canvas({ isDrawer, roomCode }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState("pen");

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const drawStroke = (ctx, stroke) => {
    ctx.beginPath();
    ctx.moveTo(stroke.x0, stroke.y0);
    ctx.lineTo(stroke.x1, stroke.y1);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const handleStroke = (stroke) => drawStroke(ctx, stroke);
    const handleClear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.on("draw-stroke", handleStroke);
    socket.on("clear-canvas", handleClear);
    return () => {
      socket.off("draw-stroke", handleStroke);
      socket.off("clear-canvas", handleClear);
    };
  }, []);

  const startDrawing = (e) => {
    if (!isDrawer) return;
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e, canvasRef.current);
  };

  const draw = (e) => {
    if (!isDrawer || !drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    const stroke = {
      x0: lastPos.current.x,
      y0: lastPos.current.y,
      x1: pos.x,
      y1: pos.y,
      color: tool === "eraser" ? "#ffffff" : color,
      width: tool === "eraser" ? brushSize * 4 : brushSize,
    };
    drawStroke(ctx, stroke);
    socket.emit("draw-stroke", { roomCode, stroke });
    lastPos.current = pos;
  };

  const stopDrawing = (e) => {
    e?.preventDefault();
    drawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear-canvas", { roomCode });
  };

  const colors = [
    "#000000",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#78716c",
    "#0ea5e9",
    "#14b8a6",
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          cursor: isDrawer
            ? tool === "eraser"
              ? "cell"
              : "crosshair"
            : "default",
          border: "2px solid #1a1a1a",
          borderRadius: "8px",
          boxShadow: "4px 4px 0px #1a1a1a",
          background: "#fff",
          touchAction: "none",
          width: "100%",
          maxWidth: "672px",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Toolbar */}
      {isDrawer && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            background: "#fffef7",
            border: "2px solid #1a1a1a",
            borderRadius: "8px",
            boxShadow: "3px 3px 0px #1a1a1a",
            padding: "8px 12px",
            width: "100%",
            maxWidth: "672px",
          }}
        >
          {/* Color Palette */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setTool("pen");
                }}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: c,
                  border:
                    color === c && tool === "pen"
                      ? "3px solid #1a1a1a"
                      : "2px solid #d1d5db",
                  transform:
                    color === c && tool === "pen" ? "scale(1.25)" : "scale(1)",
                  cursor: "pointer",
                  boxShadow:
                    color === c && tool === "pen"
                      ? "2px 2px 0px #1a1a1a"
                      : "none",
                  transition: "all 0.1s ease",
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <div
            style={{ width: "1px", height: "32px", background: "#d1d5db" }}
          />

          {/* Brush Size */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{ fontSize: "12px", fontWeight: "700", color: "#1a1a1a" }}
            >
              Size
            </span>
            <input
              type="range"
              min="2"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              style={{ width: "56px", accentColor: "#1a1a1a" }}
            />
            <div
              style={{
                borderRadius: "50%",
                background: "#1a1a1a",
                width: brushSize,
                height: brushSize,
              }}
            />
          </div>

          {/* Divider */}
          <div
            style={{ width: "1px", height: "32px", background: "#d1d5db" }}
          />

          {/* Eraser */}
          <button
            className="btn-press"
            onClick={() => setTool(tool === "eraser" ? "pen" : "eraser")}
            style={{
              padding: "5px 12px",
              background: tool === "eraser" ? "#fecdd3" : "#fffef7",
              border: "2px solid #1a1a1a",
              borderRadius: "6px",
              boxShadow: "2px 2px 0px #1a1a1a",
              fontSize: "13px",
              fontWeight: "700",
              color: "#1a1a1a",
              cursor: "pointer",
            }}
          >
            🧹 Eraser
          </button>

          {/* Divider */}
          <div
            style={{ width: "1px", height: "32px", background: "#d1d5db" }}
          />

          {/* Clear */}
          <button
            className="btn-press"
            onClick={clearCanvas}
            style={{
              padding: "5px 12px",
              background: "#fef08a",
              border: "2px solid #1a1a1a",
              borderRadius: "6px",
              boxShadow: "2px 2px 0px #1a1a1a",
              fontSize: "13px",
              fontWeight: "700",
              color: "#1a1a1a",
              cursor: "pointer",
            }}
          >
            🗑️ Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default Canvas;
