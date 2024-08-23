"use client";
import React, { useState, useEffect, useRef } from "react";
import { TbCapture } from "react-icons/tb";
import Image from "next/image";
import { saveImageToDatabase } from "@/actions/image";

type Props = {};

export const CapturePic = (props: Props) => {
  // states
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = () => {
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
  };

  useEffect(() => {
    startCamera();

    // Cleanup on component unmount
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        setImage(canvasRef.current.toDataURL("image/png"));
      }
    }
  };

  const saveImage = async () => {
    if (!image) {
      return;
    }
    try {
      const imageId = await saveImageToDatabase(image);
      if (!imageId) {
        setMsg("Failed to save image");
      }
      setImage(null);
      setMsg("Image saved successfully");
    } catch (error) {
      setMsg("Failed to save image");
    }
  };

  const handleCancel = () => {
    setImage(null);
    setMsg(null);
    startCamera(); // Restart the camera when cancelling
  };

  return (
    <>
      <div className="w-96 h-96">
        {cameraError && <p>{cameraError}</p>}
        {msg && <p className="text-pink-500">{msg}</p>}
        {image ? (
          <Image src={image} alt="Captured image" width={400} height={400} />
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        <div className="flex justify-center items-center gap-4 m">
          {image ? (
            <>
              <button
                className="rounded-full h-20 w-20 flex justify-center items-center p-1 border border-white-700 bg-white-700 text-white"
                onClick={saveImage}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="rounded-full h-20 w-20 flex justify-center items-center p-1 border border-white-700 bg-white-700 text-white"
              >
                <p className="px-2">Retake</p>
              </button>
            </>
          ) : (
            <button
              onClick={captureImage}
              className="rounded-full h-20 w-20 flex justify-center items-center p-1 border border-white-700 bg-white-700 text-white"
            >
              <TbCapture />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
