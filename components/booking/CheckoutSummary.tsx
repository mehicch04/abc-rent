"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Check, CircleCheck } from "lucide-react";

import type { CarListItem } from "@/lib/types";
import { formatPrice } from "@/lib/currency";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { Link } from "@/i18n/navigation";
import { localParts, shortDate } from "@/lib/dates";
import { FUEL_LABELS, TRANSMISSION_LABELS, label as pick } from "@/lib/car-labels";
import type { AppLocale } from "@/i18n/routing";

export type SummaryLine = { label: string; amount: number };
type Loc = { id: string; name: string } | null;

export function CheckoutSummary({
  car,
  pickupAt,
  returnAt,
  pickup,
  ret,
  days,
  rental,
  lines,
  pickupFee,
  returnFee,
  total,
  skipDeposit,
  changeHref,
}: {
  car: CarListItem;
  pickupAt: string;
  returnAt: string;
  pickup: Loc;
  ret: Loc;
  days: number;
  rental: number;
  lines: SummaryLine[];
  pickupFee: string;
  returnFee: string;
  total: number;
  skipDeposit: boolean;
  changeHref: string;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale() as AppLocale;
  const { currency } = useCurrency();
  const price = (v: number) => formatPrice(v, currency);
  const [tz, setTz] = useState("Europe/Sarajevo");

  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Sarajevo");
    } catch {}
  }, []);

  const a = localParts(pickupAt, tz);
  const b = localParts(returnAt, tz);
  const stops = [
    { key: "p", label: t("pickupLine"), when: `${shortDate(locale, a.date)} · ${a.time}`, where: pickup?.name },
    { key: "r", label: t("returnLine"), when: `${shortDate(locale, b.date)} · ${b.time}`, where: ret?.name ?? pickup?.name },
  ];

  const row = "flex justify-between gap-4";

  return (
    <div className="rounded-[24px] bg-surface p-5 ring-1 ring-border sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground rtl:normal-case">{t("summary")}</p>

      <div className="mt-4 grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 lg:block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted lg:aspect-[16/9]">
          {car.images?.[0] && (
            <Image src={car.images[0]} alt={car.title} fill priority sizes="(max-width: 1023px) 96px, 340px" className="object-cover" />
          )}
        </div>
        <div className="min-w-0 lg:mt-4">
          <p className="truncate font-display text-lg font-semibold text-foreground">{car.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {[pick(TRANSMISSION_LABELS[car.transmission], locale), pick(FUEL_LABELS[car.fuelType], locale), t("daysCount", { days })].join(" · ")}
          </p>
        </div>
      </div>

      <ol className="relative mt-5 space-y-4 ps-6">
        <span aria-hidden className="absolute bottom-3 start-[7px] top-3 w-px bg-border" />
        {stops.map((s, i) => (
          <li key={s.key} className="relative">
            <span
              aria-hidden
              className={`absolute -start-6 top-1 grid h-[15px] w-[15px] place-items-center rounded-full ${i === 0 ? "bg-brand" : "bg-foreground"}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-surface" />
            </span>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-sm font-semibold text-foreground first-letter:uppercase">{s.when}</p>
            {s.where && <p className="text-[13px] text-muted-foreground">{s.where}</p>}
          </li>
        ))}
      </ol>

      <Link
        href={changeHref}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-strong underline-offset-4 hover:underline"
      >
        <CalendarDays className="h-4 w-4" />
        {t("change")}
      </Link>

      <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
        <div className={`${row} text-muted-foreground`}>
          <span>{t("rentalLine", { days, price: price(car.pricePerDay ?? 0) })}</span>
          <bdi dir="ltr" className="font-medium tabular-nums text-foreground">{price(rental)}</bdi>
        </div>
        {lines.map((l) => (
          <div key={l.label} className={`${row} text-muted-foreground`}>
            <span className="min-w-0 truncate">{l.label}</span>
            <bdi dir="ltr" className="font-medium tabular-nums text-foreground">{price(l.amount)}</bdi>
          </div>
        ))}
        <div className={`${row} text-muted-foreground`}>
          <span>{t("pickupLine")}</span>
          <span className="font-medium text-emerald-700 dark:text-emerald-300">{pickupFee}</span>
        </div>
        <div className={`${row} text-muted-foreground`}>
          <span>{t("returnLine")}</span>
          <span className="font-medium text-emerald-700 dark:text-emerald-300">{returnFee}</span>
        </div>
        <div className={`${row} items-baseline border-t border-border pt-3`}>
          <span className="font-semibold text-foreground">{t("total")}</span>
          <bdi dir="ltr" className="font-display text-2xl font-semibold tabular-nums text-foreground">{price(total)}</bdi>
        </div>
        <div className={`${row} text-muted-foreground`}>
          <span>{skipDeposit ? t("noDepositLabel") : t("depositLabel")}</span>
          <span className="font-medium text-foreground">
            {skipDeposit || car.deposit == null ? (
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-300" aria-hidden />
            ) : (
              <bdi dir="ltr">{price(car.deposit)}</bdi>
            )}
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-2 border-t border-dashed border-border pt-4 text-[13px] text-muted-foreground">
        {[t("noPrepay"), t("freeCancel")].map((x) => (
          <li key={x} className="flex items-start gap-2">
            <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-strong" />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}
