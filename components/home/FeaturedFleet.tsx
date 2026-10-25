"use client";

import { useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import { Cog, Infinity as InfinityIcon, Plane, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CarListItem } from "@/lib/types";
import { carCategories, type CarCategory } from "@/lib/car-categories";
import { FleetCard } from "@/components/fleet/FleetCard";
import { PillLink } from "@/components/ui/PillLink";
import { Band } from "@/components/ui/Band";
import { Heading } from "./Heading";

export type FleetType = { id: CarCategory; count: number; from: number | null; image: string | null };

const PERKS = [ShieldCheck, InfinityIcon, Plane, Cog];
const EASE = [0.22, 1, 0.36, 1] as const;

export function FeaturedFleet({ cars, total, types }: { cars: CarListItem[]; total: number; types: FleetType[] }) {
  const t = useTranslations("HomeFleet");
  const tf = useTranslations("Fleet");
  const perks = t.raw("included") as { title: string; body: string }[];
  const [tab, setTab] = useState<"TOP" | CarCategory>("TOP");

  const tabs = [{ id: "TOP" as const, label: t("tabTop") }, ...types.slice(0, 4).map((x) => ({ id: x.id, label: tf(`categories.${x.id}`) }))];

  const shown = useMemo(() => {
    const list =
      tab === "TOP"
        ? [...cars].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
        : cars.filter((c) => carCategories(c).includes(tab));
    return list.slice(0, 6);
  }, [cars, tab]);

  return (
    <Band className="py-3">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} subtitle={t("lead")} className="max-w-xl" />
          <PillLink href="/vozila" variant="dark" className="self-start lg:self-auto">
            {t("viewAllCount", { count: total })}
          </PillLink>
        </div>

        <div role="tablist" aria-label={t("eyebrow")} className="no-scrollbar mt-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.05] p-1.5 ring-1 ring-white/10">
          {tabs.map((x) => {
            const on = tab === x.id;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(x.id)}
                className={`h-10 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors duration-300 ${
                  on ? "bg-white text-ink shadow-[0_8px_20px_-10px_rgba(255,255,255,0.5)]" : "text-white/65 hover:text-white"
                }`}
              >
                {x.label}
              </button>
            );
          })}
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((car, i) => (
            <motion.li
              key={`${tab}-${car.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
            >
              <FleetCard car={car} sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 360px" />
            </motion.li>
          ))}
        </ul>

        <ul className="mt-6 grid overflow-hidden rounded-[24px] bg-white/[0.03] ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => {
            const Icon = PERKS[i] ?? ShieldCheck;
            return (
              <li
                key={p.title}
                className="flex gap-4 border-white/10 p-5 sm:p-6 [&:not(:first-child)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-s lg:[&:not(:first-child)]:border-s lg:[&:not(:first-child)]:border-t-0"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/15 text-brand-strong">
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
      </div>
    </Band>
  );
}
