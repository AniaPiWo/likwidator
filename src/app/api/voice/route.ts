import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai"; // Import OpenAI API client

export async function POST(req: NextRequest) {
  try {
    const file = await req.blob(); // Zmiana na pobieranie blob z requestu
    const response = await openai.audio.transcriptions.create({
      file: new File([file], "audio.mp3"),
      model: "whisper-1",
      language: "pl",
      response_format: "text",
    });

    return NextResponse.json({ transcription: response.text });
  } catch (error) {
    console.error("Failed to transcribe audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
