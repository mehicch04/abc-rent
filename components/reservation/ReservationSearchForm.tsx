"use client";

import { useEffect, useRef, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { MapPin, CalendarDays, Clock, ArrowRight, AlertCircle, ChevronDown, Repeat2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { DateField } from "@/components/ui/DateField";
import { useReturnAfterPickup } from "@/hooks/useReturnAfterPickup";

type SimpleLocation = { id: string; name: string; city: string };

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


export function ReservationSearchForm({ locations }: { locations: SimpleLocation[] }) {
  const t = useTranslations("Search");
  const locale = useLocale();
  const router = useRouter();

  const [sameLocation, setSameLocation] = useState(true);
  const [pickupLocationId, setPickupLocationId] = useState("");
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
    setPickupDate((v) => v || dateOffset(1));
    setReturnDate((v) => v || dateOffset(3));
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
    router.push(`/vozila?${params.toString()}`);
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
