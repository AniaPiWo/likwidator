import { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/lib/openai";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // wyłączamy domyślny parser body, ponieważ używamy formidable
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing form data" });
    }

    const audioFile = files.file;

    if (!audioFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = (audioFile as unknown as formidable.File).filepath;

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
      });

      return res.status(200).json({ transcription: transcription.text });
    } catch (error) {
      return res.status(500).json({ message: "Error transcribing audio" });
    }
  });
};

export default handler;
