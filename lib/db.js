import { MongoClient, ObjectId } from "mongodb";
import { seedEvents } from "./seed";

// MongoDB when MONGODB_URI is set, otherwise in-memory (resets when the server restarts).
const g = globalThis;

async function col() {
  if (!process.env.MONGODB_URI) return null;
  g._mongo ??= new MongoClient(process.env.MONGODB_URI).connect();
  const c = (await g._mongo).db("culturescouts").collection("events");
  if (!g._seeded) {
    g._seeded = true;
    if ((await c.countDocuments()) === 0) await c.insertMany(seedEvents().map(({ _id, ...e }) => e));
  }
  return c;
}
const mem = () => (g._events ??= seedEvents());
const clean = (d) => d && { ...d, _id: String(d._id) };
const byId = (id) => (ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id });

export async function listEvents() {
  const c = await col();
  if (!c) return [...mem()];
  return (await c.find({}, { projection: { poster: 0 } }).toArray()).map(clean);
}

export async function getEvent(id) {
  const c = await col();
  if (!c) return mem().find((e) => e._id === id) ?? null;
  return clean(await c.findOne(byId(id)));
}

export async function addEvent(ev) {
  const doc = { ...ev, verifications: [], createdAt: new Date().toISOString() };
  const c = await col();
  if (!c) {
    const saved = { ...doc, _id: `ev-${Date.now()}` };
    mem().push(saved);
    return saved;
  }
  const { insertedId } = await c.insertOne(doc);
  return { ...doc, _id: String(insertedId) };
}

/** Add a verifying scout (not the original poster, no duplicates). Returns the updated event or an error string. */
export async function verifyEvent(id, scout) {
  const ev = await getEvent(id);
  if (!ev) return { error: "Event not found" };
  const name = scout.trim();
  if (name.toLowerCase() === (ev.scout || "").toLowerCase()) return { error: "You posted this one — another scout must verify it." };
  if ((ev.verifications || []).some((v) => v.toLowerCase() === name.toLowerCase())) return { error: "You already verified this." };
  const c = await col();
  if (!c) {
    ev.verifications = [...(ev.verifications || []), name];
    return { event: ev };
  }
  await c.updateOne(byId(id), { $push: { verifications: name } });
  return { event: await getEvent(id) };
}

/** Points: 10 per event posted, 5 per verification. */
export function leaderboard(events) {
  const pts = {};
  for (const e of events) {
    if (e.scout) pts[e.scout] = (pts[e.scout] || 0) + 10;
    for (const v of e.verifications || []) pts[v] = (pts[v] || 0) + 5;
  }
  return Object.entries(pts).map(([name, points]) => ({ name, points })).sort((a, b) => b.points - a.points);
}
