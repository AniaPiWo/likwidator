"use client";
import React, { useRef, useState, useEffect } from "react";

export const SquareCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const startDrawing = (e: MouseEvent) => {
      setIsDrawing(true);
      setStartPos({
        x: e.offsetX,
        y: e.offsetY,
      });
    };

    const drawSquare = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = x2 - x1;
      const height = y2 - y1;
      const sideLength = Math.min(Math.abs(width), Math.abs(height));

      const correctedX = width < 0 ? x1 - sideLength : x1;
      const correctedY = height < 0 ? y1 - sideLength : y1;

      ctx.strokeRect(correctedX, correctedY, sideLength, sideLength);
    };

    const drawing = (e: MouseEvent) => {
      if (!isDrawing) return;
      const currentX = e.offsetX;
      const currentY = e.offsetY;
      drawSquare(startPos.x, startPos.y, currentX, currentY);
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", drawing);
      canvas.removeEventListener("mouseup", stopDrawing);
    };
  }, [isDrawing, startPos]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};
