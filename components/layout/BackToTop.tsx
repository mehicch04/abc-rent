"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function BackToTop() {
  const t = useTranslations("Common");
  const [visible, setVisible] = useState(false);
  const checkout = usePathname()?.includes("/rezervacija");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label={t("backToTop")}
          title={t("backToTop")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          className={`${checkout ? "max-lg:hidden " : ""}fixed bottom-[76px] end-5 z-40 inline-flex h-10 w-10 items-center justify-center sm:bottom-[92px] sm:end-[30px] sm:h-11 sm:w-11 [html[data-bar]_&]:max-lg:bottom-[148px] rounded-full bg-surface text-foreground shadow-[0_6px_18px_-8px_rgba(11,18,32,0.35)] ring-1 ring-border transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        >
          <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
