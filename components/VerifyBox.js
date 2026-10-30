"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useScoutName from "./useScoutName";

export default function VerifyBox({ id, verifications = [], scout }) {
  const router = useRouter();
  const [name, setName] = useScoutName();
  const [list, setList] = useState(verifications);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify() {
    setBusy(true);
    setMsg("");
    const res = await fetch(`/api/events/${id}/verify`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scout: name }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setMsg(data.error);
    setList(data.verifications);
    setMsg("Thanks! +5 points 🎉");
    router.refresh();
  }

  return (
    <div className="panel verify">
      <p>
        📸 Scouted by <strong>{scout}</strong>
        {list.length > 0 ? <> · ✓ Verified by <strong>{list.join(", ")}</strong></> : " · Not verified yet"}
      </p>
      <p className="small muted">Saw this poster too, or know the kavu? Confirm the details are correct.</p>
      <div className="row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your scout name" />
        <button className="btn btn-ghost" onClick={verify} disabled={busy || !name.trim()}>
          {busy ? "…" : "✓ I confirm this is correct"}
        </button>
      </div>
      {msg && <p className="small">{msg}</p>}
    </div>
  );
}
