"use client";

import { useTranslations } from "next-intl";
import type { CarListItem } from "@/lib/types";
import { FleetCard } from "@/components/fleet/FleetCard";
import { PillLink } from "@/components/ui/PillLink";
import { CardRail } from "@/components/ui/CardRail";

export function SimilarCars({
  cars,
  title,
  lead,
  bleed = "-mx-4 px-4",
}: {
  bleed?: string;
  cars: CarListItem[];
  locale?: string;
  title: string;
  lead?: string;
}) {
  const t = useTranslations("Fleet");
  if (cars.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground/70 ring-1 ring-border">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {t("similarEyebrow")}
          </span>
          <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[2.1rem]">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{lead ?? t("similarLead")}</p>
        </div>
        <PillLink href="/vozila" variant="dark" className="self-start sm:self-auto">
          {t("viewAll")}
        </PillLink>
      </div>

      <CardRail
        className="mt-8"
        bleed={bleed}
        items={cars.slice(0, 3).map((car) => ({ key: car.id, node: <FleetCard car={car} sizes="(max-width: 639px) 84vw, (max-width: 1023px) 46vw, 400px" /> }))}
      />
    </section>
  );
}
