import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bs", "en"],
  defaultLocale: "bs",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

/** Browsers ship without Bosnian number/date data, so Intl falls back to Croatian (identical numeric formats). */
export function intlLocale(locale: string): string {
  return locale === "bs" ? "hr" : locale;
}
