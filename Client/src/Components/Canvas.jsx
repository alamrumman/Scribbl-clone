import { useEffect, useRef, useState } from "react";
import { socket } from "@/socket";

function Canvas({ isDrawer, roomCode }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState("pen"); // pen or eraser

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    // Scale mouse position to canvas actual resolution
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

  // Listen for remote strokes + clear
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
    "#000000", "#ffffff", "#ef4444", "#f97316",
    "#eab308", "#22c55e", "#3b82f6", "#8b5cf6",
    "#ec4899", "#78716c", "#0ea5e9", "#14b8a6",
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border-2 border-gray-300 rounded bg-white touch-none w-full max-w-2xl"
        style={{ cursor: isDrawer ? (tool === "eraser" ? "cell" : "crosshair") : "default" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Toolbar — only visible to drawer */}
      {isDrawer && (
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded border w-full max-w-2xl">
          
          {/* Color Palette */}
          <div className="flex flex-wrap gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setTool("pen"); }}
                className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  borderColor: color === c && tool === "pen" ? "#6366f1" : "#d1d5db",
                  transform: color === c && tool === "pen" ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300" />

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Size</span>
            <input
              type="range"
              min="2"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
            <div
              className="rounded-full bg-black"
              style={{ width: brushSize, height: brushSize }}
            />
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300" />

          {/* Eraser */}
          <button
            onClick={() => setTool(tool === "eraser" ? "pen" : "eraser")}
            className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${
              tool === "eraser"
                ? "bg-indigo-500 text-white border-indigo-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            🧹 Eraser
          </button>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="px-3 py-1 rounded text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default Canvas;