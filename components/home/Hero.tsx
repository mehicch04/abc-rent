"use client";

import Image from "next/image";
import { Check, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/routing";
import { useCompany } from "@/components/company/CompanyProvider";

export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const company = useCompany();
  const count = company.rating.count ?? 0;
  const score = (company.rating.score ?? 5).toLocaleString(intlLocale(locale), { minimumFractionDigits: 1 });
  const perks = t.raw("perks") as string[];

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
          className="-z-20 object-cover object-[60%_70%] motion-safe:animate-[hero-zoom_18s_ease-out_both]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(75%_65%_at_50%_40%,rgba(11,18,32,0.82)_0%,rgba(11,18,32,0.62)_55%,rgba(11,18,32,0.9)_100%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B3049]/50 via-transparent to-ink/80" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[18%] -z-10 h-[320px] w-[min(900px,120%)] -translate-x-1/2 rounded-full bg-brand/30 blur-[110px]" />

        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-28 pt-10 text-center text-white sm:px-6 sm:pb-36 sm:pt-20 lg:min-h-[620px] lg:justify-center lg:pt-14">
          <a
            href={company.map.link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="motion-safe:animate-rise inline-flex items-center gap-2.5 rounded-full bg-ink/55 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-ink/70"
          >
            <span className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-3 w-3 fill-[#F5A524] text-[#F5A524]" />
              ))}
            </span>
            {t("chip", { score, count })}
          </a>

          <h1
            style={{ animationDelay: "60ms" }}
            className="motion-safe:animate-rise mt-5 max-w-4xl font-display text-[2.15rem] font-semibold leading-[1.03] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:text-[5rem]"
          >
            <span className="block [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]">{t("titleA")}</span>
            <span className="block bg-gradient-to-r from-[#82CEF6] via-[#2BB0F0] to-[#82CEF6] bg-clip-text pb-[0.08em] text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone] [filter:drop-shadow(0_2px_22px_rgba(8,121,184,0.45))]">
              {t("titleB")}
            </span>
          </h1>

          <p style={{ animationDelay: "120ms" }} className="motion-safe:animate-rise mt-4 max-w-xl text-[15px] leading-relaxed text-white/90 [text-shadow:0_1px_14px_rgba(0,0,0,0.5)] sm:mt-5 sm:text-lg">
            {t("subtitle")}
          </p>

          <ul style={{ animationDelay: "180ms" }} className="motion-safe:animate-rise mt-7 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-white">
            {perks.map((x) => (
              <li key={x} className="inline-flex items-center gap-2 rounded-full bg-ink/45 py-1.5 pe-3.5 ps-1.5 ring-1 ring-white/15 backdrop-blur-md">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-white">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
