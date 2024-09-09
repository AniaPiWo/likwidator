"use client";
import React, { useState, useRef } from "react";
import { transcribeAudio } from "@/actions/voice"; // Importujemy funkcję serwerową

export const VoiceTranscription: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });

        const file = new File([audioBlob], "recording.mp3", {
          type: "audio/mp3",
        });

        // Wywołanie funkcji serwerowej bez API route
        const transcriptionText = await transcribeAudio(file);
        setTranscription(transcriptionText);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing the microphone: ", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  return (
    <div>
      <h1>Voice Transcription</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {transcription && (
        <div>
          <h2>Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};
