"use client";
import { useEffect, useState } from "react";

// Remembers the scout's name in this browser (no login needed for the prototype).
export default function useScoutName() {
  const [name, setName] = useState("");
  useEffect(() => {
    try { setName(localStorage.getItem("scoutName") || ""); } catch {}
  }, []);
  const save = (v) => {
    setName(v);
    try { localStorage.setItem("scoutName", v); } catch {}
  };
  return [name, save];
}
