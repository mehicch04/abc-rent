"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Plane, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { intlLocale } from "@/i18n/routing";
import { useCompany } from "@/components/company/CompanyProvider";
import { Price } from "@/components/currency/Price";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ fromBam }: { fromBam: number | null }) {
  const t = useTranslations("Hero");
  const company = useCompany();
  const locale = useLocale();
  const score = company.rating.score ?? 5;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-700/20"
      />

      <div className="container relative grid items-center gap-12 pb-12 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-strong"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            {t("eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-6xl xl:text-7xl"
          >
            {t("titleA")}
            <span className="mt-1 block bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-300 dark:to-brand-500">
              {t("titleB")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#rezervacija"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-brand-foreground shadow-brand transition-colors hover:bg-brand-700"
            >
              {t("ctaSearch")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/vozila"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-7 py-4 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand-strong"
            >
              {t("ctaFleet")}
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
          >
            <li>
              <a
                href={company.map.link ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                <span className="font-semibold text-foreground">
                  {score.toLocaleString(intlLocale(locale), { minimumFractionDigits: 1 })}
                </span>
                {t("reviews")}
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-foreground/80">
              <Clock3 className="h-4 w-4 text-brand" />
              {t("open247")}
            </li>
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ink shadow-glow ring-1 ring-black/5 sm:aspect-[16/11] lg:aspect-[5/6] xl:aspect-[1/1]">
            <Image
              src="/img/hero-sarajevo.webp"
              alt={t("imageAlt")}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 46vw"
              className="object-cover object-[35%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          </div>

          {fromBam != null && (
            <div className="absolute -top-4 right-4 animate-float rounded-2xl bg-brand px-5 py-3 text-brand-foreground shadow-brand sm:right-6">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                {t("fromLabel")}
              </span>
              <span className="font-display text-2xl font-extrabold">
                <Price bam={fromBam} />
              </span>
              <span className="ml-1 text-sm text-white/80">{t("perDay")}</span>
            </div>
          )}

          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-card-hover backdrop-blur sm:left-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Plane className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs text-muted-foreground">
                {t("deliveryTitle")}
              </span>
              <span className="font-display text-base font-bold text-foreground">
                {t("deliveryValue")}
              </span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
