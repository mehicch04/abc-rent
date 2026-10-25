"use client";

import { m as motion } from "framer-motion";
import { ArrowUpRight, Ban, Banknote, Fuel, Gauge, Globe, IdCard, ShieldCheck, UserPlus, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BAM_PER_EUR, formatPrice } from "@/lib/currency";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { RENTAL_POLICY as P } from "@/lib/rental-policy";

export function RentalRules({ deposit }: { deposit: number | null }) {
  const t = useTranslations("Rules");
  const { currency } = useCurrency();
  const eur = (v: number) => `⁦${formatPrice(v * BAM_PER_EUR, currency)}⁩`;
  const bam = (v: number) => `⁦${formatPrice(v, currency)}⁩`;

  const items = [
    {
      icon: IdCard,
      title: t("driverT"),
      body: [t("driverB"), P.minAge ? t("ageLine", { age: P.minAge }) : null, P.licenceYears ? t("yearsLine", { years: P.licenceYears }) : null],
    },
    {
      icon: ShieldCheck,
      title: t("insuranceT"),
      body: [t("insuranceB", { price: eur(P.fullInsuranceEur) }), P.excessEur ? t("excessLine", { amount: eur(P.excessEur) }) : null],
    },
    ...(deposit != null ? [{ icon: Wallet, title: t("depositT"), body: [t("depositB", { amount: bam(deposit) })] }] : []),
    { icon: Banknote, title: t("payT"), body: [t("payB")] },
    { icon: Fuel, title: t("fuelT"), body: [t("fuelB")] },
    { icon: Gauge, title: t("kmT"), body: [t("kmB")] },
    { icon: Ban, title: t("cancelT"), body: [t("cancelB")] },
    { icon: Globe, title: t("borderT"), body: [t("borderB")] },
    { icon: UserPlus, title: t("extraDriverT"), body: [t("extraDriverB", { price: eur(P.additionalDriverEur) })] },
  ];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">{t("title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("lead")}</p>
        </div>
        <Link href="/uvjeti-najma" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong">
          {t("all")}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
        </Link>
      </div>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ icon: Icon, title, body }, i) => (
          <motion.li
            key={title}
            data-spot
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.05 }}
            className="group flex gap-3.5 rounded-2xl bg-surface-muted p-4 ring-1 ring-transparent transition-[background-color,box-shadow] duration-300 hover:bg-surface hover:ring-border"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand-strong transition-[transform,background-color,color] duration-300 group-hover:-rotate-6 group-hover:bg-brand group-hover:text-white">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">{title}</span>
              {body.filter(Boolean).map((line) => (
                <span key={line} className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">
                  {line}
                </span>
              ))}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
