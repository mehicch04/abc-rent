"use client";

import { m as motion } from "framer-motion";
import { Cog, Infinity as InfinityIcon, Plane, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CarListItem } from "@/lib/types";
import type { CarCategory } from "@/lib/car-categories";
import { FleetCard } from "@/components/fleet/FleetCard";
import { PillLink } from "@/components/ui/PillLink";
import { Band } from "@/components/ui/Band";
import { Heading } from "./Heading";

export type FleetType = { id: CarCategory; count: number; from: number | null; image: string | null };

const PERKS = [ShieldCheck, InfinityIcon, Plane, Cog];
const EASE = [0.22, 1, 0.36, 1] as const;

export function FeaturedFleet({ cars, total }: { cars: CarListItem[]; total: number; types?: FleetType[] }) {
  const t = useTranslations("HomeFleet");
  const perks = t.raw("included") as { title: string; body: string }[];
  const picked = cars.filter((c) => c.isFeatured);
  const shown = (picked.length ? picked : cars).slice(0, 6);

  return (
    <Band className="py-3">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} subtitle={t("lead")} className="max-w-xl" />
          <PillLink href="/vozila" variant="dark" className="self-start lg:self-auto">
            {t("viewAllCount", { count: total })}
          </PillLink>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((car, i) => (
            <motion.li
              key={car.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
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
