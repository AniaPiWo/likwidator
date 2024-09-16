"use client";
import React, { useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDrawing(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const endPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(endPos.x, endPos.y);
      ctx.stroke();
    }

    setDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ border: "1px solid black" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};
