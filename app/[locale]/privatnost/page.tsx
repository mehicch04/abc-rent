import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { ConsentLink } from "@/components/consent/CookieConsent";
import { buildPageMetadata } from "@/lib/seo";
import { getCompany } from "@/lib/company";
import { privacyContent } from "@/lib/privacy";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const tSeo = await getTranslations({ locale, namespace: "Seo" });
  const tFoot = await getTranslations({ locale, namespace: "Footer" });
  return buildPageMetadata({
    locale,
    path: "/privatnost",
    title: tSeo("privacy.title"),
    description: tSeo("privacy.description"),
    tab: tFoot("privacy"),
  });
}

export default async function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const [company, t] = await Promise.all([getCompany(), getTranslations("Footer")]);
  const c = privacyContent(locale as AppLocale, company);

  return (
    <>
      <PageHeader title={c.heading} lead={c.intro} />
      <LegalDoc c={c}>
        <ConsentLink
          label={t("cookies")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
        />
      </LegalDoc>
    </>
  );
}
