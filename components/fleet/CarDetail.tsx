"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Check,
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
import { InquiryModal } from "@/components/reservation/InquiryModal";
import { SimilarCars } from "@/components/fleet/SimilarCars";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CLASS_LABELS, FUEL_LABELS, TRANSMISSION_LABELS } from "@/lib/car-labels";
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

  const en = locale === "en";

  const whatsappUrl = buildWhatsAppUrl({
    car: { title: car.title },
    locale,
  } as InquiryContext);
  const description = en ? car.descriptionEn : car.descriptionHr;

  const L = (m: Record<string, Record<string, string>>, k: string) => m[k]?.[en ? "en" : "bs"] ?? k;
  const included = t.raw("included") as string[];
  const cats = carCategories(car);

  const specs = [
    { icon: Users, label: en ? "Seats" : "Sjedišta", value: String(car.passengers) },
    { icon: DoorOpen, label: en ? "Doors" : "Vrata", value: String(car.doors) },
    { icon: Settings2, label: en ? "Gearbox" : "Mjenjač", value: L(TRANSMISSION_LABELS, car.transmission) },
    { icon: Fuel, label: en ? "Fuel" : "Gorivo", value: L(FUEL_LABELS, car.fuelType) },
    { icon: Calendar, label: en ? "Year" : "Godište", value: String(car.year) },
    { icon: Briefcase, label: en ? "Luggage" : "Prtljag", value: car.luggage != null ? String(car.luggage) : "/" },
    { icon: Snowflake, label: en ? "Air conditioning" : "Klima", value: car.airCondition ? (en ? "Yes" : "Da") : en ? "No" : "Ne" },
    { icon: Armchair, label: en ? "Class" : "Klasa", value: L(CLASS_LABELS, car.carClass) },
  ];

  return (
    <>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-2xl">
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
                {formatPrice(car.pricePerDay, currency)}
              </span>
              <span className="text-sm text-muted-foreground">/ {en ? "day" : "dan"}</span>
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
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                {t("bookNow")}
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
          <dl className="mt-3 grid grid-cols-2 border-t border-border">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 border-b border-border py-3 odd:pr-4 even:pl-4">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="truncate text-sm font-medium text-foreground">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {description && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-foreground">{t("description")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          )}
        </div>
      </div>

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
