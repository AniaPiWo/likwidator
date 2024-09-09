"use client";
import React, { useState, useEffect } from "react";

export const VoiceInput: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    // Sprawdzenie, czy przeglądarka obsługuje Web Speech API
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Twoja przeglądarka nie obsługuje Web Speech API");
      return;
    }

    // Inicjalizacja rozpoznawania mowy
    const speechRecognition = new (window as any).webkitSpeechRecognition();
    speechRecognition.lang = "pl-PL"; // Ustawienie języka na polski
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;

    // Gdy rozpoznawanie zakończone poprawnie
    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    // Gdy rozpoznawanie mowy zostanie zakończone
    speechRecognition.onend = () => {
      setListening(false);
    };

    setRecognition(speechRecognition);
  }, []);

  const handleListen = () => {
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

  return (
    <div>
      <button
        onClick={handleListen}
        style={{ fontSize: "24px", padding: "10px", cursor: "pointer" }}
      >
        🎤 {listening ? "Zatrzymaj nasłuchiwanie" : "Rozpocznij nasłuchiwanie"}
      </button>
      <div>
        <h3>Rozpoznany tekst:</h3>
        <p>{transcript || "Brak tekstu"}</p>
      </div>
    </div>
  );
};
