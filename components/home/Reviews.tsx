"use client";

import { useRef } from "react";
import { m as motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/routing";
import type { ReviewsData } from "@/lib/reviews";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${className} ${i < Math.round(value) ? "fill-[#FBBC04] text-[#FBBC04]" : "fill-border text-border"}`}
        />
      ))}
    </span>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export function Reviews({ data }: { data: ReviewsData }) {
  const t = useTranslations("Reviews");
  const locale = useLocale();
  const track = useRef<HTMLDivElement>(null);
  if (!data.reviews.length) return null;

  const score = data.score.toLocaleString(intlLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const scroll = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("figure");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
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
            <span className="mt-1.5 block text-sm text-muted-foreground">
              {t("count", { count: data.count })}
            </span>
          </span>
        </a>
      </div>

      <div
        ref={track}
        className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {data.reviews.map((r, i) => (
          <motion.figure
            key={`${r.author}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-[86%] shrink-0 snap-start flex-col rounded-[22px] bg-surface-muted p-7 sm:w-[calc(50%-8px)] lg:w-[calc((100%-32px)/3)]"
          >
            <div className="flex items-center justify-between">
              <Stars value={r.rating} />
              <span className="font-display text-5xl leading-[0.6] text-brand/25" aria-hidden>
                &rdquo;
              </span>
            </div>
            <blockquote className="mt-5 line-clamp-6 flex-1 text-[15px] leading-relaxed text-foreground/85">{r.text}</blockquote>
            <figcaption className="mt-7 flex items-center gap-3 border-t border-border pt-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white dark:bg-white dark:text-ink">
                {initials(r.author)}
              </span>
              <span className="min-w-0">
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-medium text-foreground hover:underline">
                    {r.author}
                  </a>
                ) : (
                  <span className="block truncate text-sm font-medium text-foreground">{r.author}</span>
                )}
                <span className="block truncate text-xs text-muted-foreground">
                  {r.time ? `${r.time} · ` : ""}
                  {t("source")}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <PillLink href={data.url} variant="outline">
          {t("all")}
        </PillLink>
        {data.reviews.length > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label={t("prev")}
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label={t("next")}
              className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-ink-700 dark:bg-white dark:text-ink"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
