import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/lib/openai"; // Import OpenAI API client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const file = req.body;
    const response = await openai.audio.transcriptions.create({
      file: new File([file], "audio.mp3"),
      model: "whisper-1",
      language: "pl",
      response_format: "text",
    });

    res.status(200).json({ transcription: response.text });
  } catch (error) {
    console.error("Failed to transcribe audio:", error);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
}
