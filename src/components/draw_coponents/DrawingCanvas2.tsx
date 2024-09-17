"use client";
import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

interface DrawingShape {
  id: string;
  object: fabric.Object | null;
}

type ShapeType =
  | "CIRCLE"
  | "RECT"
  | "ELLIPSE"
  | "TRIANGLE"
  | "LINE"
  | "POLYGON"
  | "POLYLINE"
  | "TEXT";

interface PointerPosition {
  x: number;
  y: number;
}

export const DrawingCanvas2: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentShape, setCurrentShape] = useState<DrawingShape | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("CIRCLE");
  const [originPosition, setOriginPosition] = useState<PointerPosition>({
    x: 0,
    y: 0,
  });
  const [polygonPoints, setPolygonPoints] = useState<PointerPosition[]>([]);
  const [lines, setLines] = useState<fabric.Line[]>([]);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
      backgroundColor: "#f3f3f3",
      height: 500,
      width: 800,
    });

    setCanvas(fabricCanvas);
    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const getPointerPosition = (event: fabric.IEvent): PointerPosition => {
    return canvas?.getPointer(event.e) ?? { x: 0, y: 0 };
  };

  const handleMouseDownCircle = (event: fabric.IEvent) => {
    const pointer = getPointerPosition(event);
    const circle = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      originX: "center",
      originY: "center",
      radius: 0,
      fill: "green",
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
    });
    setCurrentShape({ id: uuidv4(), object: circle });
    canvas?.add(circle);
    setOriginPosition(pointer);
    setIsDrawing(true);
  };

  const handleMouseMoveCircle = (event: fabric.IEvent) => {
    if (!isDrawing || !currentShape?.object) return;
    const pointer = getPointerPosition(event);
    const radius = Math.hypot(
      pointer.x - originPosition.x,
      pointer.y - originPosition.y
    );
    (currentShape.object as fabric.Circle).set({ radius });
    canvas?.renderAll();
  };

  const handleMouseUpShape = () => {
    setIsDrawing(false);
    setCurrentShape(null);
  };

  const handleMouseDownPolygon = (event: fabric.IEvent) => {
    const pointer = getPointerPosition(event);
    setPolygonPoints((prev) => [...prev, pointer]);

    if (polygonPoints.length > 0) {
      const line = new fabric.Line(
        [
          polygonPoints[polygonPoints.length - 1].x,
          polygonPoints[polygonPoints.length - 1].y,
          pointer.x,
          pointer.y,
        ],
        {
          stroke: "black",
          strokeWidth: 2,
          selectable: false,
          hasControls: false,
        }
      );
      setLines((prev) => [...prev, line]);
      canvas?.add(line);
    }
  };

  const handleMouseMovePolygon = (event: fabric.IEvent) => {
    if (!isDrawing || lines.length === 0) return;
    const pointer = getPointerPosition(event);
    const lastLine = lines[lines.length - 1];
    lastLine.set({ x2: pointer.x, y2: pointer.y });
    canvas?.renderAll();
  };

  const handleDoubleClickPolygon = () => {
    if (polygonPoints.length > 2) {
      const polygon = new fabric.Polygon(polygonPoints, {
        fill: "red",
        stroke: "black",
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
      });
      canvas?.add(polygon);
      setPolygonPoints([]);
      setLines([]);
    }
  };

  useEffect(() => {
    if (!canvas) return; // Ensure canvas is available

    const handleMouseDown = (event: fabric.IEvent) => {
      switch (shapeType) {
        case "CIRCLE":
          handleMouseDownCircle(event);
          break;
        case "POLYGON":
          handleMouseDownPolygon(event);
          break;
        default:
          break;
      }
    };

    const handleMouseMove = (event: fabric.IEvent) => {
      switch (shapeType) {
        case "CIRCLE":
          handleMouseMoveCircle(event);
          break;
        case "POLYGON":
          handleMouseMovePolygon(event);
          break;
        default:
          break;
      }
    };

    const handleMouseUp = () => {
      handleMouseUpShape();
    };

    const handleDoubleClick = () => {
      if (shapeType === "POLYGON") {
        handleDoubleClickPolygon();
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("mouse:dblclick", handleDoubleClick);

    return () => {
      if (canvas) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMove);
        canvas.off("mouse:up", handleMouseUp);
        canvas.off("mouse:dblclick", handleDoubleClick);
      }
    };
  }, [shapeType, isDrawing, currentShape, polygonPoints, lines, canvas]);

  return <canvas ref={canvasRef} width={800} height={600} />;
};
