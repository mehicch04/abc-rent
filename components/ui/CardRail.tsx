"use client";

import { useRef, useState, type ReactNode } from "react";
import { m as motion } from "framer-motion";

export function CardRail({
  items,
  cols = "sm:grid-cols-2 lg:grid-cols-3",
  bleed = "-mx-4 px-4",
  className = "",
  label,
}: {
  items: { key: string; node: ReactNode }[];
  cols?: string;
  bleed?: string;
  className?: string;
  label?: (i: number) => string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);

  const step = () => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    return first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
  };

  const onScroll = () => {
    const el = ref.current;
    const w = step();
    if (el && w) setAt(Math.min(items.length - 1, Math.round(Math.abs(el.scrollLeft) / w)));
  };

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollTo({ left: (rtl ? -1 : 1) * i * step(), behavior: "smooth" });
  };

  return (
    <div className={className}>
      <ul
        ref={ref}
        onScroll={onScroll}
        className={`no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:mx-0 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 ${bleed} ${cols}`}
      >
        {items.map((it, i) => (
          <li key={it.key} className="w-[84%] shrink-0 snap-center sm:w-auto">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 5) * 0.05 }}
            >
              {it.node}
            </motion.div>
          </li>
        ))}
      </ul>
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5 sm:hidden">
          {items.map((it, i) => (
            <button
              key={it.key}
              type="button"
              onClick={() => go(i)}
              aria-label={label ? label(i) : String(i + 1)}
              aria-current={i === at ? "true" : undefined}
              className="grid h-6 place-items-center px-0.5"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === at ? "w-6 bg-brand" : "w-1.5 bg-foreground/25"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
