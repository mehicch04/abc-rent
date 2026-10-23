import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock3, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS, SITE } from "@/lib/site-config";
import type { Company } from "@/lib/company";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

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

  return (
    <footer className="mt-24 bg-[#06090F] text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_1fr_1.1fr]">
        <div>
          <Image src="/logo-dark.png" alt={SITE.name} width={103} height={48} className="h-12 w-auto" />
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
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                  {nav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("contact")}</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/55">
            {company.phones.map((p) => (
              <li key={p.value}>
                <a href={p.href} className="flex items-center gap-2.5 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                  <bdi dir="ltr">{p.value}</bdi>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <bdi dir="ltr">{company.email}</bdi>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            © {year} {company.name}. {t("rights")}
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/uvjeti-najma" className="transition-colors hover:text-white">
              {nav("terms")}
            </Link>
            <span>
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
