"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImagePicker from "@/components/ImagePicker";
import { prettyDate } from "@/lib/dates";
import { HANDOFF_KEY } from "@/lib/handoff";

const LANGS = [
  { id: "en", label: "English" },
  { id: "ar", label: "العربية" },
  { id: "ml", label: "മലയാളം" },
];
const UI = {
  en: { when: "When", where: "Where", programme: "Programme", tips: "Before you go", other: "Also on the poster", past: "These dates have already passed. This may be an old poster." },
  ar: { when: "متى", where: "أين", programme: "البرنامج", tips: "قبل أن تذهب", other: "معلومات أخرى", past: "هذه التواريخ قد مضت. قد يكون هذا ملصقًا قديمًا." },
  ml: { when: "എപ്പോൾ", where: "എവിടെ", programme: "പരിപാടികൾ", tips: "പോകുന്നതിന് മുമ്പ്", other: "മറ്റു വിവരങ്ങൾ", past: "ഈ തീയതികൾ കഴിഞ്ഞുപോയി. ഇത് പഴയ പോസ്റ്റർ ആയിരിക്കാം." },
};

export default function TranslatePage() {
  const router = useRouter();
  const [poster, setPoster] = useState(null);
  const [lang, setLang] = useState("en");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function read() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ poster, lang }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.visitor) throw new Error("This doesn't look like a festival poster. Try another photo.");
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not read the poster.");
    } finally {
      setBusy(false);
    }
  }

  // Hand the poster to the scout flow, which reads it into a reviewable event.
  function shareWithScouts() {
    try {
      sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ poster }));
    } catch {}
    router.push("/scout");
  }

  const v = result?.visitor;
  const t = UI[result?.lang] || UI.en;
  const rtl = result?.lang === "ar";
  const textClass = result?.lang === "ar" ? "ar" : result?.lang === "ml" ? "ml" : "";

  return (
    <section className="narrow">

      <div className="form">
        <ImagePicker maxSize={1280} value={poster} onChange={(p) => { setPoster(p); setResult(null); }} label="Take / upload poster photo" />
        <div>
          <p className="label">Explain it in</p>
          <div className="chips">
            {LANGS.map((l) => (
              <button key={l.id} type="button" className={`chip ${lang === l.id ? "active" : ""}`} onClick={() => setLang(l.id)}>{l.label}</button>
            ))}
          </div>
        </div>
        {error && <p className="error">⚠️ {error}</p>}
        <button className="btn btn-primary btn-lg" disabled={!poster || busy} onClick={read}>
          {busy ? "Gemma is reading the Malayalam… (can take a minute or two)" : "Translate poster"}
        </button>
      </div>

      {v && (
        <article className={`panel translate-result ${textClass}`} dir={rtl ? "rtl" : "ltr"} lang={result.lang}>
          <h2>{v.title}</h2>
          {v.name_ml && <p className="ml muted" dir="ltr">{v.name_ml}</p>}
          <p>{v.summary}</p>
          {result.is_past && <p className="error">⚠️ {t.past}</p>}

          <dl className="facts">
            <dt>{t.when}</dt><dd>{v.when}</dd>
            <dt>{t.where}</dt><dd>{v.where}</dd>
          </dl>

          {v.programme?.length > 0 && (
            <>
              <h3>{t.programme}</h3>
              <table className="schedule">
                <tbody>
                  {v.programme.map((p, i) => (
                    <tr key={i}>
                      <td className="nowrap"><strong>{p.time}</strong>{p.date && <><br /><span className="small muted">{prettyDate(p.date)}</span></>}</td>
                      <td><strong>{p.name}</strong>{p.what && <><br /><span className="small">{p.what}</span></>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {v.tips?.length > 0 && (
            <>
              <h3>{t.tips}</h3>
              <ul className="checklist">{v.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
            </>
          )}
          {v.other && <><h3>{t.other}</h3><p>{v.other}</p></>}

          <div className="share-box" dir="ltr">
            <p className="small"><strong>Not on our map yet?</strong> Share it and a local Culture Scout will check the details and publish it for other visitors.</p>
            <button className="btn btn-ghost" onClick={shareWithScouts}>🤝 Share with Culture Scouts</button>
          </div>
          <p className="small muted" dir="ltr">Read by {result.model}. AI can make mistakes, so check timings with the temple or locals.</p>
        </article>
      )}
    </section>
  );
}
