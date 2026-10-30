import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/db";
import { DISTRICTS } from "@/lib/districts";
import { prettyDate, prettyRange } from "@/lib/dates";
import GuideTabs from "@/components/GuideTabs";
import VerifyBox from "@/components/VerifyBox";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }) {
  const { id } = await params;
  const e = await getEvent(id);
  if (!e) notFound();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.kavu_name} ${e.place} ${e.district} Kerala`)}`;

  return (
    <article className="narrow">
      <Link href="/" className="muted small">← All festivals</Link>
      {e.sample && <p className="sample-banner">Sample entry — shows how a scouted event looks.</p>}

      <div className="card-top" style={{ marginTop: 16 }}>
        <span className="pill">{prettyRange(e.start_date, e.end_date)}</span>
        <span className="muted small">📍 {e.place}, {e.district} · {DISTRICTS[e.district]?.ml}</span>
      </div>
      <h1>{e.kavu_name}</h1>
      {e.kavu_name_ml && <p className="ml title-ml">{e.kavu_name_ml}</p>}
      {e.date_text_ml && <p className="small muted">Poster date: <span className="ml">{e.date_text_ml}</span></p>}

      <div className="event-layout">
        <div>
          <h2>Programme</h2>
          {e.theyyams?.length ? (
            <table className="schedule">
              <tbody>
                {e.theyyams.map((t, i) => (
                  <tr key={i}>
                    <td><strong>{t.name}</strong>{t.name_ml && <div className="ml small muted">{t.name_ml}</div>}</td>
                    <td className="small">{t.date ? prettyDate(t.date) : ""}</td>
                    <td className="small">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="muted">Programme not listed on the poster.</p>}
          {e.notes_en && <p className="small">ℹ️ {e.notes_en}</p>}
          <a className="btn btn-ghost" href={mapsUrl} target="_blank" rel="noreferrer">🧭 Directions</a>
        </div>
        {e.poster && (
          <figure className="poster">
            <img src={e.poster} alt="Original poster" />
            <figcaption className="small muted">Original poster</figcaption>
          </figure>
        )}
      </div>

      <section className="section-tight">
        <h2>Visitor guide</h2>
        <GuideTabs guide={e.guide} />
      </section>

      <section className="section-tight">
        <VerifyBox id={e._id} verifications={e.verifications || []} scout={e.scout} />
      </section>
    </article>
  );
}
