"use client";
import { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaRegCircleStop } from "react-icons/fa6";
import { transcribeAudio } from "@/actions/voice";
type WhisperComponentProps = {
  data: {
    id: number;
    transcript: string;
    selectedLabel: string;
    customLabel?: string;
  };
  onChange: (id: number, data: any) => void;
};

export default function WhisperComponent({
  data,
  onChange,
}: WhisperComponentProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>(data.transcript);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    data.selectedLabel
  );
  const [error, setError] = useState<string | null>(null);
  const [customLabel, setCustomLabel] = useState<string>(
    data.customLabel || ""
  );
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const labels = ["Label 1", "Label 2", "Label 3", "Label 4", "Custom Label"];

  useEffect(() => {
    // Pass the data up to the parent whenever state changes
    onChange(data.id, { transcript, selectedLabel, customLabel });
  }, [transcript, selectedLabel, customLabel]);

  useEffect(() => {
    // Dynamically resize the textarea based on its content
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [transcript]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLabel(e.target.value);
    if (e.target.value !== "Custom Label") {
      setCustomLabel("");
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      mediaRecorder?.stop();
setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);

        const chunks: Blob[] = [];
        newMediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        newMediaRecorder.onstop = async () => {
          setIsTranscribing(true);
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          try {
            const transcription = await transcribeAudio(audioBlob);
            setIsTranscribing(false);
            setTranscript(transcription);
          } catch (error) {
            setError("Transcription failed: " + error);
          }
        };

        newMediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        setError("Failed to access microphone: " + error);
      }
    }
  };

  return (
    <main>
      <div className="flex gap-4 justify-center">
        <form className="flex flex-col gap-4 justify-center w-full md:w-1/2 p-4  relative">
          {/* Select dropdown for labels */}
          <div className="mt-4">
            <select
              value={selectedLabel}
              onChange={handleLabelChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Choose a label</option>
              {labels.map((label, index) => (
                <option key={index} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {/* Input field for custom label */}
          {selectedLabel === "Custom Label" && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Enter Custom Label:
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Type your custom label"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {/* Dynamically resizable textarea */}
          <div className="relative">
            <textarea
              rows={2}
              ref={textareaRef}
              className="relative w-full p-2 pl-14 border border-white resize-none overflow-hidden flex items-center justify-center h-full"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={
                isRecording
                  ? "Listening..."
                  : isTranscribing
                  ? "Transcribing..."
                  : "Start recording by clicking on the microphone button"
              }
            />

            <button
              type="button"
              className="absolute p-2 left-3 top-8 transform -translate-y-1/2 text-gray-500 "
              onClick={handleRecording}
            >
              {isRecording ? (
                <FaRegCircleStop className="text-red-500" />
              ) : (
                <FaMicrophone className="text-blue-500" />
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
