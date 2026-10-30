import { NextResponse } from "next/server";
import { askGemmaJSON, imagePart } from "@/lib/gemma";
import { todayISO, isISODate } from "@/lib/dates";

const LANGS = { en: "English", ar: "Arabic (Modern Standard Arabic)", ml: "Malayalam" };

// For visitors: read any Malayalam festival poster and explain it in their language.
export async function POST(req) {
  try {
    const { poster, lang = "en" } = await req.json();
    const img = imagePart(poster);
    if (!img) return NextResponse.json({ error: "Please upload a poster photo." }, { status: 400 });
    const language = LANGS[lang] || LANGS.en;

    const prompt = `You are helping a foreign visitor in Kerala, India who cannot read Malayalam. The photo is a festival poster or notice,
usually a Theyyam / kaliyattam / temple utsavam notice in Malayalam. Today's date is ${todayISO()}.

Explain the poster in ${language}. Rules:
- Every text value must be in ${language} (keep proper names recognisable; you may add the Malayalam name in brackets).
- Dates may use the Malayalam calendar (e.g. "1201 കുംഭം 3"); convert them to normal dates. If no year is printed, assume the nearest upcoming date.
- List every programme item from the poster in order. Items between 12 AM and 6 AM belong to the next calendar day.
- Tips: Theyyam is sacred worship, not a show: dress modestly, follow volunteers, ask before photographing,
  don't touch the performer, accept prasadam with the right hand.
- Never invent details that are not on the poster. Keep it short.
- If this is not a festival poster at all, set "is_event_poster" to false and leave the rest empty.

Reply with ONLY a JSON object, no markdown:
{
  "is_event_poster": true,
  "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD",
  "name_ml": "temple / festival name in Malayalam script",
  "title": "short title of the festival",
  "summary": "2-3 sentences: what it is, where, when, and the one moment not to miss",
  "when": "dates and timing in plain words (say if it runs overnight)",
  "where": "place and district",
  "programme": [{"date": "YYYY-MM-DD or empty", "time": "e.g. 4:00 AM", "name": "programme name", "what": "one short line explaining it"}],
  "tips": ["3-4 short, respectful tips"],
  "other": "anything else useful on the poster (free meal, fireworks, contact), or empty"
}`;

    const { data, model } = await askGemmaJSON([img, { text: prompt }]);
    if (data.is_event_poster === false) return NextResponse.json({ lang, visitor: null, model });
    const end = isISODate(data.end_date) ? data.end_date : isISODate(data.start_date) ? data.start_date : "";
    return NextResponse.json({ lang, visitor: data, is_past: Boolean(end && end < todayISO()), model });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Could not read the poster" }, { status: 500 });
  }
}
