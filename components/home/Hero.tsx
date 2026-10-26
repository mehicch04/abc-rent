"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, MousePointerClick, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale, type AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { useCompany } from "@/components/company/CompanyProvider";
import { Price } from "@/components/currency/Price";
import { TRANSMISSION_LABELS, label } from "@/lib/car-labels";
import type { CarListItem } from "@/lib/types";
import { STAGE, STAGE_CARS, STAGE_MOB } from "./hero-stage";
import { useCarFrame } from "@/components/fleet/useCarFrame";

type Spot = (typeof STAGE_CARS)[number] & { car: CarListItem };
type Key = Spot["key"];

const short = (title: string) => {
  const out: string[] = [];
  for (const w of title.split(/\s+/)) {
    out.push(w);
    if (out.filter((x) => x.length > 1).length >= 2) break;
  }
  return out.join(" ");
};

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
const DESK = { x: 0, y: 0, w: STAGE.w, h: 1443 };
const MOB = STAGE_MOB;

function Thumb({ src, on }: { src?: string; on: boolean }) {
  const { frame, ready, onLoad, onError } = useCarFrame(src, 72 / 44);
  const fit = frame && !frame.photo ? frame : null;
  return (
    <span className={`relative h-11 w-[72px] shrink-0 overflow-hidden rounded-xl bg-white transition-shadow duration-300 ${on ? "shadow-[inset_0_0_0_1px_rgba(8,121,184,0.25)]" : ""}`}>
      {src && (
        <span className={`absolute inset-0 transition-[opacity,transform] duration-300 ${ready ? "opacity-100" : "opacity-0"} ${fit ? "" : "p-1"} ${on ? "scale-110" : "group-hover/p:scale-105"}`}>
          <span className="absolute inset-0" style={fit ? { transformOrigin: fit.origin, transform: fit.transform } : undefined}>
            <Image src={src} alt="" fill sizes="256px" quality={90} onLoad={onLoad} onError={onError} className={`mix-blend-multiply ${frame?.photo ? "object-cover" : "object-contain"}`} />
          </span>
        </span>
      )}
    </span>
  );
}

function Stage({
  spots,
  active,
  mode,
  onEnter,
  onLeave,
  onPick,
  onReset,
  svgRef,
}: {
  spots: Spot[];
  active: Key | null;
  mode: "full" | "crop";
  onEnter: (k: Key) => void;
  onLeave: () => void;
  onPick: (k: Key) => void;
  onReset: () => void;
  svgRef?: React.Ref<SVGSVGElement>;
}) {
  const box = mode === "crop" ? MOB : DESK;
  return (
    <svg ref={svgRef} viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} preserveAspectRatio={mode === "crop" ? "xMidYMid slice" : "none"} className="absolute inset-0 h-full w-full" aria-hidden>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="transparent" className={active ? "cursor-pointer" : ""} onClick={onReset} />
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="#0B1220" className="pointer-events-none transition-opacity duration-500" opacity={active ? 0.58 : 0} />
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
          onPointerEnter={(e) => e.pointerType === "mouse" && onEnter(s.key)}
          onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
          onClick={(e) => {
            e.stopPropagation();
            onPick(s.key);
          }}
        />
      ))}
    </svg>
  );
}

