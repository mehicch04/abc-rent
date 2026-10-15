"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
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

        {types.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{t("typesTitle")}</h3>
              <p className="text-sm text-muted-foreground">{t("typesLead")}</p>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {types.map((ty) => (
                <li key={ty.id}>
                  <Link
                    href={{ pathname: "/vozila", query: { tip: ty.id } }}
                    className="group flex h-full flex-col rounded-[20px] bg-surface p-2 ring-1 ring-border transition-[box-shadow] duration-300 hover:shadow-[0_20px_40px_-28px_rgba(11,18,32,0.35)] hover:ring-foreground/15"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-[#EDF1F5]">
                      {ty.image && (
                        <Image
                          src={ty.image}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 45vw, 260px"
                          className="object-contain px-4 pb-2 pt-4 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        />
                      )}
                    </span>
                    <span className="flex items-end justify-between gap-2 px-2 pb-1.5 pt-3">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">{tf(`categories.${ty.id}`)}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {ty.from != null && (
                            <>
                              {t("from")} <Price bam={ty.from} className="font-medium text-foreground" /> ·{" "}
                            </>
                          )}
                          {t("carsCount", { count: ty.count })}
                        </span>
                      </span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-muted text-foreground transition-colors group-hover:bg-brand group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/vozila"
                  className="group flex h-full min-h-[11rem] flex-col justify-between rounded-[20px] bg-ink p-5 text-white transition-colors hover:bg-ink-700 dark:bg-brand dark:hover:bg-brand-700"
                >
                  <span className="text-sm font-medium text-white/70">{t("allTile")}</span>
                  <span>
                    <span className="block font-display text-5xl font-semibold leading-none tracking-tight">{total}</span>
                    <span className="mt-3 flex items-center justify-between gap-2 text-sm text-white/80">
                      {tf("viewAll")}
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink">
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}
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
