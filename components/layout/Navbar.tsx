"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { ArrowUpRight, Clock, Menu, Phone, Plane, Star, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS, SITE } from "@/lib/site-config";
import { useCompany } from "@/components/company/CompanyProvider";
import { CurrencySwitch } from "@/components/currency/CurrencySwitch";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { LanguageToggle } from "./LanguageToggle";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
const EASE = [0.22, 1, 0.36, 1] as const;

function TopBar() {
  const t = useTranslations("Nav");
  const company = useCompany();
  const score = company.rating.score ?? SITE.rating.score;
  const count = company.rating.count ?? SITE.rating.count;
  const phone = company.phones[0];
  return (
    <div className="hidden bg-ink text-white/70 lg:block">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-6 px-6 text-xs">
        <a href={company.map.link ?? SITE.map.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-white">
          <span className="flex gap-0.5" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-3 w-3 fill-[#F5A524] text-[#F5A524]" />
            ))}
          </span>
          <span className="font-semibold text-white">{score.toFixed(1).replace(".", ",")}</span>
          <span>{t("rating", { count })}</span>
        </a>
        <span className="inline-flex items-center gap-2">
          <Plane className="h-3.5 w-3.5 text-brand-300" />
          {t("airport")}
        </span>
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-300" />
            {t("open24")}
          </span>
          {phone && (
            <a href={phone.href} className="inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-brand-300">
              <Phone className="h-3.5 w-3.5" />
              <bdi dir="ltr">{phone.value}</bdi>
            </a>
          )}
          <a
            href={`https://wa.me/${company.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366]/15 text-[#25D366] transition-colors hover:bg-[#25D366]/25"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const company = useCompany();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const active = NAV_LINKS.findIndex((l) => isActive(l.href));
  const target = hover ?? (active >= 0 ? active : null);

  const measure = useCallback(() => {
    const el = target != null ? items.current[target] : null;
    setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [target]);

  useIso(measure, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <TopBar />
      <header className="pointer-events-none sticky top-0 z-50 px-3 pt-2.5 sm:px-4 sm:pt-3">
        <nav
          className={`pointer-events-auto relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 rounded-full pe-2 ps-4 ring-1 transition-[background-color,box-shadow] duration-300 sm:ps-5 ${
            scrolled || open
              ? "bg-surface/80 shadow-[0_22px_50px_-28px_rgba(11,18,32,0.5)] ring-border backdrop-blur-xl backdrop-saturate-150"
              : "bg-surface shadow-[0_1px_2px_rgba(11,18,32,0.05)] ring-border/80"
          }`}
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-10 -bottom-px h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

          <Link href="/" className="flex shrink-0 items-center" aria-label={SITE.name}>
            <Image src="/logo.png" alt={SITE.name} width={86} height={40} loading="eager" className="h-9 w-auto sm:h-10" />
          </Link>

          <ul onMouseLeave={() => setHover(null)} className="relative hidden items-center rounded-full bg-surface-muted p-1 lg:flex">
            <span
              aria-hidden
              className={`absolute inset-y-1 rounded-full bg-ink shadow-[0_8px_18px_-10px_rgba(11,18,32,0.8)] transition-[left,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${pill ? "opacity-100" : "opacity-0"}`}
              style={pill ? { left: pill.left, width: pill.width } : undefined}
            />
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <Link
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  href={link.href}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-current={i === active ? "page" : undefined}
                  className={`relative z-10 block rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    target === i ? "text-white" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center rounded-full bg-surface-muted p-0.5 sm:flex">
              <LanguageToggle />
              <span aria-hidden className="h-4 w-px bg-border" />
              <CurrencySwitch />
            </div>
            <Link
              href="/vozila"
              className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-brand-gradient pe-1.5 ps-4 text-sm font-semibold text-white shadow-[0_12px_26px_-14px_rgba(8,121,184,0.95)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_16px_32px_-14px_rgba(8,121,184,1)] active:scale-[0.98] sm:ps-5"
            >
              <span aria-hidden className="pointer-events-none absolute inset-y-0 -start-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-[transform,opacity] duration-700 group-hover:translate-x-[420%] group-hover:opacity-100 rtl:group-hover:-translate-x-[420%]" />
              {t("book")}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
              </span>
            </Link>
            <button
              type="button"
              aria-label={t("menu")}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-foreground transition-colors hover:bg-border/70 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="pointer-events-auto absolute inset-x-3 top-full mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-6xl origin-top overflow-y-auto rounded-[28px] bg-surface p-3 shadow-[0_30px_60px_-30px_rgba(11,18,32,0.55)] ring-1 ring-border sm:inset-x-4 lg:hidden"
            >
              <ul className="grid gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i, duration: 0.25, ease: EASE }}>
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                        isActive(link.href) ? "bg-ink text-white" : "text-foreground hover:bg-surface-muted"
                      }`}
                    >
                      {t(link.key)}
                      <ArrowUpRight className={`h-4 w-4 rtl:-scale-x-100 ${isActive(link.href) ? "text-brand-300" : "text-muted-foreground"}`} />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-surface-muted p-1.5 sm:hidden">
                <div className="flex items-center">
                  <LanguageToggle />
                  <span aria-hidden className="h-4 w-px bg-border" />
                  <CurrencySwitch />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={company.phones[0]?.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-muted py-3 text-sm font-semibold text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {t("call")}
                </a>
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-[#06301A]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
