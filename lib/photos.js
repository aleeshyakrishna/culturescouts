import { existsSync } from "node:fs";
import path from "node:path";

// Theyyam photos live in public/theyyam/ (local only, not in git: they belong to the photographers).
// Pages check they exist so the app still looks right without them.
export const PHOTOS = {
  fire: { src: "/theyyam/fire.jpg", alt: "Theyyam performer ringed by flaming torches at night", credit: "Rijith Thenhipalam Photography" },
  crown: { src: "/theyyam/crown.jpg", alt: "Theyyam with silver crown and red flower headdress", credit: "Sreejish Photography" },
  face: { src: "/theyyam/face.jpg", alt: "Close-up of a Theyyam face painted black and white", credit: "Vyshakh Ravi Photography" },
};

export function photo(name) {
  const p = PHOTOS[name];
  return p && existsSync(path.join(process.cwd(), "public", p.src)) ? p : null;
}
