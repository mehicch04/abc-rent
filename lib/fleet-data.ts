import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { toCarListItem, type CarListItem } from "@/lib/types";
import { getCompany } from "@/lib/company";

/** All offerable cars, no date filter (the default /vozila browse view). */
export const getBrowseCars = unstable_cache(
  async (): Promise<CarListItem[]> => {
    const rows = await prisma.car.findMany({
      where: { isAvailable: true },
      orderBy: { sortOrder: "asc" },
    });
    const { seasonalPricing } = await getCompany();
    return rows.map((c) => toCarListItem(c, seasonalPricing));
  },
  ["fleet-browse-cars"],
  { revalidate: 300, tags: ["fleet"] },
);

/** Active pickup / return offices. */
export const getActiveLocations = unstable_cache(
  async () =>
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        street: true,
        city: true,
        postalCode: true,
      },
    }),
  ["active-locations"],
  { revalidate: 300, tags: ["fleet", "locations"] },
);

type LocCopy = { name: string; street?: string };

const LOCATION_COPY: Record<string, Partial<Record<"en" | "de" | "ar", LocCopy>>> = {
  "sarajevo-poslovnica": {
    en: { name: "Sarajevo office" },
    de: { name: "Büro Sarajevo" },
    ar: { name: "مكتب سراييفو" },
  },
  "aerodrom-sarajevo": {
    en: { name: "Sarajevo Airport (SJJ)" },
    de: { name: "Flughafen Sarajevo (SJJ)" },
    ar: { name: "مطار سراييفو (SJJ)" },
  },
  "dostava-na-adresu": {
    en: { name: "Delivery to your address (Sarajevo)", street: "Your address in Sarajevo" },
    de: { name: "Lieferung an Ihre Adresse (Sarajevo)", street: "Ihre Adresse in Sarajevo" },
    ar: { name: "التوصيل إلى عنوانك (سراييفو)", street: "عنوانك في سراييفو" },
  },
};

export type LocationRow = { id: string; slug: string; name: string; street: string; city: string; postalCode: string };

/** Active locations with names in the visitor's language (the database keeps Bosnian only). */
export async function getLocations(locale: string): Promise<LocationRow[]> {
  const rows: LocationRow[] = await getActiveLocations();
  if (locale === "bs") return rows;
  return rows.map((l) => {
    const c = LOCATION_COPY[l.slug]?.[locale as "en" | "de" | "ar"];
    return c ? { ...l, name: c.name, street: c.street ?? l.street } : l;
  });
}
