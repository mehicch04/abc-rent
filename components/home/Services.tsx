"use client";

import { motion } from "framer-motion";
import { ArrowRight, Crown, MapPinHouse, Plane, UserRound, Users, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCompany } from "@/components/company/CompanyProvider";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

type Item = { title: string; body: string; wa?: string };

const ICONS = [UserRound, Plane, MapPinHouse, Users, Crown, UsersRound];
const LINKS = ["wa", "wa", "/kontakt", "/vozila", "/vozila", "/vozila"] as const;

export function Services() {
  const t = useTranslations("Services");
  const company = useCompany();
  const items = t.raw("items") as Item[];
  const wa = (text?: string) =>
    `https://wa.me/${company.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  return (
    <section id="usluge" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} accentTone="muted" />
        <PillLink href={wa()} variant="dark" className="self-start sm:self-auto">
          {t("cta")}
        </PillLink>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = ICONS[i] ?? Users;
          const featured = i === 0;
          const target = LINKS[i] ?? "/vozila";
          const linkCls = `mt-6 inline-flex items-center gap-1.5 text-sm font-medium ${
            featured ? "text-white" : "text-brand-strong"
          }`;
          const more = (
            <>
              {t("more")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          );
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
              className={`group flex flex-col rounded-2xl p-7 ${
                featured ? "bg-brand text-white" : "bg-surface-muted text-foreground"
              }`}
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
                  featured ? "bg-white/15 text-white" : "bg-surface text-brand-strong"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-8 font-display text-lg font-semibold">{item.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${featured ? "text-white/80" : "text-muted-foreground"}`}>
                {item.body}
              </p>
              {target === "wa" ? (
                <a href={wa(item.wa)} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {more}
                </a>
              ) : (
                <Link href={target} className={linkCls}>
                  {more}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
