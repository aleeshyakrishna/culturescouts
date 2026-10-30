import { NextResponse } from "next/server";
import { askGemmaJSON, imagePart } from "@/lib/gemma";
import { DISTRICTS } from "@/lib/districts";
import { todayISO, isISODate } from "@/lib/dates";

// Step 1 of scouting: read a festival poster photo and return a DRAFT event for the scout to review.
export async function POST(req) {
  try {
    const { poster } = await req.json();
    const img = imagePart(poster);
    if (!img) return NextResponse.json({ error: "Please upload a poster photo." }, { status: 400 });

    const prompt = `You are reading a photo of a festival poster or notice from Kerala, India — usually a Theyyam / kaliyattam / temple utsavam notice written in Malayalam.
Today's date is ${todayISO()}.

Extract the event details. Rules:
- Copy names exactly as written; give Malayalam in Malayalam script and an English transliteration.
- Dates: copy the date text exactly as printed into "date_text_ml" (it may use the Malayalam calendar, e.g. "തുലാം 15", or English dates).
  Then give your best Gregorian guess as YYYY-MM-DD in start_date/end_date. If the poster uses only Malayalam-calendar dates or you are unsure, still guess but set "date_confidence" to "low".
  If no year is printed, assume the nearest upcoming date from today.
- "kavu_name" is the temple / kavu / devasthanam where the festival happens — not a sponsoring house, club or committee.
- "district" must be one of: ${Object.keys(DISTRICTS).join(", ")} (best guess from the place name), or "" if unknown.
  Theyyam is almost always in North Malabar: Kasaragod (e.g. Kanhangad, Nileshwaram, Chithari, Cheruvathur, Trikaripur) or Kannur (e.g. Payyanur, Taliparamba, Thalassery, Kannur, Mattannur); sometimes north Kozhikode or Wayanad.
- List EVERY item on the schedule in order — each Theyyam, thottam, ritual (e.g. agnipravesham / fire walk, kodiyettam, purappad) and cultural programme — with its date and time.
  Night schedules run past midnight: an item at 12 AM – 6 AM belongs to the NEXT calendar day.
- If something is not on the poster, use "" — never invent details.
- If this is not a festival poster at all, set "is_event_poster" to false.

Reply with ONLY a JSON object, no markdown:
{
  "is_event_poster": true,
  "kavu_name": "English transliteration of the kavu / temple name",
  "kavu_name_ml": "name in Malayalam script",
  "place": "village / town in English",
  "district": "",
  "lat": 0, "lng": 0,
  "date_text_ml": "date text exactly as printed",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "date_confidence": "high | medium | low",
  "theyyams": [{"name": "English", "name_ml": "Malayalam", "date": "YYYY-MM-DD or empty", "time": "e.g. 4:00 AM or empty"}],
  "notes_en": "other useful info from the poster (e.g. annadanam / free meal, fireworks, contact), in English",
  "unclear": "anything you could not read clearly"
}
For lat/lng give the approximate coordinates of the place if you know it, else 0.`;

    const { data, model } = await askGemmaJSON([img, { text: prompt }]);

    // Sanitise the draft.
    const district = DISTRICTS[data.district] ? data.district : "";
    const start = isISODate(data.start_date) ? data.start_date : "";
    const end = isISODate(data.end_date) ? data.end_date : "";
    // Gemma's coordinates are often a guess; drop them if they are far (> ~60 km) from the district.
    let lat = Number(data.lat) || 0, lng = Number(data.lng) || 0;
    if (district && lat && Math.hypot(lat - DISTRICTS[district].lat, lng - DISTRICTS[district].lng) > 0.55) {
      lat = 0; lng = 0;
    }
    const draft = {
      ...data,
      district,
      start_date: start,
      end_date: end,
      lat, lng,
      is_past: Boolean((end || start) && (end || start) < todayISO()),
      theyyams: Array.isArray(data.theyyams) ? data.theyyams : [],
      model,
    };
    return NextResponse.json(draft);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Could not read the poster" }, { status: 500 });
  }
}
