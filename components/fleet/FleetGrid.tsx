"use client";

import { useMemo, useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown, X } from "lucide-react";
import { CarCard } from "./CarCard";
import dynamic from "next/dynamic";

const InquiryModal = dynamic(
  () => import("@/components/reservation/InquiryModal").then((m) => m.InquiryModal),
  { ssr: false },
);
import {
  CAR_CATEGORIES,
  carCategories,
  type CarCategory,
} from "@/lib/car-categories";
import type { CarListItem, SearchContext } from "@/lib/types";
import type { ExtraItem } from "@/lib/extras";
import type { Booked } from "@/lib/extras-availability";

type Props = {
  cars: CarListItem[];
  search?: SearchContext;
  /** Pickup/return offices offered in the inquiry modal. */
  locations?: { id: string; name: string }[];
  /** Hide the type-filter bar (e.g. on the homepage featured section). */
  showFilters?: boolean;
  /** Eagerly load the first few car photos (use on the dedicated fleet page). */
  eagerFirstImages?: boolean;
  /** Override the image `sizes` (e.g. smaller on the homepage teaser grid). */
  imageSizes?: string;
  /** Optional equipment offered in the inquiry modal. */
  extras?: ExtraItem[];
  bookedExtras?: Booked[];
};

function Select({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative min-w-0 flex-1 sm:w-52 sm:flex-none">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none truncate rounded-full border border-border bg-surface pl-4 pr-10 text-sm text-foreground outline-none transition-colors hover:border-foreground/30 focus:border-brand"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export type SortKey =
  | "RECOMMENDED"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "YEAR_DESC"
  | "NAME_ASC"
  | "NAME_DESC";

export function FleetGrid({
  cars,
  search,
  locations,
  showFilters = true,
  eagerFirstImages = false,
  imageSizes,
  extras,
  bookedExtras,
}: Props) {
  const t = useTranslations("Fleet");
  const [selected, setSelected] = useState<CarListItem | null>(null);
  const [modalReady, setModalReady] = useState(false);
  useEffect(() => {
    if (selected) setModalReady(true);
  }, [selected]);
  const [active, setActive] = useState<CarCategory | "ALL">("ALL");
  const [brand, setBrand] = useState<string>("ALL");
  const [sort, setSort] = useState<SortKey>("RECOMMENDED");

  // Effective categories per car (explicit, else derived from carClass).
  const carCats = useMemo(
    () => new Map(cars.map((c) => [c.id, carCategories(c)])),
    [cars],
  );

  const counts = useMemo(() => {
    const m = new Map<CarCategory, number>();
    for (const c of cars) {
      if (brand !== "ALL" && c.brand !== brand) continue;
      for (const cat of carCats.get(c.id) ?? []) {
        m.set(cat, (m.get(cat) ?? 0) + 1);
      }
    }
    return m;
  }, [cars, carCats, brand]);

  // Only categories that still have cars under the current brand.
  const typeOptions = useMemo(
    () =>
      CAR_CATEGORIES.filter((cat) => (counts.get(cat) ?? 0) > 0).map((cat) => ({
        id: cat,
        label: t(`categories.${cat}`),
        count: counts.get(cat) ?? 0,
      })),
    [counts, t],
  );

  // Brands that still have cars in the chosen category, alphabetical.
  const brands = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of cars) {
      if (active !== "ALL" && !carCats.get(c.id)?.includes(active)) continue;
      const b = c.brand?.trim();
      if (b) m.set(b, (m.get(b) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], "bs"));
  }, [cars, carCats, active]);

  const totalForBrands = useMemo(
    () => brands.reduce((a, [, n]) => a + n, 0),
    [brands],
  );

  useEffect(() => {
    if (brand !== "ALL" && !brands.some(([b]) => b === brand)) {
      setBrand("ALL");
    }
  }, [brands, brand]);

  useEffect(() => {
    if (active !== "ALL" && (counts.get(active) ?? 0) === 0) {
      setActive("ALL");
    }
  }, [counts, active]);

  const allCount = useMemo(
    () => cars.filter((c) => brand === "ALL" || c.brand === brand).length,
    [cars, brand],
  );

  const filtersActive = active !== "ALL" || brand !== "ALL";
  const clearFilters = () => {
    setActive("ALL");
    setBrand("ALL");
  };

  const visibleCars = useMemo(() => {
    const filtered = cars.filter((c) => {
      const byType = active === "ALL" || carCats.get(c.id)?.includes(active);
      const byBrand = brand === "ALL" || c.brand === brand;
      return byType && byBrand;
    });

    switch (sort) {
      case "PRICE_ASC":
        // Cars without a price go last.
        return filtered.sort(
          (a, b) => (a.pricePerDay ?? Infinity) - (b.pricePerDay ?? Infinity),
        );
      case "PRICE_DESC":
        return filtered.sort(
          (a, b) => (b.pricePerDay ?? -Infinity) - (a.pricePerDay ?? -Infinity),
        );
      case "YEAR_DESC":
        return filtered.sort((a, b) => b.year - a.year);
      case "NAME_ASC":
        return filtered.sort((a, b) => a.title.localeCompare(b.title, "bs"));
      case "NAME_DESC":
        return filtered.sort((a, b) => b.title.localeCompare(a.title, "bs"));
      case "RECOMMENDED":
      default:
        return filtered; // owner's order from the admin (sortOrder)
    }
  }, [active, brand, sort, cars, carCats]);

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "RECOMMENDED", label: t("sort.recommended") },
    { value: "PRICE_ASC", label: t("sort.priceAsc") },
    { value: "PRICE_DESC", label: t("sort.priceDesc") },
    { value: "YEAR_DESC", label: t("sort.yearDesc") },
    { value: "NAME_ASC", label: t("sort.nameAsc") },
    { value: "NAME_DESC", label: t("sort.nameDesc") },
  ];

  return (
    <>
      {showFilters && (
        <div className="mb-10">
          <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ id: "ALL" as const, label: t("allTypes"), count: allCount }, ...typeOptions].map((o) => {
              const on = active === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setActive(on && o.id !== "ALL" ? "ALL" : o.id)}
                  aria-pressed={on}
                  className={`relative isolate inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${
                    on ? "text-white dark:text-ink" : "text-foreground/65 hover:text-foreground"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="fleet-type"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      className="absolute inset-0 -z-10 rounded-full bg-ink dark:bg-white"
                    />
                  )}
                  {o.label}
                  <sup className={`text-[10px] font-medium tabular-nums ${on ? "opacity-70" : "text-muted-foreground"}`}>
                    {o.count}
                  </sup>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-display text-lg font-semibold text-foreground">
                {t("resultsCount", { count: visibleCars.length })}
              </span>
            </p>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-8 w-fit items-center gap-1 rounded-full px-2 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                <X className="h-3.5 w-3.5" />
                {t("clearFilters")}
              </button>
            )}
            <div className="flex gap-2 sm:ml-auto">
              {brands.length > 1 && (
                <Select
                  id="fleet-brand"
                  label={t("brandLabel")}
                  value={brand}
                  onChange={setBrand}
                  options={[
                    { value: "ALL", label: t("allBrands") },
                    ...brands.map(([name, n]) => ({ value: name, label: `${name} (${n})` })),
                  ]}
                />
              )}
              <Select
                id="fleet-sort"
                label={t("sort.label")}
                value={sort}
                onChange={(v) => setSort(v as SortKey)}
                options={SORT_OPTIONS}
              />
            </div>
          </div>
        </div>
      )}

      {visibleCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCars.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              search={search}
              priority={eagerFirstImages && i < 3}
              imageSizes={imageSizes}
              onSelect={setSelected}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-surface-muted p-10 text-center text-muted-foreground">
          {t("noResults")}
        </p>
      )}

      {(selected || modalReady) && (
      <InquiryModal
        car={selected}
        search={search}
        locations={locations}
        extras={extras}
        bookedExtras={bookedExtras}
        onClose={() => setSelected(null)}
      />
      )}
    </>
  );
}
