"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CarListItem } from "@/lib/types";
import type { ExtraItem } from "@/lib/extras";
import type { Booked } from "@/lib/extras-availability";
import { CarCard } from "@/components/fleet/CarCard";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

const InquiryModal = dynamic(
  () => import("@/components/reservation/InquiryModal").then((m) => m.InquiryModal),
  { ssr: false },
);

const INTERVAL = 4200;
const RING = 2 * Math.PI * 20;
const SLIDE = "w-[82vw] max-w-[360px] sm:w-[calc((100vw-4.25rem)/2.15)] sm:max-w-none lg:w-[calc((min(100vw,72rem)-5.5rem)/3)]";

export function FeaturedFleet({
  cars,
  total,
  locations,
  extras,
  bookedExtras,
}: {
  cars: CarListItem[];
  total: number;
  locations: { id: string; name: string }[];
  extras: ExtraItem[];
  bookedExtras: Booked[];
}) {
  const t = useTranslations("HomeFleet");
  const track = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<number>();
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [view, setView] = useState({ start: 0, size: 1, end: false });
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const [selected, setSelected] = useState<CarListItem | null>(null);
  const [modalReady, setModalReady] = useState(false);
  const count = cars.length + 1;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (selected) setModalReady(true);
  }, [selected]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth;
    setIndex(Math.min(count - 1, Math.round(el.scrollLeft / step)));
    setView({
      start: el.scrollLeft / el.scrollWidth,
      size: el.clientWidth / el.scrollWidth,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 8,
    });
  }, [count]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const first = el.children[0] as HTMLElement;
      const target = el.children[(i + count) % count] as HTMLElement;
      el.scrollTo({ left: target.offsetLeft - first.offsetLeft, behavior: "smooth" });
      setTick((v) => v + 1);
    },
    [count],
  );

  const atEnd = () => {
    const el = track.current;
    return !!el && el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
  };

  const next = useCallback(() => (atEnd() ? goTo(0) : goTo(index + 1)), [goTo, index]);
  const prev = useCallback(() => (index === 0 ? goTo(count - 1) : goTo(index - 1)), [goTo, index, count]);

  const running = playing && !hold && inView && !selected;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(next, INTERVAL);
    return () => window.clearTimeout(id);
  }, [running, next, tick]);

  const pauseFor = (ms: number) => {
    setHold(true);
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setHold(false), ms);
  };

  return (
    <section className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} subtitle={t("lead")} className="max-w-xl" />
          <PillLink href="/vozila" variant="dark" className="self-start lg:self-auto">
            {t("viewAll")}
          </PillLink>
        </div>
      </div>

      <div
        ref={track}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHold(false)}
        onTouchStart={() => pauseFor(7000)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
        className="no-scrollbar relative mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 [scroll-padding-inline:1rem] sm:px-6 sm:[scroll-padding-inline:1.5rem] lg:px-[max(1.5rem,calc((100%-72rem)/2+1.5rem))] lg:[scroll-padding-inline:max(1.5rem,calc((100%-72rem)/2+1.5rem))]"
      >
        {cars.map((car) => (
          <div key={car.id} className={`flex shrink-0 snap-start ${SLIDE}`}>
            <div className="w-full">
              <CarCard
                car={car}
                onSelect={setSelected}
                imageSizes="(max-width: 639px) 82vw, (max-width: 1023px) 46vw, 360px"
              />
            </div>
          </div>
        ))}
        <div className={`flex shrink-0 snap-start ${SLIDE}`}>
          <Link
            href="/vozila"
            className="group relative flex w-full flex-col overflow-hidden rounded-[22px] bg-brand p-7 text-white transition-colors hover:bg-brand-700 sm:p-8"
          >
            <span
              aria-hidden
              className="text-outline pointer-events-none absolute -bottom-10 -right-4 select-none font-display text-[11rem] font-semibold leading-none tracking-tighter text-white/20"
            >
              {total}
            </span>
            <span className="text-sm font-medium text-white/75">{t("allTitle")}</span>
            <span className="mt-6 font-display text-6xl font-semibold leading-none tracking-tight">{total}</span>
            <span className="mt-2 text-sm text-white/80">{t("allCount")}</span>
            <p className="mt-6 max-w-[16rem] text-sm leading-relaxed text-white/85">{t("allBody")}</p>
            <span className="mt-auto inline-flex w-fit items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-sm font-medium text-ink">
              {t("allCta")}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </span>
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <p className="shrink-0 font-display text-sm font-semibold tabular-nums text-foreground">
          {String(view.end ? count : index + 1).padStart(2, "0")}
          <span className="text-muted-foreground"> / {String(count).padStart(2, "0")}</span>
        </p>
        <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border">
          <span
            className="absolute inset-y-0 rounded-full bg-foreground transition-[left,width] duration-300 ease-out"
            style={{ left: `${view.start * 100}%`, width: `${Math.max(view.size * 100, 6)}%` }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? t("pause") : t("play")}
            aria-pressed={!playing}
            className="relative grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface"
          >
            <svg aria-hidden viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
              <circle cx="22" cy="22" r="20" fill="none" strokeWidth="1.5" className="stroke-border" />
              {playing && (
                <circle
                  key={`${index}-${tick}-${running}`}
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={RING}
                  className="stroke-brand motion-safe:animate-ring"
                  style={{
                    strokeDashoffset: RING,
                    animationDuration: `${INTERVAL}ms`,
                    animationPlayState: running ? "running" : "paused",
                    ["--ring-len" as string]: RING,
                  }}
                />
              )}
            </svg>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              prev();
              pauseFor(INTERVAL * 2);
            }}
            aria-label={t("prev")}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-foreground/30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              next();
              pauseFor(INTERVAL * 2);
            }}
            aria-label={t("next")}
            className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-ink-700 dark:bg-white dark:text-ink dark:hover:bg-white/90"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {(selected || modalReady) && (
        <InquiryModal
          car={selected}
          search={{}}
          locations={locations}
          extras={extras}
          bookedExtras={bookedExtras}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
