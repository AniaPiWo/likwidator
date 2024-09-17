"use client";
import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";
import { IoTriangleOutline, IoRemoveOutline } from "react-icons/io5";
import { BiRectangle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";

type Props = {};

export const DrawingCanvas = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [textInput, setTextInput] = useState<string>("");

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
      backgroundColor: "#f3f3f3",
      height: 500,
      width: 1000,
    });

    setCanvas(fabricCanvas);

    // zeby canvas byl od razu widoczny
    const placeholderText = new fabric.FabricText(".", {
      left: 1,
      top: 1,
      fontSize: 30,
      fill: "#f3f3f3",
      fontFamily: "Roboto, sans-serif",
    });
    fabricCanvas.add(placeholderText);

    // Allow editing text directly by double-clicking on the text object
    fabricCanvas.on("mouse:dblclick", (options) => {
      if (options.target && options.target.type === "text") {
        const textObject = options.target as fabric.IText;
        textObject.enterEditing();
        textObject.selectAll();
      }
    });

    // Irregularly drawn lines (Path)
    let isDrawing = false;
    let points: { x: number; y: number }[] = [];
    let activePath: fabric.Path | null = null; // Track the active path

    // Start drawing
    fabricCanvas.on("mouse:down", (options) => {
      // If an object is selected, don't start drawing
      if (options.target) {
        isDrawing = false;
        return;
      }

      isDrawing = true;
      points = [];
      const pointer = fabricCanvas.getPointer(options.e);
      points.push({ x: pointer.x, y: pointer.y });
    });

    // Continue drawing
    fabricCanvas.on("mouse:move", (options) => {
      if (!isDrawing) return;
      const pointer = fabricCanvas.getPointer(options.e);
      points.push({ x: pointer.x, y: pointer.y });
      const pathData =
        `M ${points[0].x} ${points[0].y} ` +
        points
          .slice(1)
          .map((p) => `L ${p.x} ${p.y}`)
          .join(" ");

      if (activePath) {
        fabricCanvas.remove(activePath); // Remove the previous path
      }

      activePath = new fabric.Path(pathData, {
        stroke: "black",
        fill: "transparent",
        selectable: false,
        strokeWidth: 1,
      });
      fabricCanvas.add(activePath);
      fabricCanvas.renderAll();
    });

    // Finish drawing
    fabricCanvas.on("mouse:up", () => {
      isDrawing = false;
      points = [];
      activePath = null;
      fabricCanvas.selection = true;
    });

    return () => {
      fabricCanvas.dispose();
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

  const handleAddPath = () => {
    if (canvas) {
      const path = new fabric.Path("M 0 0 L 100 100", {
        stroke: "black",
        strokeWidth: 1,
      });
      canvas.add(path);
    }
  };

  const handleAddText = () => {
    if (canvas && textInput.trim()) {
      const text = new fabric.IText(textInput, {
        left: 400,
        top: 400,
        fontSize: 24,
        fill: "black",
        fontFamily: "Roboto, sans-serif",
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      setTextInput("");
    }
  };

  return (
    <div className="container flex flex-col items-center gap-2">
      <div className="buttonbox flex gap-2">
        <button className="btn btn-primary" onClick={handleAddRectangle}>
          <BiRectangle />
        </button>
        <button className="btn btn-primary" onClick={handleAddCircle}>
          <FaRegCircle />
        </button>
        <button className="btn btn-primary" onClick={handleAddTriangle}>
          <IoTriangleOutline />
        </button>
        <button className="btn btn-primary" onClick={handleAddLine}>
          <IoRemoveOutline />
        </button>
        <button className="btn btn-primary" onClick={handleAddPath}>
          Add Path
        </button>
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text here"
            className="input input-bordered"
          />
          <button className="btn btn-primary" onClick={handleAddText}>
            T
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
};
