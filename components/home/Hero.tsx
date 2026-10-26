"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, MousePointerClick, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale, type AppLocale } from "@/i18n/routing";
import { Link, useRouter } from "@/i18n/navigation";
import { useCompany } from "@/components/company/CompanyProvider";
import { Price } from "@/components/currency/Price";
import { TRANSMISSION_LABELS, label } from "@/lib/car-labels";
import type { CarListItem } from "@/lib/types";
import { STAGE, STAGE_CARS } from "./hero-stage";

type Spot = (typeof STAGE_CARS)[number] & { car: CarListItem };
type Key = Spot["key"];

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
const CROP = { x: 1150, y: 880, w: 1378, h: 1004 };

function Stage({
  spots,
  active,
  mode,
  onEnter,
  onLeave,
  onPick,
  svgRef,
}: {
  spots: Spot[];
  active: Key | null;
  mode: "full" | "crop";
  onEnter: (k: Key) => void;
  onLeave: () => void;
  onPick: (s: Spot, touch: boolean) => void;
  svgRef?: React.Ref<SVGSVGElement>;
}) {
  const touch = useRef(false);
  const vb = mode === "crop" ? `${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}` : `0 0 ${STAGE.w} ${STAGE.h}`;
  return (
    <svg ref={svgRef} viewBox={vb} preserveAspectRatio={mode === "crop" ? "xMidYMid slice" : "xMaxYMax slice"} className="absolute inset-0 h-full w-full" aria-hidden>
      {mode === "crop" && <image href="/img/hero/stage-m.webp" x={CROP.x} y={CROP.y} width={CROP.w} height={CROP.h} preserveAspectRatio="none" />}
      <rect x={0} y={0} width={STAGE.w} height={STAGE.h} fill="#0B1220" className="pointer-events-none transition-opacity duration-500" opacity={active ? 0.58 : 0} />
      {spots.map((s) => {
        const on = active === s.key;
        return (
          <image
            key={s.key}
            href={s.img}
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            preserveAspectRatio="none"
            className="pointer-events-none"
            style={{
              opacity: on ? 1 : 0,
              transformBox: "fill-box",
              transformOrigin: "50% 100%",
              transform: on ? "scale(1.025)" : "scale(1)",
              filter: on ? "brightness(1.14) saturate(1.06) drop-shadow(0 0 22px rgba(30,164,233,0.55))" : "none",
              transition: "opacity 450ms ease, transform 600ms cubic-bezier(0.22,1,0.36,1), filter 450ms ease",
            }}
          />
        );
      })}
      {spots.map((s) => (
        <path
          key={s.key}
          d={s.path}
          fill="transparent"
          className="cursor-pointer"
          onPointerDown={(e) => (touch.current = e.pointerType !== "mouse")}
          onPointerEnter={(e) => e.pointerType === "mouse" && onEnter(s.key)}
          onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
          onClick={() => onPick(s, touch.current)}
        />
      ))}
      {spots.map((s) => (
        <g key={s.key} className={`pointer-events-none transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`}>
          <circle cx={s.tag[0]} cy={s.tag[1] + 46} r={mode === "crop" ? 15 : 11} fill="#1EA4E9" stroke="#fff" strokeWidth={mode === "crop" ? 5 : 4} />
          <circle cx={s.tag[0]} cy={s.tag[1] + 46} r={mode === "crop" ? 15 : 11} fill="none" stroke="#7FD0F7" strokeWidth={3} className="origin-center [transform-box:fill-box] motion-safe:animate-[hero-ping_2.2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        </g>
      ))}
    </svg>
  );
}

