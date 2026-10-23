import type { Car } from "@prisma/client";
import type { AppLocale } from "@/i18n/routing";

type Label = Record<AppLocale, string>;

export const CLASS_LABELS: Record<Car["carClass"], Label> = {
  CITY_CAR: { bs: "Gradski auto", en: "City car", de: "Stadtauto", ar: "سيارة مدينة" },
  ECONOMY: { bs: "Ekonomična", en: "Economy", de: "Economy", ar: "اقتصادية" },
  COMPACT: { bs: "Kompaktna", en: "Compact", de: "Kompaktklasse", ar: "مدمجة" },
  MIDSIZE: { bs: "Srednja klasa", en: "Midsize", de: "Mittelklasse", ar: "متوسطة" },
  FULLSIZE: { bs: "Velika klasa", en: "Full-size", de: "Oberklasse", ar: "كبيرة" },
  LUXURY: { bs: "Luksuzna", en: "Luxury", de: "Luxusklasse", ar: "فاخرة" },
  SUV: { bs: "SUV", en: "SUV", de: "SUV", ar: "SUV" },
  VAN: { bs: "Kombi", en: "Van", de: "Van", ar: "فان" },
  MINIBUS: { bs: "Minibus", en: "Minibus", de: "Kleinbus", ar: "ميني باص" },
};

export const TRANSMISSION_LABELS: Record<Car["transmission"], Label> = {
  MANUAL: { bs: "Manuelni", en: "Manual", de: "Schaltgetriebe", ar: "يدوي" },
  AUTOMATIC: { bs: "Automatik", en: "Automatic", de: "Automatik", ar: "أوتوماتيك" },
};

export const FUEL_LABELS: Record<Car["fuelType"], Label> = {
  PETROL: { bs: "Benzin", en: "Petrol", de: "Benzin", ar: "بنزين" },
  DIESEL: { bs: "Dizel", en: "Diesel", de: "Diesel", ar: "ديزل" },
  HYBRID: { bs: "Hibrid", en: "Hybrid", de: "Hybrid", ar: "هجين" },
  PLUG_IN_HYBRID: { bs: "Plug-in hibrid", en: "Plug-in hybrid", de: "Plug-in-Hybrid", ar: "هجين قابل للشحن" },
  ELECTRIC: { bs: "Električni", en: "Electric", de: "Elektro", ar: "كهربائي" },
};

export function label(map: Label, locale: AppLocale): string {
  return map[locale] ?? map.en ?? map.bs;
}
