import type { Metadata } from "next";
import { CtaBand } from "@/components/home/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RENTAL_TERMS } from "@/lib/rental-terms";
import { LegalDoc } from "@/components/legal/LegalDoc";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const tSeo = await getTranslations({ locale, namespace: "Seo" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  return buildPageMetadata({
    locale,
    path: "/uvjeti-najma",
    title: tSeo("terms.title"),
    description: tSeo("terms.description"),
    tab: tNav("terms"),
  });
}

export default async function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const c = RENTAL_TERMS[(locale in RENTAL_TERMS ? locale : "bs") as keyof typeof RENTAL_TERMS];

  return (
    <>
    <PageHeader title={c.heading} lead={c.intro} />
    <LegalDoc c={c} />
    <CtaBand />
    </>
  );
}
