"use client";
import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";
import { IoTriangleOutline, IoRemoveOutline } from "react-icons/io5";
import { BiRectangle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { BsBrush } from "react-icons/bs";

type Props = {};

export const DrawingCanvas2 = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [brushColor, setBrushColor] = useState<string>("black");

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#f3f3f3",
      isDrawingMode: true, // Enable drawing mode initially
    });

    // Resize the canvas to 100% width and height of its parent
    function resizeCanvas() {
      const parent = canvasRef.current?.parentNode;
      if (!parent) return;
      const parentElement = parent as HTMLElement;
      fabricCanvas.setWidth(parentElement.clientWidth);
      fabricCanvas.setHeight(parentElement.clientHeight);
      fabricCanvas.renderAll();
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Set initial brush settings
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = brushColor;
    fabricCanvas.freeDrawingBrush.width = brushSize;

    setCanvas(fabricCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      fabricCanvas.dispose();
    };
  }, []);

  // Handle Brush Selection
  const handleBrushSelection = (type: string) => {
    if (!canvas) return;

    switch (type) {
      case "pen":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        break;
      case "brush":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = brushColor;
        if (canvas.freeDrawingBrush) {
          if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = brushSize;
          }
        }
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
          blur: 10,
          offsetX: 0,
          offsetY: 0,
          affectStroke: true,
          color: brushColor,
        });
        break;
      case "eraser":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        break;
      default:
        canvas.isDrawingMode = false;
    }
    canvas.renderAll();
  };

  // Handle Brush Size Change
  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
    if (canvas && canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = size;
    }
  };

  // Handle Brush Color Change
  const handleBrushColorChange = (color: string) => {
    setBrushColor(color);
    if (canvas && canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  // Add shapes and other elements to canvas
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

  const handleAddDashedLine = () => {
    if (canvas) {
      const dashedLine = new fabric.Line([50, 50, 200, 200], {
        stroke: "black",
        strokeWidth: 2,
        strokeDashArray: [10, 5],
      });
      canvas.add(dashedLine);
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

  const handleDeleteSelectedObject = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  };

  const handleClearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#f3f3f3";
      canvas.renderAll();
    }
  };

  const handleSaveCanvas = () => {
    if (canvas) {
      const canvasData = canvas.toJSON();
      console.log("Canvas JSON data:", canvasData);

      // Copy canvasData to clipboard
      const canvasDataString = JSON.stringify(canvasData);
      navigator.clipboard
        .writeText(canvasDataString)
        .then(() => {
          console.log("Canvas data copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy canvas data to clipboard:", err);
        });
    }
  };

  return (
    <div className="container flex flex-col justify-center gap-2 w-full h-full ">
      <div className="flex flex-col gap-2 sm:flex-row flex-wrap justify-start sm:justify-center">
        <div className="flex sm:flex-row items-start justify-start gap-2 ">
          <button
            className="btn btn-primary"
            onClick={() => handleBrushSelection("pen")}
          >
            Pen
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleBrushSelection("brush")}
          >
            <BsBrush />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleBrushSelection("eraser")}
          >
            Eraser
          </button>
        </div>

        {/* Brush size and color controls */}
        <div className="flex gap-2">
          <label>Brush Size:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
          />
          <label>Color:</label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => handleBrushColorChange(e.target.value)}
          />
        </div>

        {/* Existing shape and text controls */}
        <div className="flex gap-2">
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
          <button className="btn btn-primary" onClick={handleAddDashedLine}>
            - -
          </button>
        </div>

        {/* Text and delete controls */}
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
          <button
            className="btn btn-primary"
            onClick={handleDeleteSelectedObject}
          >
            Delete
          </button>
        </div>

        {/* Canvas actions */}
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={handleClearCanvas}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleSaveCanvas}>
            Save
          </button>
        </div>
      </div>

      {/* Canvas Element */}
      <div className="w-full h-96">
        <canvas className="w-full h-full" ref={canvasRef} />
      </div>
    </div>
  );
};
