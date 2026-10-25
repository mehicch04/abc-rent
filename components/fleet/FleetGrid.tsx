"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Bus,
  Car,
  CarFront,
  CarTaxiFront,
  ChevronDown,
  Gauge,
  Gem,
  Package,
  SlidersHorizontal,
  Sun,
  Users,
  X,
} from "lucide-react";
import { FleetCard } from "./FleetCard";
import { EMPTY, FilterBar, FilterPanel, type Facet, type Group, type Option, type Selection } from "./FleetFilters";
import { CAR_CATEGORIES, carCategories, type CarCategory } from "@/lib/car-categories";
import { FUEL_LABELS, TRANSMISSION_LABELS, label } from "@/lib/car-labels";
import { currencySymbol, displayAmount } from "@/lib/currency";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { rentalDays } from "@/lib/extras";
import type { AppLocale } from "@/i18n/routing";
import type { CarListItem, SearchContext } from "@/lib/types";

type Props = {
  cars: CarListItem[];
  search?: SearchContext;
  eagerFirstImages?: boolean;
  imageSizes?: string;
  initialType?: CarCategory;
};

export type SortKey = "RECOMMENDED" | "PRICE_ASC" | "PRICE_DESC" | "YEAR_DESC" | "NAME_ASC" | "NAME_DESC";

