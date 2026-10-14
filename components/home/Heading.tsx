"use client";

import { motion } from "framer-motion";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function Heading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  className = "",
}: Props) {
  const center = align === "center";
  const dark = tone === "dark";
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
          dark
            ? "border-white/15 bg-white/5 text-brand-300"
            : "border-brand/20 bg-brand/5 text-brand-strong"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        {eyebrow}
      </span>
      <h2
        className={`mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-[2.75rem] ${
          dark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-white/65" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
