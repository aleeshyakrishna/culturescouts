import Link from "next/link";
import { leaderboard, listEvents } from "@/lib/db";
import EventsBrowser from "@/components/EventsBrowser";
import { photo } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await listEvents();
  const board = leaderboard(events).slice(0, 5);
  const heroPhoto = photo("fire");
  const gallery = ["crown", "fire", "face"].map(photo).filter(Boolean);

  return (
    <>
      <section className="hero" style={heroPhoto ? { "--hero-img": `url(${heroPhoto.src})` } : undefined}>
        <div className="hero-inner">
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
          <Link href="/translate" className="btn btn-ghost">🌐 Translate a poster</Link>
        </div>
        <ul className="hero-stats">
          <li><strong>400+</strong><span>Theyyam forms</span></li>
          <li><strong>Oct–May</strong><span>Theyyam season</span></li>
          <li><strong>3</strong><span>languages: EN · AR · ML</span></li>
        </ul>
        </div>
        {heroPhoto && <span className="photo-credit">📷 {heroPhoto.credit}</span>}
      </section>

      <section className="section" id="map">
        <h2>What's happening</h2>
        <EventsBrowser events={events} />
      </section>

      {gallery.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>The gods who dance</h2>
            <span className="muted small ml">ദൈവക്കോലങ്ങൾ</span>
          </div>
          <p className="muted gallery-lead">In Theyyam, the performer becomes the deity for one night. Every face is painted by hand, every crown built fresh. Come with respect: this is worship, not a show.</p>
          <div className="gallery">
            {gallery.map((g) => (
              <figure key={g.src} className="gallery-item">
                <img src={g.src} alt={g.alt} loading="lazy" />
                <figcaption>📷 {g.credit}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

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
