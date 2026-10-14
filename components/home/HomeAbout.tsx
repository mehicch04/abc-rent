"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompany } from "@/components/company/CompanyProvider";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeAbout() {
  const t = useTranslations("HomeAbout");
  const company = useCompany();
  const points = t.raw("points") as { title: string; body: string }[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <Heading
            eyebrow={t("eyebrow")}
            title={t("title")}
            accent={t("accent")}
            accentTone="muted"
            className="max-w-3xl"
          />
          <PillLink href="/vozila" className="mt-8">
            {t("cta")}
          </PillLink>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="relative aspect-[16/10] overflow-hidden rounded-2xl"
        >
          <Image
            src="/img/chauffeur.webp"
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 1023px) 100vw, 40vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="relative min-h-[340px] overflow-hidden rounded-2xl bg-ink"
        >
          <Image
            src="/img/airport-transfer.webp"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 1023px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <a
            href={company.phones[0]?.href}
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink"
          >
            <Phone className="h-4 w-4 text-brand" />
            {company.phones[0]?.value}
          </a>
          <p className="absolute bottom-6 left-6 right-6 max-w-sm font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
            {t("callout")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className="flex flex-col justify-center py-4"
        >
          <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
            {t("title2")} <em className="font-semibold italic text-brand-strong">{t("accent2")}</em>
          </h3>
          <p className="mt-4 text-muted-foreground">{t("body2")}</p>
          <ul className="mt-6 space-y-5">
            {points.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-medium text-foreground">{p.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <PillLink href="#rezervacija" className="mt-8 w-fit">
            {t("cta2")}
          </PillLink>
        </motion.div>
      </div>
    </section>
  );
}
