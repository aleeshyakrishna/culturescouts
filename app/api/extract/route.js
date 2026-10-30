import { NextResponse } from "next/server";
import { askGemmaJSON, imagePart } from "@/lib/gemma";
import { posterPrompt, cleanDraft } from "@/lib/poster";

// Step 1 of scouting: read a festival poster photo and return a DRAFT event for the scout to review.
export async function POST(req) {
  try {
    const { poster } = await req.json();
    const img = imagePart(poster);
    if (!img) return NextResponse.json({ error: "Please upload a poster photo." }, { status: 400 });
    const { data, model } = await askGemmaJSON([img, { text: posterPrompt() }]);
    return NextResponse.json(cleanDraft(data, model));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Could not read the poster" }, { status: 500 });
  }
}
