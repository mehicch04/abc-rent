"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompany } from "@/components/company/CompanyProvider";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

type Item = { name: string; note: string; km: number; time: string; season: string };

const ROW =
  "lg:grid-cols-[2.5rem_minmax(0,0.8fr)_minmax(0,1.5fr)_7.5rem_6.5rem_9rem_2.75rem] lg:items-center lg:gap-6";

export function Destinations() {
  const t = useTranslations("Destinations");
  const company = useCompany();
  const items = t.raw("items") as Item[];
  const max = Math.max(...items.map((i) => i.km));
  const wa = (text: string) => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;

  return (
    <section className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:pb-1">{t("lead")}</p>
        </div>

        <div className="mt-12">
          <div
            className={`hidden border-b border-border px-4 pb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid ${ROW}`}
          >
            <span>#</span>
            <span>{t("colPlace")}</span>
            <span />
            <span>{t("colKm")}</span>
            <span>{t("colTime")}</span>
            <span>{t("colSeason")}</span>
            <span />
          </div>

          <ol>
            {items.map((d, i) => (
              <motion.li
                key={d.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-border"
              >
                <a
                  href={wa(`${t("waPrefix")} ${d.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group grid grid-cols-[2rem_minmax(0,1fr)_2.75rem] gap-x-3 gap-y-1.5 rounded-2xl px-4 py-5 transition-colors hover:bg-surface sm:py-6 ${ROW}`}
                >
                  <span className="pt-1.5 text-xs font-medium tabular-nums text-muted-foreground lg:pt-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {d.name}
                  </span>
                  <span className="row-span-3 grid h-11 w-11 place-items-center self-center justify-self-end rounded-full border border-border text-foreground transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white lg:order-last lg:row-span-1">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                  <p className="col-start-2 text-sm leading-relaxed text-muted-foreground lg:col-start-auto">{d.note}</p>
                  <div className="col-start-2 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm lg:contents">
                    <span className="font-medium tabular-nums text-foreground lg:block">
                      {d.km} km
                      <span className="mt-2 hidden h-1 w-full overflow-hidden rounded-full bg-border lg:block">
                        <span className="block h-full rounded-full bg-brand" style={{ width: `${(d.km / max) * 100}%` }} />
                      </span>
                    </span>
                    <span className="tabular-nums text-foreground/80">{d.time}</span>
                    <span className="inline-flex w-fit items-center rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border group-hover:bg-surface-muted">
                      {d.season}
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-surface p-6 ring-1 ring-border sm:flex-row sm:items-center sm:p-7">
          <p className="max-w-lg font-display text-lg font-semibold leading-snug text-foreground">{t("ask")}</p>
          <PillLink href={wa(t("waAsk"))} className="shrink-0">
            {t("cta")}
          </PillLink>
        </div>
      </div>
    </section>
  );
}
