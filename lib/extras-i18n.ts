import type { ExtraItem } from "@/lib/extras";

type Copy = { name: string; note?: string };

/** German and Arabic copy for the extras we seed. Anything else falls back to English. */
const COPY: Record<string, { de: Copy; ar: Copy }> = {
  "no deposit": {
    de: { name: "Ohne Kaution", note: "Kleine Tagesgebühr statt Kaution" },
    ar: { name: "بدون وديعة", note: "رسوم يومية بسيطة بدلاً من الوديعة" },
  },
  "child seat": {
    de: { name: "Kindersitz", note: "Für Kinder von 1 bis 5 Jahren" },
    ar: { name: "كرسي أطفال", note: "للأطفال من 1 إلى 5 سنوات" },
  },
  "booster seat": {
    de: { name: "Sitzerhöhung", note: "Für Kinder von 5 bis 10 Jahren" },
    ar: { name: "مقعد رافع", note: "للأطفال من 5 إلى 10 سنوات" },
  },
  "cross border": {
    de: { name: "Grenzübertritt", note: "Fahrten außerhalb von Bosnien und Herzegowina" },
    ar: { name: "عبور الحدود", note: "القيادة خارج البوسنة والهرسك" },
  },
  cleaning: {
    de: { name: "Reinigung", note: "Sie geben das Auto ungereinigt zurück" },
    ar: { name: "تنظيف السيارة", note: "تعيد السيارة دون الحاجة لتنظيفها" },
  },
  "private driver": {
    de: { name: "Privatfahrer", note: "Nur Fahrer, ohne Kraftstoff" },
    ar: { name: "سائق خاص", note: "السائق فقط، الوقود غير مشمول" },
  },
  "full insurance, no deposit": {
    de: { name: "Vollkasko ohne Kaution", note: "Keine Kaution bei der Abholung" },
    ar: { name: "تأمين شامل بدون وديعة", note: "لا تترك وديعة عند الاستلام" },
  },
  "additional driver": {
    de: { name: "Zusatzfahrer", note: "Ein zweiter Fahrer im Mietvertrag" },
    ar: { name: "سائق إضافي", note: "سائق ثانٍ مسجّل في عقد الإيجار" },
  },
  "all inclusive: car and driver": {
    de: { name: "All inclusive: Auto mit Fahrer", note: "Auto, Fahrer, Kraftstoff und Parken zu einem Tagespreis" },
    ar: { name: "شامل كلياً: سيارة مع سائق", note: "السيارة والسائق والوقود والمواقف بسعر يومي واحد" },
  },
};

export function extraText(e: Pick<ExtraItem, "nameHr" | "nameEn" | "noteHr" | "noteEn">, locale: string): { name: string; note: string | null } {
  if (locale === "bs") return { name: e.nameHr, note: e.noteHr };
  if (locale === "de" || locale === "ar") {
    const c = COPY[e.nameEn.trim().toLowerCase()]?.[locale];
    if (c) return { name: c.name, note: c.note ?? e.noteEn };
  }
  return { name: e.nameEn, note: e.noteEn };
}
