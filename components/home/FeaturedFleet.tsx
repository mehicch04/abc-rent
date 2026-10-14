"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Car, Cog, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { FUEL_LABELS, label } from "@/lib/car-labels";
import { carCategories } from "@/lib/car-categories";
import { Price } from "@/components/currency/Price";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

export type FleetCard = {
  slug: string;
  title: string;
  image: string | null;
  price: number | null;
  passengers: number;
  fuelType: string;
  carClass: string;
  categories: string[];
};

export function FeaturedFleet({ cars }: { cars: FleetCard[] }) {
  const t = useTranslations("HomeFleet");
  const tf = useTranslations("Fleet");
  const locale = useLocale() as AppLocale;

  return (
    <section className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} />
          <PillLink href="/vozila" variant="dark" className="self-start sm:self-auto">
            {t("viewAll")}
          </PillLink>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, i) => {
            const cats = carCategories(car);
            const fuel = label(FUEL_LABELS[car.fuelType as keyof typeof FUEL_LABELS], locale);
            return (
              <motion.article
                key={car.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className="group relative flex flex-col rounded-2xl bg-surface p-3"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#EEF2F6]">
                  {car.image && (
                    <Image
                      src={car.image}
                      alt={car.title}
                      fill
                      sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 360px"
                      className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      <Link
                        href={`/vozila/${car.slug}`}
                        className="before:absolute before:inset-0 before:content-['']"
                      >
                        {car.title}
                      </Link>
                    </h3>
                    {cats[0] && (
                      <span className="shrink-0 rounded-full border border-brand/30 px-2.5 py-0.5 text-[11px] font-medium text-brand-strong">
                        {tf(`categories.${cats[0]}`)}
                      </span>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t("seats", { n: car.passengers })}
                    </li>
                    <li className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      {[cats[1] ? tf(`categories.${cats[1]}`) : null, fuel].filter(Boolean).join(" · ")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Cog className="h-4 w-4" />
                      {t("auto")}
                    </li>
                  </ul>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    {car.price != null ? (
                      <p>
                        <Price bam={car.price} className="font-display text-2xl font-semibold text-foreground" />
                        <span className="text-sm text-muted-foreground"> / {t("perDay")}</span>
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="relative z-10 rounded-full bg-brand px-4 py-2 text-xs font-medium text-white transition-colors group-hover:bg-brand-700">
                      {t("book")}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
