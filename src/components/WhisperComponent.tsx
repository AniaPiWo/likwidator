"use client";
import { useState, useRef } from "react";
import { CopyIcon, MicIcon } from "@/components/ui/icon";
import { toast, Toaster } from "sonner";
import { transcribeAudio } from "@/actions/voice";

export default function WhisperComponent() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        audioChunksRef.current = [];

        try {
          const transcription = await transcribeAudio(audioBlob);
          setTranscript(transcription);
        } catch (error) {
          console.error("Error during transcription:", error);
          setError((error as Error).toString());
        }
      };

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

  const handleTranscriptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTranscript(e.target.value);
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
              <textarea
                value={transcript}
                onChange={handleTranscriptChange}
                rows={5}
                cols={50}
              />
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </main>
  );
}
