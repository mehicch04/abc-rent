import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveExtras } from "@/lib/extras";
import { getBookedExtras } from "@/lib/extras-availability";
import { toCarListItem } from "@/lib/types";
import { getCompany } from "@/lib/company";
import { getBrowseCars } from "@/lib/fleet-data";
import { Hero } from "@/components/home/Hero";
import { Perks } from "@/components/home/Perks";
import { Services } from "@/components/home/Services";
import { WhyChoose } from "@/components/home/WhyChoose";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Reviews } from "@/components/home/Reviews";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { ReservationSearchForm } from "@/components/reservation/ReservationSearchForm";
import { FleetGrid } from "@/components/fleet/FleetGrid";

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

  const t = await getTranslations("Fleet");

  const [locations, featured, allCars, extras, bookedExtras] = await Promise.all([
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, street: true, city: true },
    }),
    prisma.car.findMany({
      where: { isAvailable: true, isFeatured: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    getBrowseCars().catch(() => []),
    getActiveExtras(),
    getBookedExtras().catch(() => []),
  ]);

  const { seasonalPricing } = await getCompany();
  const cars = featured.map((c) => toCarListItem(c, seasonalPricing));

  const prices = allCars
    .map((c) => c.pricePerDay)
    .filter((p): p is number => p != null && p > 0);
  const fromBam = prices.length ? Math.min(...prices) : null;

  return (
    <>
      <Hero fromBam={fromBam} />

      <section
        id="rezervacija"
        className="container relative z-10 mt-6 scroll-mt-24 sm:mt-8"
      >
        <ReservationSearchForm locations={locations} />
      </section>

      <Perks />

      {cars.length > 0 && (
        <section className="container pb-20 sm:pb-28">
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-strong">
                <span className="h-px w-7 bg-brand" />
                {t("title")}
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {t("featuredTitle")}
              </h2>
            </div>
            <Link
              href="/vozila"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand-strong"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <FleetGrid
            cars={cars}
            showFilters={false}
            locations={locations.map((l) => ({ id: l.id, name: l.name }))}
            imageSizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 30vw"
            extras={extras}
            bookedExtras={bookedExtras}
          />
        </section>
      )}

      <Services />

      <WhyChoose />

      <HowItWorks />

      <Reviews />

      <Faq />

      <FinalCta />
    </>
  );
}
