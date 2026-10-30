// Runs every image in posters/ through the app's /api/extract route and prints what Gemma read.
// Usage: npm run dev (in another tab), then: node scripts/test-posters.mjs [file ...]
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, extname, basename } from "node:path";
import { tmpdir } from "node:os";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const DIR = "posters";
const OUT = join(DIR, "results");
mkdirSync(OUT, { recursive: true });

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(DIR).filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f)).map((f) => join(DIR, f));

if (!files.length) {
  console.log("No images found in posters/. Drop some poster photos there and run again.");
  process.exit(0);
}

for (const file of files) {
  // Shrink to 1600px JPEG like the browser upload does (macOS sips).
  const tmp = join(tmpdir(), `cs-${Date.now()}.jpg`);
  execFileSync("sips", ["-Z", "1600", "-s", "format", "jpeg", file, "--out", tmp], { stdio: "ignore" });
  const poster = `data:image/jpeg;base64,${readFileSync(tmp).toString("base64")}`;

  const t0 = Date.now();
  const res = await fetch(`${BASE}/api/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poster }),
  });
  const data = await res.json();
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  writeFileSync(join(OUT, basename(file, extname(file)) + ".json"), JSON.stringify(data, null, 2));

  console.log(`\n=== ${basename(file)}  (${res.status}, ${secs}s, ${data.model ?? "no model"})`);
  if (data.error) { console.log("ERROR:", data.error); continue; }
  console.log(`kavu:   ${data.kavu_name} / ${data.kavu_name_ml}`);
  console.log(`place:  ${data.place}, ${data.district || "(no district)"}  [${data.lat}, ${data.lng}]`);
  console.log(`dates:  "${data.date_text_ml}" -> ${data.start_date} .. ${data.end_date}  (confidence: ${data.date_confidence})`);
  for (const t of data.theyyams) console.log(`  - ${t.name} / ${t.name_ml}  ${t.date} ${t.time}`);
  if (data.notes_en) console.log(`notes:  ${data.notes_en}`);
  if (data.unclear) console.log(`unclear: ${data.unclear}`);
}
console.log(`\nFull JSON saved in ${OUT}/`);
