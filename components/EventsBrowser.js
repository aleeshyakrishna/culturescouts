"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { matchesFilter, prettyRange } from "@/lib/dates";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <div className="map" /> });

const FILTERS = [
  { id: "tonight", label: "🔥 Tonight" },
  { id: "week", label: "This week" },
  { id: "upcoming", label: "All upcoming" },
];

export default function EventsBrowser({ events }) {
  const [filter, setFilter] = useState("week");
  const shown = useMemo(
    () =>
      events
        .filter((e) => matchesFilter(e, filter))
        .sort((a, b) => (a.start_date || "").localeCompare(b.start_date || ""))
        .map((e) => ({ ...e, dateLabel: prettyRange(e.start_date, e.end_date) })),
    [events, filter]
  );

  return (
    <>
      <div className="chips" role="tablist">
        {FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={filter === f.id}
            className={`chip ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
        <span className="muted small">{shown.length} found</span>
      </div>

      <MapView events={shown} />
      <p className="legend small muted">
        <span className="dot verified" /> verified by a second scout &nbsp; <span className="dot" /> awaiting verification
      </p>

      {shown.length === 0 ? (
        <p className="empty">Nothing listed for this period yet. <Link href="/scout">Be the first scout to add one →</Link></p>
      ) : (
        <div className="grid">
          {shown.map((e) => (
            <Link key={e._id} href={`/event/${e._id}`} className="card">
              <div className="card-top">
                <span className="pill">{e.dateLabel}</span>
                {(e.verifications || []).length > 0 ? <span className="badge ok">✓ Verified</span> : <span className="badge">Unverified</span>}
              </div>
              <h3>{e.kavu_name}</h3>
              {e.kavu_name_ml && <p className="ml card-ml">{e.kavu_name_ml}</p>}
              <p className="small muted">📍 {e.place}{e.place ? ", " : ""}{e.district}</p>
              {e.theyyams?.length > 0 && (
                <p className="small">{e.theyyams.slice(0, 3).map((t) => t.name).join(" · ")}{e.theyyams.length > 3 ? " …" : ""}</p>
              )}
              {e.sample && <span className="sample-tag">Sample</span>}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
