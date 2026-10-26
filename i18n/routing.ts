import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bs", "en", "de", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];

export const LOCALE_NAMES: Record<AppLocale, string> = {
  bs: "Bosanski",
  en: "English",
  de: "Deutsch",
  ar: "العربية",
};

/** Browsers ship without Bosnian number/date data, so Intl falls back to Croatian (identical numeric formats). */
export function intlLocale(locale: string): string {
  if (locale === "bs") return "hr";
  if (locale === "ar") return "ar-u-nu-latn";
  return locale;
}

export function isRtl(locale: string): boolean {
  return locale === "ar";
}

/** Database copy exists in Bosnian and English only; every other language reads the English column. */
export function dbLang(locale: string): "bs" | "en" {
  return locale === "bs" ? "bs" : "en";
}
