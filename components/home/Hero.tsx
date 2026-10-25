"use client";

import Image from "next/image";
import { Check, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/routing";
import { useCompany } from "@/components/company/CompanyProvider";
import { ReservationSearchForm } from "@/components/reservation/ReservationSearchForm";

type Loc = { id: string; name: string; city: string; slug?: string };

export function Hero({ locations }: { locations: Loc[] }) {
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
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(90%_80%_at_50%_35%,rgba(11,18,32,0.5)_0%,rgba(11,18,32,0.82)_70%,#0B1220_100%)]" />

        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-10 pt-10 text-center text-white sm:px-6 sm:pb-16 sm:pt-20 lg:min-h-[640px] lg:justify-center lg:pt-16">
          <a
            href={company.map.link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="motion-safe:animate-rise inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/85 ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/15"
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
            {t("titleA")}
            <span className="block text-white/50">{t("titleB")}</span>
          </h1>

          <p style={{ animationDelay: "120ms" }} className="motion-safe:animate-rise mt-4 max-w-xl text-[15px] leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
            {t("subtitle")}
          </p>

          <div id="rezervacija" style={{ animationDelay: "180ms" }} className="motion-safe:animate-rise mt-8 w-full max-w-4xl scroll-mt-24 sm:mt-10">
            <ReservationSearchForm locations={locations} variant="bar" />
          </div>

          <ul style={{ animationDelay: "240ms" }} className="motion-safe:animate-rise mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/65">
            {perks.map((x) => (
              <li key={x} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
