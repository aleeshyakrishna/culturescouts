# Culture Scouts — project handoff

Hackathon: **Hacktoberfest Hack Day Dubai x Legesher** (MLH), Fri 30 Oct 2026, 2:30–8:00 PM, DIFC Innovation Hub.
Team of 3. Stack: Next.js 16 (App Router, plain JS) + Node API routes + MongoDB + Gemma 4 via the Gemini API.

## Problem (narrow + deep)
Every Theyyam season (≈ Oct–May), hundreds of sacred performances in North Malabar (Kannur, Kasaragod) are announced
only on Malayalam posters and WhatsApp forwards, often with Malayalam-calendar dates (e.g. "തുലാം 15").
Visitors can't find, read or time them (main Theyyam often appears ~4 AM), don't know the etiquette, and young
Malayalis have no role in the tradition. Tourism angle: brings visitors beyond Kochi–Munnar–Alleppey; money reaches
local homestays, food stalls, autos and artists (Responsible Tourism). Respect first: Theyyam is worship, not a show.

## Solution — the "Culture Scouts" loop
Young scout photographs a poster → Gemma 4 reads the Malayalam and extracts kavu, place, district, dates, schedule
→ scout reviews/corrects (human check) → published to a live map → a second scout verifies → visitors see
"Tonight / This week" with a visitor guide in English, Arabic and Malayalam → scouts earn points (leaderboard).

Prize tracks: Best Use of Gemma 4 · Best Open-Source AI Project · Best Innovation in Your Language (Malayalam; Legesher).

## Code map
- `lib/gemma.js` — `askGemma` / `askGemmaJSON`: model `gemma-4-26b-a4b-it`, fallback `gemma-4-31b-it`, then `gemini-2.5-flash`; 3 retries each (Gemma API gives random 500s — keep retries). JSON parsed from text (no JSON mode, no system prompt).
- `lib/db.js` — MongoDB if `MONGODB_URI` set, else in-memory (RESETS ON SERVER RESTART). Leaderboard: 10 pts per post, 5 per verification; poster can't verify own event.
- `lib/seed.js` — 2 SAMPLE events (flagged `sample: true`, dates relative to today). Remove once real posters are in.
- `lib/dates.js` — IST date helpers + Tonight/Week/Upcoming filters. `lib/districts.js` — 14 Kerala districts (EN/ML + coords).
- `app/api/extract` — poster image → draft event JSON (returns `date_text_ml`, best-guess ISO dates, `date_confidence`).
- `app/api/events` — GET list; POST save reviewed event + generate trilingual visitor guide (`guide.en/ar/ml`). Guide failure doesn't block saving.
- `app/api/events/[id]/verify` — second-scout verification.
- Pages: `/` (hero, filter chips, Leaflet map, cards, leaderboard), `/scout` (upload → read → review form → publish), `/event/[id]` (programme, poster, directions, guide tabs, verify box).
- `components/ImagePicker.js` resizes images client-side (max 1600px) to base64.

## Run
```
npm install
echo "GEMINI_API_KEY=..." > .env.local     # optional: MONGODB_URI=...
npm run dev                                 # http://localhost:3000
```

## Status
- Builds cleanly; full UI flow tested with a mocked Gemma response (scout → review → publish → verify → leaderboard, Arabic guide RTL).
- NOT yet tested: real Gemma calls on real poster photos (do this first).
- Git repo initialised with an initial commit; not pushed yet (needs a public GitHub repo for MLH submission).

## To do (priority order)
1. Test 3–5 real Theyyam posters; tune the extract prompt in `app/api/extract/route.js` if fields are misread.
2. Make Malayalam-calendar date handling reliable (currently: Gemma guesses + scout confirms; flagged orange when unsure). A wrong date is worse than none.
3. Have an Arabic reader check the guide text (sample one was hand-written; new ones come from Gemma).
4. Remove sample events once real ones exist; consider MongoDB Atlas so data survives restarts.
5. Push to GitHub, submit on MLH, rehearse the 2-minute demo (script in README.md).
Pitch-only "next steps": Instagram share cards for scouts, "Which Theyyam is this?" photo ID, elder voice stories,
season alerts, kavu committee accounts, all Kerala festivals, more languages.

## Notes
- Never commit `.env.local` (already in .gitignore). The team's first API key was pasted in chat — use a regenerated one.
- `../heritagevault` is an earlier, abandoned idea (cultural archive); `../gemma-test` is the API smoke test. Ignore both.
