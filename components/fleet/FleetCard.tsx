"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Cog, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { carCategories } from "@/lib/car-categories";
import { FUEL_LABELS, TRANSMISSION_LABELS, label } from "@/lib/car-labels";
import { bookingHref } from "@/lib/booking";
import type { CarListItem, SearchContext } from "@/lib/types";
import { Price } from "@/components/currency/Price";

export function FleetCard({
  car,
  search,
  days,
  priority = false,
  sizes,
}: {
  car: CarListItem;
  search?: SearchContext;
  days?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Fleet");
  const href = `/${locale}/vozila/${car.slug}`;
  const dated = Boolean(search?.pickupAt && search?.returnAt);
  const bookHref = dated
    ? `/${locale}${bookingHref(car.slug, {
        pickupLocationId: search?.pickupLocationId,
        returnLocationId: search?.returnLocationId,
        pickupAt: search?.pickupAt ?? undefined,
        returnAt: search?.returnAt ?? undefined,
      })}`
    : `${href}#rezervacija`;
  const cat = carCategories(car)[0];
  const image = car.images?.[0];

  const specs = [
    { icon: Users, value: String(car.passengers), sub: t("cardSeats") },
    { icon: Briefcase, value: car.luggage != null ? String(car.luggage) : "/", sub: t("cardBags") },
    { icon: Cog, value: label(TRANSMISSION_LABELS[car.transmission], locale), sub: label(FUEL_LABELS[car.fuelType], locale) },
  ];

  return (
    <article className="group relative isolate flex h-full flex-col rounded-[26px] bg-surface p-2 shadow-[0_1px_2px_rgba(11,18,32,0.04),0_12px_32px_-24px_rgba(11,18,32,0.25)] ring-1 ring-border transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_36px_70px_-36px_rgba(8,121,184,0.45)] hover:ring-brand/30">
      <Link href={href} aria-label={car.title} className="absolute inset-0 z-10 rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />

      <div className="light-island relative overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#F7FAFD_0%,#EAF2F8_55%,#DDEAF4_100%)]">
        <span aria-hidden className="pointer-events-none absolute -end-10 -top-12 h-44 w-44 rounded-full bg-brand/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />
        <div className="relative flex items-start justify-between gap-3 px-4 pt-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-strong rtl:normal-case rtl:tracking-normal">{car.brand}</p>
            <h3 className="mt-0.5 truncate font-display text-lg font-semibold tracking-tight text-foreground">{car.title}</h3>
          </div>
        </div>

        <div className="relative aspect-[16/10]">
          <span aria-hidden className="absolute inset-x-[16%] bottom-[13%] h-5 rounded-[50%] bg-ink/25 blur-lg transition-transform duration-700 group-hover:scale-x-110" />
          {image && (
            <Image
              src={image}
              alt=""
              fill
              priority={priority}
              sizes={sizes ?? "(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 300px"}
              className="object-contain px-5 pb-3 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-[1.05]"
            />
          )}
        </div>

        <div className="absolute bottom-3 start-3 end-3 flex gap-1.5 overflow-hidden">
          {car.isFeatured && <span className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">{t("popular")}</span>}
          {cat && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm backdrop-blur">{t(`categories.${cat}`)}</span>}
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium tabular-nums text-ink shadow-sm backdrop-blur">{car.year}</span>
        </div>
      </div>

      <ul className="mx-1 mt-3 grid grid-cols-3 divide-x divide-border rounded-2xl bg-surface-muted py-3 rtl:divide-x-reverse">
        {specs.map(({ icon: Icon, value, sub }) => (
          <li key={sub} className="flex min-w-0 flex-col items-center px-1 text-center">
            <Icon className="h-4 w-4 text-brand-strong" />
            <span className="mt-1.5 max-w-full truncate text-xs font-semibold leading-none text-foreground">{value}</span>
            <span className="mt-1 max-w-full truncate text-[11px] leading-none text-muted-foreground">{sub}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-3 px-3 pb-2 pt-4">
        <div className="min-w-0 leading-none">
          {car.pricePerDay != null && (
            <p className="flex items-baseline gap-1 whitespace-nowrap">
              <Price bam={car.pricePerDay} className="font-display text-[1.7rem] font-semibold tracking-tight text-foreground" />
              <span className="text-xs text-muted-foreground">{t("perDayShort")}</span>
            </p>
          )}
          <p className="mt-1.5 truncate text-xs text-muted-foreground">
            {dated && car.pricePerDay != null && days ? (
              <>
                <Price bam={car.pricePerDay * days} className="font-semibold text-foreground" /> {t("cardTotal")}
              </>
            ) : car.deposit != null ? (
              <>
                {t("cardDeposit")} <Price bam={car.deposit} className="font-medium text-foreground" />
              </>
            ) : (
              t("unlimitedKm")
            )}
          </p>
        </div>
        <Link
          href={bookHref}
          aria-label={t("book")}
          className="group/b relative z-20 inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand pe-1.5 ps-4 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_rgba(8,121,184,0.95)] transition-colors hover:bg-brand-700 xl:ps-1.5"
        >
          <span className="xl:hidden">{t("book")}</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover/b:translate-x-0.5 rtl:group-hover/b:-translate-x-0.5">
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </span>
        </Link>
      </div>
    </article>
  );
}
