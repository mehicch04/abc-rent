"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Briefcase, Cog, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { carCategories } from "@/lib/car-categories";
import { FUEL_LABELS, TRANSMISSION_LABELS, label } from "@/lib/car-labels";
import { buildWhatsAppUrl, type InquiryContext } from "@/lib/whatsapp";
import type { CarListItem, SearchContext } from "@/lib/types";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Price } from "@/components/currency/Price";

type Props = {
  car: CarListItem;
  search?: SearchContext;
  onSelect?: (car: CarListItem) => void;
  priority?: boolean;
  imageSizes?: string;
};

export function CarCard({ car, search, onSelect, priority = false, imageSizes }: Props) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Fleet");
  const href = `/${locale}/vozila/${car.slug}`;
  const image = car.images?.[0];
  const cat = carCategories(car)[0];

  const whatsappUrl = buildWhatsAppUrl({
    car: { title: car.title },
    pickupLocation: search?.pickupLocation,
    returnLocation: search?.returnLocation,
    pickupAt: search?.pickupAt,
    returnAt: search?.returnAt,
    locale,
  } as InquiryContext);

  const specs = [
    { icon: Users, value: String(car.passengers), label: t("cardSeats") },
    { icon: Briefcase, value: car.luggage != null ? String(car.luggage) : "/", label: t("cardBags") },
    { icon: Cog, value: label(TRANSMISSION_LABELS[car.transmission], locale), label: t("cardGearbox") },
  ];

  return (
    <article className="group relative flex flex-col rounded-[22px] bg-surface p-2 ring-1 ring-border transition-[box-shadow] duration-300 hover:ring-foreground/20">
      <Link
        href={href}
        aria-label={car.title}
        className="relative block aspect-[4/3] overflow-hidden rounded-[16px] bg-[#EDF1F5]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-6 select-none whitespace-nowrap text-center font-display text-[3.25rem] font-semibold uppercase leading-none tracking-tight text-ink/[0.06]"
        >
          {car.model}
        </span>
        {image && (
          <Image
            src={image}
            alt={car.title}
            fill
            priority={priority}
            sizes={imageSizes ?? "(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 360px"}
            className="object-contain px-5 pb-4 pt-8 mix-blend-multiply transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-hover:scale-[1.05]"
          />
        )}
        {cat && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ink">
            {t(`categories.${cat}`)}
          </span>
        )}
        <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold tracking-tight text-foreground">
              <Link href={href} className="transition-colors hover:text-brand-strong">
                {car.title}
              </Link>
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {car.year} · {label(FUEL_LABELS[car.fuelType], locale)}
            </p>
          </div>
          {car.pricePerDay != null && (
            <p className="shrink-0 text-right leading-none">
              <Price bam={car.pricePerDay} className="font-display text-2xl font-semibold text-foreground" />
              <span className="mt-1 block text-xs text-muted-foreground">{t("perDayLabel")}</span>
            </p>
          )}
        </div>

        <ul className="mt-4 grid grid-cols-3 divide-x divide-border rounded-2xl bg-surface-muted py-3">
          {specs.map(({ icon: Icon, value, label: l }) => (
            <li key={l} className="flex flex-col items-center gap-1 px-1 text-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="truncate text-sm font-medium text-foreground">{value}</span>
              <span className="text-[11px] text-muted-foreground">{l}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect?.(car)}
            className="group/btn inline-flex h-11 flex-1 items-center justify-between rounded-full bg-brand pl-5 pr-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("book")}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand transition-transform duration-300 group-hover/btn:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ring-border text-foreground transition-colors hover:text-[#25D366] hover:ring-[#25D366]"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </article>
  );
}
