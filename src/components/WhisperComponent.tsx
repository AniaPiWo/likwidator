"use client";
import { useState, useRef } from "react";
import { CopyIcon, MicIcon } from "@/components/ui/icon";
import { toast, Toaster } from "sonner";
import { openai } from "@/lib/openai"; // Importowanie klienta OpenAI

export default function WhisperComponent() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Dodany stan błędów
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const startRecording = async () => {
    setError(null); // Reset błędu przed każdą próbą nagrywania

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
          type: isSafari ? "audio/mp4" : "audio/mp3",
        });
        sendAudioToWhisperAPI(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start(isSafari ? 1000 : 0);
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

  const sendAudioToWhisperAPI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.mp3");
    formData.append("model", "whisper-1");

    try {
      // Korzystanie z klienta OpenAI do wysłania zapytania
      const response = await openai.audio.transcriptions.create({
        file: new File([audioBlob], "audio.mp3"),
        model: "whisper-1",
        response_format: "text",
      });

      setTranscript(response.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setError(error?.toString() as string);
    }
  };

  const copyTranscript = () => {
    navigator.clipboard
      .writeText(transcript)
      .then(() => {
        toast.success("Copied successfully!");
      })
      .catch((err: Error) => {
        console.error("Failed to copy transcript: ", err);
      });
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

          {/* Wyświetlanie błędu jeśli mikrofon nie jest dostępny */}
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
