"use client";
import React, { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Nowy stan dla błędów
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    // Dynamiczne przypisanie typu dla SpeechRecognition lub webkitSpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Twoja przeglądarka nie obsługuje Web Speech API");
      return;
    }

    // Inicjalizacja rozpoznawania mowy
    const speechRecognition = new SpeechRecognition();
    speechRecognition.lang = "pl-PL"; // Ustawienie języka na polski
    speechRecognition.continuous = false;
    speechRecognition.interimResults = true; // Wyniki pośrednie będą wyświetlane na bieżąco

    // Gdy rozpoznawanie zakończone poprawnie
    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setTranscript((prev) => prev + result[0].transcript);
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscript(interimTranscript); // Ustawianie tymczasowego tekstu
    };

    // Gdy rozpoznawanie mowy zostanie zakończone
    speechRecognition.onend = () => {
      setListening(false);
    };

    // Obsługa błędów
    speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setErrorMessage(
        `Błąd rozpoznawania mowy: ${event.error}. Szczegóły: ${event.message}`
      );
    };

    setRecognition(speechRecognition);
  }, []);

  const handleListen = () => {
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setErrorMessage(null); // Resetowanie błędu przy nowym nasłuchiwaniu
      recognition.start();
      setTranscript(""); // Zresetowanie transkryptu przy rozpoczęciu nowego nasłuchiwania
      setListening(true);
    }
  };

  return (
    <div>
      <button
        onClick={handleListen}
        style={{
          fontSize: "24px",
          padding: "10px",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          animation: listening ? "rotate-half 1s infinite linear" : "none",
        }}
      >
        <FaMicrophone />
      </button>
      {transcript && (
        <>
          <p>{transcript}</p>
        </>
      )}
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Błąd:</strong> {errorMessage}
        </div>
      )}

      <style>
        {`
      @keyframes rotate-half {
        0% {
          transform: rotate(0deg);
        }
        50% {
          transform: rotate(180deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}
      </style>
    </div>
  );
};
