"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImagePicker from "@/components/ImagePicker";
import useScoutName from "@/components/useScoutName";
import { DISTRICTS } from "@/lib/districts";
import { HANDOFF_KEY } from "@/lib/handoff";

const EMPTY_ROW = { name: "", name_ml: "", date: "", time: "" };

export default function ScoutPage() {
  const router = useRouter();
  const [poster, setPoster] = useState(null);
  const [draft, setDraft] = useState(null);
  const [scout, setScout] = useScoutName();
  const [step, setStep] = useState("upload"); // upload → reading → review → saving
  const [error, setError] = useState("");
  const [fromVisitor, setFromVisitor] = useState(false);

  // A visitor shared a poster from /translate: load it and start reading straight away.
  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(HANDOFF_KEY) || "null");
      sessionStorage.removeItem(HANDOFF_KEY);
    } catch {}
    if (saved?.poster) {
      setPoster(saved.poster);
      setFromVisitor(true);
      read(saved.poster);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const setRow = (i, k) => (e) =>
    setDraft((d) => ({ ...d, theyyams: d.theyyams.map((t, j) => (j === i ? { ...t, [k]: e.target.value } : t)) }));

  async function read(img = poster) {
    setStep("reading");
    setError("");
    try {
      const res = await fetch("/api/extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ poster: img }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.is_event_poster === false) throw new Error("This doesn't look like a festival poster. Try another photo.");
      setDraft({ ...data, theyyams: data.theyyams?.length ? data.theyyams : [EMPTY_ROW] });
      setStep("review");
    } catch (e) {
      setError(e.message || "Could not read the poster.");
      setStep("upload");
    }
  }

  async function publish(e) {
    e.preventDefault();
    setStep("saving");
    setError("");
    try {
      const res = await fetch("/api/events", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, poster, scout }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/event/${data.id}`);
      router.refresh();
    } catch (e) {
      setError(e.message || "Could not publish.");
      setStep("review");
    }
  }

  return (
    <section className="narrow">

      {(step === "upload" || step === "reading") && (
        <div className="form">
          {fromVisitor && <p className="small">🤝 A visitor shared this poster. Gemma is reading it, then please check the details.</p>}
          <ImagePicker value={poster} onChange={setPoster} label="Take / upload poster photo" />
          {error && <p className="error">⚠️ {error}</p>}
          <button className="btn btn-primary btn-lg" disabled={!poster || step === "reading"} onClick={() => read()}>
            {step === "reading" ? "Gemma is reading the Malayalam… (can take up to a minute)" : "Read poster"}
          </button>
        </div>
      )}

      {draft && (step === "review" || step === "saving") && (
        <form className="form" onSubmit={publish}>
          <div className="review-head">
            {poster && <img src={poster} alt="Poster" className="thumb" />}
            <div>
              <h2>Check what Gemma read</h2>
              <p className="small muted">Fix anything that's wrong — you're the human check. {draft.unclear && <><br />⚠️ Unclear: {draft.unclear}</>}</p>
            </div>
          </div>

          <div className="row">
            <label>Kavu / event (English)<input value={draft.kavu_name || ""} onChange={set("kavu_name")} required /></label>
            <label>Malayalam<input className="ml" value={draft.kavu_name_ml || ""} onChange={set("kavu_name_ml")} /></label>
          </div>
          <div className="row">
            <label>Place<input value={draft.place || ""} onChange={set("place")} /></label>
            <label>District
              <select value={draft.district || ""} onChange={set("district")} required>
                <option value="">Choose…</option>
                {Object.entries(DISTRICTS).map(([en, d]) => <option key={en} value={en}>{en} · {d.ml}</option>)}
              </select>
            </label>
          </div>

          <div className={`date-box ${draft.date_confidence === "low" || draft.is_past ? "warn" : ""}`}>
            <p className="small">
              Date on poster: <strong className="ml">{draft.date_text_ml || "—"}</strong>
              {draft.date_confidence === "low" && <><br />⚠️ Gemma isn't sure about the date (e.g. Malayalam calendar). Please confirm.</>}
              {draft.is_past && <><br />⚠️ This date has already passed — is this an old poster? Check the year before publishing.</>}
            </p>
            <div className="row">
              <label>Start date<input type="date" value={draft.start_date || ""} onChange={set("start_date")} required /></label>
              <label>End date<input type="date" value={draft.end_date || ""} onChange={set("end_date")} /></label>
            </div>
          </div>

          <div>
            <p className="label">Programme</p>
            {draft.theyyams.map((t, i) => (
              <div key={i} className="t-row">
                <input placeholder="Theyyam / programme" value={t.name || ""} onChange={setRow(i, "name")} />
                <input className="ml" placeholder="മലയാളം" value={t.name_ml || ""} onChange={setRow(i, "name_ml")} />
                <input type="date" value={t.date || ""} onChange={setRow(i, "date")} />
                <input placeholder="Time" value={t.time || ""} onChange={setRow(i, "time")} />
                <button type="button" className="link" onClick={() => setDraft((d) => ({ ...d, theyyams: d.theyyams.filter((_, j) => j !== i) }))}>✕</button>
              </div>
            ))}
            <button type="button" className="link" onClick={() => setDraft((d) => ({ ...d, theyyams: [...d.theyyams, EMPTY_ROW] }))}>+ Add row</button>
          </div>

          <label>Other info<textarea rows={2} value={draft.notes_en || ""} onChange={set("notes_en")} /></label>
          <label>Your scout name<input value={scout} onChange={(e) => setScout(e.target.value)} placeholder="e.g. Aleeshya" required /></label>

          {error && <p className="error">⚠️ {error}</p>}
          <button className="btn btn-primary btn-lg" disabled={step === "saving"}>
            {step === "saving" ? "Publishing + writing visitor guide…" : "Publish to the map (+10 pts)"}
          </button>
          <button type="button" className="link" onClick={() => { setDraft(null); setStep("upload"); }}>← Use a different photo</button>
        </form>
      )}
    </section>
  );
}
