import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getActiveLocations, getBrowseCars } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-config";
import type { CarListItem } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HomeAbout } from "@/components/home/HomeAbout";
import { FeaturedFleet, type FleetType } from "@/components/home/FeaturedFleet";
import { CAR_CATEGORIES, carCategories } from "@/lib/car-categories";
import { getActiveExtras } from "@/lib/extras";
import { getBookedExtras } from "@/lib/extras-availability";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Visit } from "@/components/home/Visit";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { ReservationSearchForm } from "@/components/reservation/ReservationSearchForm";
import { Requirements } from "@/components/home/Requirements";
import { Destinations } from "@/components/home/Destinations";
import { Reviews } from "@/components/home/Reviews";
import { getReviews } from "@/lib/reviews";

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

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const [cars, locations, extras, bookedExtras, reviews] = await Promise.all([
    getBrowseCars().catch(() => [] as CarListItem[]),
    getActiveLocations().catch(() => []),
    getActiveExtras().catch(() => []),
    getBookedExtras().catch(() => []),
    getReviews(locale),
  ]);

  const picked = cars.filter((c) => c.isFeatured).slice(0, 3);
  const featured = picked.length ? picked : cars.slice(0, 3);
  const types: FleetType[] = CAR_CATEGORIES.map((id) => {
    const inType = cars.filter((c) => carCategories(c).includes(id));
    const cheapest = inType
      .filter((c) => c.pricePerDay != null)
      .sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0))[0];
    return {
      id,
      count: inType.length,
      from: cheapest?.pricePerDay ?? null,
      image: (cheapest ?? inType[0])?.images?.[0] ?? null,
    };
  })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return (
    <>
      <Hero fleetCount={cars.length} />

      <section id="rezervacija" className="relative z-10 mx-auto -mt-16 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <ReservationSearchForm locations={locations} />
      </section>

      <Features />
      <HomeAbout />
      <FeaturedFleet
        cars={featured}
        total={cars.length}
        types={types}
        locations={locations.map((l) => ({ id: l.id, name: l.name }))}
        extras={extras}
        bookedExtras={bookedExtras}
      />
      <Services />
      <HowItWorks />
      <Requirements />
      <Destinations />
      <Reviews data={reviews} />
      <Visit address={SITE.address} />
      <Faq />
      <CtaBand />
    </>
  );
}
