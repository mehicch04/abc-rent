import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getLocations, getBrowseCars } from "@/lib/fleet-data";
import type { CarListItem } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { ReservationSearchForm } from "@/components/reservation/ReservationSearchForm";
import { Features } from "@/components/home/Features";
import { FeaturedFleet, type FleetType } from "@/components/home/FeaturedFleet";
import { CAR_CATEGORIES, carCategories } from "@/lib/car-categories";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { Reviews } from "@/components/home/Reviews";
import { getReviews } from "@/lib/reviews";
import { getGuides } from "@/lib/guides";
import { GuidesTeaser } from "@/components/home/GuidesTeaser";

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

  const [cars, locations, reviews] = await Promise.all([
    getBrowseCars().catch(() => [] as CarListItem[]),
    getLocations(locale).catch(() => []),
    getReviews(locale),
  ]);

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
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <Hero />

      <section id="rezervacija" className="relative z-10 mx-auto -mt-20 max-w-6xl scroll-mt-24 px-4 sm:-mt-24 sm:px-6">
        <ReservationSearchForm locations={locations} />
      </section>
      <Features />
      <FeaturedFleet
        cars={cars}
        total={cars.length}
        types={types}
      />
      <Reviews data={reviews} />
      <HowItWorks />
      <Services />
      <GuidesTeaser guides={getGuides(locale)} />
      <Faq />
      <CtaBand />
    </>
  );
}
