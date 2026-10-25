import type { Metadata } from "next";
import { Band } from "@/components/ui/Band";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarCheck, Heart, MapPin, ShieldCheck } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { getBrowseCars } from "@/lib/fleet-data";
import { SITE } from "@/lib/site-config";
import { PageHeader } from "@/components/layout/PageHeader";
import { Heading } from "@/components/home/Heading";
import { Visit } from "@/components/home/Visit";
import { CtaBand } from "@/components/home/CtaBand";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const tSeo = await getTranslations({ locale, namespace: "Seo" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  return buildPageMetadata({
    locale,
    path: "/o-nama",
    title: tSeo("about.title"),
    description: tSeo("about.description"),
    tab: tNav("about"),
  });
}

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const cars = await getBrowseCars().catch(() => []);

  const stats = [
    { value: "500+", label: t("stats.clientsLabel") },
    { value: String(cars.length || 19), label: t("stats.carsLabel") },
    { value: "24/7", label: t("stats.supportLabel") },
    { value: `${SITE.deposit.standard} €`, label: t("stats.depositLabel") },
  ];

  const features = [
    { icon: CalendarCheck, title: t("features.f1Title"), text: t("features.f1Text") },
    { icon: MapPin, title: t("features.f2Title"), text: t("features.f2Text") },
    { icon: ShieldCheck, title: t("features.f3Title"), text: t("features.f3Text") },
    { icon: Heart, title: t("features.f4Title"), text: t("features.f4Text") },
  ];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Heading eyebrow={t("storyTitle")} title={t("storyHeadline")} accent={t("storyAccent")} />
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p className="text-foreground">{t("intro2")}</p>
            <p>{t("storyP1")}</p>
            <p>{t("storyP2")}</p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px border-y border-border bg-border lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-background py-8 ps-6 odd:ps-0 lg:ps-8 lg:odd:ps-8 lg:first:ps-0">
              <p className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Band>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[4/5]">
            <Image src="/img/chauffeur.webp" alt={t("imageAlt")} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <Heading eyebrow={t("featuresEyebrow")} title={t("featuresTitle")} accent={t("featuresAccent")} />
            <ul className="mt-8 border-t border-border">
              {features.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 border-b border-border py-5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-brand-strong ring-1 ring-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Visit address={SITE.address} />
      <CtaBand />
    </>
  );
}
