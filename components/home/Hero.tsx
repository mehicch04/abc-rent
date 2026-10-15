"use client";

import Image from "next/image";
import { Phone, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/routing";
import { useCompany } from "@/components/company/CompanyProvider";
import { PillLink } from "@/components/ui/PillLink";

export function Hero({ fleetCount }: { fleetCount: number }) {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const company = useCompany();
  const count = company.rating.count ?? 0;
  const score = (company.rating.score ?? 5).toLocaleString(intlLocale(locale), {
    minimumFractionDigits: 1,
  });

  const stats = [
    { value: String(fleetCount), label: t("statFleet") },
    { value: String(count), label: t("statReviews") },
    { value: "24/7", label: t("statSupport") },
  ];

  return (
    <section className="px-3 pt-1 sm:px-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink">
        <div className="absolute inset-0 -z-10 lg:left-auto lg:w-[74%]">
          <Image
            src="/img/hero-fleet.webp"
            alt={t("imageAlt")}
            fill
            priority
            sizes="(max-width: 639px) 62vw, (max-width: 1023px) 100vw, 74vw"
            quality={65}
            className="object-cover object-[64%_55%] lg:object-[42%_center] lg:[mask-image:linear-gradient(to_right,transparent,black_38%)]"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/50 to-ink/85 lg:hidden" />
        <div aria-hidden className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-ink via-ink/60 via-40% to-ink/0 to-70% lg:block" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 hidden h-2/5 bg-gradient-to-t from-ink/80 to-transparent lg:block" />

        <div className="mx-auto flex min-h-[620px] max-w-6xl flex-col justify-between px-5 pb-28 pt-14 sm:px-6 lg:min-h-[700px] lg:pt-20">
          <div className="max-w-2xl text-white">
            <a
              href={company.map.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="motion-safe:animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-white/15"
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {t("chip", { score, count })}
            </a>

            <h1
              className="motion-safe:animate-rise mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]"
            >
              {t("titleA")}
              <em className="block font-semibold italic text-brand-400">{t("titleB")}</em>
            </h1>

            <p
              style={{ animationDelay: "80ms" }}
              className="motion-safe:animate-rise mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg"
            >
              {t("subtitle")}
            </p>

            <div
              style={{ animationDelay: "160ms" }}
              className="motion-safe:animate-fade-up mt-9 flex flex-wrap items-center gap-3"
            >
              <PillLink href="/vozila">{t("ctaPrimary")}</PillLink>
              <PillLink
                href={company.phones[0]?.href ?? "/kontakt"}
                variant="light"
                icon={<Phone className="h-4 w-4" />}
              >
                {t("ctaSecondary")}
              </PillLink>
            </div>
          </div>

          <div
            style={{ animationDelay: "260ms" }}
            className="motion-safe:animate-fade-up mt-14 flex flex-wrap gap-x-10 gap-y-6 text-white sm:gap-x-14"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-10 sm:gap-14">
                {i > 0 && <span aria-hidden className="hidden h-10 w-px bg-white/20 sm:block" />}
                <div>
                  <p className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-sm text-white/60">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
