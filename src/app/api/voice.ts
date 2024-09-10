import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/lib/openai";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { audioBlob } = req.body;
    console.log("audioBlob", audioBlob);
    const response = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: "whisper-1",
      response_format: "text",
    });

    res.status(200).json({ transcription: response.text });
  } catch (error) {
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
}
