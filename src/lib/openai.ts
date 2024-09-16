import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true,
});

//custom Nerdbord OpenAI client
export const vercelSDK = createOpenAI({
  fetch: async (url, options) => {
    const fullUrl =
      "https://training.nerdbord.io/api/v1/openai/chat/completions";
    const result = await fetch(fullUrl, options);
    return result;
  },
});
