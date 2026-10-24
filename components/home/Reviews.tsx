"use client";

import type { CSSProperties } from "react";
import { ShieldCheck, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/routing";
import type { Review, ReviewsData } from "@/lib/reviews";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="flex shrink-0 gap-0.5" aria-label={`${value}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden className={`${className} ${i < Math.round(value) ? "fill-[#F5A524] text-[#F5A524]" : "fill-border text-border"}`} />
      ))}
    </span>
  );
}

function Card({ r, href, copy }: { r: Review; href: string; copy?: boolean }) {
  const t = useTranslations("Reviews");
  return (
    <figure aria-hidden={copy} className="w-[300px] shrink-0 pe-4 sm:w-[400px]">
      <div className="flex h-full flex-col rounded-[22px] bg-surface-muted p-5 ring-1 ring-border/70 transition-colors duration-300 hover:bg-surface hover:ring-brand/25 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5BC8F5] to-[#0767A0] text-base font-semibold text-white shadow-[0_6px_14px_-8px_rgba(8,121,184,0.9)]">
            {r.author.trim().charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span dir="auto" className="block truncate font-semibold text-foreground">
              {r.author}
            </span>
            <span className="block text-xs text-muted-foreground">{t("googleReview")}</span>
          </span>
          <Stars value={r.rating} />
        </div>
        <blockquote dir="auto" className="mt-4 line-clamp-5 flex-1 text-[15px] leading-relaxed text-foreground/80">
          {r.text}
        </blockquote>
        <a
          href={r.url ?? href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={copy ? -1 : undefined}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-strong underline-offset-4 hover:underline"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          {t("verify")}
        </a>
      </div>
    </figure>
  );
}

function Row({ items, href, reverse }: { items: Review[]; href: string; reverse?: boolean }) {
  let row = items;
  while (row.length && row.length < 6) row = [...row, ...items];
  const style = {
    animation: `reviews-marquee ${row.length * 7}s linear infinite`,
    animationDirection: reverse ? "reverse" : "normal",
  } as CSSProperties;
  return (
    <div className="group/row overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto">
      <div dir="ltr" style={style} className="flex w-max items-stretch group-hover/row:![animation-play-state:paused] motion-reduce:![animation:none]">
        {row.map((r, i) => (
          <Card key={`a${i}`} r={r} href={href} />
        ))}
        {row.map((r, i) => (
          <Card key={`b${i}`} r={r} href={href} copy />
        ))}
      </div>
    </div>
  );
}

export function Reviews({ data }: { data: ReviewsData }) {
  const t = useTranslations("Reviews");
  const locale = useLocale();
  if (!data.reviews.length) return null;

  const score = data.score.toLocaleString(intlLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const top = data.reviews.filter((_, i) => i % 2 === 0);
  const bottom = data.reviews.filter((_, i) => i % 2 === 1);

  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} />
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 self-start rounded-2xl bg-surface-muted px-5 py-4 transition-colors hover:bg-border/60 lg:self-auto"
          >
            <span className="font-display text-4xl font-semibold leading-none tracking-tight text-foreground">{score}</span>
            <span>
              <Stars value={data.score} />
              <span className="mt-1.5 block text-sm text-muted-foreground">{t("count", { count: data.count })}</span>
            </span>
          </a>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <Row items={top} href={data.url} />
        {bottom.length > 0 && <Row items={bottom} href={data.url} reverse />}
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl justify-center px-4 sm:px-6">
        <PillLink href={data.url} variant="outline">
          {t("all")}
        </PillLink>
      </div>
    </section>
  );
}
