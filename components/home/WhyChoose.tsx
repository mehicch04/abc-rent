"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clock3,
  LifeBuoy,
  ReceiptText,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "./SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;
const ICONS = [ShieldCheck, Clock3, Truck, BadgeCheck, LifeBuoy, ReceiptText];

export function WhyChoose() {
  const t = useTranslations("WhyChoose");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section className="container py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-card-hover"
              >
                <span
                  aria-hidden
                  className="absolute right-5 top-4 font-display text-4xl font-extrabold text-foreground/[0.05]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className="h-7 w-7 text-brand transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
