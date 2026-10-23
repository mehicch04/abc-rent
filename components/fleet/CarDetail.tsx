"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  CircleCheck,
  PlayCircle,
  Armchair,
  Briefcase,
  Calendar,
  DoorOpen,
  Fuel,
  Settings2,
  Snowflake,
  Users,
} from "lucide-react";

import type { CarListItem } from "@/lib/types";
import type { ExtraItem } from "@/lib/extras";
import type { Booked } from "@/lib/extras-availability";
import { formatPrice } from "@/lib/currency";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { CarGallery } from "@/components/fleet/CarGallery";
import { ImageLightbox } from "@/components/fleet/ImageLightbox";
import dynamic from "next/dynamic";

const InquiryModal = dynamic(
  () => import("@/components/reservation/InquiryModal").then((m) => m.InquiryModal),
  { ssr: false },
);
import { SimilarCars } from "@/components/fleet/SimilarCars";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CLASS_LABELS, FUEL_LABELS, TRANSMISSION_LABELS, label as pick } from "@/lib/car-labels";
import type { AppLocale } from "@/i18n/routing";
import { carDescription } from "@/lib/car-copy";
import { carVideo } from "@/lib/car-media";
import { carCategories } from "@/lib/car-categories";
import { buildWhatsAppUrl, type InquiryContext } from "@/lib/whatsapp";

export function CarDetail({
  car,
  similar,
  locations,
  extras,
  bookedExtras,
  locale,
}: {
  car: CarListItem;
  similar: CarListItem[];
  locations: { id: string; name: string }[];
  extras: ExtraItem[];
  bookedExtras: Booked[];
  locale: string;
}) {
  const t = useTranslations("Fleet");
  const { currency } = useCurrency();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);

  const lang = locale as AppLocale;

  const whatsappUrl = buildWhatsAppUrl({
    car: { title: car.title },
    locale: lang,
  } as InquiryContext);
  const description = carDescription(car, locale, (k, v) => t(k as never, v as never));
  const video = carVideo(car.slug);

  const included = t.raw("included") as string[];
  const cats = carCategories(car);

  const specs = [
    { icon: Users, label: t("spec.seats"), value: String(car.passengers) },
    { icon: DoorOpen, label: t("spec.doors"), value: String(car.doors) },
    { icon: Settings2, label: t("spec.gearbox"), value: pick(TRANSMISSION_LABELS[car.transmission], lang) },
    { icon: Fuel, label: t("spec.fuel"), value: pick(FUEL_LABELS[car.fuelType], lang) },
    { icon: Calendar, label: t("spec.year"), value: String(car.year) },
    { icon: Briefcase, label: t("spec.luggage"), value: car.luggage != null ? String(car.luggage) : "/" },
    { icon: Snowflake, label: t("spec.ac"), value: car.airCondition ? t("spec.yes") : t("spec.no") },
    { icon: Armchair, label: t("spec.class"), value: pick(CLASS_LABELS[car.carClass], lang) },
  ];
  const need = [
    t("needLicence"),
    t("needId"),
    ...(car.deposit != null ? [t("needDeposit", { amount: `\u2066${formatPrice(car.deposit, currency)}\u2069` })] : []),
    t("needNoPay"),
  ];

  return (
    <>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="isolate self-start overflow-hidden rounded-2xl [transform:translateZ(0)] lg:sticky lg:top-24">
          <CarGallery
            images={car.images ?? []}
            title={car.title}
            onOpen={(i) => setLightbox(i)}
            autoPlay
            priority
            sizes="(max-width: 1023px) 92vw, 52vw"
          />
        </div>

        <div className="min-w-0">
          {cats[0] && (
            <span className="inline-flex rounded-full border border-brand/30 px-2.5 py-0.5 text-xs font-medium text-brand-strong">
              {t(`categories.${cats[0]}`)}
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {car.title}
          </h1>

          {car.pricePerDay != null && (
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-semibold text-foreground">
                <bdi dir="ltr">{formatPrice(car.pricePerDay, currency)}</bdi>
              </span>
              <span className="text-sm text-muted-foreground">/ {t("perDayWord")}</span>
            </p>
          )}

          {!car.isAvailable ? (
            <p className="mt-6 rounded-2xl bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
              {t("notOffered")}
            </p>
          ) : (
            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBooking(true)}
                className="group inline-flex h-12 flex-1 items-center justify-between rounded-full bg-brand ps-6 pe-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                {t("bookNow")}
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-strong">
                  <ArrowRight className="rtl:-scale-x-100 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[#25D366] hover:text-[#25D366]"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          )}

          <ul className="mt-6 flex flex-wrap gap-2">
            {included.map((i) => (
              <li key={i} className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground">
                <Check className="h-3.5 w-3.5 text-brand-strong" />
                {i}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-sm font-semibold text-foreground">{t("specifications")}</h2>
          <ul className="mt-3 grid grid-cols-2 border-t border-border">
            {specs.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-3 border-b border-border py-3 odd:pe-4 even:ps-4">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">{label}</span>
                  <span className="block truncate text-sm font-medium text-foreground">{value}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-foreground">{t("description")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>

          <div className="mt-8 rounded-2xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground">{t("need")}</h2>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {need.map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm text-foreground/85">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-strong" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {video && (
        <section className="mt-12 border-t border-border pt-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <PlayCircle className="h-5 w-5 text-brand-strong" />
              {t("video")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("videoNote")}</p>
          </div>
          <video
            src={video}
            poster={car.images?.[0]}
            controls
            muted
            playsInline
            preload="none"
            className="mt-4 aspect-video w-full rounded-2xl bg-ink object-cover"
          />
        </section>
      )}

      <SimilarCars cars={similar} locale={locale} title={t("similar")} />

      <ImageLightbox
        images={car.images ?? []}
        title={car.title}
        openIndex={lightbox}
        onClose={() => setLightbox(null)}
        thumbSizes="(max-width: 1023px) 92vw, 52vw"
      />

      {booking && (
        <InquiryModal
          car={car}
          search={{}}
          locations={locations}
          extras={extras}
          bookedExtras={bookedExtras}
          onClose={() => setBooking(false)}
        />
      )}
    </>
  );
}
