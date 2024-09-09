export async function transcribeAudio(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error during transcription");
  }

  const data = await response.json();
  return data.transcription;
}
