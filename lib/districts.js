// Kerala's 14 districts with approximate centre coordinates (for the map).
export const DISTRICTS = {
  Thiruvananthapuram: { ml: "തിരുവനന്തപുരം", lat: 8.5241, lng: 76.9366 },
  Kollam: { ml: "കൊല്ലം", lat: 8.8932, lng: 76.6141 },
  Pathanamthitta: { ml: "പത്തനംതിട്ട", lat: 9.2648, lng: 76.787 },
  Alappuzha: { ml: "ആലപ്പുഴ", lat: 9.4981, lng: 76.3388 },
  Kottayam: { ml: "കോട്ടയം", lat: 9.5916, lng: 76.5222 },
  Idukki: { ml: "ഇടുക്കി", lat: 9.8494, lng: 76.971 },
  Ernakulam: { ml: "എറണാകുളം", lat: 9.9816, lng: 76.2999 },
  Thrissur: { ml: "തൃശ്ശൂർ", lat: 10.5276, lng: 76.2144 },
  Palakkad: { ml: "പാലക്കാട്", lat: 10.7867, lng: 76.6548 },
  Malappuram: { ml: "മലപ്പുറം", lat: 11.051, lng: 76.0711 },
  Kozhikode: { ml: "കോഴിക്കോട്", lat: 11.2588, lng: 75.7804 },
  Wayanad: { ml: "വയനാട്", lat: 11.6854, lng: 76.132 },
  Kannur: { ml: "കണ്ണൂർ", lat: 11.8745, lng: 75.3704 },
  Kasaragod: { ml: "കാസർഗോഡ്", lat: 12.4996, lng: 74.9869 },
};

export const TYPES = [
  { id: "art", en: "Performing art", ml: "കല" },
  { id: "song", en: "Folk song", ml: "നാടൻപാട്ട്" },
  { id: "story", en: "Oral story", ml: "കഥ" },
  { id: "ritual", en: "Ritual / festival", ml: "അനുഷ്ഠാനം / ഉത്സവം" },
  { id: "craft", en: "Craft", ml: "കരകൗശലം" },
  { id: "food", en: "Food tradition", ml: "ഭക്ഷണ പാരമ്പര്യം" },
];

export const typeLabel = (id) => TYPES.find((t) => t.id === id) ?? { en: id, ml: id };
