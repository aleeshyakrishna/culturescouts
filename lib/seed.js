import { todayISO } from "./dates";

// SAMPLE events so the map isn't empty before real posters are added. Clearly marked as samples.
export function seedEvents() {
  return [
    {
      _id: "sample-1",
      sample: true,
      kavu_name: "Sample Bhagavathi Kavu",
      kavu_name_ml: "മാതൃക ഭഗവതി കാവ്",
      place: "Payyanur",
      district: "Kannur",
      lat: 12.1, lng: 75.2,
      start_date: todayISO(0),
      end_date: todayISO(1),
      date_text_ml: "തുലാം മാസം (മാതൃക)",
      theyyams: [
        { name: "Thottam (invocation songs)", name_ml: "തോറ്റം", date: todayISO(0), time: "7:00 PM" },
        { name: "Vishnumoorthi", name_ml: "വിഷ്ണുമൂർത്തി", date: todayISO(1), time: "4:00 AM" },
      ],
      notes_en: "Sample entry to show how the app works.",
      guide: {
        en: {
          about: "Theyyam is a sacred ritual of North Malabar in which the performer is believed to become the deity. It is worship, not a stage show.",
          best_time: "Arrive in the evening for the thottam songs; the main Theyyam usually appears in the early morning hours.",
          etiquette: ["Dress modestly and remove footwear in the kavu compound.", "Ask before photographing, and never use flash near the performer.", "Keep a respectful distance and follow the instructions of the kavu committee."],
        },
        ar: {
          about: "التيّام طقس مقدس في شمال مالابار، يُعتقد فيه أن المؤدي يتحول إلى الإله. إنه عبادة وليس عرضًا مسرحيًا.",
          best_time: "احضر في المساء لسماع أناشيد الثوتّام؛ وعادةً ما يظهر التيّام الرئيسي في ساعات الفجر.",
          etiquette: ["ارتدِ ملابس محتشمة واخلع حذاءك داخل ساحة الكاوو.", "استأذن قبل التصوير ولا تستخدم الفلاش قرب المؤدي.", "حافظ على مسافة محترمة واتبع تعليمات لجنة الكاوو."],
        },
        ml: {
          about: "കോലധാരി ദൈവമായി മാറുന്നു എന്ന് വിശ്വസിക്കുന്ന ഉത്തര മലബാറിന്റെ അനുഷ്ഠാന കലയാണ് തെയ്യം. ഇത് ആരാധനയാണ്, പ്രദർശനമല്ല.",
          best_time: "തോറ്റം കാണാൻ വൈകുന്നേരം എത്തുക; പ്രധാന തെയ്യം സാധാരണ പുലർച്ചെയാണ് പുറപ്പെടുന്നത്.",
          etiquette: ["മാന്യമായ വസ്ത്രം ധരിക്കുക, കാവിൽ ചെരിപ്പ് അഴിക്കുക.", "ഫോട്ടോ എടുക്കും മുമ്പ് അനുവാദം ചോദിക്കുക, ഫ്ലാഷ് ഉപയോഗിക്കരുത്.", "കാവ് കമ്മിറ്റിയുടെ നിർദ്ദേശങ്ങൾ പാലിക്കുക."],
        },
      },
      poster: null,
      scout: "Anu (sample)",
      verifications: ["Rahul (sample)"],
      createdAt: new Date().toISOString(),
    },
    {
      _id: "sample-2",
      sample: true,
      kavu_name: "Sample Tharavad Kavu",
      kavu_name_ml: "മാതൃക തറവാട് കാവ്",
      place: "Nileshwaram",
      district: "Kasaragod",
      lat: 12.25, lng: 75.13,
      start_date: todayISO(3),
      end_date: todayISO(4),
      date_text_ml: "(മാതൃക)",
      theyyams: [
        { name: "Muchilottu Bhagavathi", name_ml: "മുച്ചിലോട്ട് ഭഗവതി", date: todayISO(4), time: "Early morning" },
      ],
      notes_en: "Sample entry.",
      guide: null,
      poster: null,
      scout: "Fathima (sample)",
      verifications: [],
      createdAt: new Date().toISOString(),
    },
  ];
}
