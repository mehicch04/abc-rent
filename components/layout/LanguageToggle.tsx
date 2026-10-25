"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_NAMES, routing, type AppLocale } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function switchTo(next: AppLocale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next, scroll: false });
    });
  }

  return (
    <div ref={ref} className="relative" data-pending={isPending}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold text-foreground/80 transition-colors hover:bg-foreground/[0.06] hover:text-foreground aria-expanded:bg-foreground/[0.06]"
      >
        {locale.toUpperCase()}
        <span className="sr-only">
          {t("language")}: {LOCALE_NAMES[locale]}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="listbox" className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-[0_24px_50px_-24px_rgba(11,18,32,0.45)]">
          {routing.locales.map((l) => {
            const active = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="option"
                aria-selected={active}
                lang={l}
                onClick={() => switchTo(l)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  active ? "bg-brand/10 text-brand-strong" : "text-foreground hover:bg-surface-muted"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-6 text-start text-xs font-semibold">{l.toUpperCase()}</span>
                  <span className={active ? "font-semibold" : "text-muted-foreground"}>{LOCALE_NAMES[l]}</span>
                </span>
                {active && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
