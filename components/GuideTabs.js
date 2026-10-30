"use client";
import { useState } from "react";

const LANGS = [
  { id: "en", label: "English", dir: "ltr" },
  { id: "ar", label: "العربية", dir: "rtl" },
  { id: "ml", label: "മലയാളം", dir: "ltr" },
];
const HEAD = {
  en: ["What it is", "When to arrive", "Etiquette"],
  ar: ["ما هو", "متى تحضر", "آداب الزيارة"],
  ml: ["എന്താണ്", "എപ്പോൾ എത്തണം", "പാലിക്കേണ്ട മര്യാദകൾ"],
};

export default function GuideTabs({ guide }) {
  const [lang, setLang] = useState("en");
  if (!guide) return <p className="muted">Visitor guide not available for this event yet.</p>;
  const g = guide[lang] || {};
  const l = LANGS.find((x) => x.id === lang);
  const h = HEAD[lang];

  return (
    <div className="guide">
      <div className="chips">
        {LANGS.map((x) => (
          <button key={x.id} className={`chip ${lang === x.id ? "active" : ""}`} onClick={() => setLang(x.id)}>{x.label}</button>
        ))}
      </div>
      <div dir={l.dir} lang={lang} className={`panel ${lang === "ml" ? "ml" : ""} ${lang === "ar" ? "ar" : ""}`}>
        <h3>{h[0]}</h3>
        <p>{g.about}</p>
        <h3>{h[1]}</h3>
        <p>{g.best_time}</p>
        <h3>{h[2]}</h3>
        <ul>{(g.etiquette || []).map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>
    </div>
  );
}
