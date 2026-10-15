"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ArrowUpRight, Cog, Infinity as InfinityIcon, Plane, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CarListItem } from "@/lib/types";
import type { ExtraItem } from "@/lib/extras";
import type { Booked } from "@/lib/extras-availability";
import type { CarCategory } from "@/lib/car-categories";
import { CarCard } from "@/components/fleet/CarCard";
import { Price } from "@/components/currency/Price";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

const InquiryModal = dynamic(
  () => import("@/components/reservation/InquiryModal").then((m) => m.InquiryModal),
  { ssr: false },
);

export type FleetType = { id: CarCategory; count: number; from: number | null; image: string | null };

const PERKS = [ShieldCheck, InfinityIcon, Plane, Cog];

export function FeaturedFleet({
  cars,
  total,
  types,
  locations,
  extras,
  bookedExtras,
}: {
  cars: CarListItem[];
  total: number;
  types: FleetType[];
  locations: { id: string; name: string }[];
  extras: ExtraItem[];
  bookedExtras: Booked[];
}) {
  const t = useTranslations("HomeFleet");
  const tf = useTranslations("Fleet");
  const [selected, setSelected] = useState<CarListItem | null>(null);
  const [modalReady, setModalReady] = useState(false);
  const perks = t.raw("included") as { title: string; body: string }[];
  const [lead, ...rest] = cars;
  const prices = types.map((x) => x.from).filter((x): x is number => x != null);
  const minPrice = prices.length ? Math.min(...prices) : null;

  useEffect(() => {
    if (selected) setModalReady(true);
  }, [selected]);

  return (
    <section className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} subtitle={t("lead")} className="max-w-xl" />
          <PillLink href="/vozila" variant="dark" className="self-start lg:self-auto">
            {t("viewAllCount", { count: total })}
          </PillLink>
        </div>

        {lead && (
          <div className={`mt-12 grid gap-5 ${rest.length ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}>
            <CarCard
              car={lead}
              variant="feature"
              badge={tf("popular")}
              onSelect={setSelected}
              imageSizes="(max-width: 1023px) 92vw, 600px"
            />
            {rest.length > 0 && (
              <div className="grid gap-5">
                {rest.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    variant="row"
                    onSelect={setSelected}
                    imageSizes="(max-width: 639px) 92vw, 240px"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <ul className="mt-5 grid overflow-hidden rounded-[24px] bg-surface ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => {
            const Icon = PERKS[i] ?? ShieldCheck;
            return (
              <li
                key={p.title}
                className="flex gap-4 border-border p-5 sm:p-6 [&:not(:first-child)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand-strong">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <Link
          href="/vozila"
          className="group relative mt-5 block overflow-hidden rounded-[28px] bg-ink p-7 text-white ring-1 ring-white/10 sm:p-10 lg:p-12"
        >
          <span
            aria-hidden
            className="text-outline pointer-events-none absolute -bottom-16 -right-6 select-none font-display text-[16rem] font-semibold leading-none tracking-tighter text-white/[0.07] sm:text-[20rem]"
          >
            {total}
          </span>
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {t("ctaEyebrow")}
              </span>
              <h3 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.6rem]">
                {t("ctaTitle", { count: Math.max(total - cars.length, 0) })}{" "}
                <em className="font-semibold italic text-brand-300">{t("ctaAccent")}</em>
              </h3>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/65">{t("ctaBody")}</p>
              <ul className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-white/80">
                <li className="rounded-full bg-white/[0.08] px-3 py-1.5 ring-1 ring-white/10">{t("ctaCars", { count: total })}</li>
                <li className="rounded-full bg-white/[0.08] px-3 py-1.5 ring-1 ring-white/10">{t("ctaTypes", { count: types.length })}</li>
                {minPrice != null && (
                  <li className="rounded-full bg-white/[0.08] px-3 py-1.5 ring-1 ring-white/10">
                    {t("from")} <Price bam={minPrice} /> {tf("perDayShort")}
                  </li>
                )}
              </ul>
            </div>

            <div className="flex lg:justify-end">
              <span className="inline-flex items-center gap-4 rounded-full bg-white py-2 pl-7 pr-2 text-base font-medium text-ink transition-transform duration-300 group-hover:-translate-y-0.5 sm:py-2.5 sm:pl-8 sm:text-lg">
                {t("ctaButton")}
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white">
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </div>

      {(selected || modalReady) && (
        <InquiryModal
          car={selected}
          search={{}}
          locations={locations}
          extras={extras}
          bookedExtras={bookedExtras}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
