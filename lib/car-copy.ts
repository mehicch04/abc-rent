import { carCategories } from "@/lib/car-categories";

export type CarCopyKind = "compact" | "suv" | "family" | "van" | "sedan" | "wagon";

/** Which description template fits a car, from its categories. */
export function carCopyKind(car: { categories?: string[] | null; carClass: string }): CarCopyKind {
  const cats = carCategories(car);
  if (cats.includes("MINIBUS")) return "van";
  if (cats.includes("TRANSPORT")) return "family";
  if (cats.includes("SUV")) return "suv";
  if (cats.includes("KARAVAN")) return "wagon";
  if (cats.includes("LIMUZINA") || cats.includes("LUXURY")) return "sedan";
  return "compact";
}

type T = (key: string, values?: Record<string, string | number>) => string;

/** Database text in Bosnian or English when the owner wrote one, otherwise a sentence pair built from the specs. */
export function carDescription(
  car: {
    title: string;
    passengers: number;
    luggage: number | null;
    transmission: string;
    categories?: string[] | null;
    carClass: string;
    descriptionHr?: string | null;
    descriptionEn?: string | null;
  },
  locale: string,
  t: T,
): string {
  const own = locale === "bs" ? car.descriptionHr : locale === "en" ? car.descriptionEn : null;
  if (own && own.trim()) return own.trim();
  const kind = carCopyKind(car);
  const first = t(`about.${kind}`, { name: car.title, seats: car.passengers });
  const second = t("about.spec", {
    gearbox: t(`gearboxText.${car.transmission}`),
    seats: car.passengers,
    bags: car.luggage ?? 2,
  });
  return `${first} ${second}`;
}
