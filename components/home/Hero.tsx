"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, Facebook, Instagram, Phone, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { useCompany } from "@/components/company/CompanyProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Price } from "@/components/currency/Price";
import type { CarListItem } from "@/lib/types";

const FACES = [
  { l: "E", c: "from-[#5BC8F5] to-[#0767A0]" },
  { l: "R", c: "from-[#F5B85B] to-[#D9731A]" },
  { l: "S", c: "from-[#7BE0B0] to-[#119463]" },
  { l: "A", c: "from-[#B49BF5] to-[#5B3FD9]" },
];

export function Hero({ spotlight }: { spotlight?: CarListItem | null }) {
  const t = useTranslations("Hero");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const company = useCompany();
  const count = company.rating.count ?? 0;
  const score = (company.rating.score ?? 5).toLocaleString(intlLocale(locale), { minimumFractionDigits: 1 });

  const socials = [
    { href: `https://wa.me/${company.whatsapp}`, label: "WhatsApp", icon: <WhatsAppIcon className="h-4 w-4" /> },
    company.socials.instagram && { href: company.socials.instagram, label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    company.socials.facebook && { href: company.socials.facebook, label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    company.phones[0] && { href: company.phones[0].href, label: t("ctaSecondary"), icon: <Phone className="h-4 w-4" /> },
  ].filter(Boolean) as { href: string; label: string; icon: JSX.Element }[];

  return (
    <section className="px-3 pt-3 sm:px-4">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-ink">
        <Image
          src="/img/hero-fleet.webp"
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          quality={70}
          decoding="sync"
          className="-z-20 object-cover object-[68%_60%] motion-safe:animate-[hero-zoom_18s_ease-out_both]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/5 rtl:bg-gradient-to-l max-lg:from-ink/80 max-lg:via-ink/60 max-lg:to-ink/40" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-ink/50 to-transparent" />

        <div className="mx-auto flex min-h-[600px] max-w-6xl flex-col px-5 pb-24 pt-14 sm:min-h-[640px] sm:px-6 sm:pb-28 sm:pt-20 lg:min-h-[700px] lg:pt-24">
          <div className="max-w-2xl text-white">
            <h1 className="motion-safe:animate-rise font-display text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.6rem]">
              {t("titleA")}
              <span className="block text-white/55">{t("titleB")}</span>
            </h1>

            <p style={{ animationDelay: "80ms" }} className="motion-safe:animate-rise mt-5 max-w-md text-[15px] leading-relaxed text-white/80 sm:mt-6 sm:text-[17px]">
              {t("subtitle")}
            </p>

            <div style={{ animationDelay: "160ms" }} className="motion-safe:animate-rise mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
              <Link
                href="/vozila"
                className="group inline-flex h-14 items-center gap-4 rounded-full bg-white pe-2 ps-6 text-[15px] font-semibold text-ink shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                {t("ctaPrimary")}
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-[-45deg] rtl:group-hover:rotate-45">
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </span>
              </Link>
              <a
                href={company.phones[0]?.href ?? "/kontakt"}
                className="inline-flex h-14 items-center gap-2.5 rounded-full px-5 text-[15px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                {t("ctaSecondary")}
              </a>
            </div>

            <a
              href={company.map.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: "240ms" }}
              className="motion-safe:animate-rise group mt-9 inline-flex items-center gap-4 sm:mt-12"
            >
              <span className="flex -space-x-2.5 rtl:space-x-reverse">
                {FACES.map((f) => (
                  <span key={f.l} className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${f.c} text-sm font-semibold text-white ring-2 ring-ink`}>
                    {f.l}
                  </span>
                ))}
              </span>
              <span className="text-white">
                <span className="flex items-center gap-2">
                  <span className="text-base font-semibold">{score}/5</span>
                  <span className="flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#F5A524] text-[#F5A524]" />
                    ))}
                  </span>
                </span>
                <span className="block text-xs text-white/65 group-hover:text-white/85">{t("trusted", { count })}</span>
              </span>
            </a>
          </div>

          <div className="mt-auto flex items-end justify-between gap-6 pt-10">
            <ul className="hidden gap-2 sm:flex">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>

            {spotlight && (
              <Link
                href={`/vozila/${spotlight.slug}`}
                style={{ animationDelay: "320ms" }}
                className="motion-safe:animate-rise group ms-auto flex w-full max-w-[320px] items-center gap-3 rounded-[22px] bg-white/10 p-2.5 text-white ring-1 ring-white/20 backdrop-blur-xl transition-colors hover:bg-white/15"
              >
                <span className="relative h-[72px] w-[104px] shrink-0 overflow-hidden rounded-2xl bg-white">
                  {spotlight.images?.[0] && (
                    <Image src={spotlight.images[0]} alt="" fill sizes="104px" className="object-contain p-1.5 mix-blend-multiply" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    {t("available")}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold">{spotlight.title}</span>
                  {spotlight.pricePerDay != null && (
                    <span className="block text-xs text-white/65">
                      {tc("from")} <Price bam={spotlight.pricePerDay} className="font-semibold text-white" /> / {tc("perDay")}
                    </span>
                  )}
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
