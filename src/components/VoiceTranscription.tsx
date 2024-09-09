"use client";
import React, { useState, useRef } from "react";
import { transcribeAudio } from "@/actions/voice"; // Importujemy funkcję serwerową

export const VoiceTranscription: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Dodany stan błędów
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null); // Reset błędu przy każdym nowym nagraniu
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
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/mp3",
          });

          const file = new File([audioBlob], "recording.mp3", {
            type: "audio/mp3",
          });

          // Wywołanie funkcji do API route
          const transcriptionText = await transcribeAudio(file);
          setTranscription(transcriptionText);
        } catch (error) {
          setError(error?.toString() as string);
        }
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      setError(error?.toString() as string);
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

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {transcription && (
        <div>
          <h2>Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};
