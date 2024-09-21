"use client";
import React, { useState } from "react";
import WhisperComponent from "./WhisperComponent";

type WhisperData = {
  id: number;
  transcript: string;
  selectedLabel: string;
  customLabel?: string;
};

type Props = {};

export const Form = (props: Props) => {
  // State to hold multiple WhisperComponent instances and their data
  const [whisperComponents, setWhisperComponents] = useState<WhisperData[]>([
    { id: 0, transcript: "", selectedLabel: "", customLabel: "" },
  ]);

  // Function to add a new WhisperComponent
  const addNewComponent = () => {
    const newId = whisperComponents.length;
    setWhisperComponents([
      ...whisperComponents,
      { id: newId, transcript: "", selectedLabel: "", customLabel: "" },
    ]);
  };

  // Function to update data from each WhisperComponent
  const handleComponentChange = (id: number, data: WhisperData) => {
    setWhisperComponents((prev) =>
      prev.map((component) =>
        component.id === id ? { ...component, ...data } : component
      )
    );
  };

  // Submit data to your backend (Prisma)
  const handleSubmit = async () => {
    try {
      console.log(whisperComponents);
      alert("Notatka zapisana pomyślnie!");
    } catch (error) {
      console.error("Wystąpił bład podczas zapisywania notatki:", error);
      alert("Nie udało się zapisać notatki.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {whisperComponents.map((component, index) => (
        <WhisperComponent
          key={component.id}
          data={component}
          onChange={handleComponentChange}
        />
      ))}
      <div className="flex justify-center gap-4">
        <button
          onClick={addNewComponent}
          className="mt-4 text-white px-4 py-2 bg-pink-500"
        >
          Nowa notatka
        </button>
        <button
          onClick={handleSubmit}
          className="mt-4 text-white px-4 py-2 bg-green-500"
        >
          Zapisz notatki
        </button>
      </div>
    </div>
  );
};
