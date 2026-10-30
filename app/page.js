import Link from "next/link";
import { leaderboard, listEvents } from "@/lib/db";
import EventsBrowser from "@/components/EventsBrowser";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await listEvents();
  const board = leaderboard(events).slice(0, 5);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Theyyam season is here · തെയ്യക്കാലം</p>
        <h1>
          Kerala's most powerful rituals
          <br />
          <span className="accent">are hidden on village walls.</span>
        </h1>
        <p className="lead">
          Theyyam schedules live on Malayalam posters and WhatsApp forwards. Young <strong>Culture Scouts</strong> snap them,
          Gemma reads them, and visitors find them — in English, العربية and മലയാളം.
        </p>
        <div className="hero-actions">
          <Link href="/scout" className="btn btn-primary">📸 Scout a poster</Link>
          <a href="#map" className="btn btn-ghost">🗺 Find a Theyyam near me</a>
        </div>
      </section>

      <section className="section" id="map">
        <h2>What's happening</h2>
        <EventsBrowser events={events} />
      </section>

      <section className="section" id="leaderboard">
        <div className="section-head">
          <h2>Top scouts</h2>
          <span className="muted small">10 pts per poster · 5 pts per verification</span>
        </div>
        <ol className="board">
          {board.map((s, i) => (
            <li key={s.name}>
              <span className="rank">{["🥇", "🥈", "🥉"][i] || i + 1}</span>
              <span className="who">{s.name}</span>
              <span className="pts">{s.points} pts</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
