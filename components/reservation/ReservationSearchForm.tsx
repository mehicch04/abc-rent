"use client";

import { useEffect, useRef, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { MapPin, CalendarDays, Clock, ArrowRight, AlertCircle, ChevronDown, Repeat2, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { DateField } from "@/components/ui/DateField";
import { useReturnAfterPickup } from "@/hooks/useReturnAfterPickup";
import { track } from "@/lib/track";

type SimpleLocation = { id: string; name: string; city: string; slug?: string };

const pad = (n: number) => String(n).padStart(2, "0");

/** Local `YYYY-MM-DD`. */
function dateOffset(days = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 24-hour, 30-minute slots: 00:00 → 23:30. Always 24h, no AM/PM, all browsers.
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => `${pad(Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`);

const CONTROL =
  "h-12 w-full min-w-0 rounded-xl border border-border bg-background px-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] focus:border-brand focus:ring-2 focus:ring-ring/30 sm:text-sm";
const DATE_CONTROL = `${CONTROL} flex-1`;
const LBL =
  "mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground";

/** Select with a custom, always-aligned chevron (consistent across browsers). */
function StyledSelect({
  id,
  value,
  onChange,
  children,
  ariaLabel,
  disabled,
  selectRef,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  selectRef?: React.Ref<HTMLSelectElement>;
}) {
  return (
    <div className="relative">
      <select
        ref={selectRef}
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={`${CONTROL} appearance-none pe-10`}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}


export function ReservationSearchForm({ locations, variant = "card" }: { locations: SimpleLocation[]; variant?: "card" | "bar" }) {
  const t = useTranslations("Search");
  const locale = useLocale();
  const router = useRouter();

  const [sameLocation, setSameLocation] = useState(true);
  const [pickupLocationId, setPickupLocationId] = useState(
    () => (locations.find((l) => l.slug === "aerodrom-sarajevo") ?? locations[0])?.id ?? "",
  );
  const [returnLocationId, setReturnLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("09:00");
  const [today, setToday] = useState("");
  const [error, setError] = useState<string | null>(null);
  const returnRef = useRef<HTMLSelectElement>(null);

  useReturnAfterPickup(pickupDate, returnDate, setReturnDate);

  useEffect(() => {
    setToday(dateOffset(0));
    const q = new URLSearchParams(window.location.search);
    const known = (id: string | null) => (id && locations.some((l) => l.id === id) ? id : null);
    const split = (iso: string | null) => {
      const d = iso ? new Date(iso) : null;
      if (!d || Number.isNaN(d.getTime()) || d.getTime() < Date.now() - 864e5) return null;
      const p = (n: number) => String(n).padStart(2, "0");
      return [`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`, `${p(d.getHours())}:${p(d.getMinutes())}`] as const;
    };
    const pl = known(q.get("pickupLocationId"));
    const rl = known(q.get("returnLocationId"));
    if (pl) setPickupLocationId(pl);
    if (rl && rl !== pl) {
      setSameLocation(false);
      setReturnLocationId(rl);
    }
    const pa = split(q.get("pickupAt"));
    const ra = split(q.get("returnAt"));
    if (pa && ra) {
      setPickupDate(pa[0]);
      setPickupTime(pa[1]);
      setReturnDate(ra[0]);
      setReturnTime(ra[1]);
      return;
    }
    setPickupDate((v) => v || dateOffset(1));
    setReturnDate((v) => v || dateOffset(3));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveReturnId = sameLocation ? pickupLocationId : returnLocationId;
  const pickupName = locations.find((l) => l.id === pickupLocationId)?.name;

  function pickOtherReturn() {
    setSameLocation(false);
    requestAnimationFrame(() => returnRef.current?.focus());
  }

  function handleSubmit() {
    setError(null);
    if (!pickupLocationId || !effectiveReturnId) {
      setError(t("errRequired"));
      return;
    }
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    if (end <= start) {
      setError(t("errOrder"));
      return;
    }
    const params = new URLSearchParams({
      pickupLocationId,
      returnLocationId: effectiveReturnId,
      pickupAt: start.toISOString(),
      returnAt: end.toISOString(),
    });
    track("search", {
      search_term: locations.find((l) => l.id === pickupLocationId)?.name ?? "",
      pickup_date: pickupDate,
      return_date: returnDate,
    });
    router.push(`/vozila?${params.toString()}`);
  }

  if (variant === "bar") {
    const SEG = "flex min-w-0 items-center gap-3 px-4 py-3 lg:py-2";
    const CAP = "block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground rtl:normal-case rtl:tracking-normal";
    const BARE = "min-w-0 cursor-pointer appearance-none bg-transparent p-0 text-[15px] font-medium text-foreground outline-none";
    const dateSeg = (
      label: string,
      Icon: typeof CalendarDays,
      date: string,
      min: string,
      setDate: (v: string) => void,
      time: string,
      setTime: (v: string) => void,
    ) => (
      <div className={SEG}>
        <Icon className="h-4 w-4 shrink-0 text-brand" />
        <div className="min-w-0 flex-1">
          <span className={CAP}>{label}</span>
          <div className="flex items-center gap-1.5">
            <DateField compact value={date} min={min} locale={locale} onChange={setDate} className="h-6 min-w-0 shrink text-[15px] font-medium text-foreground outline-none focus-visible:underline [&>svg]:hidden" />
            <span aria-hidden className="text-muted-foreground">·</span>
            <span className="relative shrink-0">
              <select value={time} onChange={(e) => setTime(e.target.value)} aria-label={`${label} – ${t("time")}`} className={`${BARE} pe-5 tabular-nums focus-visible:underline`}>
                {TIME_SLOTS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>
    );

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full"
      >
        <div className="rounded-[26px] bg-surface p-2 text-start shadow-[0_40px_80px_-40px_rgba(0,0,0,0.75)] lg:rounded-full">
          <div className="grid divide-y divide-border lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-center lg:divide-x lg:divide-y-0 rtl:lg:divide-x-reverse">
            <div className={SEG}>
              <MapPin className="h-4 w-4 shrink-0 text-brand" />
              <div className="min-w-0 flex-1">
                <label htmlFor="pickup-loc" className={CAP}>
                  {t("pickupLocation")}
                </label>
                <span className="relative block">
                  <select id="pickup-loc" value={pickupLocationId} onChange={(e) => setPickupLocationId(e.target.value)} className={`${BARE} w-full truncate pe-6 focus-visible:underline`}>
                    <option value="" disabled>
                      {t("placeholder")}
                    </option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </span>
              </div>
            </div>
            {dateSeg(t("pickupDate"), CalendarDays, pickupDate, today, setPickupDate, pickupTime, setPickupTime)}
            {dateSeg(t("returnDate"), Clock, returnDate, pickupDate, setReturnDate, returnTime, setReturnTime)}
            <div className="pt-2 lg:ps-2 lg:pt-0 rtl:lg:pe-2 rtl:lg:ps-0">
              <button
                type="submit"
                className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-brand px-7 text-[15px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(8,121,184,0.9)] transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-auto lg:rounded-full"
              >
                <Search className="h-4 w-4" />
                {t("search")}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex min-h-10 flex-wrap items-center justify-center gap-x-4 gap-y-3">
          <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm text-white/80">
            <input
              type="checkbox"
              checked={sameLocation}
              onChange={(e) => {
                setSameLocation(e.target.checked);
                if (!e.target.checked) requestAnimationFrame(() => returnRef.current?.focus());
              }}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="relative h-5 w-9 shrink-0 rounded-full bg-white/25 transition-colors duration-300 after:absolute after:start-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] peer-checked:bg-brand peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-white/60"
            />
            {t("sameLocation")}
          </label>
          <AnimatePresence initial={false}>
            {!sameLocation && (
              <motion.span
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative inline-flex"
              >
                <MapPin className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
                <select
                  ref={returnRef}
                  id="return-loc"
                  aria-label={t("returnLocation")}
                  value={returnLocationId}
                  onChange={(e) => setReturnLocationId(e.target.value)}
                  className="h-10 max-w-[78vw] cursor-pointer appearance-none truncate rounded-full bg-white/10 pe-9 ps-10 text-sm font-medium text-white outline-none ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 [&>option]:text-ink"
                >
                  <option value="" disabled>
                    {t("returnLocation")}
                  </option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-rose-300/40"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      style={{ animationDelay: "200ms" }}
      className="w-full rounded-2xl border border-border bg-surface p-5 shadow-[0_24px_60px_-40px_rgba(11,18,32,0.45)] motion-safe:animate-rise sm:p-6"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pickup-loc" className={LBL}>
              <MapPin className="h-3.5 w-3.5 text-brand" />
              {t("pickupLocation")}
            </label>
            <StyledSelect id="pickup-loc" value={pickupLocationId} onChange={setPickupLocationId}>
              <option value="" disabled>
                {t("placeholder")}
              </option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </StyledSelect>
          </div>

          <div>
            <label htmlFor="return-loc" className={LBL}>
              <MapPin className="h-3.5 w-3.5 text-brand" />
              {t("returnLocation")}
            </label>
            <div className="relative">
              <div
                aria-hidden={sameLocation}
                className={`transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  sameLocation ? "pointer-events-none translate-y-1 opacity-0" : "translate-y-0 opacity-100"
                }`}
              >
                <StyledSelect
                  id="return-loc"
                  value={returnLocationId}
                  onChange={setReturnLocationId}
                  disabled={sameLocation}
                  selectRef={returnRef}
                >
                  <option value="" disabled>
                    {t("placeholder")}
                  </option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </StyledSelect>
              </div>
              <button
                type="button"
                onClick={pickOtherReturn}
                tabIndex={sameLocation ? 0 : -1}
                aria-hidden={!sameLocation}
                className={`group absolute inset-0 flex items-center gap-2.5 rounded-xl border border-dashed border-border bg-surface-muted px-3.5 text-start text-sm transition-[opacity,transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${
                  sameLocation ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <Repeat2 className="h-4 w-4 shrink-0 text-brand" />
                <span className="min-w-0 truncate text-muted-foreground">
                  {t("sameAsPickup")}
                  {pickupName && <span className="text-foreground">{` · ${pickupName}`}</span>}
                </span>
                <span className="ms-auto shrink-0 text-xs font-medium text-brand-strong underline-offset-4 group-hover:underline">
                  {t("change")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dates row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Pickup */}
          <div>
            <label htmlFor="pickup-date" className={LBL}>
              <CalendarDays className="h-3.5 w-3.5 text-brand" />
              {t("pickupDate")}
            </label>
            <div className="flex gap-2">
              <DateField
                value={pickupDate}
                min={today}
                locale={locale}
                onChange={setPickupDate}
                className={DATE_CONTROL}
              />
              <div className="w-28 shrink-0">
                <StyledSelect value={pickupTime} onChange={setPickupTime} ariaLabel={`${t("pickupDate")} – ${t("time")}`}>
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </StyledSelect>
              </div>
            </div>
          </div>

          {/* Return */}
          <div>
            <label htmlFor="return-date" className={LBL}>
              <Clock className="h-3.5 w-3.5 text-brand" />
              {t("returnDate")}
            </label>
            <div className="flex gap-2">
              <DateField
                value={returnDate}
                min={pickupDate}
                locale={locale}
                onChange={setReturnDate}
                className={DATE_CONTROL}
              />
              <div className="w-28 shrink-0">
                <StyledSelect value={returnTime} onChange={setReturnTime} ariaLabel={`${t("returnDate")} – ${t("time")}`}>
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </StyledSelect>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: same-location toggle + submit */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex cursor-pointer select-none items-center gap-3 self-start text-sm text-foreground/80">
          <input
            type="checkbox"
            checked={sameLocation}
            onChange={(e) => setSameLocation(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="relative h-6 w-11 shrink-0 rounded-full bg-foreground/15 transition-colors duration-300 after:absolute after:start-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] peer-checked:bg-brand peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface"
          />
          {t("sameLocation")}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                className="flex items-center gap-1.5 text-sm font-medium text-brand-strong"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
          >
            {t("search")}
            <ArrowRight className="rtl:-scale-x-100 h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </button>
        </div>
      </div>
    </form>
  );
}
