"use client";

import { motion } from "framer-motion";
import { CarFront, KeyRound, MessageCircleMore } from "lucide-react";
import { useTranslations } from "next-intl";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

const ICONS = [CarFront, MessageCircleMore, KeyRound];

export function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <section className="px-3 sm:px-4">
      <div className="overflow-hidden rounded-[28px] bg-ink py-20 dark:ring-1 dark:ring-white/10 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} tone="dark" />
            <div className="max-w-sm lg:pb-1">
              <p className="text-sm leading-relaxed text-white/60">{t("lead")}</p>
              <PillLink href="/vozila" variant="light" className="mt-5">
                {t("cta")}
              </PillLink>
            </div>
          </div>

          <ol className="mt-14 grid gap-4 lg:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = ICONS[i] ?? CarFront;
              const last = i === steps.length - 1;
              return (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col overflow-hidden rounded-[22px] p-7 ring-1 sm:p-8 ${
                    last ? "bg-brand ring-brand" : "bg-white/[0.04] ring-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-full ${
                        last ? "bg-white text-brand-strong" : "bg-white/10 text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      aria-hidden
                      className={`text-outline font-display text-6xl font-semibold leading-none tracking-tight ${
                        last ? "text-white/50" : "text-white/20"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className={`mt-12 h-1 overflow-hidden rounded-full ${last ? "bg-white/25" : "bg-white/10"}`}>
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${((i + 1) / steps.length) * 100}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${last ? "bg-white" : "bg-brand-400"}`}
                    />
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold text-white">{s.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${last ? "text-white/85" : "text-white/60"}`}>{s.body}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
