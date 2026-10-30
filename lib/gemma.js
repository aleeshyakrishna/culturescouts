import { GoogleGenAI } from "@google/genai";

// Gemma 4 first; Gemini Flash only as an emergency fallback so the demo never dies.
const MODELS = ["gemma-4-26b-a4b-it", "gemma-4-31b-it", "gemini-2.5-flash"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let client;
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing. Add it to .env.local and restart the server.");
  }
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

/**
 * Ask Gemma with retries + model fallback.
 * parts: array of { text } or { inlineData: { mimeType, data } }
 * Returns { text, model }.
 */
export async function askGemma(parts) {
  const ai = getClient();
  let lastErr;
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts }],
        });
        if (res.text) return { text: res.text, model };
        throw new Error("Empty response");
      } catch (err) {
        lastErr = err;
        console.warn(`[gemma] ${model} attempt ${attempt} failed:`, err.status ?? "", err.message?.slice(0, 120));
        if (err.status && err.status < 500 && err.status !== 429) break; // bad request: try next model
        await sleep(1500 * attempt);
      }
    }
  }
  throw lastErr ?? new Error("All models failed");
}

/** Ask Gemma and parse a JSON object out of the reply. */
export async function askGemmaJSON(parts) {
  const { text, model } = await askGemma(parts);
  const cleaned = text.replace(/```json|```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  return { data: JSON.parse(cleaned.slice(start, end + 1)), model };
}

/** Split a data URL ("data:image/jpeg;base64,....") into Gemma inlineData. */
export function imagePart(dataUrl) {
  const match = /^data:(.+?);base64,(.+)$/.exec(dataUrl || "");
  if (!match) return null;
  return { inlineData: { mimeType: match[1], data: match[2] } };
}
