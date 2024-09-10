import { openai } from "@/lib/openai";

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.mp3");

    const response = await openai.audio.transcriptions.create({
      file: new File([formData.get("file") as Blob], "audio.mp3"),
      model: "whisper-1",
      language: "pl",
      response_format: "text",
    });
    return response.text;
  } catch (error) {
    console.error("Failed to transcribe audio:", error);
    throw new Error("Failed to transcribe audio");
  }
}
