import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Clock3, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS, SITE } from "@/lib/site-config";
import type { Company } from "@/lib/company";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ConsentLink } from "@/components/consent/CookieConsent";

type Props = {
  company: Company;
  locations: { name: string; street: string; city: string }[];
};

export function Footer({ company, locations }: Props) {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const social = "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white hover:text-white";
  const phone = company.phones[0];
  const hours = locale === "bs" ? company.hours : t("hoursValue");
  const tile = "flex flex-col gap-3 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10 transition-colors active:bg-white/10";

  return (
    <footer className="relative mt-24 overflow-hidden bg-[#06090F] text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(30,164,233,0.18),transparent)] md:hidden" />
      <div className="relative px-4 pb-10 pt-14 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <Image src="/logo-dark.png" alt={SITE.name} width={103} height={48} className="h-11 w-[94px]" />
          <Link
            href="/vozila"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-gradient pe-1.5 ps-4 text-sm font-semibold text-white shadow-[0_12px_26px_-14px_rgba(8,121,184,0.95)]"
          >
            {nav("book")}
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-brand">
              <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
            </span>
          </Link>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-white/60">{t("tagline")}</p>

        <div className="mt-7 grid grid-cols-2 gap-2.5">
          {phone && (
            <a href={phone.href} className={tile}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/20 text-brand-300">
                <Phone className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-white/50">{nav("call")}</span>
                <bdi dir="ltr" className="block whitespace-nowrap text-[13px] font-semibold text-white">
                  {phone.value}
                </bdi>
              </span>
            </a>
          )}
          <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" className={tile}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366]/15 text-[#25D366]">
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-white/50">WhatsApp</span>
              <span className="block text-[13px] font-semibold text-white">{t("chat")}</span>
            </span>
          </a>
        </div>

        <ul className="mt-2.5 divide-y divide-white/10 rounded-2xl bg-white/[0.03] text-sm ring-1 ring-white/10">
          {company.phones.slice(1).map((p) => (
            <li key={p.value}>
              <a href={p.href} className="flex items-center gap-3 px-4 py-3.5 text-white/70">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <bdi dir="ltr">{p.value}</bdi>
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${company.email}`} className="flex items-center gap-3 px-4 py-3.5 text-white/70">
              <Mail className="h-4 w-4 shrink-0 text-brand-400" />
              <bdi dir="ltr" className="truncate">
                {company.email}
              </bdi>
            </a>
          </li>
          <li className="flex items-center gap-3 px-4 py-3.5 text-white/70">
            <Clock3 className="h-4 w-4 shrink-0 text-brand-400" />
            <span className="flex-1">{hours}</span>
            <span className="relative grid h-2.5 w-2.5 place-items-center">
              <span className="absolute inset-0 rounded-full bg-emerald-400/60 motion-safe:animate-ping" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
          </li>
        </ul>

        <p className="mt-9 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 rtl:normal-case rtl:tracking-normal">{t("navTitle")}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="inline-flex h-10 items-center rounded-full bg-white/[0.05] px-4 text-sm text-white/80 ring-1 ring-white/10 transition-colors active:bg-white/10">
                {nav(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-9 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 rtl:normal-case rtl:tracking-normal">{t("locations")}</p>
        <ul className="mt-3 divide-y divide-white/10 rounded-2xl bg-white/[0.03] ring-1 ring-white/10">
          {locations.map((loc) => (
            <li key={loc.name} className="flex gap-3 px-4 py-3.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span className="min-w-0 text-white/50">
                <span className="block font-medium text-white/90">{loc.name}</span>
                {loc.street}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-xs leading-relaxed text-white/45">{t("languages")}</p>
          {(company.socials.facebook || company.socials.instagram) && (
            <div className="flex shrink-0 gap-2">
              {company.socials.facebook && (
                <a href={company.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={social}>
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {company.socials.instagram && (
                <a href={company.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}>
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto hidden max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.1fr]">
        <div>
          <Image src="/logo-dark.png" alt={SITE.name} width={103} height={48} className="h-12 w-[103px]" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">{t("tagline")}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{t("languages")}</p>
          <div className="mt-6 flex gap-2">
            <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={social}>
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            {company.socials.facebook && (
              <a href={company.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={social}>
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {company.socials.instagram && (
              <a href={company.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}>
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("navTitle")}</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block py-1.5 text-sm text-white/55 transition-colors hover:text-white">
                  {nav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("contact")}</h3>
          <ul className="mt-3 space-y-1 text-sm text-white/55">
            {company.phones.map((p) => (
              <li key={p.value}>
                <a href={p.href} className="flex items-center gap-2.5 py-1.5 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                  <bdi dir="ltr">{p.value}</bdi>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 py-1.5 transition-colors hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <bdi dir="ltr">{company.email}</bdi>
              </a>
            </li>
            <li className="flex items-center gap-2.5 py-1.5">
              <Clock3 className="h-4 w-4 shrink-0 text-brand-400" />
              {locale === "bs" ? company.hours : t("hoursValue")}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("locations")}</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {locations.map((loc) => (
              <li key={loc.name} className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-white/55">
                  <span className="block text-white/85">{loc.name}</span>
                  {loc.street}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-7 text-center text-xs text-white/45 sm:px-6 md:flex-row md:justify-between md:py-6 md:text-start">
          <span className="order-2 md:order-none">
            © {year} {company.name}. {t("rights")}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 md:justify-start md:gap-x-6">
            <Link href="/uvjeti-najma" className="transition-colors hover:text-white">
              {nav("terms")}
            </Link>
            <Link href="/privatnost" className="transition-colors hover:text-white">
              {t("privacy")}
            </Link>
            <ConsentLink label={t("cookies")} className="transition-colors hover:text-white" />
            <span className="w-full md:w-auto">
              Powered and designed by{" "}
              <a href="https://mehiccdev.com" target="_blank" rel="noopener" className="font-medium text-white/80 underline underline-offset-4 transition-colors hover:text-white">
                mehiccdev
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
