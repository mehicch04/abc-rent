"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompany } from "@/components/company/CompanyProvider";

const ease = [0.22, 1, 0.36, 1] as const;

type Service = {
  tag: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  waText: string;
  imageAlt: string;
};

const KEYS = [
  { key: "chauffeur", image: "/img/chauffeur.webp" },
  { key: "transfer", image: "/img/airport-transfer.webp" },
] as const;

export function Services() {
  const t = useTranslations("Services");
  const company = useCompany();

  return (
    <section
      id="usluge"
      className="relative scroll-mt-24 overflow-hidden bg-ink-gradient py-20 text-white sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
          className="max-w-2xl"
        >
          <p className="mb-3 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
            <span className="h-px w-7 bg-brand-400" />
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {KEYS.map(({ key, image }, i) => {
            const s = t.raw(key) as Service;
            const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(s.waText)}`;
            return (
              <motion.article
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={image}
                    alt={s.imageAlt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-foreground">
                    {s.tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                    {s.body}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-sm text-white/85">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-100"
                  >
                    {s.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
