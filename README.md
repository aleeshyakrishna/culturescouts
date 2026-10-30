# Culture Scouts — Kerala's hidden festivals, found · തെയ്യം · ഉത്സവം

**Every Theyyam season, hundreds of sacred performances in North Malabar are announced only on Malayalam posters and
WhatsApp forwards — often using a calendar outsiders can't read. Visitors miss them, young Malayalis drift away, and a
living tradition stays invisible outside the village.**

Culture Scouts turns young people into the bridge:

1. 📸 A **scout** photographs a festival poster.
2. 🤖 **Gemma 4** reads the Malayalam: kavu name, place, dates (incl. Malayalam-calendar dates), each Theyyam and its time.
3. ✅ The scout **reviews and corrects** it, and a **second scout verifies** it.
4. 🗺 It appears on a **live map** ("Tonight / This week") with a **visitor guide in English, Arabic and Malayalam** —
   what it is, when to arrive, and etiquette.
5. 🏆 Scouts earn points on a leaderboard.

## Run it
```bash
npm install
cp env.example .env.local     # add GEMINI_API_KEY (MONGODB_URI optional)
npm run dev
```
Open http://localhost:3000. Without MONGODB_URI, data is kept in memory and resets on restart.

## Tech
Next.js (App Router) · Node API routes · MongoDB · Gemma 4 (`gemma-4-26b-a4b-it`) via the Gemini API, with retries + fallback · Leaflet + OpenStreetMap

## Prize tracks
- **Best Use of Gemma 4** — multimodal poster reading (Malayalam OCR + structuring) and trilingual guide generation
- **Best Open-Source AI Project** — open-weight model, open-source code
- **Best Innovation in Your Language** — built for Malayalam: reads Malayalam posters and serves Malayalam speakers

## Impact
- **Tourism:** brings visitors to North Malabar's village festivals, beyond the usual Kochi–Munnar–Alleppey circuit; money reaches local homestays, food stalls, autos and artists.
- **Youth:** young people become the ones who discover and share their culture — not just consume it.
- **Respect first:** Theyyam is worship. Every event carries an etiquette guide; kavu committees can control what is listed.

## Demo (2 min)
1. Hook: show a real Malayalam Theyyam poster — "Can you read this? Neither can 99% of visitors."
2. Scout it live → Gemma fills the form → fix one thing → publish.
3. Show it on the map under "This week" → open it → switch the guide to العربية.
4. Second teammate verifies → leaderboard updates.
5. Close: "From a poster on a village wall to the world map."

## Next steps
Shareable Instagram cards for scouts · "Which Theyyam is this?" photo ID · elder voice stories per kavu ·
season alerts · kavu committee accounts · every festival in Kerala (Poorams, perunnals, utsavams, boat races) · more languages.
