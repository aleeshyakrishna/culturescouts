"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function MapView({ events }) {
  const ref = useRef(null);

  useEffect(() => {
    let map;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false }).setView([11.6, 75.6], 8); // centred on North Malabar
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
      events.forEach((e) => {
        if (typeof e.lat !== "number" || typeof e.lng !== "number") return;
        const verified = (e.verifications || []).length > 0;
        L.circleMarker([e.lat, e.lng], {
          radius: 10, weight: 2.5, color: "#7a1f12",
          fillColor: verified ? "#c9a227" : "#f3e7c4", fillOpacity: 0.95,
        })
          .addTo(map)
          .bindPopup(
            `<strong>${esc(e.kavu_name)}</strong><br/>${esc(e.kavu_name_ml || "")}<br/>` +
              `<small>${esc(e.place)}, ${esc(e.district)} · ${esc(e.dateLabel || "")}</small><br/>` +
              `<a href="/event/${e._id}">Open →</a>`
          );
      });
    });
    return () => { cancelled = true; map?.remove(); };
  }, [events]);

  return <div ref={ref} className="map" aria-label="Map of festivals" />;
}

const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
