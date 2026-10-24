import { intlLocale } from "@/i18n/routing";

const pad = (n: number) => String(n).padStart(2, "0");

const BS_MONTHS = ["januar", "februar", "mart", "april", "maj", "juni", "juli", "august", "septembar", "oktobar", "novembar", "decembar"];
const BS_MONTHS_SHORT = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
const BS_WEEKDAYS = ["pon", "uto", "sri", "čet", "pet", "sub", "ned"];
const BS_WEEKDAYS_LONG = ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"];

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function todayISO(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toISODate(d);
}

export function monthLabel(locale: string, d: Date): string {
  if (locale === "bs") return `${BS_MONTHS[d.getMonth()]} ${d.getFullYear()}.`;
  return new Intl.DateTimeFormat(intlLocale(locale), { month: "long", year: "numeric" }).format(d);
}

/** Monday first. */
export function weekdayLabels(locale: string): string[] {
  if (locale === "bs") return BS_WEEKDAYS;
  const f = new Intl.DateTimeFormat(intlLocale(locale), { weekday: "short" });
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(2024, 0, 1 + i)));
}

/** "sub, 25. okt 2026." style, short and readable. */
export function shortDate(locale: string, iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  if (locale === "bs") return `${BS_WEEKDAYS[(d.getDay() + 6) % 7]}, ${d.getDate()}. ${BS_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}.`;
  return new Intl.DateTimeFormat(intlLocale(locale), { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(d);
}

export function longDate(locale: string, iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  if (locale === "bs") return `${BS_WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()}. ${BS_MONTHS[d.getMonth()]} ${d.getFullYear()}.`;
  return new Intl.DateTimeFormat(intlLocale(locale), { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
}

/** Date and time of an instant as seen in one time zone. */
export function localParts(iso: string, timeZone: string): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}
