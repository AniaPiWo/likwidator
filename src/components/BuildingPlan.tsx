"use client";
import React, { useRef, useState, useEffect, MouseEvent } from "react";

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const BuildingPlan: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Wyczyszczenie płótna
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Rysowanie wszystkich prostokątów
        rectangles.forEach((rect) => {
          ctx.beginPath();
          ctx.rect(rect.x, rect.y, rect.width, rect.height);
          ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
          ctx.fill();
          ctx.stroke();
        });

        // Rysowanie aktualnie rysowanego prostokąta
        if (currentRect) {
          ctx.beginPath();
          ctx.rect(
            currentRect.x,
            currentRect.y,
            currentRect.width,
            currentRect.height
          );
          ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }, [rectangles, currentRect]);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      setCurrentRect({ x: startX, y: startY, width: 0, height: 0 });
      setDrawing(true);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !currentRect) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const width = mouseX - currentRect.x;
      const height = mouseY - currentRect.y;

      setCurrentRect({ ...currentRect, width, height });
    }
  };

  const handleMouseUp = () => {
    if (drawing && currentRect) {
      setRectangles([...rectangles, currentRect]);
      setCurrentRect(null);
      setDrawing(false);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <p>Click and drag to draw rooms (rectangles).</p>
    </div>
  );
};
