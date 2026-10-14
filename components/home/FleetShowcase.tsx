"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Cog,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Price } from "@/components/currency/Price";
import { carCategories, type CarCategory } from "@/lib/car-categories";
import { Heading } from "./Heading";

export type ShowcaseItem = {
  slug: string;
  title: string;
  brand: string;
  image: string | null;
  price: number | null;
  passengers: number;
  luggage: number | null;
  carClass: string;
  categories: string[];
};

const FILTERS: (CarCategory | "ALL")[] = ["ALL", "COMPACT", "SUV", "LUXURY", "TRANSPORT", "MINIBUS"];

export function FleetShowcase({ cars }: { cars: ShowcaseItem[] }) {
  const t = useTranslations("Showcase");
  const tf = useTranslations("Fleet");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const track = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () =>
      filter === "ALL"
        ? cars
        : cars.filter((c) => carCategories(c).includes(filter as CarCategory)),
    [cars, filter],
  );

  const available = FILTERS.filter(
    (f) => f === "ALL" || cars.some((c) => carCategories(c).includes(f as CarCategory)),
  );

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 680), behavior: "smooth" });
  };

  return (
    <section className="pb-20 pt-6 sm:pb-28">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label={t("prev")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label={t("next")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-brand dark:bg-white dark:text-ink dark:hover:bg-brand dark:hover:text-white"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5">
          {available.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                track.current?.scrollTo({ left: 0, behavior: "smooth" });
              }}
              className={`relative isolate shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f
                  ? "border-transparent text-white dark:text-ink"
                  : "border-border text-foreground/70 hover:text-foreground"
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="fleet-filter"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 -z-10 rounded-full bg-ink dark:bg-white"
                />
              )}
              {f === "ALL" ? t("all") : tf(`categories.${f}`)}
            </button>
          ))}
        </div>

        <div
          ref={track}
          className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-6"
        >
          {list.map((car, i) => (
            <motion.div
              key={car.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04 }}
              className="w-[78%] shrink-0 snap-start sm:w-[320px]"
            >
              <Link
                href={`/vozila/${car.slug}`}
                className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-surface p-2.5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-[#F8FBFD] to-[#E3EEF7]">
                  {car.image && (
                    <Image
                      src={car.image}
                      alt={car.title}
                      fill
                      sizes="(max-width: 639px) 78vw, 320px"
                      className="object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink backdrop-blur">
                    {tf(`categories.${carCategories(car)[0] ?? "COMPACT"}`)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {car.brand}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-foreground">
                    {car.title}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
                    <li className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-brand" />
                      {car.passengers}
                    </li>
                    {car.luggage != null && (
                      <li className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-brand" />
                        {car.luggage}
                      </li>
                    )}
                    <li className="inline-flex items-center gap-1.5">
                      <Cog className="h-3.5 w-3.5 text-brand" />
                      {t("auto")}
                    </li>
                  </ul>
                  <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
                    {car.price != null ? (
                      <p className="text-sm text-muted-foreground">
                        {t("from")}{" "}
                        <Price
                          bam={car.price}
                          className="font-display text-2xl font-extrabold text-foreground"
                        />{" "}
                        {t("perDay")}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-colors group-hover:bg-brand dark:bg-white dark:text-ink dark:group-hover:bg-brand dark:group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/vozila"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand-strong"
          >
            {t("viewAll", { count: cars.length })}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
