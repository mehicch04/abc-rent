"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { PillLink } from "@/components/ui/PillLink";

export function CtaBand() {
  const t = useTranslations("Cta");

  return (
    <section className="px-3 sm:px-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink">
        <Image
          src="/img/hero-sarajevo.webp"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[80%_center]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24">
          <h2 className="max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-white/70">{t("body")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PillLink href="/vozila">{t("primary")}</PillLink>
            <PillLink href="/kontakt" variant="light">
              {t("secondary")}
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
