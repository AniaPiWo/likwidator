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
  const [isHighlightBrushActive, setIsHighlightBrushActive] = useState(false);

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#f3f3f3",
    });

    // Function to resize canvas to 100% width and height of its parent
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

    // Disable free drawing mode initially
    fabricCanvas.isDrawingMode = false;

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
      if (fabricCanvas.isDrawingMode) return; // Do not use path drawing if in drawing mode

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
      if (!isDrawing || fabricCanvas.isDrawingMode) return;
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
      window.removeEventListener("resize", resizeCanvas);
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

  const handleActivateHighlightBrush = () => {
    if (canvas) {
      const highlightBrush = new fabric.PencilBrush(canvas);
      highlightBrush.color = "rgba(255, 0, 0, 0.3)"; // Red with 30% opacity
      highlightBrush.width = 30; // Brush size

      canvas.isDrawingMode = !canvas.isDrawingMode;
      canvas.freeDrawingBrush = highlightBrush;
      setIsHighlightBrushActive(canvas.isDrawingMode);
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Delete" || event.key === "Del") {
      handleDeleteSelectedObject();
    }
  });

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

      // Kopiowanie canvasData do schowka
      /*       const canvasDataString = JSON.stringify(canvasData);
      navigator.clipboard
        .writeText(canvasDataString)
        .then(() => {
          console.log("Canvas data copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy canvas data to clipboard:", err);
        }); */
    }
  };

  // Function to add a door symbol to the canvas
  const handleAddDoor = () => {
    if (canvas) {
      const doorPath = new fabric.Path(
        "M 30 30 L 30 70 M 30 70 A 40 40 0 0 0 70 30",
        {
          left: 100,
          top: 100,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 1,
        }
      );
      canvas.add(doorPath);
    }
  };

  // Function to add a window symbol to the canvas
  const handleAddWindow = () => {
    if (canvas) {
      const windowPath = new fabric.Path(
        "M 30 30 L 30 70 M 30 70 A 40 40 0 0 0 70 30",
        {
          left: 200,
          top: 200,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 1,
          strokeDashArray: [5, 5], // Dashed line
        }
      );
      canvas.add(windowPath);
    }
  };

  return (
    <div className="container flex flex-col justify-center gap-2  w-full h-full ">
      <div className="flex flex-col gap-2 sm:flex-row flex-wrap justify-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex sm:flex-row items-start justify-start gap-2 ">
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
            <button className="btn btn-primary" onClick={handleAddDoor}>
              Drzwi
            </button>
            <button className="btn btn-primary" onClick={handleAddWindow}>
              Okno
            </button>
          </div>
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
              className={`btn btn-primary ${
                isHighlightBrushActive ? "btn-active" : ""
              }`}
              onClick={handleActivateHighlightBrush}
            >
              {isHighlightBrushActive ? "Szkoda" : "Ołówek"}
            </button>

            <button
              className="btn btn-primary"
              onClick={handleDeleteSelectedObject}
            >
              Usuń
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={handleClearCanvas}>
            Wyczyść
          </button>
          <button className="btn btn-primary" onClick={handleSaveCanvas}>
            Zapisz
          </button>
        </div>
      </div>
      <div className="w-full h-96">
        <canvas className="w-full h-full" ref={canvasRef} />
      </div>
    </div>
  );
};
