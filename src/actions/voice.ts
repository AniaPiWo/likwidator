"use server";
import { vercelSDK, openai } from "@/lib/openai";
import { z } from "zod";

const audioSchema = z.object({
  file: z.instanceof(File).describe("Audio file for transcription"),
});

export async function transcribeAudio(file: File): Promise<string> {
  const parsed = audioSchema.parse({ file });

  // Zamiast korzystania z fs.createReadStream, przekazujemy obiekt File bezpośrednio
  const transcription = await openai.audio.transcriptions.create({
    file: file, // Bezpośrednio przesyłamy obiekt File
    model: "whisper-1",
    response_format: "text",
  });

  return transcription.text;
}
