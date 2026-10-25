"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
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
  const ref = useRef<HTMLElement>(null);
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
    { icon: Users, text: `${car.passengers} ${t("cardSeats")}` },
    ...(car.luggage != null ? [{ icon: Briefcase, text: `${car.luggage} ${t("cardBags")}` }] : []),
    { icon: Cog, text: `${label(TRANSMISSION_LABELS[car.transmission], locale)} · ${label(FUEL_LABELS[car.fuelType], locale)}` },
  ];

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 7}deg`);
    el.style.setProperty("--px", `${(x - 0.5) * 18}px`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--px", "0px");
  };

  return (
    <article
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className="group relative isolate flex h-full flex-col rounded-[26px] bg-surface p-2 shadow-[0_1px_2px_rgba(11,18,32,0.04),0_14px_34px_-26px_rgba(11,18,32,0.3)] ring-1 ring-border transition-[transform,box-shadow] duration-300 ease-out [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:shadow-[0_40px_70px_-38px_rgba(8,121,184,0.5)] hover:ring-brand/30 motion-reduce:[transform:none]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[26px] opacity-0 transition-opacity duration-300 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,0%),rgba(30,164,233,0.16),transparent_45%)] group-hover:opacity-100"
      />
      <Link href={href} aria-label={car.title} className="absolute inset-0 z-10 rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />

      <div className="light-island relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[radial-gradient(120%_90%_at_50%_0%,#FFFFFF_0%,#EEF4F9_45%,#DCE8F2_100%)]">
        <div className="absolute inset-x-3 top-3 z-[1] flex items-start justify-between gap-2">
          <span className="flex gap-1.5">
            {car.isFeatured && <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">{t("popular")}</span>}
            {cat && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm">{t(`categories.${cat}`)}</span>}
          </span>
          <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white backdrop-blur">{car.year}</span>
        </div>
        <span aria-hidden className="absolute inset-x-[18%] bottom-[11%] h-5 rounded-[50%] bg-ink/30 blur-lg transition-transform duration-500 group-hover:scale-x-110" />
        {image && (
          <div className="absolute inset-0 mix-blend-multiply transition-transform duration-500 ease-out [transform:translate3d(var(--px,0px),0,0)]">
            <Image
              src={image}
              alt=""
              fill
              priority={priority}
              sizes={sizes ?? "(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 300px"}
              className="object-contain px-6 pb-4 pt-9 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-[1.07]"
            />
          </div>
        )}
      </div>

      <div className="px-3 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-strong rtl:normal-case rtl:tracking-normal">{car.brand}</p>
        <h3 className="mt-1 truncate font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-strong">{car.title}</h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {specs.map(({ icon: Icon, text }, i) => (
            <li
              key={text}
              style={{ transitionDelay: `${i * 40}ms` }}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-[11.5px] font-medium text-foreground/75 transition-[background-color,color] duration-300 group-hover:bg-brand/10 group-hover:text-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-brand-strong" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-3 mt-auto flex items-end justify-between gap-3 border-t border-dashed border-border pb-2 pt-4">
        <div className="min-w-0 leading-none">
          {car.pricePerDay != null && (
            <p className="flex items-baseline gap-1 whitespace-nowrap">
              <Price bam={car.pricePerDay} className="font-display text-[1.6rem] font-semibold tracking-tight text-foreground" />
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
          className="group/b relative z-20 inline-flex h-11 shrink-0 items-center gap-2 overflow-hidden rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_rgba(8,121,184,0.95)] transition-[background-color,transform] duration-300 hover:bg-brand-700 active:scale-95"
        >
          <span aria-hidden className="pointer-events-none absolute inset-y-0 -start-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-[transform,opacity] duration-700 group-hover:translate-x-[460%] group-hover:opacity-100 rtl:group-hover:-translate-x-[460%]" />
          {t("book")}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/b:translate-x-1 rtl:-scale-x-100 rtl:group-hover/b:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
