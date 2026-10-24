"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export const CONTROL =
  "h-11 w-full min-w-0 rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none transition-[border-color,box-shadow] focus:border-brand focus:ring-2 focus:ring-ring/30 sm:text-sm";

export const LABEL = "mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground";

export function Select({
  id,
  value,
  onChange,
  children,
  ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={`${CONTROL} appearance-none pe-10`}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
