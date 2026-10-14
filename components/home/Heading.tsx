"use client";

import { motion } from "framer-motion";

type Props = {
  eyebrow: string;
  title: string;
  accent?: string;
  accentTone?: "brand" | "muted";
  subtitle?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function Heading({
  eyebrow,
  title,
  accent,
  accentTone = "brand",
  subtitle,
  align = "left",
  tone = "light",
  className = "",
}: Props) {
  const dark = tone === "dark";
  const accentCls =
    accentTone === "muted"
      ? dark
        ? "text-white/45"
        : "text-muted-foreground"
      : dark
        ? "text-brand-300"
        : "text-brand-strong";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
          dark ? "bg-white/10 text-white/75" : "bg-surface text-foreground/70 ring-1 ring-border"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        {eyebrow}
      </span>
      <h2
        className={`mt-4 text-balance font-display text-[1.9rem] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[2.6rem] ${
          dark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
        {accent && (
          <>
            {" "}
            <em className={`font-semibold italic ${accentCls}`}>{accent}</em>
          </>
        )}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${dark ? "text-white/65" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
