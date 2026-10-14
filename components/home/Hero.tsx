"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/routing";
import { useCompany } from "@/components/company/CompanyProvider";
import { PillLink } from "@/components/ui/PillLink";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ fleetCount }: { fleetCount: number }) {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const company = useCompany();
  const count = company.rating.count ?? 0;
  const score = (company.rating.score ?? 5).toLocaleString(intlLocale(locale), {
    minimumFractionDigits: 1,
  });

  const stats = [
    { value: String(fleetCount), label: t("statFleet") },
    { value: String(count), label: t("statReviews") },
    { value: "24/7", label: t("statSupport") },
  ];

  return (
    <section className="px-3 pt-1 sm:px-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink">
        <Image
          src="/img/hero-sarajevo.webp"
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[70%_center]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="mx-auto flex min-h-[620px] max-w-6xl flex-col justify-between px-5 pb-28 pt-14 sm:px-6 lg:min-h-[700px] lg:pt-20">
          <div className="max-w-2xl text-white">
            <motion.a
              href={company.map.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-white/15"
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {t("chip", { score, count })}
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05, ease }}
              className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]"
            >
              {t("titleA")}
              <em className="block font-semibold italic text-brand-400">{t("titleB")}</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease }}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <PillLink href="/vozila">{t("ctaPrimary")}</PillLink>
              <PillLink
                href={company.phones[0]?.href ?? "/kontakt"}
                variant="light"
                icon={<Phone className="h-4 w-4" />}
              >
                {t("ctaSecondary")}
              </PillLink>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-14 flex flex-wrap gap-x-10 gap-y-6 text-white sm:gap-x-14"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-10 sm:gap-14">
                {i > 0 && <span aria-hidden className="hidden h-10 w-px bg-white/20 sm:block" />}
                <div>
                  <p className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-sm text-white/60">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
