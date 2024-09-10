import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { Uploadable } from "openai/uploads.mjs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audioBlob");
    console.log("FILE IN ROUTE =>", file);
    console.log("FILE IN ROUTE =>", typeof file);
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const response = await openai.audio.transcriptions.create({
      file: file as Uploadable,
      model: "whisper-1",
      language: "pl",
      response_format: "text",
    });
    console.log("RESPONSE IN ROUTE =>", response);
    return NextResponse.json({ transcription: response });
  } catch (error) {
    console.error("Failed to transcribe audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
