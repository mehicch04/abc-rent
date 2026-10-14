"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Check, Infinity as InfinityIcon, LifeBuoy, ReceiptText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;

function Tile({
  className = "",
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease }}
      className={`group relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Bento() {
  const t = useTranslations("Bento");
  const chips = t.raw("insurance.chips") as string[];

  return (
    <section className="container py-20 sm:py-28">
      <Heading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:auto-rows-[minmax(14rem,auto)] lg:grid-cols-4">
        <Tile className="min-h-[22rem] bg-ink text-white md:col-span-2 lg:row-span-2">
          <Image
            src="/img/airport-transfer.webp"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
          <div className="relative flex h-full flex-col justify-between">
            <span className="w-fit rounded-full bg-brand px-3.5 py-1.5 font-display text-sm font-bold">
              {t("delivery.badge")}
            </span>
            <div>
              <h3 className="max-w-md font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                {t("delivery.title")}
              </h3>
              <p className="mt-3 max-w-md text-white/70">{t("delivery.body")}</p>
            </div>
          </div>
        </Tile>

        <Tile delay={0.05} className="bg-brand text-white">
          <span className="font-display text-6xl font-extrabold tracking-tighter">
            {t("deposit.value")}
          </span>
          <h3 className="mt-4 font-display text-lg font-bold">{t("deposit.title")}</h3>
          <p className="mt-1 text-sm text-white/75">{t("deposit.body")}</p>
        </Tile>

        <Tile delay={0.1} className="border border-border bg-surface">
          <InfinityIcon className="h-16 w-16 text-brand" strokeWidth={1.6} />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">{t("mileage.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("mileage.body")}</p>
        </Tile>

        <Tile delay={0.15} className="bg-[#111A2C] text-white">
          <div className="flex items-center gap-3">
            <span className="font-display text-6xl font-extrabold tracking-tighter">
              {t("support.value")}
            </span>
            <span className="relative mt-2 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold">{t("support.title")}</h3>
          <p className="mt-1 text-sm text-white/65">{t("support.body")}</p>
        </Tile>

        <Tile delay={0.2} className="border border-border bg-surface">
          <BadgeCheck className="h-10 w-10 text-brand" />
          <h3 className="mt-6 font-display text-lg font-bold text-foreground">{t("quality.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("quality.body")}</p>
        </Tile>

        <Tile delay={0.05} className="border border-border bg-surface-muted md:col-span-2">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">{t("insurance.title")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("insurance.body")}</p>
            </div>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
              >
                <Check className="h-3.5 w-3.5 text-brand" />
                {c}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile delay={0.1} className="border border-border bg-surface">
          <ReceiptText className="h-10 w-10 text-brand" />
          <h3 className="mt-6 font-display text-lg font-bold text-foreground">{t("prices.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("prices.body")}</p>
        </Tile>

        <Tile delay={0.15} className="border border-border bg-surface">
          <LifeBuoy className="h-10 w-10 text-brand" />
          <h3 className="mt-6 font-display text-lg font-bold text-foreground">{t("roadside.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("roadside.body")}</p>
        </Tile>
      </div>
    </section>
  );
}
