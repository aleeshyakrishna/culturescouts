import { NextResponse } from "next/server";
import { askGemmaJSON } from "@/lib/gemma";
import { addEvent, listEvents } from "@/lib/db";
import { DISTRICTS } from "@/lib/districts";
import { isISODate } from "@/lib/dates";

export async function GET() {
  return NextResponse.json(await listEvents());
}

const inKerala = (lat, lng) => lat > 8 && lat < 12.9 && lng > 74.8 && lng < 77.5;

// Step 2 of scouting: the scout has reviewed the draft. Save it and generate the visitor guide.
export async function POST(req) {
  try {
    const b = await req.json();
    if (!b.scout?.trim()) return NextResponse.json({ error: "Enter your scout name." }, { status: 400 });
    if (!b.kavu_name?.trim()) return NextResponse.json({ error: "Kavu / event name is required." }, { status: 400 });
    if (!DISTRICTS[b.district]) return NextResponse.json({ error: "Choose a district." }, { status: 400 });
    if (!isISODate(b.start_date)) return NextResponse.json({ error: "Confirm the start date." }, { status: 400 });

    // Map position: Gemma's guess if it's inside Kerala, otherwise the district centre (slightly jittered).
    const d = DISTRICTS[b.district];
    const lat = Number(b.lat), lng = Number(b.lng);
    const pos = inKerala(lat, lng) ? { lat, lng } : { lat: d.lat + (Math.random() - 0.5) * 0.08, lng: d.lng + (Math.random() - 0.5) * 0.08 };

    const theyyams = (b.theyyams || []).filter((t) => t.name?.trim() || t.name_ml?.trim());

    // Visitor guide in English, Arabic and Malayalam. If it fails, still save the event.
    let guide = null;
    try {
      const list = theyyams.map((t) => `${t.name} (${t.name_ml}) ${t.date} ${t.time}`).join("; ") || "not listed";
      const { data } = await askGemmaJSON([{ text: `Write a short, respectful visitor guide for a first-time visitor to this Kerala festival.
Event: ${b.kavu_name} (${b.kavu_name_ml || ""}), ${b.place}, ${b.district} district, Kerala.
Dates: ${b.start_date} to ${b.end_date || b.start_date}. Programme: ${list}.
Notes: ${b.notes_en || "none"}

It is most likely a Theyyam / kaliyattam (sacred ritual worship in North Malabar) or a temple festival. Emphasise that it is worship, not a show.
Keep general advice accurate; do not invent facts about this specific kavu. If programme times are listed, use them for "best_time".

Reply with ONLY JSON, no markdown:
{
  "en": {"about": "2-3 sentences", "best_time": "1-2 sentences on when to arrive", "etiquette": ["3-4 short tips"]},
  "ar": {"about": "...", "best_time": "...", "etiquette": ["..."]},
  "ml": {"about": "...", "best_time": "...", "etiquette": ["..."]}
}
"ar" must be in Modern Standard Arabic, "ml" in Malayalam script.` }]);
      guide = data;
    } catch (e) {
      console.warn("Guide generation failed:", e.message);
    }

    const saved = await addEvent({
      kavu_name: b.kavu_name.trim(),
      kavu_name_ml: b.kavu_name_ml?.trim() || "",
      place: b.place?.trim() || "",
      district: b.district,
      ...pos,
      start_date: b.start_date,
      end_date: isISODate(b.end_date) ? b.end_date : b.start_date,
      date_text_ml: b.date_text_ml || "",
      theyyams,
      notes_en: b.notes_en || "",
      poster: b.poster || null,
      scout: b.scout.trim(),
      guide,
    });
    return NextResponse.json({ id: saved._id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Could not save" }, { status: 500 });
  }
}
