import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { getCarBySlug, getSimilarCars } from "@/lib/car-detail";
import { getLocations } from "@/lib/fleet-data";
import { getActiveExtras } from "@/lib/extras";
import { getBookedExtras } from "@/lib/extras-availability";
import { SITE_URL, buildAlternates } from "@/lib/seo";
import { carDescription } from "@/lib/car-copy";
import { SITE } from "@/lib/site-config";
import { CarDetail } from "@/components/fleet/CarDetail";

export const revalidate = 300;

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = await getCarBySlug(params.slug);
  if (!car) return { title: { absolute: SITE.name } };

  const t = await getTranslations({ locale: params.locale, namespace: "Fleet" });
  const description = carDescription(car, params.locale, (k, v) => t(k as never, v as never));

  const url = `${SITE_URL}/${params.locale}/vozila/${car.slug}`;

  return {
    title: car.title,
    description: description.slice(0, 160),
    alternates: buildAlternates(params.locale, `/vozila/${car.slug}`),
    openGraph: {
      title: car.title,
      description: description.slice(0, 160),
      url,
      images: car.images?.length ? [{ url: car.images[0] }] : undefined,
      type: "website",
    },
  };
}

export default async function CarPage({ params }: Props) {
  const car = await getCarBySlug(params.slug);
  if (!car) notFound();

  const [similar, locations, extras, booked, t] = await Promise.all([
    getSimilarCars(car.slug, car.carClass),
    getLocations(params.locale),
    getActiveExtras(),
    getBookedExtras().catch(() => []),
    getTranslations("Fleet"),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: car.title,
    image: car.images ?? [],
    description: carDescription(car, params.locale, (k, v) => t(k as never, v as never)),
    brand: { "@type": "Brand", name: car.brand },
    offers: car.pricePerDay
      ? {
          "@type": "Offer",
          price: car.pricePerDay,
          priceCurrency: car.currency ?? "BAM",
          availability: car.isAvailable
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${SITE_URL}/${params.locale}/vozila/${car.slug}`,
        }
      : undefined,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        // Escaped so a stray closing tag in a description cannot break out.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/${params.locale}/vozila`} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {t("backToFleet")}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-foreground">{car.title}</span>
      </nav>

      <CarDetail
        car={car}
        similar={similar}
        locations={locations.map((l) => ({ id: l.id, name: l.name }))}
        extras={extras}
        bookedExtras={booked}
        locale={params.locale}
      />
    </div>
  );
}
