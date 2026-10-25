import { waDigits } from "@/lib/phone";

export type WaLang = "HR" | "EN";

export type WaGuest = {
  firstName: string;
  reference: string;
  carTitle?: string | null;
  pickupAt: Date | string;
  returnAt: Date | string;
  pickupLocation?: string | null;
};

const when = (d: Date | string, lang: WaLang) => {
  const x = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(x.getTime())) return "";
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Sarajevo",
      day: "numeric",
      month: lang === "EN" ? "short" : "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(x)
      .map((q) => [q.type, q.value]),
  );
  return lang === "EN" ? `${p.day} ${p.month}, ${p.hour}:${p.minute}` : `${p.day}.${p.month}.${p.year}. u ${p.hour}:${p.minute}`;
};

export const waLink = (phone: string, text?: string) =>
  `https://wa.me/${waDigits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export function guestTemplates(g: WaGuest, lang: WaLang) {
  const name = g.firstName.trim();
  const car = g.carTitle ?? "";
  const from = when(g.pickupAt, lang);
  const to = when(g.returnAt, lang);
  const loc = g.pickupLocation ?? "";
  if (lang === "EN") {
    return [
      { key: "hello", label: "Hello", text: `Hello ${name}, this is ABC Rent a Car about your booking ${g.reference}.` },
      {
        key: "confirm",
        label: "Confirmed",
        text: `Hello ${name}, your booking ${g.reference} is confirmed. ${car}, pickup ${from}${loc ? ` at ${loc}` : ""}, return ${to}. See you soon!`,
      },
      {
        key: "docs",
        label: "Documents",
        text: `Hello ${name}, so everything is ready for your pickup, please send us a photo of your passport or ID card and your driving licence here. Booking ${g.reference}.`,
      },
      {
        key: "pickup",
        label: "Pickup",
        text: `Hello ${name}, we are expecting you on ${from}${loc ? ` at ${loc}` : ""}. Message us here when you land or arrive and we will come to you.`,
      },
    ];
  }
  return [
    { key: "hello", label: "Pozdrav", text: `Zdravo ${name}, ovdje ABC Rent a Car u vezi vaše rezervacije ${g.reference}.` },
    {
      key: "confirm",
      label: "Potvrda",
      text: `Zdravo ${name}, vaša rezervacija ${g.reference} je potvrđena. ${car}, preuzimanje ${from}${loc ? `, ${loc}` : ""}, povrat ${to}. Vidimo se!`,
    },
    {
      key: "docs",
      label: "Dokumenti",
      text: `Zdravo ${name}, da sve bude spremno za preuzimanje, pošaljite nam ovdje fotografiju pasoša ili lične karte i vozačke dozvole. Rezervacija ${g.reference}.`,
    },
    {
      key: "pickup",
      label: "Preuzimanje",
      text: `Zdravo ${name}, čekamo vas ${from}${loc ? `, ${loc}` : ""}. Kad sletite ili stignete, javite nam se ovdje i dolazimo.`,
    },
  ];
}

export const agencyText = (reference: string, lang: WaLang) =>
  lang === "EN" ? `Hello, I am writing about my booking ${reference}.` : `Zdravo, pišem u vezi rezervacije ${reference}.`;
