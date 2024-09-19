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
    if (!canvasRef.current) return;

    const resizeCanvas = () => {
      if (canvasRef.current && canvas) {
        // Ustawienie szerokości i wysokości płótna na podstawie rodzica
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvas.setWidth(parent.clientWidth);
          canvas.setHeight(parent.clientHeight);
          canvas.renderAll();
        }
      }
    };

    // Tworzenie płótna z początkowymi wymiarami rodzica
    const parent = canvasRef.current.parentElement;
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#f3f3f3",
      height: parent ? parent.clientHeight : 1000,
      width: parent ? parent.clientWidth : 1000,
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

    // Helper function to disable object selection
    const disableObjectSelection = () => {
      fabricCanvas.selection = false;
      fabricCanvas.forEachObject((obj) => {
        obj.selectable = false;
      });
    };

    // Helper function to enable object selection
    const enableObjectSelection = () => {
      fabricCanvas.selection = true;
      fabricCanvas.forEachObject((obj) => {
        obj.selectable = true;
      });
    };

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

      // Disable object selection during drawing
      disableObjectSelection();
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

      // Re-enable object selection
      enableObjectSelection();
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

  /*   const handleAddPath = () => {
    if (canvas) {
      const path = new fabric.Path("M 0 0 L 100 100", {
        stroke: "black",
        strokeWidth: 1,
      });
      canvas.add(path);
    }
  }; */

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
    }
  };

  return (
    <div className="container flex flex-col items-center gap-2 p-4 border-b">
      <div className="buttonbox flex justify-start gap-2">
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
          przerywana linia
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
          <button className="btn btn-primary" onClick={handleClearCanvas}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleSaveCanvas}>
            Save
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
};
