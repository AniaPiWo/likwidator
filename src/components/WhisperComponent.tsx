"use client";
import { useState, useRef } from "react";
import { CopyIcon, MicIcon } from "@/components/ui/icon";
import { toast, Toaster } from "sonner";

export default function WhisperComponent() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const startRecording = async () => {
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
    formData.append("file", audioBlob, `audio.mp3`);
    formData.append("model", "whisper-1");

    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is not set in environment variables");
      }

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data: { text: string } = await response.json();
      setTranscript(data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setTranscript(error?.toString() as string);
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
    </main>
  );
}
