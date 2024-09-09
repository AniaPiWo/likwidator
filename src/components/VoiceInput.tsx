"use client";
import React, { useState, useEffect } from "react";

// Rozszerzenie typu Window o webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognition;
  }
}

// Interfejs dla SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Interfejs dla zdarzenia wyników rozpoznawania mowy
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// Interfejs dla listy wyników rozpoznawania mowy
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

// Interfejs dla pojedynczego wyniku rozpoznawania mowy
interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  readonly isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

// Interfejs dla pojedynczej alternatywy (propozycji rozpoznania)
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

// Interfejs dla błędów rozpoznawania mowy
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export const VoiceInput: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    // Dynamiczne przypisanie typu dla SpeechRecognition lub webkitSpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Twoja przeglądarka nie obsługuje Web Speech API");
      return;
    }

    // Inicjalizacja rozpoznawania mowy
    const speechRecognition = new SpeechRecognition();
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
      {transcript && (
        <>
          <h3>Rozpoznany tekst:</h3>
          <p>{transcript}</p>
        </>
      )}
    </div>
  );
};
