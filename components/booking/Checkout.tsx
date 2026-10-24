"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  MessageSquareText,
  Loader2,
  Package,
  Minus,
  Plus,
  ShieldCheck,
  CarFront,
  TriangleAlert,
  UserRound,
  Wallet,
} from "lucide-react";

import type { CarListItem } from "@/lib/types";
import type { ExtraItem } from "@/lib/extras";
import { extraLineTotal, rentalDays } from "@/lib/extras";
import { extraText } from "@/lib/extras-i18n";
import { availabilityFor, maxSelectable, type Booked } from "@/lib/extras-availability";
import { formatPrice } from "@/lib/currency";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Link } from "@/i18n/navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { DELIVERY_SLUG, bookingHref, overlapsBusy, type BusyRange } from "@/lib/booking";
import { FUEL_LABELS, TRANSMISSION_LABELS, label as pick } from "@/lib/car-labels";
import type { AppLocale } from "@/i18n/routing";
import { CheckoutSummary, type SummaryLine } from "./CheckoutSummary";

type Loc = { id: string; name: string; slug: string } | null;

type Props = {
  car: CarListItem;
  pickupAt: string;
  returnAt: string;
  pickup: Loc;
  ret: Loc;
  extras: ExtraItem[];
  booked: Booked[];
  busy: BusyRange[];
  upsell: { car: CarListItem; diff: number }[];
};

type Field = "firstName" | "lastName" | "phone" | "email" | "flight" | "note";

const INPUT =
  "h-12 w-full min-w-0 rounded-xl border bg-background px-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/60 focus:border-brand focus:ring-2 focus:ring-ring/30 sm:text-sm";

function Card({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[22px] bg-surface p-5 ring-1 ring-border sm:p-6">
      <h2 className="flex items-center gap-2.5 font-display text-base font-semibold text-foreground sm:text-lg">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-brand-strong">{icon}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Choice({
  name,
  checked,
  onChange,
  title,
  note,
  aside,
  disabled,
}: {
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  title: string;
  note?: string;
  aside?: ReactNode;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40 ${
        checked ? "border-brand bg-brand/[0.06]" : "border-border hover:border-foreground/25"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <input type="radio" name={name} checked={checked} disabled={disabled} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          checked ? "border-brand" : "border-foreground/25"
        }`}
      >
        <span className={`h-2.5 w-2.5 rounded-full bg-brand transition-transform ${checked ? "scale-100" : "scale-0"}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        {note && <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{note}</span>}
      </span>
      {aside && <span className="shrink-0 text-sm font-semibold text-foreground">{aside}</span>}
    </label>
  );
}

