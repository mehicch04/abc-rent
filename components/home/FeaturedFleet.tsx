"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { CarListItem } from "@/lib/types";
import type { ExtraItem } from "@/lib/extras";
import type { Booked } from "@/lib/extras-availability";
import { CarCard } from "@/components/fleet/CarCard";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

const InquiryModal = dynamic(
  () => import("@/components/reservation/InquiryModal").then((m) => m.InquiryModal),
  { ssr: false },
);

export function FeaturedFleet({
  cars,
  total,
  locations,
  extras,
  bookedExtras,
}: {
  cars: CarListItem[];
  total: number;
  locations: { id: string; name: string }[];
  extras: ExtraItem[];
  bookedExtras: Booked[];
}) {
  const t = useTranslations("HomeFleet");
  const [selected, setSelected] = useState<CarListItem | null>(null);
  const [modalReady, setModalReady] = useState(false);

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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onSelect={setSelected}
              imageSizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 360px"
            />
          ))}
        </div>
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
