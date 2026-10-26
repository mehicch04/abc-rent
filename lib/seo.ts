import type { Metadata } from "next";
import { SITE } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${SITE.domain}`;

export const ASSET_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : SITE_URL;

export function ogImage(locale: string) {
  const l = (routing.locales as readonly string[]).includes(locale) ? locale : routing.defaultLocale;
  return { url: `${ASSET_URL}/og/${l}.jpg`, width: 1200, height: 630, alt: `${SITE.name} | Rent a Car Sarajevo`, type: "image/jpeg" };
}

const OG_LOCALE: Record<string, string> = { bs: "bs_BA", en: "en_US", de: "de_DE", ar: "ar_AR" };

export function buildAlternates(locale: string, path: string) {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${clean}`;
  // x-default points search engines at the default-locale version.
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${clean}`;
  return { canonical: `${SITE_URL}/${locale}${clean}`, languages };
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  tab,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  tab?: string;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
  return {
    title: { absolute: tab ? `${tab} | ${SITE.name}` : SITE.name },
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title,
      description,
      locale: OG_LOCALE[locale] ?? "bs_BA",
      images: [ogImage(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage(locale).url],
    },
  };
}