function Tag({ s, pos, onEnter, onLeave }: { s: Spot; pos: { x: number; y: number }; onEnter: () => void; onLeave: () => void }) {
  const tc = useTranslations("Common");
  const tf = useTranslations("Fleet");
  const locale = useLocale() as AppLocale;
  return (
    <Link
      href={`/vozila/${s.slug}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ left: pos.x, top: pos.y }}
      className="group/tag absolute z-20 flex -translate-x-1/2 -translate-y-[calc(100%+14px)] items-center gap-3 whitespace-nowrap rounded-2xl bg-white/95 py-2 pe-2 ps-4 text-ink shadow-[0_24px_50px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/60 backdrop-blur motion-safe:animate-[hero-tag_0.35s_cubic-bezier(0.22,1,0.36,1)_both]"
    >
      <span className="leading-tight">
        <span className="block text-sm font-semibold">{s.car.title}</span>
        <span className="block text-xs text-ink/60">
          {s.car.passengers} {tf("cardSeats")} · {label(TRANSMISSION_LABELS[s.car.transmission], locale)}
          {s.car.pricePerDay != null && (
            <>
              {" · "}
              {tc("from")} <Price bam={s.car.pricePerDay} className="font-semibold text-ink" /> / {tc("perDay")}
            </>
          )}
        </span>
      </span>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-white transition-transform duration-300 group-hover/tag:rotate-45">
        <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
      </span>
      <span aria-hidden className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 rounded-[3px] bg-white/95" />
    </Link>
  );
}

export function Hero({ cars }: { cars: CarListItem[] }) {
  const t = useTranslations("Hero");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const company = useCompany();
  const count = company.rating.count ?? 0;
  const score = (company.rating.score ?? 5).toLocaleString(intlLocale(locale), { minimumFractionDigits: 1 });
  const perks = t.raw("perks") as string[];

  const spots: Spot[] = STAGE_CARS.flatMap((s) => {
    const car = cars.find((c) => c.slug === s.slug);
    return car ? [{ ...s, car }] : [];
  });

  const [active, setActive] = useState<Key | null>(null);
  const [hoverable, setHoverable] = useState(true);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const svgFull = useRef<SVGSVGElement>(null);
  const svgCrop = useRef<SVGSVGElement>(null);
  const leaveT = useRef<ReturnType<typeof setTimeout>>();

  const enter = useCallback((k: Key) => {
    clearTimeout(leaveT.current);
    setActive(k);
  }, []);
  const leave = useCallback(() => {
    clearTimeout(leaveT.current);
    leaveT.current = setTimeout(() => setActive(null), 160);
  }, []);
  const pick = (s: Spot, touch: boolean) => {
    if (!touch || active === s.key) router.push(`/vozila/${s.slug}`);
    else enter(s.key);
  };

  const place = useCallback(() => {
    const box = root.current?.getBoundingClientRect();
    const s = spots.find((x) => x.key === active);
    const svg = [svgFull.current, svgCrop.current].find((el) => el && el.getBoundingClientRect().width > 0);
    const m = svg?.getScreenCTM();
    if (!box || !s || !svg || !m) return setPos(null);
    const p = new DOMPoint(s.tag[0], s.tag[1]).matrixTransform(m);
    const top = svg.getBoundingClientRect().top - box.top;
    setPos({ x: Math.min(Math.max(p.x - box.left, 170), box.width - 170), y: Math.max(p.y - box.top, top + 78, 90) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useIso(place, [place]);
  useEffect(() => {
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setHoverable(canHover);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || spots.length === 0) return;
    const keys = spots.map((s) => s.key);
    let i = 0;
    let id: ReturnType<typeof setTimeout>;
    const step = () => {
      if (canHover && i >= keys.length) return setActive(null);
      setActive(keys[i % keys.length]);
      i++;
      id = setTimeout(step, canHover ? 1300 : 3200);
    };
    id = setTimeout(step, 1400);
    const stop = () => clearTimeout(id);
    window.addEventListener("pointerdown", stop, { once: true });
    window.addEventListener("wheel", stop, { once: true, passive: true });
    return () => {
      stop();
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("wheel", stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active || hoverable) return;
    root.current?.querySelectorAll<HTMLUListElement>("[data-picker]").forEach((ul) => {
      const li = ul.querySelector<HTMLElement>(`[data-key="${active}"]`);
      if (ul.offsetParent && li) ul.scrollTo({ left: li.offsetLeft - ul.offsetLeft - 8, behavior: "smooth" });
    });
  }, [active, hoverable]);

  const tag = spots.find((s) => s.key === active);

  const picker = (
    <ul data-picker className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:pb-0">
      {spots.map((s) => {
        const on = active === s.key;
        return (
          <li key={s.key} data-key={s.key} className="shrink-0">
            <Link
              href={`/vozila/${s.slug}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && enter(s.key)}
              onPointerLeave={(e) => e.pointerType === "mouse" && leave()}
              onFocus={() => enter(s.key)}
              onBlur={leave}
              className={`group/p flex items-center gap-3 rounded-2xl py-2 pe-3 ps-2 ring-1 transition-all duration-300 ${
                on ? "bg-white text-ink ring-white" : "bg-white/[0.07] text-white ring-white/15 backdrop-blur-md hover:bg-white/[0.12]"
              }`}
            >
              <span className={`relative h-10 w-14 shrink-0 overflow-hidden rounded-xl transition-colors ${on ? "bg-[#EEF4F9]" : "bg-white/90"}`}>
                {s.car.images?.[0] && <Image src={s.car.images[0]} alt="" fill sizes="56px" className="object-contain p-0.5 mix-blend-multiply" />}
              </span>
              <span className="leading-tight">
                <span className="block text-[13px] font-semibold">{s.car.title.split(" ").slice(0, 3).join(" ")}</span>
                {s.car.pricePerDay != null && (
                  <span className={`block text-xs ${on ? "text-ink/60" : "text-white/60"}`}>
                    {tc("from")} <Price bam={s.car.pricePerDay} className={`font-semibold ${on ? "text-brand-strong" : "text-white"}`} /> / {tc("perDay")}
                  </span>
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section className="px-3 pt-3 sm:px-4">
      <div ref={root} className="relative isolate overflow-hidden rounded-[32px] bg-ink lg:flex lg:min-h-[clamp(640px,calc(100vh-120px),800px)] lg:flex-col">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(8,121,184,0.35),transparent_60%)] lg:hidden" />
        <div className="absolute inset-0 -z-10 hidden lg:block">
          <Image
            src="/img/hero/bascarsija.webp"
            alt={t("imageAlt")}
            fill
            priority
            sizes="(min-width: 1024px) 100vw, 16px"
            quality={78}
            className="object-cover object-[100%_100%]"
          />
          <div aria-hidden className="absolute inset-y-0 left-0 w-[66%] bg-gradient-to-r from-ink via-ink/80 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
          {spots.length > 0 && <Stage spots={spots} active={active} mode="full" onEnter={enter} onLeave={leave} onPick={pick} svgRef={svgFull} />}
        </div>

        <div className="pointer-events-none relative mx-auto flex w-full max-w-6xl flex-col px-5 pb-28 pt-9 sm:px-6 sm:pb-32 sm:pt-14 lg:flex-1 lg:justify-center lg:pb-32 lg:pt-10">
          <div className="pointer-events-auto max-w-xl text-white lg:max-w-[min(640px,52%)] lg:rtl:self-end">
            <a
              href={company.map.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="motion-safe:animate-rise inline-flex items-center gap-2.5 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/[0.14]"
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
              className="motion-safe:animate-rise mt-5 font-display text-[2.2rem] font-semibold leading-[1.03] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:text-[3.3rem] xl:text-[3.75rem] 2xl:text-[4.1rem]"
            >
              <span className="block [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]">{t("titleA")}</span>
              <span className="block bg-gradient-to-r from-[#82CEF6] via-[#2BB0F0] to-[#82CEF6] bg-clip-text pb-[0.08em] text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone] [filter:drop-shadow(0_2px_22px_rgba(8,121,184,0.45))] rtl:bg-gradient-to-l">
                {t("titleB")}
              </span>
            </h1>

            <p style={{ animationDelay: "120ms" }} className="motion-safe:animate-rise mt-4 max-w-md text-[15px] leading-relaxed text-white/85 sm:mt-5 sm:text-[17px]">
              {t("subtitle")}
            </p>

            <ul style={{ animationDelay: "180ms" }} className="motion-safe:animate-rise mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/90">
              {perks.map((x) => (
                <li key={x} className="inline-flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-white">
                    <Check className="h-3 w-3" strokeWidth={3.5} />
                  </span>
                  {x}
                </li>
              ))}
            </ul>

            {spots.length > 0 && (
              <div style={{ animationDelay: "240ms" }} className="motion-safe:animate-rise mt-8 hidden lg:block">
                <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55 rtl:normal-case rtl:tracking-normal">
                  <MousePointerClick className="h-3.5 w-3.5 text-brand-300" />
                  {t("pickHint")}
                </p>
                {picker}
              </div>
            )}
          </div>

          {spots.length > 0 && (
            <div className="pointer-events-auto mt-8 lg:hidden">
              <div className="relative aspect-[1378/1004] overflow-hidden rounded-[22px] ring-1 ring-white/10">
                <Stage spots={spots} active={active} mode="crop" onEnter={enter} onLeave={leave} onPick={pick} svgRef={svgCrop} />
                <span className="pointer-events-none absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">
                  <MousePointerClick className="h-3.5 w-3.5 text-brand-300" />
                  {hoverable ? t("pickHint") : t("tapHint")}
                </span>
              </div>
              <div className="mt-3">{picker}</div>
            </div>
          )}
        </div>

        {tag && pos && <Tag s={tag} pos={pos} onEnter={() => enter(tag.key)} onLeave={leave} />}
      </div>
    </section>
  );
}
