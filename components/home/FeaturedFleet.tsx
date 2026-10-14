"use client";

import { useTranslations } from "next-intl";
import type { CarListItem } from "@/lib/types";
import type { ExtraItem } from "@/lib/extras";
import type { Booked } from "@/lib/extras-availability";
import { FleetGrid } from "@/components/fleet/FleetGrid";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

export function FeaturedFleet({
  cars,
  locations,
  extras,
  bookedExtras,
}: {
  cars: CarListItem[];
  locations: { id: string; name: string }[];
  extras: ExtraItem[];
  bookedExtras: Booked[];
}) {
  const t = useTranslations("HomeFleet");

  return (
    <section className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} />
          <PillLink href="/vozila" variant="dark" className="self-start sm:self-auto">
            {t("viewAll")}
          </PillLink>
        </div>
        <FleetGrid
          cars={cars}
          showFilters={false}
          locations={locations}
          extras={extras}
          bookedExtras={bookedExtras}
          imageSizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 360px"
        />
      </div>
    </section>
  );
}
