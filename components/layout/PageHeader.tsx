import type { ReactNode } from "react";
import Image from "next/image";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-3 pt-1 sm:px-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink">
        <Image
          src="/img/hero-sarajevo.webp"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[75%_center] opacity-60"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-14 text-white sm:px-6 sm:pt-20">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              {eyebrow}
            </span>
          )}
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[3.4rem]">
            {title}
          </h1>
          {lead && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