function Stepper({
  value,
  max,
  onChange,
  name,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  name: string;
}) {
  const te = useTranslations("Extras");
  const btn =
    "grid h-9 w-9 place-items-center rounded-full ring-1 ring-border transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} disabled={value <= 0} onClick={() => onChange(value - 1)} aria-label={te("decrease", { name })}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums text-foreground" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={te("increase", { name })}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Checkout({ car, pickupAt, returnAt, pickup, ret, extras, booked, busy, upsell }: Props) {
  const t = useTranslations("Booking");
  const te = useTranslations("Extras");
  const tf = useTranslations("Fleet");
  const locale = useLocale() as AppLocale;
  const { currency } = useCurrency();
  const price = (v: number) => formatPrice(v, currency);
  const top = useRef<HTMLDivElement>(null);

  const start = useMemo(() => new Date(pickupAt), [pickupAt]);
  const end = useMemo(() => new Date(returnAt), [returnAt]);
  const days = rentalDays(start, end);
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "booked" | "extras">("idle");
  const conflict = overlapsBusy(busy, start, end) || status === "booked";

  const find = (n: string) => extras.find((e) => e.nameEn.trim().toLowerCase() === n);
  const noDeposit = find("no deposit");
  const driver = find("private driver");
  const gear = extras.filter((e) => e.id !== noDeposit?.id && e.id !== driver?.id && e.pricing !== "INCLUDED");

  const free = useMemo(
    () =>
      availabilityFor(
        extras,
        booked.map((x) => ({ ...x, from: new Date(x.from), to: new Date(x.to) })),
        start,
        end,
      ),
    [extras, booked, start, end],
  );
  const [live, setLive] = useState<Record<string, number>>({});
  const freeOf = (e: ExtraItem) => Math.max(0, live[e.id] ?? free[e.id] ?? e.totalStock);
  const cap = (e: ExtraItem) => maxSelectable(e.maxQty, freeOf(e));

  const [form, setForm] = useState<Record<Field, string>>({ firstName: "", lastName: "", phone: "", email: "", flight: "", note: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [skipDeposit, setSkipDeposit] = useState(false);
  const [withDriver, setWithDriver] = useState(false);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [done, setDone] = useState<{ reference: string } | null>(null);

  const setField = (k: Field, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const chosen = [
    ...(skipDeposit && noDeposit ? [{ e: noDeposit, q: 1 }] : []),
    ...(withDriver && driver ? [{ e: driver, q: 1 }] : []),
    ...gear.filter((e) => (qty[e.id] ?? 0) > 0).map((e) => ({ e, q: qty[e.id] })),
  ];

  const rental = (car.pricePerDay ?? 0) * days;
  const lines: SummaryLine[] = chosen.map(({ e, q }) => ({
    label: `${extraText(e, locale).name}${q > 1 ? ` × ${q}` : ""}`,
    amount: extraLineTotal(e.pricing, e.price, q, days),
  }));
  const total = rental + lines.reduce((a, l) => a + l.amount, 0);
  const fee = (l: Loc) => (l?.slug === DELIVERY_SLUG ? t("taxiFee") : t("freeFee"));

  const wa = buildWhatsAppUrl({ car: { title: car.title }, pickupLocation: pickup, returnLocation: ret, pickupAt: start, returnAt: end, locale });

  useEffect(() => {
    if (done || status === "booked") top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (status === "extras") document.getElementById("co-gear")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [done, status]);

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (form.firstName.trim().length < 2) e.firstName = t("errRequired");
    if (form.lastName.trim().length < 2) e.lastName = t("errRequired");
    if (form.phone.replace(/[^\d+]/g, "").length < 6) e.phone = t("errPhone");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = t("errEmail");
    setErrors(e);
    const firstBad = (Object.keys(e) as Field[])[0];
    if (firstBad) document.getElementById(`co-${firstBad}`)?.focus();
    return !firstBad;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (conflict || status === "sending" || !validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          carTitle: car.title,
          pickupLocationId: pickup?.id,
          returnLocationId: ret?.id,
          pickupAt,
          returnAt,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          flightNumber: form.flight.trim(),
          message: form.note.trim(),
          locale,
          currency,
          extras: chosen.map(({ e, q }) => ({ id: e.id, qty: q })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.error === "booked") return setStatus("booked");
      if (data.error === "extras" && data.free) {
        const next: Record<string, number> = data.free;
        setLive((l) => ({ ...l, ...next }));
        setQty((q) => Object.fromEntries(Object.entries(q).map(([id, n]) => [id, Math.min(n, next[id] ?? n)])));
        if (driver && next[driver.id] === 0) setWithDriver(false);
        if (noDeposit && next[noDeposit.id] === 0) setSkipDeposit(false);
        return setStatus("extras");
      }
      if (!res.ok || !data.ok) throw new Error(data.error ?? "failed");
      setDone({ reference: data.reference });
    } catch {
      setStatus("error");
    }
  }

  const steps = t.raw("steps") as string[];
  const active = done ? 2 : 1;

  const field = (k: Field, opts: { label: string; type?: string; auto?: string; hint?: string; optional?: boolean; ph?: string; dir?: "ltr" }) => (
    <div className="min-w-0">
      <label htmlFor={`co-${k}`} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-foreground">
        {opts.label}
        {opts.optional && <span className="text-xs font-normal text-muted-foreground">{t("optional")}</span>}
      </label>
      <input
        id={`co-${k}`}
        type={opts.type ?? "text"}
        autoComplete={opts.auto}
        dir={opts.dir}
        value={form[k]}
        placeholder={opts.ph}
        aria-invalid={Boolean(errors[k])}
        aria-describedby={`co-${k}-d`}
        onChange={(e) => setField(k, e.target.value)}
        className={`${INPUT} ${errors[k] ? "border-rose-500" : "border-border"} ${opts.dir === "ltr" ? "rtl:text-end" : ""}`}
      />
      <p id={`co-${k}-d`} className={`mt-1.5 text-xs ${errors[k] ? "text-rose-600 dark:text-rose-300" : "text-muted-foreground"}`}>
        {errors[k] ?? opts.hint ?? ""}
      </p>
    </div>
  );

  const unit = (e: ExtraItem) => (
    <>
      <bdi dir="ltr">{price(e.price)}</bdi> {e.pricing === "PER_DAY" ? `/ ${t("perDayUnit")}` : t("once")}
    </>
  );

  return (
    <div ref={top} className="scroll-mt-24">
      <ol className="flex items-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm">
        {steps.map((s, i) => {
          const isDone = i < active;
          const isActive = i === active;
          return (
            <li key={s} className="flex min-w-0 items-center gap-2 sm:gap-3">
              {i > 0 && <span aria-hidden className={`h-px w-4 shrink-0 sm:w-10 ${i <= active ? "bg-brand" : "bg-border"}`} />}
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                  isDone ? "bg-brand text-white" : isActive ? "bg-foreground text-background" : "bg-surface-muted text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                aria-current={isActive ? "step" : undefined}
                className={`truncate ${isActive ? "text-foreground" : "text-muted-foreground"} ${isActive ? "" : "hidden sm:inline"}`}
              >
                {s}
              </span>
            </li>
          );
        })}
      </ol>

      {done ? (
        <div className="mx-auto mt-10 max-w-xl rounded-[24px] bg-surface p-6 text-center ring-1 ring-border sm:p-10">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15">
            <Check className="h-7 w-7 text-emerald-700 dark:text-emerald-300" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t("successTitle")}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{t("reference")}</p>
          <p className="mt-1 font-mono text-xl font-semibold tracking-wider text-foreground">
            <bdi dir="ltr">{done.reference}</bdi>
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("successBody", { email: form.email.trim() })}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
              {t("backHome")}
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-[#25D366]"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              {t("waUs")}
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <aside className="min-w-0 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <CheckoutSummary
                car={car}
                pickupAt={pickupAt}
                returnAt={returnAt}
                pickup={pickup}
                ret={ret}
                days={days}
                rental={rental}
                lines={lines}
                pickupFee={fee(pickup)}
                returnFee={fee(ret)}
                total={total}
                skipDeposit={skipDeposit}
                changeHref={`/vozila/${car.slug}?${new URLSearchParams({
                  ...(pickup ? { pickupLocationId: pickup.id } : {}),
                  ...(ret ? { returnLocationId: ret.id } : {}),
                  pickupAt,
                  returnAt,
                }).toString()}#rezervacija`}
              />
            </div>
          </aside>

          <form id="checkout" noValidate onSubmit={submit} className="min-w-0 space-y-5 lg:order-1">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t("title")}</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("lead")}</p>
            </div>

            {conflict && (
              <p role="alert" className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 px-4 py-3.5 text-sm font-medium text-rose-700 dark:text-rose-300">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {t("errBooked")}
              </p>
            )}

            <Card title={t("details")} icon={<UserRound className="h-4 w-4" />}>
              <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                {field("firstName", { label: t("firstName"), auto: "given-name" })}
                {field("lastName", { label: t("lastName"), auto: "family-name" })}
                {field("phone", { label: t("phone"), type: "tel", auto: "tel", hint: t("phoneHint"), ph: "+387 6x xxx xxx", dir: "ltr" })}
                {field("email", { label: t("email"), type: "email", auto: "email", hint: t("emailHint"), dir: "ltr" })}
                {field("flight", { label: t("flight"), hint: t("flightHint"), optional: true, ph: "W6 4217", dir: "ltr" })}
              </div>
            </Card>

            {noDeposit && (
              <Card title={t("depositTitle")} icon={<ShieldCheck className="h-4 w-4" />}>
                <div className="grid gap-2.5">
                  <Choice
                    name="deposit"
                    checked={!skipDeposit}
                    onChange={() => setSkipDeposit(false)}
                    title={t("depositStd")}
                    note={car.deposit != null ? t("depositStdNote", { amount: `⁦${price(car.deposit)}⁩` }) : undefined}
                    aside={<span className="text-muted-foreground">{t("noDaily")}</span>}
                  />
                  <Choice
                    name="deposit"
                    checked={skipDeposit}
                    onChange={() => setSkipDeposit(true)}
                    title={t("depositNone")}
                    note={t("depositNoneNote")}
                    aside={<>+{unit(noDeposit)}</>}
                  />
                </div>
              </Card>
            )}

            {gear.length > 0 && (
              <div id="co-gear" className="scroll-mt-24">
              <Card title={t("equipmentTitle")} icon={<Package className="h-4 w-4" />}>
                <p className="-mt-2 mb-4 text-[13px] text-muted-foreground">{t("equipmentLead")}</p>
                {status === "extras" && (
                  <p role="alert" className="mb-4 flex items-start gap-2 rounded-2xl bg-amber-400/15 px-4 py-3 text-sm font-medium text-amber-800 dark:text-amber-200">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    {t("errExtras")}
                  </p>
                )}
                <ul className="grid gap-2.5">
                  {gear.map((e) => {
                    const x = extraText(e, locale);
                    const max = cap(e);
                    const left = freeOf(e);
                    const v = qty[e.id] ?? 0;
                    const counted = e.totalStock < 20;
                    const pct = counted ? Math.round((left / Math.max(1, e.totalStock)) * 100) : 100;
                    return (
                      <li
                        key={e.id}
                        className={`rounded-2xl border p-4 transition-colors ${
                          v > 0 ? "border-brand bg-brand/[0.06]" : "border-border"
                        } ${left === 0 ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">{x.name}</p>
                            {x.note && <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{x.note}</p>}
                            <p className="mt-1 text-[13px] font-medium text-foreground">{unit(e)}</p>
                          </div>
                          {e.maxQty > 1 ? (
                            <Stepper name={x.name} value={v} max={max} onChange={(n) => setQty((q) => ({ ...q, [e.id]: n }))} />
                          ) : (
                            <label className="relative mt-0.5 inline-flex shrink-0 cursor-pointer items-center">
                              <input
                                type="checkbox"
                                checked={v > 0}
                                disabled={max === 0}
                                onChange={(ev) => setQty((q) => ({ ...q, [e.id]: ev.target.checked ? 1 : 0 }))}
                                aria-label={x.name}
                                className="peer sr-only"
                              />
                              <span
                                aria-hidden
                                className="relative h-6 w-11 rounded-full bg-foreground/15 transition-colors after:absolute after:start-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-brand peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:opacity-40 rtl:peer-checked:after:-translate-x-5"
                              />
                            </label>
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          {counted && (
                            <span aria-hidden className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                              <span
                                className={`block h-full rounded-full ${left === 0 ? "bg-rose-500" : pct <= 34 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </span>
                          )}
                          <span
                            className={`shrink-0 text-xs font-medium ${
                              left === 0
                                ? "text-rose-600 dark:text-rose-300"
                                : counted && pct <= 34
                                  ? "text-amber-700 dark:text-amber-300"
                                  : "text-emerald-700 dark:text-emerald-300"
                            }`}
                          >
                            {left === 0 ? t("stockNone") : counted ? t("stock", { free: left, total: e.totalStock }) : t("stockAlways")}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
              </div>
            )}

            {driver && (
              <Card title={t("driverTitle")} icon={<CarFront className="h-4 w-4" />}>
                <div className="grid gap-2.5">
                  <Choice name="driver" checked={!withDriver} onChange={() => setWithDriver(false)} title={t("driverSelf")} note={t("driverSelfNote")} />
                  <Choice
                    name="driver"
                    checked={withDriver}
                    disabled={cap(driver) === 0}
                    onChange={() => setWithDriver(true)}
                    title={extraText(driver, locale).name}
                    note={[
                      extraText(driver, locale).note,
                      cap(driver) === 0
                        ? t("stockNone")
                        : driver.totalStock < 20
                          ? t("stock", { free: freeOf(driver), total: driver.totalStock })
                          : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                    aside={<>+{unit(driver)}</>}
                  />
                </div>
              </Card>
            )}

            <Card title={t("noteTitle")} icon={<MessageSquareText className="h-4 w-4" />}>
              <label htmlFor="co-note" className="sr-only">
                {t("noteTitle")}
              </label>
              <textarea
                id="co-note"
                rows={3}
                value={form.note}
                placeholder={t("notePh")}
                onChange={(e) => setField("note", e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/60 focus:border-brand focus:ring-2 focus:ring-ring/30 sm:text-sm"
              />
            </Card>

            {upsell.length > 0 && (
              <section className="rounded-[22px] bg-surface-muted p-5 sm:p-6">
                <h2 className="font-display text-base font-semibold text-foreground sm:text-lg">{t("upsellTitle")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("upsellLead")}</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {upsell.map(({ car: c, diff }) => (
                    <li key={c.id} className="flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
                      <div className="relative aspect-[16/9] bg-[#EDF1F5]">
                        {c.images?.[0] && <Image src={c.images[0]} alt={c.title} fill sizes="(max-width: 640px) 90vw, 300px" className="object-cover" />}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="text-sm font-semibold text-foreground">{c.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {[pick(TRANSMISSION_LABELS[c.transmission], locale), pick(FUEL_LABELS[c.fuelType], locale), `${c.passengers} ${tf("cardSeats")}`].join(" · ")}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-brand-strong">
                          {t("upsellDiff", { amount: `⁦${price(diff)}⁩` })}
                        </p>
                        <div className="mt-auto pt-3">
                          <Link
                            href={bookingHref(c.slug, { pickupLocationId: pickup?.id, returnLocationId: ret?.id, pickupAt, returnAt })}
                            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-surface-muted"
                          >
                            {t("upsellTake")}
                            <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-[22px] bg-surface p-5 ring-1 ring-border sm:p-6">
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 p-4">
                <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t("payTitle")}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{t("payBody")}</p>
                </div>
              </div>

              {status === "error" && (
                <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-medium text-rose-600 dark:text-rose-300">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  {t("errGeneric")}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="submit"
                  disabled={conflict || status === "sending"}
                  className="group inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-1"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      {t("submit")}
                      <span className="text-white/70">·</span>
                      <bdi dir="ltr">{price(total)}</bdi>
                    </>
                  )}
                </button>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-[#25D366]"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  {t("orWa")}
                </a>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {t.rich("terms", {
                  link: (c) => (
                    <Link href="/uvjeti-najma" className="font-medium text-foreground underline underline-offset-2">
                      {c}
                    </Link>
                  ),
                })}
              </p>
            </section>
          </form>
        </div>
      )}
    </div>
  );
}
