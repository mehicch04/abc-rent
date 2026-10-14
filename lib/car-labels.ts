import type { Car } from "@prisma/client";
import type { AppLocale } from "@/i18n/routing";

type Label = Record<AppLocale, string>;

export const CLASS_LABELS: Record<Car["carClass"], Label> = {
  CITY_CAR: { bs: "Gradski auto", en: "City car" },
  ECONOMY: { bs: "Ekonomična", en: "Economy" },
  COMPACT: { bs: "Kompaktna", en: "Compact" },
  MIDSIZE: { bs: "Srednja klasa", en: "Midsize" },
  FULLSIZE: { bs: "Velika klasa", en: "Full-size" },
  LUXURY: { bs: "Luksuzna", en: "Luxury" },
  SUV: { bs: "SUV", en: "SUV" },
  VAN: { bs: "Kombi", en: "Van" },
  MINIBUS: { bs: "Minibus", en: "Minibus" },
};

export const TRANSMISSION_LABELS: Record<Car["transmission"], Label> = {
  MANUAL: { bs: "Manuelni", en: "Manual" },
  AUTOMATIC: { bs: "Automatik", en: "Automatic" },
};

export const FUEL_LABELS: Record<Car["fuelType"], Label> = {
  PETROL: { bs: "Benzin", en: "Petrol" },
  DIESEL: { bs: "Dizel", en: "Diesel" },
  HYBRID: { bs: "Hibrid", en: "Hybrid" },
  PLUG_IN_HYBRID: { bs: "Plug-in hibrid", en: "Plug-in hybrid" },
  ELECTRIC: { bs: "Električni", en: "Electric" },
};

export function label(map: Label, locale: AppLocale): string {
  return map[locale] ?? map.bs;
}
