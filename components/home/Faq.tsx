"use client";

import { useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompany } from "@/components/company/CompanyProvider";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

export function Faq() {
  const t = useTranslations("Faq");
  const company = useCompany();
  const items = t.raw("items") as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
        <div>
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} subtitle={t("lead")} />
          <PillLink href={`https://wa.me/${company.whatsapp}`} variant="dark" className="mt-8">
            {t("cta")}
          </PillLink>
        </div>

        <ul className="border-t border-border">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-start"
                >
                  <span className="font-display text-base font-medium text-foreground sm:text-lg">{item.q}</span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 shrink-0 text-brand-strong" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-foreground/60" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
