"use client";

import { motion } from "framer-motion";
import { CarFront, KeyRound, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;
const ICONS = [CarFront, Send, KeyRound];

export function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <section className="container py-20 sm:py-28">
      <Heading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} align="center" />

      <div className="relative mt-16">
        <div
          aria-hidden
          className="absolute left-[16.66%] right-[16.66%] top-9 hidden h-px border-t-2 border-dashed border-brand/30 md:block"
        />
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="absolute left-[16.66%] right-[16.66%] top-9 hidden h-0.5 origin-left bg-gradient-to-r from-brand-500 to-brand-300 md:block"
        />

        <ol className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => {
            const Icon = ICONS[i] ?? CarFront;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.25 + i * 0.25, ease }}
                className="relative flex flex-col items-center text-center"
              >
                <span className="relative inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-ink text-white ring-8 ring-background dark:bg-white dark:text-ink">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-6 font-display text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
