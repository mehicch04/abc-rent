import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Clock3, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
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
  const year = new Date().getFullYear();

  return (
    <footer className="relative mx-3 mb-3 mt-24 overflow-hidden rounded-[2.5rem] bg-ink text-white sm:mx-4 sm:mb-4">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-500/25 blur-[110px]" />

      <div className="container relative">
        <div className="grid items-end gap-8 border-b border-white/10 py-14 lg:grid-cols-[1.4fr_1fr] lg:py-20">
          <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            {t("ctaA")}
            <span className="block text-brand-300">{t("ctaB")}</span>
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/vozila"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
            >
              {t("book")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={`https://wa.me/${company.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.2fr]">
          <div className="space-y-5">
            <Image src="/logo-dark.png" alt={SITE.name} width={343} height={160} className="h-14 w-auto" />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">{t("tagline")}</p>
            {(company.socials.facebook || company.socials.instagram) && (
              <div className="flex gap-2">
                {company.socials.facebook && (
                  <a
                    href={company.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand-300 hover:text-brand-300"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {company.socials.instagram && (
                  <a
                    href={company.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand-300 hover:text-brand-300"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t("navTitle")}</h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                    {nav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t("contact")}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {company.phones.map((p) => (
                <li key={p.value}>
                  <a href={p.href} className="flex items-center gap-2.5 text-white/75 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 shrink-0 text-brand-300" />
                    {p.value}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 text-white/75 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-brand-300" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-white/75">
                <Clock3 className="h-4 w-4 shrink-0 text-brand-300" />
                {company.hours}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t("locations")}</h3>
            <ul className="mt-5 space-y-4">
              {locations.map((loc) => (
                <li key={loc.name} className="flex gap-2.5 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                  <span className="text-white/60">
                    <span className="block font-medium text-white">{loc.name}</span>
                    {loc.street}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row">
          <span>
            © {year} {company.name}. {t("rights")}
          </span>
          <span>
            Powered and designed by{" "}
            <a
              href="https://mehiccdev.com"
              target="_blank"
              rel="noopener"
              className="font-semibold text-brand-300 underline decoration-brand-300/40 underline-offset-4 transition-colors hover:text-white"
            >
              mehiccdev
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
