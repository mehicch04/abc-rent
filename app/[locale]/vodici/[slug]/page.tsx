import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Clock3, Info } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { intlLocale, routing } from "@/i18n/routing";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { GUIDE_SLUGS, getGuide, getGuides, type GuideBlock } from "@/lib/guides";
import { getBrowseCars } from "@/lib/fleet-data";
import { carCategories } from "@/lib/car-categories";
import { getCompany } from "@/lib/company";
import { SimilarCars } from "@/components/fleet/SimilarCars";
import { GuideCard } from "@/components/guides/GuideCard";
import { PillLink } from "@/components/ui/PillLink";
import type { CarListItem } from "@/lib/types";

type Props = { params: { locale: string; slug: string } };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => GUIDE_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuide(params.locale, params.slug);
  if (!g) return {};
  return buildPageMetadata({ locale: params.locale, path: `/vodici/${g.slug}`, title: g.title, description: g.lead, tab: g.title });
}

function Block({ b }: { b: GuideBlock }) {
  switch (b.type) {
    case "h2":
      return <h2 className="pt-6 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{b.text}</h2>;
    case "p":
      return <p className="text-[15.5px] leading-[1.75] text-foreground/85">{b.text}</p>;
    case "ul":
      return (
        <ul className="space-y-3">
          {b.items.map((it) => (
            <li key={it} className="flex gap-3 text-[15.5px] leading-[1.7] text-foreground/85">
              <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-hidden rounded-2xl ring-1 ring-border">
          <table className="w-full text-start text-sm">
            <thead className="bg-surface-muted text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{b.head[0]}</th>
                <th className="px-4 py-3 text-end font-medium">{b.head[1]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {b.rows.map(([a, c]) => (
                <tr key={a} className="bg-surface">
                  <td className="px-4 py-3 text-foreground/90">{a}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-end font-medium tabular-nums text-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <p className="flex gap-3 rounded-2xl bg-surface-muted p-4 text-sm leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {b.text}
        </p>
      );
  }
}

export default async function GuidePage({ params }: Props) {
  setRequestLocale(params.locale);
  const guide = getGuide(params.locale, params.slug);
  if (!guide) notFound();

  const [t, tFleet, cars, company] = await Promise.all([
    getTranslations("Guides"),
    getTranslations("Fleet"),
    getBrowseCars().catch(() => [] as CarListItem[]),
    getCompany(),
  ]);
  const others = getGuides(params.locale).filter((g) => g.slug !== guide.slug).slice(0, 3);
  const picked = cars
    .filter((c) => guide.cars === "family" ? carCategories(c).some((k) => k === "TRANSPORT" || k === "MINIBUS") : guide.cars === "compact" ? carCategories(c).includes("COMPACT") : true)
    .slice(0, 3);
  const date = new Intl.DateTimeFormat(intlLocale(params.locale), { day: "numeric", month: "long", year: "numeric" }).format(new Date(guide.updated));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.lead,
    dateModified: guide.updated,
    inLanguage: params.locale,
    mainEntityOfPage: `${SITE_URL}/${params.locale}/vodici/${guide.slug}`,
    publisher: { "@type": "Organization", name: company.name },
  };

  return (
    <article className="mx-auto w-full max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/vodici" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
        {t("back")}
      </Link>

      <header className="mt-8 max-w-3xl">
        <h1 className="text-balance font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-5xl">{guide.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{guide.lead}</p>
        <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {t("minutes", { n: guide.minutes })}
          </span>
          <span>{t("updated", { date })}</span>
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="max-w-3xl space-y-5">
          {guide.blocks.map((b, i) => (
            <Block key={i} b={b} />
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[22px] bg-ink p-6 text-white">
            <p className="font-display text-xl font-semibold">{t("ctaTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{t("ctaBody")}</p>
            <div className="mt-6 flex flex-col gap-2">
              <PillLink href="/vozila">{t("ctaButton")}</PillLink>
              <PillLink href={`https://wa.me/${company.whatsapp}`} variant="light">
                {t("whatsapp")}
              </PillLink>
            </div>
          </div>
        </aside>
      </div>

      <SimilarCars cars={picked} locale={params.locale} title={tFleet("featuredTitle")} />

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-xl font-semibold text-foreground">{t("more")}</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {others.map((g) => (
            <li key={g.slug}>
              <GuideCard guide={g} readLabel={t("read")} minutesLabel={t("minutes", { n: g.minutes })} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
