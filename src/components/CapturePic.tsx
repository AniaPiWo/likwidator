"use client";
import React, { useState, useEffect, useRef } from "react";

type Props = {};

export const CapturePic = (props: Props) => {
  //states
  const [cameraError, setCameraError] = useState<string | null>(null);

  //refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.error("Failed to access camera:", err);
          setCameraError("No camera available or permission denied.");
        });
    }
  }, []);

  return (
    <div className="w-96 h-96">
      {cameraError && <p>{cameraError}</p>}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
