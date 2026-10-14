"use client";

import { motion } from "framer-motion";
import { Clock3, ExternalLink, Mail, MapPin, Navigation, Phone, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/routing";
import { useCompany } from "@/components/company/CompanyProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;

export function Visit({ address }: { address: string }) {
  const t = useTranslations("Visit");
  const locale = useLocale();
  const company = useCompany();
  const score = company.rating.score ?? 5;
  const count = company.rating.count ?? 0;
  const lat = company.map.lat;
  const lng = company.map.lng;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=${locale}&output=embed`;
  const mapLink = company.map.link ?? `https://www.google.com/maps?q=${lat},${lng}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const wa = `https://wa.me/${company.whatsapp}`;

  return (
    <section className="container py-20 sm:py-28">
      <Heading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="relative min-h-[26rem] overflow-hidden rounded-[2rem] border border-border bg-surface-muted lg:min-h-full"
        >
          <iframe
            src={mapSrc}
            title={`${company.name}, ${address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full grayscale-[35%] dark:invert-[0.9] dark:hue-rotate-180"
          />
          <div className="absolute inset-x-3 bottom-3 flex flex-col gap-3 rounded-2xl border border-border bg-surface/95 p-4 shadow-card-hover backdrop-blur sm:inset-x-auto sm:left-4 sm:bottom-4 sm:max-w-sm sm:p-5">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-base font-bold text-foreground">{company.name}</p>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand dark:bg-white dark:text-ink"
              >
                <Navigation className="h-4 w-4" />
                {t("directions")}
              </a>
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("openMap")}
                className="inline-flex items-center justify-center rounded-full border border-border px-3.5 text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <motion.a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="group relative overflow-hidden rounded-[2rem] bg-ink p-7 text-white sm:p-8"
          >
            <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" />
            <p className="relative text-sm font-semibold uppercase tracking-[0.16em] text-brand-300">
              {t("ratingLabel")}
            </p>
            <div className="relative mt-4 flex items-end gap-4">
              <span className="font-display text-7xl font-extrabold leading-none tracking-tighter">
                {score.toLocaleString(intlLocale(locale), { minimumFractionDigits: 1 })}
              </span>
              <div className="pb-2">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                {count > 0 && (
                  <p className="mt-1 text-sm text-white/65">{t("reviews", { count })}</p>
                )}
              </div>
            </div>
            <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-brand-300">
              {t("readReviews")}
              <ExternalLink className="h-4 w-4" />
            </span>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.16, ease }}
            className="rounded-[2rem] border border-border bg-surface p-7 sm:p-8"
          >
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 shrink-0 text-brand" />
                <span>
                  <span className="block text-xs text-muted-foreground">{t("hours")}</span>
                  <span className="font-semibold text-foreground">{company.hours}</span>
                </span>
              </li>
              {company.phones.map((p) => (
                <li key={p.value}>
                  <a href={p.href} className="flex items-center gap-3 font-semibold text-foreground transition-colors hover:text-brand">
                    <Phone className="h-5 w-5 shrink-0 text-brand" />
                    {p.value}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className="flex items-center gap-3 font-semibold text-foreground transition-colors hover:text-brand">
                  <Mail className="h-5 w-5 shrink-0 text-brand" />
                  {company.email}
                </a>
              </li>
            </ul>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t("whatsapp")}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
