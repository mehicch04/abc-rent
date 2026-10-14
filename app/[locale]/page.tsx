import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getActiveLocations, getBrowseCars } from "@/lib/fleet-data";
import { carCategories } from "@/lib/car-categories";
import { SITE } from "@/lib/site-config";
import type { CarListItem } from "@/lib/types";
import { Hero, type ShowcaseCar } from "@/components/home/Hero";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { FleetShowcase, type ShowcaseItem } from "@/components/home/FleetShowcase";
import { Bento } from "@/components/home/Bento";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Visit } from "@/components/home/Visit";
import { Faq } from "@/components/home/Faq";
import { ReservationSearchForm } from "@/components/reservation/ReservationSearchForm";

export const revalidate = 300;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const tSeo = await getTranslations({ locale, namespace: "Seo" });
  return buildPageMetadata({
    locale,
    path: "/",
    title: tSeo("home.title"),
    description: tSeo("home.description"),
  });
}

const GROUPS: { group: ShowcaseCar["group"]; test: (c: CarListItem) => boolean }[] = [
  { group: "premium", test: (c) => carCategories(c).includes("LUXURY") && carCategories(c).includes("LIMUZINA") },
  { group: "suv", test: (c) => carCategories(c).includes("SUV") && !carCategories(c).includes("LUXURY") },
  { group: "city", test: (c) => carCategories(c).includes("COMPACT") && !carCategories(c).includes("SUV") },
  { group: "van", test: (c) => carCategories(c).includes("MINIBUS") },
];

function pickShowcase(cars: CarListItem[]): ShowcaseCar[] {
  const out: ShowcaseCar[] = [];
  for (const g of GROUPS) {
    const pool = cars.filter((c) => g.test(c) && c.images?.[0]);
    const car = pool.find((c) => c.isFeatured) ?? pool[0];
    if (!car) continue;
    out.push({
      group: g.group,
      slug: car.slug,
      title: car.title,
      model: car.model,
      image: car.images[0],
      price: car.pricePerDay,
      passengers: car.passengers,
      luggage: car.luggage,
    });
  }
  return out;
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const [cars, locations] = await Promise.all([
    getBrowseCars().catch(() => [] as CarListItem[]),
    getActiveLocations().catch(() => []),
  ]);

  const items: ShowcaseItem[] = cars.map((c) => ({
    slug: c.slug,
    title: c.title,
    brand: c.brand,
    image: c.images?.[0] ?? null,
    price: c.pricePerDay,
    passengers: c.passengers,
    luggage: c.luggage,
    carClass: c.carClass,
    categories: c.categories,
  }));

  return (
    <>
      <Hero cars={pickShowcase(cars)} fleetCount={cars.length} />

      <section
        id="rezervacija"
        className="container relative z-10 -mt-14 scroll-mt-28"
      >
        <ReservationSearchForm locations={locations} />
      </section>

      <BrandMarquee />

      <FleetShowcase cars={items} />

      <Services />

      <Bento />

      <HowItWorks />

      <Visit address={SITE.address} />

      <Faq />
    </>
  );
}
