"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useCompany } from "@/components/company/CompanyProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function WhatsAppFab() {
  const t = useTranslations("Common");
  const company = useCompany();
  const checkout = usePathname()?.includes("/rezervacija");
  if (!company.whatsapp) return null;

  return (
    <motion.a
      href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(t("waText"))}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("waLabel")}
      title={t("waLabel")}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.94 }}
      className={`${checkout ? "max-lg:hidden " : ""}group fixed bottom-4 end-4 z-40 flex h-12 items-center sm:h-14 rounded-full bg-[#25D366] text-white shadow-[0_6px_18px_-8px_rgba(11,18,32,0.45)] transition-colors hover:bg-[#1FB859] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6 sm:end-6`}
    >
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-[max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-w-[11rem] group-hover:ps-5 group-hover:opacity-100 sm:block">
        {t("waShort")}
      </span>
      <span className="grid h-12 w-12 shrink-0 place-items-center sm:h-14 sm:w-14">
        <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      </span>
    </motion.a>
  );
}
