"use client";

import Image from "next/image";
import Link from "next/link";
import { bookingHref } from "@/lib/booking";
import { ArrowRight, ArrowUpRight, Briefcase, Cog, Fuel, ShieldCheck, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { carCategories } from "@/lib/car-categories";
import { FUEL_LABELS, TRANSMISSION_LABELS, label } from "@/lib/car-labels";
import { buildWhatsAppUrl, type InquiryContext } from "@/lib/whatsapp";
import type { CarListItem, SearchContext } from "@/lib/types";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Price } from "@/components/currency/Price";

type Variant = "default" | "feature" | "row";

type Props = {
  car: CarListItem;
  search?: SearchContext;
  priority?: boolean;
  imageSizes?: string;
  variant?: Variant;
  badge?: string;
};

export function CarCard({ car, search, priority = false, imageSizes, variant = "default", badge }: Props) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Fleet");
  const href = `/${locale}/vozila/${car.slug}`;
  const bookHref =
    search?.pickupAt && search?.returnAt
      ? `/${locale}${bookingHref(car.slug, {
          pickupLocationId: search.pickupLocationId,
          returnLocationId: search.returnLocationId,
          pickupAt: search.pickupAt,
          returnAt: search.returnAt,
        })}`
      : `${href}#rezervacija`;
  const image = car.images?.[0];
  const cat = carCategories(car)[0];
  const feature = variant === "feature";
  const row = variant === "row";

  const whatsappUrl = buildWhatsAppUrl({
    car: { title: car.title },
    pickupLocation: search?.pickupLocation,
    returnLocation: search?.returnLocation,
    pickupAt: search?.pickupAt,
    returnAt: search?.returnAt,
    locale,
  } as InquiryContext);

  const specs = [
    { icon: Users, text: `${car.passengers} ${t("cardSeats")}` },
    { icon: Briefcase, text: car.luggage != null ? `${car.luggage} ${t("cardBags")}` : "/" },
    { icon: Cog, text: label(TRANSMISSION_LABELS[car.transmission], locale) },
    { icon: Fuel, text: label(FUEL_LABELS[car.fuelType], locale) },
  ];

  const stage = feature
    ? "aspect-[16/11] lg:aspect-auto lg:min-h-[340px] lg:flex-1"
    : row
      ? "aspect-[16/11] sm:aspect-auto sm:h-full sm:min-h-[230px]"
      : "aspect-[16/11]";

  return (
    <article
      className={`group relative flex h-full rounded-[24px] bg-surface p-2 ring-1 ring-border transition-[box-shadow] duration-300 hover:shadow-[0_24px_50px_-30px_rgba(11,18,32,0.35)] hover:ring-foreground/15 ${
        row ? "flex-col sm:grid sm:grid-cols-[44%_minmax(0,1fr)]" : "flex-col"
      }`}
    >
      <Link href={href} className={`relative block overflow-hidden rounded-[18px] bg-[#EDF1F5] ${stage}`}>
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 select-none whitespace-nowrap text-center font-display font-semibold uppercase leading-none tracking-tight text-ink/[0.06] ${
            feature ? "top-8 text-[5.5rem]" : "top-7 text-[3.25rem]"
          }`}
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
            className={`object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 group-hover:scale-[1.04] ${
              feature ? "px-8 pb-6 pt-14" : "px-5 pb-4 pt-10"
            }`}
          />
        )}
        <span className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          {badge && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white">{badge}</span>
          )}
          {cat && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ink">
              {t(`categories.${cat}`)}
            </span>
          )}
        </span>
        <span className="absolute end-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium tabular-nums text-ink backdrop-blur-sm">
          {car.year}
        </span>
        <span className="absolute bottom-3 end-3 grid h-9 w-9 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="rtl:-scale-x-100 h-4 w-4" />
        </span>
      </Link>

      <div className={`flex min-w-0 flex-col ${feature ? "px-4 pb-4 pt-5 sm:px-5" : "flex-1 px-3 pb-3 pt-4"} ${row ? "sm:ps-5 sm:pt-3" : ""}`}>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{car.brand}</p>
        <h3
          className={`mt-1 font-display font-semibold tracking-tight text-foreground ${
            feature ? "text-2xl sm:text-[1.75rem]" : "truncate text-lg"
          }`}
        >
          <Link href={href} className="transition-colors hover:text-brand-strong">
            {car.title}
          </Link>
        </h3>

        <ul className={`mt-3 grid gap-x-4 gap-y-2 text-[13px] text-foreground/75 ${feature ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
          {specs.map(({ icon: Icon, text }) => (
            <li key={text} className="flex min-w-0 items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-brand-strong" />
              <span className="truncate">{text}</span>
            </li>
          ))}
        </ul>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
          <span className="truncate">{t(row ? "includedTiny" : "includedShort")}</span>
        </p>

        <div className="mt-auto pt-4">
          <div
            className={`flex justify-between gap-3 border-t border-dashed border-border pt-4 ${
              row ? "flex-col sm:gap-3" : "items-end"
            }`}
          >
            {car.pricePerDay != null && (
              <div className="min-w-0 leading-none">
                <p className="flex items-baseline gap-1 whitespace-nowrap">
                  <Price
                    bam={car.pricePerDay}
                    className={`font-display font-semibold tracking-tight text-foreground ${feature ? "text-[2rem]" : "text-[1.6rem]"}`}
                  />
                  <span className="text-xs text-muted-foreground">{t("perDayShort")}</span>
                </p>
                {car.deposit != null && (
                  <p className="mt-1.5 whitespace-nowrap text-[11px] text-muted-foreground">
                    {t("depositLabel")} <Price bam={car.deposit} />
                  </p>
                )}
              </div>
            )}
            <div className={`flex shrink-0 items-center gap-1.5 ${row ? "flex-row-reverse" : ""}`}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full text-foreground ring-1 ring-border transition-colors hover:text-[#25D366] hover:ring-[#25D366]"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <Link
                href={bookHref}
                className={`group/btn inline-flex h-11 items-center gap-2 rounded-full bg-brand ps-4 pe-1.5 ${row ? "flex-1 justify-between" : ""} text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              >
                {t("book")}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover/btn:translate-x-0.5">
                  <ArrowRight className="rtl:-scale-x-100 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
