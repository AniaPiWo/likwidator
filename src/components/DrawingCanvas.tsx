"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#f3f3f3",
        height: 500,
        width: 800,
      });

      fabricCanvasRef.current = fabricCanvas;

      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 100,
        height: 100,
      });
      fabricCanvas.add(rect);
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  const handleAddRectangle = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        width: 80,
        height: 80,
        fill: "blue",
      });
      fabricCanvas.add(rect);
    }
  };

  return (
    <div>
      <button onClick={handleAddRectangle}>Add Rectangle</button>
      {/* Element canvas do rysowania */}
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DrawingCanvas;
