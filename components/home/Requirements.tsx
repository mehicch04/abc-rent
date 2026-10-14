"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Check, ContactRound, CreditCard, IdCard, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/site-config";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

const ICONS = [IdCard, ContactRound, CreditCard, CalendarCheck];
const ease = [0.22, 1, 0.36, 1] as const;

function Perforation() {
  return (
    <div aria-hidden className="relative">
      <div className="mx-7 border-t-2 border-dashed border-border" />
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background ring-1 ring-border [clip-path:inset(0_0_0_calc(50%-1.5px))]" />
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background ring-1 ring-border [clip-path:inset(0_calc(50%-1.5px)_0_0)]" />
    </div>
  );
}

export function Requirements() {
  const t = useTranslations("Requirements");
  const items = (t.raw("items") as { title: string; body: string }[]).map((it) => ({
    ...it,
    body: it.body.replace("{standard}", String(SITE.deposit.standard)).replace("{premium}", String(SITE.deposit.premium)),
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="lg:order-2">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} subtitle={t("lead")} />
          <PillLink href="/uvjeti-najma" variant="dark" className="mt-8">
            {t("cta")}
          </PillLink>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="relative rounded-[24px] bg-surface shadow-[0_30px_70px_-50px_rgba(11,18,32,0.45)] ring-1 ring-border lg:order-1"
        >
          <div className="flex items-center justify-between px-7 py-5">
            <div>
              <p className="font-display text-sm font-semibold text-foreground">{SITE.name}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{t("ticket")}</p>
            </div>
            <span className="rounded-full bg-brand/10 px-3 py-1 font-display text-xs font-semibold tabular-nums text-brand-strong">
              {items.length}/{items.length}
            </span>
          </div>

          <Perforation />

          <ul className="divide-y divide-dashed divide-border px-7">
            {items.map((it, i) => {
              const Icon = ICONS[i] ?? IdCard;
              return (
                <li key={it.title} className="flex items-start gap-4 py-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand-strong">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{it.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
                  </div>
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.12, ease }}
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-white"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.span>
                </li>
              );
            })}
          </ul>

          <Perforation />

          <div className="flex items-center justify-between gap-6 px-7 py-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-strong" />
              {t("footer")}
            </p>
            <span
              aria-hidden
              className="hidden h-8 w-24 shrink-0 text-foreground/60 [background:repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_4px,currentColor_4px_5px,transparent_5px_7px,currentColor_7px_10px,transparent_10px_12px)] sm:block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
