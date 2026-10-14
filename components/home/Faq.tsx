"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompany } from "@/components/company/CompanyProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Heading } from "./Heading";

const ease = [0.22, 1, 0.36, 1] as const;

export function Faq() {
  const t = useTranslations("Faq");
  const company = useCompany();
  const items = t.raw("items") as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Heading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("lead")} />
          <div className="mt-8 rounded-[1.75rem] border border-border bg-surface-muted p-6">
            <p className="font-display text-lg font-bold text-foreground">{t("helpTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("helpText")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={company.phones[0]?.href}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                <Phone className="h-4 w-4" />
                {t("call")}
              </a>
            </div>
          </div>
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-5 py-6 text-left"
                >
                  <span className="font-display text-sm font-bold text-brand-strong">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-lg font-semibold text-foreground sm:text-xl">
                    {item.q}
                  </span>
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 bg-brand text-white"
                        : "border border-border text-foreground"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pl-10 pr-14 text-base leading-relaxed text-muted-foreground">
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
