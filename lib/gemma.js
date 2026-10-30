import { GoogleGenAI } from "@google/genai";

// Both Gemma 4 models are tried at the same time and the first good answer wins (the shared
// Gemma API often returns 500s or hangs under load). Gemini Flash is only an emergency fallback.
const GEMMA_MODELS = ["gemma-4-26b-a4b-it", "gemma-4-31b-it"];
const FALLBACK_MODEL = "gemini-flash-latest";
const ATTEMPTS = 3;
const TIMEOUT_MS = 90000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let client;
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing. Add it to .env.local and restart the server.");
  }
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

/** Try one model with retries. `isDone()` lets a losing model stop retrying once another has answered. */
async function tryModel(model, parts, isDone = () => false) {
  const ai = getClient();
  let lastErr;
  for (let attempt = 1; attempt <= ATTEMPTS && !isDone(); attempt++) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: { httpOptions: { timeout: TIMEOUT_MS } },
      });
      if (res.text) return { text: res.text, model };
      throw new Error("Empty response");
    } catch (err) {
      lastErr = err;
      console.warn(`[gemma] ${model} attempt ${attempt} failed:`, err.status ?? "", err.message?.slice(0, 120));
      if (err.status && err.status < 500 && err.status !== 429) break; // bad request: don't retry this model
      await sleep(1000 * attempt);
    }
  }
  throw lastErr ?? new Error(`${model} stopped`);
}

/**
 * Ask Gemma 4 (both models raced), falling back to Gemini Flash.
 * parts: array of { text } or { inlineData: { mimeType, data } }
 * Returns { text, model }.
 */
export async function askGemma(parts) {
  let done = false;
  try {
    const result = await Promise.any(GEMMA_MODELS.map((m) => tryModel(m, parts, () => done)));
    done = true;
    return result;
  } catch {
    done = true;
    console.warn("[gemma] all Gemma 4 attempts failed, using fallback", FALLBACK_MODEL);
    return tryModel(FALLBACK_MODEL, parts);
  }
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
