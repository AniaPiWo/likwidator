"use client";
import { useState, useRef } from "react";
import { CopyIcon, MicIcon } from "@/components/ui/icon";
import { toast, Toaster } from "sonner";

export default function WhisperComponent() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  //const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const startRecording = async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          //type: isSafari ? "audio/mp4" : "audio/mp3",
          type: "audio/mp3",
        });
        sendAudioToAPI(audioBlob); // wysyłamy plik audio do API route
        audioChunksRef.current = [];
      };

      //mediaRecorderRef.current.start(isSafari ? 1000 : 0);
      mediaRecorderRef.current.start(0);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError(
        "Could not access the microphone. Please ensure you have given permission to use it."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToAPI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audioBlob", audioBlob);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      setTranscript(data.transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setError(error?.toString() as string);
    }
  };

  const copyTranscript = () => {
    navigator.clipboard
      .writeText(transcript)
      .then(() => toast.success("Copied successfully!"))
      .catch((err: Error) => console.error("Failed to copy transcript: ", err));
  };

  return (
    <main>
      <div>
        <div>
          <button onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? "Stop" : "Record"}
          </button>
          <div>
            {isRecording
              ? "Recording... Click to stop."
              : "Click to start recording."}
          </div>

          {error && <div style={{ color: "red" }}>{error}</div>}

          {transcript && (
            <div>
              <button onClick={copyTranscript}>
                <CopyIcon />
                Copy
              </button>
              <p>{transcript}</p>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </main>
  );
}