function Dots({ spots, box, active }: { spots: Spot[]; box: { x: number; y: number; w: number; h: number }; active: Key | null }) {
  return (
    <>
      {spots.map((s) => (
        <span
          key={s.key}
          aria-hidden
          style={{ left: `${((s.tag[0] - box.x) / box.w) * 100}%`, top: `${((s.tag[1] + s.h * 0.14 - box.y) / box.h) * 100}%` }}
          className={`pointer-events-none absolute grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`}
        >
          <span className="absolute inset-0 rounded-full bg-brand-300/60 motion-safe:animate-ping" />
          <span className="relative h-3.5 w-3.5 rounded-full border-[3px] border-white bg-brand shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
        </span>
      ))}
    </>
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
  const dragging = useRef(false);
  const pinned = useRef<Key | null>(null);
  const [focus, setFocus] = useState(0);

  const enter = useCallback((k: Key) => {
    clearTimeout(leaveT.current);
    setActive(k);
  }, []);
  const leave = useCallback(() => {
    clearTimeout(leaveT.current);
    leaveT.current = setTimeout(() => setActive(pinned.current), 160);
  }, []);
  const userPick = useRef(false);
  const pick = useCallback((k: Key) => {
    clearTimeout(leaveT.current);
    pinned.current = k;
    userPick.current = true;
    setActive(k);
    setFocus((n) => n + 1);
    requestAnimationFrame(() => {
      const ul = [...(root.current?.querySelectorAll<HTMLUListElement>("[data-picker]") ?? [])].find((u) => u.offsetParent);
      ul?.querySelector<HTMLElement>(`[data-key="${k}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }, []);
  const reset = useCallback(() => {
    clearTimeout(leaveT.current);
    pinned.current = null;
    setActive(null);
  }, []);

  const place = useCallback(() => {
    const box = root.current?.getBoundingClientRect();
    const s = spots.find((x) => x.key === active);
    const svg = svgFull.current && svgFull.current.getBoundingClientRect().width > 0 ? svgFull.current : null;
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
    let seen = true;
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting), { threshold: 0.35 });
    if (root.current) io.observe(root.current);
    const step = () => {
      if (!seen) {
        id = setTimeout(step, 1200);
        return;
      }
      if (i >= keys.length) return setActive(pinned.current);
      setActive(keys[i]);
      i++;
      id = setTimeout(step, canHover ? 1300 : 1500);
    };
    id = setTimeout(step, 1400);
    const stop = () => clearTimeout(id);
    const events = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
    events.forEach((ev) => window.addEventListener(ev, stop, { once: true, passive: true }));
    return () => {
      stop();
      io.disconnect();
      events.forEach((ev) => window.removeEventListener(ev, stop));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hoverable) return;
    if (userPick.current) {
      userPick.current = false;
      return;
    }
    root.current?.querySelectorAll<HTMLUListElement>("[data-picker]").forEach((ul) => {
      if (!ul.offsetParent || dragging.current) return;
      if (!active) return ul.scrollTo({ left: 0, behavior: "smooth" });
      const li = ul.querySelector<HTMLElement>(`[data-key="${active}"]`);
      if (!li) return;
      const a = li.getBoundingClientRect();
      const b = ul.getBoundingClientRect();
      ul.scrollBy({ left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: "smooth" });
    });
  }, [active, hoverable]);

  const tag = spots.find((s) => s.key === active);

  const picker = (
    <ul data-picker onTouchStart={() => (dragging.current = true)} onTouchEnd={() => (dragging.current = false)} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] xl:mx-0 xl:overflow-visible xl:px-0 xl:pb-0">
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
              key={on ? `on-${focus}` : "off"}
              className={`group/p flex items-center gap-2.5 rounded-2xl py-1.5 pe-3 ps-2 ring-1 transition-[background-color,color,box-shadow,opacity] duration-300 ${
                on
                  ? "bg-white text-ink shadow-[0_14px_34px_-14px_rgba(30,164,233,0.75)] ring-2 ring-brand-300 motion-safe:animate-[hero-focus_0.5s_cubic-bezier(0.22,1,0.36,1)]"
                  : `bg-white/[0.08] text-white ring-white/15 hover:bg-white/[0.13] ${active ? "opacity-60 xl:opacity-100" : ""}`
              }`}
            >
              <Thumb src={s.car.images?.[0]} on={on} />
              <span className="whitespace-nowrap leading-tight">
                <span className="block text-[13px] font-semibold">{short(s.car.title)}</span>
                {s.car.pricePerDay != null && (
                  <span className={`block text-xs ${on ? "text-ink/60" : "text-white/60"}`}>
                    {tc("from")} <Price bam={s.car.pricePerDay} className={`font-semibold ${on ? "text-brand-strong" : "text-white"}`} /> / {tc("perDay")}
                  </span>
                )}
              </span>
              <span className={`ms-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-300 xl:hidden ${on ? "bg-brand text-white" : "bg-white/10 text-white/70"}`}>
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section className="px-3 pt-3 sm:px-4">
      <div ref={root} className="relative isolate overflow-hidden rounded-[32px] bg-ink lg:flex lg:min-h-[calc(45vw+90px)] lg:flex-col xl:min-h-[max(660px,calc(49vw-100px))]">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_40%_at_20%_60%,rgba(8,121,184,0.22),transparent_70%)] xl:hidden" />
        <div className="absolute inset-0 -z-10 hidden xl:block">
          <div className="absolute left-[calc(4.27%+243px)] top-0 aspect-[2576/1443] w-[calc(121.95%-488px)]">
            <picture>
              <source media="(min-width: 1280px)" srcSet="/img/hero/sebilj-1920.webp 1920w, /img/hero/sebilj-2576.webp 2576w" sizes="96vw" type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt={t("imageAlt")}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
            {spots.length > 0 && <Stage spots={spots} active={active} mode="full" onEnter={enter} onLeave={leave} onPick={pick} onReset={reset} svgRef={svgFull} />}
            {spots.length > 0 && <Dots spots={spots} box={DESK} active={active} />}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[48%] bg-[linear-gradient(90deg,rgba(11,18,32,0.7)_0%,rgba(11,18,32,0.45)_45%,rgba(11,18,32,0.18)_75%,rgba(11,18,32,0)_100%)]" />
        </div>

        {spots.length > 0 && (
          <div className="relative aspect-[1380/1150] w-full overflow-hidden sm:aspect-[16/10] lg:absolute lg:end-0 lg:top-0 lg:aspect-[1380/1150] lg:w-[60%] lg:[mask-image:linear-gradient(90deg,transparent,#000_34%)] lg:rtl:[mask-image:linear-gradient(270deg,transparent,#000_34%)] xl:hidden">
            <div className="absolute inset-0 [container-type:size]">
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  width: `max(100cqw, 100cqh * ${MOB.w / MOB.h})`,
                  aspectRatio: `${MOB.w} / ${MOB.h}`,
                  top: `calc((100cqh - max(100cqw * ${MOB.h / MOB.w}, 100cqh)) / 2)`,
                }}
              >
                <picture>
                  <source media="(max-width: 1279.98px)" srcSet="/img/hero/sebilj-mob.webp" type="image/webp" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    alt={t("imageAlt")}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 h-full w-full"
                  />
                </picture>
                <Stage spots={spots} active={active} mode="crop" onEnter={enter} onLeave={leave} onPick={pick} onReset={reset} svgRef={svgCrop} />
                <Dots spots={spots} box={MOB} active={active} />
              </div>
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
          </div>
        )}

        <div className="pointer-events-none relative z-10 mx-auto -mt-10 flex w-full max-w-6xl flex-col px-5 pb-28 sm:-mt-14 sm:px-6 sm:pb-32 lg:mt-0 lg:flex-1 lg:justify-center lg:pt-14 xl:pb-32 xl:pt-10">
          <div className="pointer-events-auto max-w-xl text-white lg:max-w-[470px] xl:max-w-[480px] xl:rtl:self-end 2xl:max-w-[520px]">
            <a
              href={company.map.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="motion-safe:animate-rise hidden items-center gap-2.5 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-xs font-semibold xl:inline-flex text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/[0.14]"
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
              className="motion-safe:animate-rise font-display text-[2.2rem] font-semibold leading-[1.03] tracking-[-0.04em] xl:mt-6 sm:text-6xl lg:text-[3rem] xl:text-[3.3rem] 2xl:text-[3.7rem]"
            >
              <span className="block [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]">{t("titleA")}</span>
              <span className="block bg-gradient-to-r from-[#82CEF6] via-[#2BB0F0] to-[#82CEF6] bg-clip-text pb-[0.08em] text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone] [filter:drop-shadow(0_2px_22px_rgba(8,121,184,0.45))] rtl:bg-gradient-to-l">
                {t("titleB")}
              </span>
            </h1>

            <p style={{ animationDelay: "120ms" }} className="motion-safe:animate-rise mt-4 max-w-md text-[15px] leading-relaxed text-white/85 sm:mt-5 sm:text-[17px]">
              {t("subtitle")}
            </p>

            {spots.length > 0 && <div className="mt-6 xl:hidden">{picker}</div>}

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
              <div style={{ animationDelay: "240ms" }} className="motion-safe:animate-rise mt-8 hidden xl:block">
                <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55 rtl:normal-case rtl:tracking-normal">
                  <MousePointerClick className="h-3.5 w-3.5 text-brand-300" />
                  {t("pickHint")}
                </p>
                {picker}
              </div>
            )}
          </div>

        </div>

        {tag && pos && <Tag s={tag} pos={pos} onEnter={() => enter(tag.key)} onLeave={leave} />}
      </div>
    </section>
  );
}
