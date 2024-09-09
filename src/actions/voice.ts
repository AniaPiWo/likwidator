export async function transcribeAudio(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // Pobierz wiadomość z błędem z odpowiedzi serwera, aby uzyskać więcej informacji
      const errorMessage = await response.text();
      console.error("Error response from server:", errorMessage);
      throw new Error(`Error during transcription: ${errorMessage}`);
    }

    const data = await response.json();
    return data.transcription;
  } catch (error) {
    console.error("Error during transcription process:", error);
    throw new Error(`Error during transcription: ${error}`);
  }
}
