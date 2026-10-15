"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-border bg-background/90 backdrop-blur-xl"
          : "border-transparent bg-background"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={SITE.name}>
          <Image src="/logo.png" alt={SITE.name} width={343} height={160} priority className="h-10 w-auto dark:hidden" />
          <Image src="/logo-dark.png" alt={SITE.name} width={343} height={160} priority className="hidden h-10 w-auto dark:block" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  isActive(link.href) ? "text-brand-strong" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {t(link.key)}
                {isActive(link.href) && (
                  <motion.span layoutId="nav-line" className="absolute inset-x-0 -bottom-0.5 h-px bg-brand" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <CurrencySwitch />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block border-b border-border py-4 text-base font-medium ${
                      isActive(link.href) ? "text-brand-strong" : "text-foreground"
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
              <li className="flex items-center justify-between py-4">
                <LanguageToggle />
                <ThemeToggle />
              </li>
              <li className="grid grid-cols-2 gap-2 pb-2">
                <a
                  href={company.phones[0]?.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {t("call")}
                </a>
                <Link
                  href="/vozila"
                  className="inline-flex items-center justify-center rounded-full bg-brand py-3 text-sm font-medium text-white"
                >
                  {t("book")}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
