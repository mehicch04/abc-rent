"use client";

import { motion } from "framer-motion";
import { Gauge, Plane, ShieldCheck, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

const ease = [0.22, 1, 0.36, 1] as const;
const ICONS = [Plane, Wallet, Gauge, ShieldCheck];

export function Perks() {
  const t = useTranslations("Perks");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section className="container py-16 sm:py-20">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[i] ?? Plane;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className="group flex gap-4 bg-surface p-6 transition-colors hover:bg-brand-50/60 dark:hover:bg-ink-700/60 sm:p-7"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-brand transition-transform duration-300 group-hover:-rotate-6">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
