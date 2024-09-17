"use client";
import React, { useRef, useEffect } from "react";
import * as fabric from "fabric";

type Props = {};

export const FabricTutorial = (props: Props) => {
  //create a ref to hold the canvas DOM element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);

  //useEffect to perform side effects
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      backgroundColor: "#f3f3f3",
      height: 500,
      width: 800,
    });

    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleAddRectangle = () => {
    if (canvas) {
      const rectangle = new fabric.Rect({
        left: Math.random() * 400,
        top: Math.random() * 400,
        width: 100,
        height: 100,
        fill: null,
        stroke: "black",
        strokeWidth: 1,
      });
      canvas.add(rectangle);
    }
  };

  const handleAddCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        left: Math.random() * 400,
        top: Math.random() * 400,
        fill: null,
        stroke: "black",
        strokeWidth: 1,
        radius: 50,
      });
      canvas.add(circle);
    }
  };

  const handleAddTriangle = () => {
    if (canvas) {
      const triangle = new fabric.Triangle({
        left: 300,
        top: 300,
        width: 100,
        height: 100,
        fill: null,
        stroke: "black",
        strokeWidth: 1,
      });
      canvas.add(triangle);
    }
  };

  const handleAddLine = () => {
    if (canvas) {
      const line = new fabric.Line([50, 50, 200, 200], {
        stroke: "black",
        strokeWidth: 1,
      });
      canvas.add(line);
    }
  };

  const handleAddText = () => {
    if (canvas) {
      const text = new fabric.Text("Hello, World!", {
        left: 400,
        top: 400,
        fontSize: 24,
        fill: "black",
      });
      canvas.add(text);
    }
  };

  return (
    <div className="container flex gap-2">
      <div className="buttonbox flex flex-col gap-2">
        <button className="btn btn-primary" onClick={handleAddRectangle}>
          Add Rectangle
        </button>
        <button className="btn btn-primary" onClick={handleAddCircle}>
          Add Circle
        </button>
        <button className="btn btn-primary" onClick={handleAddTriangle}>
          Add Triangle
        </button>
        <button className="btn btn-primary" onClick={handleAddLine}>
          Add Line
        </button>
        <button className="btn btn-primary" onClick={handleAddText}>
          Add Text
        </button>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
};
