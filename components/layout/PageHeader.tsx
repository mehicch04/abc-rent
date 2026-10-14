import type { ReactNode } from "react";

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
    <section className="relative -mt-[68px] overflow-hidden rounded-b-[2.5rem] bg-ink pb-24 pt-[calc(68px+4.5rem)] text-white lg:-mt-[76px] lg:pt-[calc(76px+5.5rem)]">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-500/25 blur-[110px]" />
      <div aria-hidden className="absolute -bottom-40 left-10 h-72 w-72 rounded-full bg-brand-700/30 blur-[100px]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