const ICONS: Record<CarCategory, Option["icon"]> = {
  LIMUZINA: Car,
  LUXURY: Gem,
  SUV: CarFront,
  COUPE: Gauge,
  COMPACT: CarTaxiFront,
  KARAVAN: Package,
  CABRIO: Sun,
  TRANSPORT: Users,
  MINIBUS: Bus,
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function FleetGrid({ cars, search, eagerFirstImages = false, imageSizes, initialType }: Props) {
  const t = useTranslations("Fleet");
  const locale = useLocale() as AppLocale;
  const { currency } = useCurrency();
  const [sel, setSel] = useState<Selection>(() => ({ ...EMPTY, cat: initialType ? [initialType] : [] }));
  const [sort, setSort] = useState<SortKey>("RECOMMENDED");
  const [drawer, setDrawer] = useState(false);
  const results = useRef<HTMLDivElement>(null);
  const changed = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    changed.current = true;
  }, [sel]);

  useEffect(() => {
    if (drawer || !changed.current) return;
    changed.current = false;
    const el = results.current;
    if (!el) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        if (window.scrollY > top + 8) window.scrollTo({ top, behavior: "smooth" });
      }),
    );
  }, [sel, drawer]);

  const steps = currency === "EUR" ? [50, 100, 150] : [100, 200, 300];
  const money = (v: number) => `⁦${v} ${currencySymbol(currency)}⁩`;

  const values = useMemo(() => {
    const bucket = (p: number | null) => {
      if (p == null) return [];
      const v = displayAmount(p, currency);
      const i = steps.findIndex((s) => v <= s);
      return [String(i === -1 ? steps.length : i)];
    };
    return new Map(
      cars.map((c) => [
        c.id,
        {
          price: bucket(c.pricePerDay),
          cat: carCategories(c) as string[],
          gear: [c.transmission as string],
          fuel: [c.fuelType as string],
          seats: [String(c.passengers)],
          brand: c.brand ? [c.brand.trim()] : [],
        } satisfies Record<Facet, string[]>,
      ]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars, currency]);

  const matches = (c: CarListItem, except?: Facet) => {
    const v = values.get(c.id)!;
    return (Object.keys(sel) as Facet[]).every((f) => f === except || sel[f].length === 0 || v[f].some((x) => sel[f].includes(x)));
  };

  const count = (f: Facet, value: string) => cars.filter((c) => matches(c, f) && values.get(c.id)![f].includes(value)).length;
  const present = (f: Facet) => {
    const s = new Set<string>();
    for (const c of cars) values.get(c.id)![f].forEach((x) => s.add(x));
    return s;
  };

  const groups: Group[] = useMemo(() => {
    const p = present("price");
    const priceLabels = [
      t("priceUpTo", { b: money(steps[0]) }),
      t("priceBetween", { a: money(steps[0]), b: money(steps[1]) }),
      t("priceBetween", { a: money(steps[1]), b: money(steps[2]) }),
      t("priceOver", { a: money(steps[2]) }),
    ];
    const cats = present("cat");
    const gears = present("gear");
    const fuels = present("fuel");
    const seats = [...present("seats")].sort((a, b) => Number(a) - Number(b));
    const brands = [...present("brand")].sort((a, b) => a.localeCompare(b, "bs"));
    return [
      {
        id: "cat",
        kind: "list",
        title: t("fCategory"),
        options: CAR_CATEGORIES.filter((c) => cats.has(c)).map((c) => ({ value: c, label: t(`categories.${c}`), count: count("cat", c), icon: ICONS[c] })),
      },
      {
        id: "price",
        kind: "check",
        title: t("fPrice"),
        options: priceLabels.map((l, i) => ({ value: String(i), label: l, count: count("price", String(i)) })).filter((o) => p.has(o.value)),
      },
      {
        id: "gear",
        kind: "check",
        title: t("fGearbox"),
        options: (["AUTOMATIC", "MANUAL"] as const).filter((g) => gears.has(g)).map((g) => ({ value: g, label: label(TRANSMISSION_LABELS[g], locale), count: count("gear", g) })),
      },
      {
        id: "fuel",
        kind: "check",
        title: t("fFuel"),
        options: (Object.keys(FUEL_LABELS) as (keyof typeof FUEL_LABELS)[])
          .filter((f) => fuels.has(f))
          .map((f) => ({ value: f, label: label(FUEL_LABELS[f], locale), count: count("fuel", f) })),
      },
      {
        id: "seats",
        kind: "check",
        title: t("fSeats"),
        options: seats.map((n) => ({ value: n, label: t("seatsN", { n }), count: count("seats", n) })),
      },
      {
        id: "brand",
        kind: "check",
        title: t("fBrand"),
        options: brands.map((b) => ({ value: b, label: b, count: count("brand", b) })),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars, values, sel, currency, locale, t]);

  const toggle = (f: Facet, v: string) =>
    setSel((s) => ({ ...s, [f]: s[f].includes(v) ? s[f].filter((x) => x !== v) : [...s[f], v] }));
  const clear = () => setSel(EMPTY);
  const reset = (f: Facet) => setSel((s) => ({ ...s, [f]: [] }));

  const visible = useMemo(() => {
    const list = cars.filter((c) => matches(c));
    const by = {
      PRICE_ASC: (a: CarListItem, b: CarListItem) => (a.pricePerDay ?? Infinity) - (b.pricePerDay ?? Infinity),
      PRICE_DESC: (a: CarListItem, b: CarListItem) => (b.pricePerDay ?? -Infinity) - (a.pricePerDay ?? -Infinity),
      YEAR_DESC: (a: CarListItem, b: CarListItem) => b.year - a.year,
      NAME_ASC: (a: CarListItem, b: CarListItem) => a.title.localeCompare(b.title, "bs"),
      NAME_DESC: (a: CarListItem, b: CarListItem) => b.title.localeCompare(a.title, "bs"),
    } as const;
    return sort === "RECOMMENDED" ? list : [...list].sort(by[sort]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars, values, sel, sort]);

  const chips = groups.flatMap((g) =>
    sel[g.id].map((v) => ({ f: g.id, v, label: g.options.find((o) => o.value === v)?.label ?? v })),
  );
  const activeCount = chips.length;

  const days = search?.pickupAt && search?.returnAt ? rentalDays(new Date(search.pickupAt), new Date(search.returnAt)) : undefined;

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", esc);
    };
  }, [drawer]);

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "RECOMMENDED", label: t("sort.recommended") },
    { value: "PRICE_ASC", label: t("sort.priceAsc") },
    { value: "PRICE_DESC", label: t("sort.priceDesc") },
    { value: "YEAR_DESC", label: t("sort.yearDesc") },
    { value: "NAME_ASC", label: t("sort.nameAsc") },
    { value: "NAME_DESC", label: t("sort.nameDesc") },
  ];

  const sortSelect = (id: string, bar?: boolean) => (
    <div className={`relative ${bar ? "min-w-0 flex-1 lg:w-52 lg:flex-none" : ""}`}>
      <select
        id={id}
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        aria-label={t("sortBy")}
        className={`h-10 appearance-none rounded-full pe-9 ps-4 text-xs font-semibold uppercase tracking-[0.04em] text-foreground outline-none transition-colors rtl:normal-case ${
          bar
            ? "w-full bg-surface-muted hover:bg-border/60 focus-visible:ring-2 focus-visible:ring-brand"
            : "w-56 border border-border bg-surface hover:border-foreground/30 focus:border-brand"
        }`}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );

  return (
    <div className="relative">
      <aside className="absolute inset-y-0 end-full me-6 hidden w-[256px] min-[1680px]:block">
        <div className="no-scrollbar motion-safe:animate-rise sticky top-[88px] max-h-[calc(100vh-104px)] overflow-y-auto rounded-[26px] bg-surface/90 px-5 pb-3 pt-5 shadow-[0_30px_60px_-40px_rgba(11,18,32,0.5)] ring-1 ring-border backdrop-blur-xl">
          <FilterPanel groups={groups} selection={sel} onToggle={toggle} onClear={clear} />
        </div>
      </aside>

      <div ref={results} className="min-h-[85vh] min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <h2 className="flex items-baseline gap-2.5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            {t("chooseTitle")}
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground rtl:normal-case rtl:tracking-normal">
              {t("availableN", { count: visible.length })}
            </span>
          </h2>
          <div className="hidden items-center gap-2 min-[1680px]:flex">
            <label htmlFor="fleet-sort" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground rtl:normal-case">
              {t("sortBy")}
            </label>
            {sortSelect("fleet-sort")}
          </div>
        </div>

        <div className="sticky top-[80px] z-30 mt-5 before:pointer-events-none before:absolute before:-inset-x-3 before:-top-3 before:bottom-1/2 before:-z-10 before:bg-background before:content-[''] min-[1680px]:hidden">
          <div className="hidden lg:block">
            <FilterBar groups={groups} selection={sel} onToggle={toggle} onReset={reset} total={visible.length} end={sortSelect("fleet-sort-bar", true)} />
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface/85 p-1.5 shadow-[0_18px_44px_-30px_rgba(11,18,32,0.55)] ring-1 ring-border backdrop-blur-xl backdrop-saturate-150 lg:hidden">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 text-xs font-semibold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 rtl:normal-case"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("filters")}
              {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[10px] text-white">{activeCount}</span>}
            </button>
            {sortSelect("fleet-sort-m", true)}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-wrap gap-1.5 overflow-hidden pt-4"
            >
              {chips.map((c) => (
                <li key={`${c.f}:${c.v}`}>
                  <button
                    type="button"
                    onClick={() => toggle(c.f, c.v)}
                    aria-label={t("removeFilter", { name: c.label })}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-brand/10 pe-2 ps-3 text-xs font-semibold text-brand-strong transition-colors hover:bg-brand/15"
                  >
                    {c.label}
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clear} className="inline-flex h-8 items-center px-2 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  {t("clearAll")}
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>

        {visible.length > 0 ? (
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((car, i) => (
              <motion.li
                key={car.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: Math.min(i, 8) * 0.035 }}
              >
                <FleetCard car={car} search={search} days={days} priority={eagerFirstImages && i < 3} sizes={imageSizes} />
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-[22px] bg-surface-muted p-10 text-center">
            <p className="text-muted-foreground">{t("noMatch")}</p>
            <button type="button" onClick={clear} className="mt-4 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background">
              {t("clearAll")}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="fleet-filters-title">
            <motion.button
              type="button"
              aria-label={t("closeFilters")}
              onClick={() => setDrawer(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.38, ease: EASE }}
              className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-surface shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)]"
            >
              <div className="flex justify-center pt-3">
                <span className="h-1.5 w-10 rounded-full bg-foreground/15" />
              </div>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label={t("closeFilters")}
                className="absolute end-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-surface-muted text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="overflow-y-auto px-5 pb-4 pt-3">
                <FilterPanel groups={groups} selection={sel} onToggle={toggle} onClear={clear} headingId="fleet-filters-title" closeSpace />
              </div>
              <div className="border-t border-border px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  {t("showN", { count: visible.length })}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
