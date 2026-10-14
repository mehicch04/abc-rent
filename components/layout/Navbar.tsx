"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS, SITE } from "@/lib/site-config";
import { useCompany } from "@/components/company/CompanyProvider";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencySwitch } from "@/components/currency/CurrencySwitch";
import { LanguageToggle } from "./LanguageToggle";

export function Navbar() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const company = useCompany();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={`relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border pl-4 pr-2 transition-[background-color,box-shadow,border-color] duration-300 sm:pl-5 lg:h-16 ${
          scrolled || open
            ? "border-border bg-surface/90 shadow-[0_18px_50px_-20px_rgba(11,18,32,0.45)] backdrop-blur-xl"
            : "border-white/15 bg-surface/95 shadow-[0_10px_40px_-18px_rgba(11,18,32,0.5)]"
        }`}
      >
        <Link href="/" className="relative flex shrink-0 items-center" aria-label={SITE.name}>
          <Image
            src="/logo.png"
            alt={SITE.name}
            width={343}
            height={160}
            priority
            className="h-9 w-auto dark:hidden lg:h-11"
          />
          <Image
            src="/logo-dark.png"
            alt={SITE.name}
            width={343}
            height={160}
            priority
            className="hidden h-9 w-auto dark:block lg:h-11"
          />
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative isolate block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-white dark:text-ink"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-full bg-ink dark:bg-white"
                  />
                )}
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <CurrencySwitch />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <a
            href={company.phones[0]?.href}
            aria-label={t("call")}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:border-brand hover:text-brand md:inline-flex lg:hidden xl:inline-flex"
          >
            <Phone className="h-4 w-4" />
          </a>
          <Link
            href="/vozila"
            className="group hidden items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-brand transition-colors hover:bg-brand-700 sm:inline-flex"
          >
            {t("book")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white dark:bg-white dark:text-ink lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full mt-2 origin-top rounded-[1.75rem] border border-border bg-surface p-3 shadow-[0_30px_80px_-30px_rgba(11,18,32,0.5)] lg:hidden"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold ${
                        isActive(link.href)
                          ? "bg-ink text-white dark:bg-white dark:text-ink"
                          : "text-foreground hover:bg-surface-muted"
                      }`}
                    >
                      {t(link.key)}
                      <ArrowRight className="h-4 w-4 opacity-50" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-border px-2 pt-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={company.phones[0]?.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {t("call")}
                </a>
                <Link
                  href="/vozila"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground"
                >
                  {t("book")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
