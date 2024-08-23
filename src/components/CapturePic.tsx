"use client";
import React, { useState, useEffect, useRef } from "react";
import { TbCapture } from "react-icons/tb";
import Image from "next/image";
import { saveImageToDatabase } from "@/actions/image";

type Props = {};

export const CapturePic = (props: Props) => {
  //states
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

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
        console.log(image);
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      const imageId = await saveImageToDatabase(image);
      if (imageId) {
        setMsg("Image saved successfully");
      } else {
        setMsg("Failed to save image");
      }
    }
  };

  const handleCancel = () => {
    setImage(null);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks() || [];
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <>
      <div className="w-96 h-96">
        {cameraError && <p>{cameraError}</p>}
        {msg && <p className="text-pink-500">{msg}</p>}
        {image ? (
          <Image src={image} alt="Captured image" width={300} height={300} />
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

        <div>
          <button
            onClick={captureImage}
            className="rounded-full h-20 w-20 flex justify-center items-center bg-violet-700 text-white"
          >
            <TbCapture />
          </button>
          <button
            onClick={handleCancel}
            className="rounded-full w-32 px-8 py-4 border border-purple-900 text-purple-900 flex items-center justify-center"
          >
            <p className="px-2">Cancel</p>
          </button>
        </div>
      </div>
    </>
  );
};
