import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getActiveLocations, getBrowseCars } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-config";
import type { CarListItem } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HomeAbout } from "@/components/home/HomeAbout";
import { FeaturedFleet, type FleetCard } from "@/components/home/FeaturedFleet";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Visit } from "@/components/home/Visit";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
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

  const featured = [...cars.filter((c) => c.isFeatured), ...cars.filter((c) => !c.isFeatured)]
    .slice(0, 6)
    .map<FleetCard>((c) => ({
      slug: c.slug,
      title: c.title,
      image: c.images?.[0] ?? null,
      price: c.pricePerDay,
      passengers: c.passengers,
      fuelType: c.fuelType,
      carClass: c.carClass,
      categories: c.categories,
    }));

  return (
    <>
      <Hero fleetCount={cars.length} />

      <section id="rezervacija" className="relative z-10 mx-auto -mt-16 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <ReservationSearchForm locations={locations} />
      </section>

      <Features />
      <HomeAbout />
      <FeaturedFleet cars={featured} />
      <Services />
      <HowItWorks />
      <Visit address={SITE.address} />
      <Faq />
      <CtaBand />
    </>
  );
}
