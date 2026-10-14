"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Heading } from "./Heading";

export function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <section className="px-3 sm:px-4">
      <div className="grid overflow-hidden rounded-[28px] bg-ink lg:grid-cols-2">
        <div className="relative min-h-[320px] bg-gradient-to-br from-[#F4F7FA] to-[#DCE6EF] lg:min-h-[560px]">
          <span
            aria-hidden
            className="absolute left-8 top-8 font-display text-7xl font-semibold tracking-tight text-ink/[0.07] sm:text-8xl"
          >
            ABC
          </span>
          <Image
            src="/cars/audi-q7.webp"
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-contain p-10 mix-blend-multiply"
          />
        </div>
        <div className="px-6 py-14 sm:px-12 lg:py-20">
          <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} tone="dark" />
          <ol className="mt-10 divide-y divide-white/10">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-5 py-6 first:pt-0"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
