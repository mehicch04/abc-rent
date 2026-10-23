import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink, MapPin } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { getCompany } from "@/lib/company";
import { getLocations } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-config";
import { PageHeader } from "@/components/layout/PageHeader";
import { Heading } from "@/components/home/Heading";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PillLink } from "@/components/ui/PillLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const tSeo = await getTranslations({ locale, namespace: "Seo" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  return buildPageMetadata({
    locale,
    path: "/kontakt",
    title: tSeo("contact.title"),
    description: tSeo("contact.description"),
    tab: tNav("contact"),
  });
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const company = await getCompany();
  const locations = await getLocations(locale).catch(() => []);
  const t = await getTranslations("Contact");
  const mapSrc = `https://maps.google.com/maps?q=${company.map.lat},${company.map.lng}&z=16&hl=${locale}&output=embed`;

  const rows = [
    {
      label: t("phonesLabel"),
      content: company.phones.map((p) => (
        <a key={p.value} href={p.href} className="block transition-colors hover:text-brand-strong">
          <bdi dir="ltr">{p.value}</bdi>
        </a>
      )),
    },
    {
      label: t("emailLabel"),
      content: (
        <a href={`mailto:${company.email}`} className="break-all transition-colors hover:text-brand-strong">
          <bdi dir="ltr">{company.email}</bdi>
        </a>
      ),
    },
    { label: t("locationLabel"), content: company.address ?? SITE.address },
    { label: t("hoursLabel"), content: locale === "bs" ? company.hours : t("hoursValue") },
  ];

  return (
    <>
      <PageHeader eyebrow={company.name} title={t("title")} lead={t("lead")} />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Heading eyebrow={t("infoEyebrow")} title={t("infoTitle")} accent={t("infoAccent")} />
            <dl className="mt-10 border-t border-border">
              {rows.map((r) => (
                <div key={r.label} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="text-sm text-muted-foreground">{r.label}</dt>
                  <dd className="font-display text-lg font-medium text-foreground">{r.content}</dd>
                </div>
              ))}
            </dl>
            <PillLink
              href={`https://wa.me/${company.whatsapp}`}
              variant="dark"
              className="mt-8"
              icon={<WhatsAppIcon className="h-4 w-4" />}
            >
              {t("whatsapp")}
            </PillLink>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">{t("formHeading")}</h2>
            <p className="mb-6 mt-2 text-muted-foreground">{t("formLead")}</p>
            <InquiryForm type="contact" />
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4">
        <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-surface-muted sm:h-[480px]">
          <iframe
            src={mapSrc}
            title={`${SITE.name}, ${SITE.address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full grayscale-[20%] dark:invert-[0.9] dark:hue-rotate-180"
          />
          <a
            href={company.map.link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink"
          >
            {t("openMap")}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <h2 className="font-display text-xl font-semibold text-foreground">{t("ourOffices")}</h2>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-3">
          {locations.map((loc) => (
            <li key={loc.name} className="flex gap-3 border-t border-border py-5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-strong" />
              <div>
                <p className="font-medium text-foreground">{loc.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{loc.street}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
