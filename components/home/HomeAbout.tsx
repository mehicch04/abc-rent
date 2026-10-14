"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompany } from "@/components/company/CompanyProvider";
import { PillLink } from "@/components/ui/PillLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Heading } from "./Heading";

export function HomeAbout() {
  const t = useTranslations("HomeAbout");
  const company = useCompany();
  const phone = company.phones[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <Heading
            eyebrow={t("eyebrow")}
            title={t("title")}
            accent={t("accent")}
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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate flex min-h-[300px] flex-col overflow-hidden rounded-[24px] bg-brand p-7 text-white sm:p-8"
        >
          <span
            aria-hidden
            className="text-outline pointer-events-none absolute -bottom-8 -right-3 -z-10 select-none font-display text-[10rem] font-semibold leading-none tracking-tighter text-white/20"
          >
            24h
          </span>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
            {t("badge")}
          </span>
          <p className="mt-6 max-w-xs font-display text-2xl font-semibold leading-snug sm:text-[1.7rem]">{t("callout")}</p>
          <div className="mt-auto flex items-center gap-2 pt-8">
            {phone && (
              <a
                href={phone.href}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-ink transition-colors hover:bg-white/90"
              >
                <Phone className="h-4 w-4 text-brand" />
                {phone.value}
              </a>
            )}
            <a
              href={`https://wa.me/${company.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("whatsapp")}
              className="grid h-12 w-12 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 transition-colors hover:bg-white/25"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
