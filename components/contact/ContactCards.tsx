"use client";

import { useState } from "react";
import { m as motion } from "framer-motion";
import { ArrowUpRight, Check, Clock3, Copy, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export type ContactCard = {
  kind: "phone" | "whatsapp" | "email" | "hours";
  label: string;
  value: string;
  href?: string;
  copy?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Icon({ kind }: { kind: ContactCard["kind"] }) {
  if (kind === "whatsapp")
    return (
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#25D366]/15 text-[#1DA851] transition-colors duration-300 group-hover:bg-[#25D366] group-hover:text-white">
        <WhatsAppIcon className="h-5 w-5" />
      </span>
    );
  const I = kind === "phone" ? Phone : kind === "email" ? Mail : Clock3;
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand-strong transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
      <I className="h-5 w-5" />
    </span>
  );
}

export function ContactCards({ cards, copyLabel, copiedLabel }: { cards: ContactCard[]; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = async (i: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      window.setTimeout(() => setCopied((c) => (c === i ? null : c)), 1600);
    } catch {}
  };

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => {
        const body = (
          <>
            <Icon kind={c.kind} />
            <span className="min-w-0 flex-1 lg:w-full">
              <span className="block text-xs font-medium text-muted-foreground">{c.label}</span>
              <bdi dir={c.kind === "hours" ? undefined : "ltr"} className="mt-0.5 block truncate font-display text-[15px] font-semibold text-foreground rtl:text-right lg:whitespace-normal lg:text-balance">
                {c.value}
              </bdi>
            </span>
            {c.kind === "hours" ? (
              <span className="relative grid h-3 w-3 shrink-0 place-items-center lg:absolute lg:end-6 lg:top-6">
                <span className="absolute inset-0 rounded-full bg-emerald-400/60 motion-safe:animate-ping" />
                <span className="relative h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            ) : (
              !c.copy && <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground lg:absolute lg:end-5 lg:top-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-strong rtl:-scale-x-100" />
            )}
          </>
        );
        const shell =
          "group relative flex h-full items-center gap-3.5 rounded-[22px] bg-surface p-4 ring-1 ring-border shadow-[0_18px_40px_-30px_rgba(11,18,32,0.45)] transition-[transform,box-shadow] duration-300 sm:p-5 lg:flex-col lg:items-start lg:gap-4";
        return (
          <motion.li
            key={c.kind}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 * i, ease: EASE }}
            className="relative"
          >
            {c.href ? (
              <a
                href={c.href}
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${shell} hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(8,121,184,0.55)] hover:ring-brand/30 ${c.copy ? "pe-14 lg:pe-5" : ""}`}
              >
                {body}
              </a>
            ) : (
              <div className={shell}>{body}</div>
            )}
            {c.copy && (
              <button
                type="button"
                onClick={() => copy(i, c.copy!)}
                aria-label={`${copyLabel}: ${c.value}`}
                className="absolute end-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full lg:end-4 lg:top-4 lg:translate-y-0 bg-surface-muted text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand-strong sm:end-4"
              >
                {copied === i ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied === i && (
                  <span role="status" className="pointer-events-none absolute -top-9 end-0 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-white motion-safe:animate-[hero-tag_0.25s_ease_both]">
                    {copiedLabel}
                  </span>
                )}
              </button>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}
