"use client";
import * as fabric from "fabric"; // v6
import { useState, useRef, useEffect } from "react";

// Define the interface for the canvas reference
interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width = 300,
  height = 300,
}) => {
  const canvased = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [line, setLine] = useState<fabric.Line | null>(null);

  useEffect(() => {
    if (canvased.current && !fabricCanvas.current) {
      fabricCanvas.current = new fabric.Canvas(canvased.current);

      // Enable drawing mode for lines
      fabricCanvas.current.on("mouse:down", (event) => {
        startDrawing(event);
      });

      fabricCanvas.current.on("mouse:move", (event) => {
        if (isDrawing) {
          updateDrawing(event);
        }
      });

      fabricCanvas.current.on("mouse:up", () => {
        finishDrawing();
      });
    }

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
        fabricCanvas.current = null;
      }
    };
  }, [isDrawing]);

  const startDrawing = (event: fabric.TEvent) => {
    if (fabricCanvas.current) {
      const pointer = fabricCanvas.current.getPointer(event.e);
      const newLine = new fabric.Line(
        [pointer.x, pointer.y, pointer.x, pointer.y],
        {
          stroke: "black",
          strokeWidth: 2,
          selectable: false,
        }
      );
      fabricCanvas.current.add(newLine);
      setLine(newLine);
      setIsDrawing(true);
    }
  };

  const updateDrawing = (event: fabric.TEvent) => {
    if (fabricCanvas.current && line) {
      const pointer = fabricCanvas.current.getPointer(event.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      fabricCanvas.current.renderAll();
    }
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    setLine(null);
  };

  return (
    <div className="container">
      <div
        style={{
          position: "absolute",
          border: "1px dotted gray",
          top: "30%",
          left: "30%",
        }}
      >
        <canvas width={width} height={height} ref={canvased} />
      </div>
    </div>
  );
};
