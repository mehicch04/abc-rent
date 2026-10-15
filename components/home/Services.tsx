"use client";

import Image from "next/image";
import { m as motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Crown,
  MapPinHouse,
  Users,
  UsersRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCompany } from "@/components/company/CompanyProvider";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

type Premium = {
  label: string;
  title: string;
  body: string;
  points: string[];
  badge: string;
  cta: string;
  wa: string;
  imageAlt: string;
};
type Item = { title: string; body: string };

const PREMIUM_IMAGES = ["/img/chauffeur.webp", "/img/airport-transfer.webp"];
const ICONS = [MapPinHouse, Users, Crown, UsersRound];
const LINKS = ["/kontakt", "/vozila", "/vozila", "/vozila"] as const;
const ease = [0.22, 1, 0.36, 1] as const;

export function Services() {
  const t = useTranslations("Services");
  const company = useCompany();
  const premium = t.raw("premium") as Premium[];
  const items = t.raw("items") as Item[];
  const wa = (text?: string) =>
    `https://wa.me/${company.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  return (
    <section id="usluge" className="scroll-mt-24 px-3 py-3 sm:px-4">
      <div className="light-island rounded-[28px] bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <Heading
              eyebrow={t("eyebrow")}
              title={t("title")}
              accent={t("accent")}
            />
            <PillLink
              href={wa()}
              variant="dark"
              className="self-start sm:self-auto"
            >
              {t("cta")}
            </PillLink>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {premium.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="flex flex-col rounded-[24px] bg-surface p-2 ring-1 ring-border"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-ink">
                  <Image
                    src={PREMIUM_IMAGES[i] ?? PREMIUM_IMAGES[0]}
                    alt={p.imageAlt}
                    fill
                    sizes="(max-width: 1023px) 94vw, 560px"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur-md">
                    {p.label}
                  </span>
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    <Clock3 className="h-3.5 w-3.5" />
                    {p.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-6 sm:px-6">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {p.body}
                  </p>
                  <ul className="mt-6 grid gap-2.5">
                    {p.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-center gap-3 text-sm text-foreground"
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-brand-strong">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <PillLink href={wa(p.wa)}>{p.cta}</PillLink>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => {
              const Icon = ICONS[i] ?? Users;
              const featured = i === 0;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <Link
                    href={LINKS[i] ?? "/vozila"}
                    className={`group flex h-full flex-col rounded-2xl p-6 transition-colors ${
                      featured
                        ? "bg-brand text-white hover:bg-brand-700"
                        : "bg-surface-muted text-foreground hover:bg-border/50"
                    }`}
                  >
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${
                        featured
                          ? "bg-white/15 text-white"
                          : "bg-surface text-brand-strong"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-6 font-display text-base font-semibold">
                      {item.title}
                    </h3>
                    <p
                      className={`mt-2 flex-1 text-sm leading-relaxed ${featured ? "text-white/80" : "text-muted-foreground"}`}
                    >
                      {item.body}
                    </p>
                    <span
                      className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium ${featured ? "text-white" : "text-brand-strong"}`}
                    >
                      {t("more")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
