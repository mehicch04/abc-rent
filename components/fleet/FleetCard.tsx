"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { carCategories } from "@/lib/car-categories";
import { TRANSMISSION_LABELS, label } from "@/lib/car-labels";
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
  const auto = car.transmission === "AUTOMATIC";

  const chip =
    "rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase leading-none tracking-[0.06em] rtl:normal-case rtl:tracking-normal";
  const spec =
    "inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 py-1.5 text-[11px] font-semibold leading-none text-foreground/80 dark:bg-white/[0.08]";

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-[22px] bg-gradient-to-b from-[#F7F9FB] to-[#EAEFF4] ring-1 ring-border transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_34px_60px_-38px_rgba(11,18,32,0.55)] dark:from-[#18202B] dark:to-[#0E141C]">
      <Link href={href} aria-label={car.title} className="absolute inset-0 z-10 rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />

      <div className="relative px-5 pt-5">
        <h3 className="truncate font-display text-[1.15rem] font-semibold tracking-tight text-foreground">{car.title}</h3>
        <div className="mt-2.5 flex flex-nowrap gap-1.5 overflow-hidden">
          {car.isFeatured && <span className={`${chip} shrink-0 bg-brand text-white`}>{t("popular")}</span>}
          <span className={`${chip} min-w-0 truncate text-foreground/70 ring-1 ring-inset ring-foreground/15`}>
            {[cat ? t(`categories.${cat}`) : null, car.year].filter(Boolean).join(" · ")}
          </span>
        </div>
      </div>

      <div className="relative mt-1 aspect-[16/10] bg-[radial-gradient(closest-side,#FFFFFF_0%,rgba(255,255,255,0.8)_55%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(closest-side,#E3E8EE_0%,#CDD5DE_60%,rgba(205,213,222,0)_100%)]">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            sizes={sizes ?? "(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 300px"}
            className="object-contain px-6 py-1 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        )}
      </div>

      <div className="relative mt-auto px-5 pb-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {car.pricePerDay != null && (
              <p className="flex items-baseline gap-1.5 leading-none">
                <Price bam={car.pricePerDay} className="font-display text-[1.7rem] font-semibold tracking-tight text-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground rtl:normal-case">{t("perDayShort")}</span>
              </p>
            )}
            <p className="mt-2 truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground rtl:normal-case">
              {dated && car.pricePerDay != null && days ? (
                <>
                  <Price bam={car.pricePerDay * days} className="font-semibold text-foreground" /> {t("cardTotal")}
                </>
              ) : car.deposit != null ? (
                <>
                  {t("cardDeposit")} <Price bam={car.deposit} className="font-semibold text-foreground" />
                </>
              ) : (
                t("unlimitedKm")
              )}
            </p>
          </div>
          <Link
            href={bookHref}
            className="relative z-20 inline-flex h-11 shrink-0 items-center rounded-full bg-brand px-3.5 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(8,121,184,0.9)] transition-[background-color,padding] duration-300 hover:bg-brand-700 lg:group-hover:ps-4"
          >
            <span className="me-2 max-w-[7rem] overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300 ease-out lg:me-0 lg:max-w-0 lg:group-hover:me-2 lg:group-hover:max-w-[7rem]">
              {t("book")}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 rtl:-scale-x-100" />
          </Link>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-foreground/[0.07] pt-4">
          <li className={spec}>
            <Users className="h-3.5 w-3.5" />
            {car.passengers}
          </li>
          {car.luggage != null && (
            <li className={spec}>
              <Briefcase className="h-3.5 w-3.5" />
              {car.luggage}
            </li>
          )}
          <li className={`${spec} uppercase rtl:normal-case`}>
            <span aria-hidden className="grid h-3.5 w-3.5 place-items-center rounded-[4px] bg-foreground text-[8px] font-bold text-background">
              {auto ? "A" : "M"}
            </span>
            {label(TRANSMISSION_LABELS[car.transmission], locale)}
          </li>
        </ul>
      </div>
    </article>
  );
}
