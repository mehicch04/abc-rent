"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Car as CarIcon,
  Cog,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { carCategories } from "@/lib/car-categories";
import {
  CLASS_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  label,
} from "@/lib/car-labels";
import { buildWhatsAppUrl, type InquiryContext } from "@/lib/whatsapp";
import type { CarListItem, SearchContext } from "@/lib/types";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Price } from "@/components/currency/Price";
import { CarGallery } from "./CarGallery";
import { ImageLightbox } from "./ImageLightbox";

type Props = {
  car: CarListItem;
  search?: SearchContext;
  onSelect?: (car: CarListItem) => void;
  /** Eagerly load this card's photo (first above-the-fold cards on the fleet page). */
  priority?: boolean;
  /** Override the image `sizes` (smaller on the homepage teaser). */
  imageSizes?: string;
};

export function CarCard({
  car,
  search,
  onSelect,
  priority = false,
  imageSizes,
}: Props) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Fleet");
  const common = useTranslations("Common");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = car.images ?? [];

  const inquiry: InquiryContext = {
    car: { title: car.title },
    pickupLocation: search?.pickupLocation,
    returnLocation: search?.returnLocation,
    pickupAt: search?.pickupAt,
    returnAt: search?.returnAt,
    locale,
  };
  const whatsappUrl = buildWhatsAppUrl(inquiry);

  const cats = carCategories(car);
  const specs = [
    { icon: Users, value: `${car.passengers} ${locale === "en" ? "seats" : "sjedišta"}` },
    {
      icon: CarIcon,
      value: [cats[1] ? t(`categories.${cats[1]}`) : label(CLASS_LABELS[car.carClass], locale), label(FUEL_LABELS[car.fuelType], locale)].join(" · "),
    },
    { icon: Cog, value: `${label(TRANSMISSION_LABELS[car.transmission], locale)} · ${car.year}` },
  ];

  return (
    <article
      data-frozen={lightbox !== null || undefined}
      className="group relative flex cursor-pointer flex-col rounded-2xl border border-border bg-surface p-3 transition-colors duration-300 hover:border-foreground/20"
    >
      <div className="relative z-10 overflow-hidden rounded-xl">
        <CarGallery
          images={images}
          title={car.title}
          onOpen={setLightbox}
          frozen={lightbox !== null}
          priority={priority}
          sizes={imageSizes}
        />
      </div>

      <ImageLightbox
        images={images}
        title={car.title}
        openIndex={lightbox}
        onClose={() => setLightbox(null)}
        thumbSizes={imageSizes}
      />

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
            <Link
              href={`/${locale}/vozila/${car.slug}`}
              className="before:absolute before:inset-0 before:z-0 before:content-['']"
            >
              {car.title}
            </Link>
          </h3>
          {cats[0] && (
            <span className="shrink-0 rounded-full border border-brand/30 px-2.5 py-0.5 text-[11px] font-medium text-brand-strong">
              {t(`categories.${cats[0]}`)}
            </span>
          )}
        </div>

        <ul className="mb-5 mt-3 space-y-1.5 text-sm text-muted-foreground">
          {specs.map((spec, i) => (
            <li key={i} className="flex items-center gap-2">
              <spec.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{spec.value}</span>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
          {car.pricePerDay != null ? (
            <p>
              <Price bam={car.pricePerDay} className="font-display text-2xl font-semibold text-foreground" />
              <span className="text-sm text-muted-foreground"> / {common("perDay")}</span>
            </p>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[#25D366] hover:text-[#25D366]"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => onSelect?.(car)}
              className="inline-flex h-9 items-center rounded-full bg-brand px-4 text-xs font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("select")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
