"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CarListItem } from "@/lib/types";
import type { ExtraItem } from "@/lib/extras";
import type { Booked } from "@/lib/extras-availability";
import { CAR_CATEGORIES, carCategories, type CarCategory } from "@/lib/car-categories";
import { CarCard } from "@/components/fleet/CarCard";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

const InquiryModal = dynamic(
  () => import("@/components/reservation/InquiryModal").then((m) => m.InquiryModal),
  { ssr: false },
);

const SPEED = 0.032;
const GAP = 20;

type Engine = {
  x: number;
  v: number;
  step: number;
  width: number;
  down: boolean;
  drag: boolean;
  startX: number;
  lastX: number;
  lastT: number;
  moved: number;
  hover: boolean;
  focus: boolean;
  reduced: boolean;
  resumeAt: number;
  tween: { from: number; to: number; start: number; dur: number } | null;
};

export function FeaturedFleet({
  cars,
  locations,
  extras,
  bookedExtras,
}: {
  cars: CarListItem[];
  locations: { id: string; name: string }[];
  extras: ExtraItem[];
  bookedExtras: Booked[];
}) {
  const t = useTranslations("HomeFleet");
  const tf = useTranslations("Fleet");
  const head = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>({
    x: 0,
    v: 0,
    step: 380,
    width: 0,
    down: false,
    drag: false,
    startX: 0,
    lastX: 0,
    lastT: 0,
    moved: 0,
    hover: false,
    focus: false,
    reduced: false,
    resumeAt: 0,
    tween: null,
  });
  const [active, setActive] = useState<CarCategory | "ALL">("ALL");
  const [reps, setReps] = useState(1);
  const [selected, setSelected] = useState<CarListItem | null>(null);
  const [modalReady, setModalReady] = useState(false);

  const counts = useMemo(() => {
    const m = new Map<CarCategory, number>();
    for (const c of cars) for (const cat of carCategories(c)) m.set(cat, (m.get(cat) ?? 0) + 1);
    return m;
  }, [cars]);

  const chips = useMemo(
    () => [
      { id: "ALL" as const, label: tf("allTypes"), count: cars.length },
      ...CAR_CATEGORIES.filter((c) => (counts.get(c) ?? 0) > 0).map((c) => ({
        id: c,
        label: tf(`categories.${c}`),
        count: counts.get(c) ?? 0,
      })),
    ],
    [cars.length, counts, tf],
  );

  const items = useMemo(
    () => (active === "ALL" ? cars : cars.filter((c) => carCategories(c).includes(active))),
    [cars, active],
  );

  const brands = useMemo(
    () => Array.from(new Set(cars.map((c) => c.brand).filter(Boolean))),
    [cars],
  );

  const slides = useMemo(
    () => Array.from({ length: reps }, (_, r) => items.map((car) => ({ car, clone: r > 0 }))).flat(),
    [items, reps],
  );

  useEffect(() => {
    if (selected) setModalReady(true);
    engine.current.focus = !!selected;
  }, [selected]);

  const layout = useCallback(() => {
    const w = wrap.current;
    const r = rail.current;
    const h = head.current;
    if (!w || !r || !h) return;
    const first = r.children[0] as HTMLElement | undefined;
    if (!first) return;
    const e = engine.current;
    e.step = first.offsetWidth + GAP;
    const need = Math.max(1, Math.ceil((w.clientWidth + e.step * 2) / (items.length * e.step)));
    if (need !== reps) setReps(need);
    e.width = items.length * need * e.step;
    const pad = h.getBoundingClientRect().left + parseFloat(getComputedStyle(h).paddingLeft) - w.getBoundingClientRect().left;
    return pad;
  }, [items.length, reps]);

  const paint = useCallback(() => {
    const r = rail.current;
    const e = engine.current;
    if (!r || !e.width) return;
    const kids = r.children;
    for (let i = 0; i < kids.length; i++) {
      const pos = ((((i * e.step + e.x) % e.width) + e.width) % e.width) - e.step;
      (kids[i] as HTMLElement).style.transform = `translate3d(${pos}px,0,0)`;
    }
  }, []);

  useEffect(() => {
    const e = engine.current;
    const pad = layout();
    if (pad !== undefined) {
      e.x = pad + e.step;
      e.tween = null;
    }
    paint();
    const onResize = () => {
      layout();
      paint();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [layout, paint, active]);

  useEffect(() => {
    const e = engine.current;
    e.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let prev = 0;
    let running = false;

    const frame = (now: number) => {
      const dt = prev ? Math.min(64, now - prev) : 16;
      prev = now;
      if (e.tween) {
        const p = Math.min(1, (now - e.tween.start) / e.tween.dur);
        e.x = e.tween.from + (e.tween.to - e.tween.from) * (1 - Math.pow(1 - p, 3));
        if (p >= 1) e.tween = null;
        e.v = 0;
      } else if (!e.drag) {
        const idle = e.hover || e.focus || e.reduced || now < e.resumeAt;
        const target = idle ? 0 : -SPEED;
        const k = Math.abs(e.v) > SPEED * 1.5 ? 0.955 : 0.93;
        e.v += (target - e.v) * (1 - Math.pow(k, dt / 16));
        e.x += e.v * dt;
      }
      if (e.width) e.x %= e.width;
      paint();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      prev = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()), { rootMargin: "100px" });
    if (wrap.current) io.observe(wrap.current);

    const w = wrap.current;
    const onWheel = (ev: WheelEvent) => {
      if (Math.abs(ev.deltaX) <= Math.abs(ev.deltaY)) return;
      ev.preventDefault();
      e.tween = null;
      e.v = 0;
      e.x -= ev.deltaX;
      e.resumeAt = performance.now() + 1800;
    };
    w?.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      stop();
      io.disconnect();
      w?.removeEventListener("wheel", onWheel);
    };
  }, [paint]);

  const nudge = (dir: 1 | -1) => {
    const e = engine.current;
    const now = performance.now();
    const from = e.tween ? e.tween.to : e.x;
    e.tween = { from: e.x, to: from - dir * e.step, start: now, dur: 700 };
    e.v = 0;
    e.resumeAt = now + 3000;
  };

  const onPointerDown = (ev: React.PointerEvent) => {
    if (ev.button !== 0) return;
    const e = engine.current;
    e.down = true;
    e.startX = e.lastX = ev.clientX;
    e.lastT = performance.now();
    e.moved = 0;
  };

  const onPointerMove = (ev: React.PointerEvent) => {
    const e = engine.current;
    if (!e.down) return;
    const now = performance.now();
    const dx = ev.clientX - e.lastX;
    if (!e.drag && Math.abs(ev.clientX - e.startX) > 6) {
      e.drag = true;
      e.tween = null;
      wrap.current?.setPointerCapture(ev.pointerId);
    }
    if (e.drag) {
      e.x += dx;
      e.moved += Math.abs(dx);
      e.v = dx / Math.max(8, now - e.lastT);
    }
    e.lastX = ev.clientX;
    e.lastT = now;
  };

  const onPointerUp = () => {
    const e = engine.current;
    e.down = false;
    if (e.drag) {
      e.drag = false;
      e.resumeAt = performance.now() + 1600;
    }
  };

  const onFocus = (ev: React.FocusEvent) => {
    const e = engine.current;
    e.focus = true;
    const w = wrap.current;
    const slide = (ev.target as HTMLElement).closest<HTMLElement>("[data-slide]");
    if (!w || !slide) return;
    const a = slide.getBoundingClientRect();
    const b = w.getBoundingClientRect();
    if (a.left < b.left + 24) e.x += b.left + 24 - a.left;
    else if (a.right > b.right - 24) e.x -= a.right - (b.right - 24);
    paint();
  };

  return (
    <section className="relative overflow-hidden bg-surface-muted pb-14 pt-20 sm:pb-16 sm:pt-28">
      <div ref={head} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} subtitle={t("lead")} className="max-w-xl" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label={t("prev")}
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-foreground/30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label={t("next")}
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-foreground/30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <PillLink href="/vozila" variant="dark" className="ml-2">
              {t("viewAll")}
            </PillLink>
          </div>
        </div>

        <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {chips.map((c) => {
            const on = active === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(c.id)}
                className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${
                  on
                    ? "bg-ink text-white dark:bg-white dark:text-ink"
                    : "bg-surface text-foreground/70 ring-1 ring-border hover:text-foreground hover:ring-foreground/25"
                }`}
              >
                {c.label}
                <sup className={`text-[10px] tabular-nums ${on ? "opacity-70" : "text-muted-foreground"}`}>{c.count}</sup>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={wrap}
        onPointerEnter={(ev) => ev.pointerType === "mouse" && (engine.current.hover = true)}
        onPointerLeave={(ev) => {
          if (ev.pointerType === "mouse") engine.current.hover = false;
          onPointerUp();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(ev) => {
          if (engine.current.moved > 6) {
            ev.preventDefault();
            ev.stopPropagation();
          }
          engine.current.moved = 0;
        }}
        onDragStart={(ev) => ev.preventDefault()}
        onFocus={onFocus}
        onBlur={() => (engine.current.focus = !!selected)}
        className="relative mt-10 cursor-grab touch-pan-y select-none overflow-hidden py-2 active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [&_img]:pointer-events-none"
      >
        <div
          ref={rail}
          key={active}
          className="grid motion-safe:animate-fade-up [--pad:1rem] [--w:300px] sm:[--pad:1.5rem] sm:[--w:340px] lg:[--pad:max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:[--w:360px]"
        >
          {slides.map(({ car, clone }, i) => (
            <div
              key={`${car.id}-${i}`}
              data-slide
              aria-hidden={clone || undefined}
              {...(clone ? { inert: "" as unknown as boolean } : {})}
              style={{ ["--i" as string]: i }}
              className="w-[var(--w)] will-change-transform [grid-area:1/1] [transform:translateX(calc(var(--pad)+var(--i)*(var(--w)+20px)))]"
            >
              <CarCard car={car} onSelect={setSelected} imageSizes="(max-width: 639px) 300px, 360px" />
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="mt-12 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:mt-16"
      >
        <div className="flex w-max shrink-0 items-center motion-safe:animate-marquee [animation-direction:reverse] [animation-duration:70s]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {brands.map((b) => (
                <span key={`${k}-${b}`} className="flex items-center">
                  <span className="text-outline px-8 font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-none tracking-tight text-foreground/20">
                    {b}
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-brand/50" />
                </span>
              ))}
            </div>
          ))}
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
