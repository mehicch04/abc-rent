"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Cog,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { intlLocale } from "@/i18n/routing";
import { useCompany } from "@/components/company/CompanyProvider";
import { Price } from "@/components/currency/Price";

export type ShowcaseCar = {
  group: "city" | "suv" | "premium" | "van";
  slug: string;
  title: string;
  model: string;
  image: string;
  price: number | null;
  passengers: number;
  luggage: number | null;
};

const ease = [0.22, 1, 0.36, 1] as const;
const CYCLE_MS = 5200;

function RotatingWord({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), 2600);
    return () => window.clearInterval(id);
  }, [reduce, words.length]);

  return (
    <span className="relative block h-[1.1em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          className="absolute inset-x-0 top-0 block bg-gradient-to-r from-brand-300 via-brand-400 to-white bg-clip-text pb-1 text-transparent"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Showroom({ cars }: { cars: ShowcaseCar[] }) {
  const t = useTranslations("Hero");
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || cars.length < 2) return;
    const id = window.setTimeout(
      () => setActive((v) => (v + 1) % cars.length),
      CYCLE_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, paused, reduce, cars.length]);

  const pick = useCallback((i: number) => {
    setActive(i);
    setPaused(true);
  }, []);

  const car = cars[active];
  if (!car) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-[#F2F7FB] to-[#DCEAF5] p-4 text-ink shadow-[0_50px_120px_-30px_rgba(10,148,220,0.55)] ring-1 ring-white/30 sm:p-6">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t("available")}
          </span>
          {car.price != null && (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={car.slug}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.3 }}
                className="text-right"
              >
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
                  {t("fromLabel")}
                </span>
                <span className="font-display text-2xl font-extrabold leading-none sm:text-3xl">
                  <Price bam={car.price} />
                </span>
                <span className="ml-1 text-sm text-ink/55">{t("perDay")}</span>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="relative mt-2 aspect-[16/10]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`bg-${car.slug}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease }}
              aria-hidden
              className="text-outline pointer-events-none absolute inset-x-0 top-[12%] select-none whitespace-nowrap text-center font-display text-[18vw] font-extrabold uppercase leading-none tracking-tight text-ink/[0.09] sm:text-[8.5rem] lg:text-[7rem] xl:text-[8.5rem]"
            >
              {car.model}
            </motion.span>
          </AnimatePresence>

          <div
            aria-hidden
            className="absolute bottom-[9%] left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[100%] bg-ink/25 blur-2xl"
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={car.slug}
              initial={{ opacity: 0, x: 90, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -90, filter: "blur(10px)" }}
              transition={{ duration: 0.65, ease }}
              className="absolute inset-0 mix-blend-multiply"
            >
              <Image
                src={car.image}
                alt={car.title}
                fill
                priority={active === 0}
                sizes="(max-width: 1023px) 92vw, 46vw"
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
              {car.title}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5 text-xs font-medium text-ink/70">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1">
                <Users className="h-3.5 w-3.5 text-brand" />
                {t("seats", { n: car.passengers })}
              </li>
              {car.luggage != null && (
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1">
                  <Briefcase className="h-3.5 w-3.5 text-brand" />
                  {t("bags", { n: car.luggage })}
                </li>
              )}
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1">
                <Cog className="h-3.5 w-3.5 text-brand" />
                {t("auto")}
              </li>
            </ul>
          </div>
          <Link
            href={`/vozila/${car.slug}`}
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
          >
            {t("details")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div
          role="tablist"
          className="relative z-10 mt-5 grid grid-cols-4 gap-1 rounded-2xl bg-ink/[0.06] p-1"
        >
          {cars.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => pick(i)}
              className={`relative overflow-hidden rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                i === active ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"
              }`}
            >
              {t(`groups.${c.group}`)}
              {i === active && !paused && !reduce && (
                <span
                  key={`p-${active}`}
                  className="absolute inset-x-2 bottom-1 h-0.5 origin-left animate-progress rounded-full bg-brand"
                />
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export function Hero({ cars, fleetCount }: { cars: ShowcaseCar[]; fleetCount: number }) {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const company = useCompany();
  const words = t.raw("rotating") as string[];
  const score = (company.rating.score ?? 5).toLocaleString(intlLocale(locale), {
    minimumFractionDigits: 1,
  });
  const count = company.rating.count ?? 0;

  const stats = [
    { value: `${score}/5`, label: t("statRating", { count }) },
    { value: "0 €", label: t("statDelivery") },
    { value: "200 €", label: t("statDeposit") },
    { value: String(fleetCount), label: t("statFleet") },
  ];

  return (
    <section className="relative -mt-[68px] overflow-hidden rounded-b-[2.5rem] bg-ink pb-28 pt-[calc(68px+3rem)] text-white sm:rounded-b-[3.5rem] lg:-mt-[76px] lg:pb-32 lg:pt-[calc(76px+4rem)]">
      <Image
        src="/img/hero-sarajevo.webp"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-25"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/85 to-ink" />
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div aria-hidden className="absolute -right-40 top-10 h-[42rem] w-[42rem] rounded-full bg-brand-500/25 blur-[140px]" />
      <div aria-hidden className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-brand-700/30 blur-[120px]" />

      <div className="container relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.08fr] lg:gap-12">
          <div>
            <motion.a
              href={company.map.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-sm backdrop-blur transition-colors hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ink">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {score}
              </span>
              <span className="text-white/80">{t("ratingChip", { count })}</span>
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06, ease }}
              className="mt-7 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[3.5rem] xl:text-[4.1rem]"
            >
              <span className="block">{t("titleA")}</span>
              <span className="block text-white/90">{t("titleB")}</span>
              <RotatingWord words={words} />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14, ease }}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#rezervacija"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white shadow-[0_15px_40px_-10px_rgba(10,148,220,0.8)] transition-colors hover:bg-brand-500"
              >
                {t("ctaSearch")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/vozila"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                {t("ctaFleet")}
              </Link>
              <a
                href={company.phones[0]?.href}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-brand-300" />
                {company.phones[0]?.value}
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
          >
            <Showroom cars={cars} />
          </motion.div>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="mt-20 grid grid-cols-2 gap-y-8 border-t border-white/10 pt-10 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="lg:border-l lg:border-white/10 lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {s.value}
              </dd>
              <dd className="mt-1 text-sm text-white/55">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
