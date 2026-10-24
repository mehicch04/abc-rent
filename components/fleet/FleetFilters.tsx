"use client";

import { useState, type ComponentType } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/booking/ui";

export type Facet = "price" | "cat" | "gear" | "fuel" | "seats" | "brand";
export type Selection = Record<Facet, string[]>;
export type Option = { value: string; label: string; count: number; icon?: ComponentType<{ className?: string }> };
export type Group = { id: Facet; title: string; options: Option[]; kind: "check" | "list" };

export const EMPTY: Selection = { price: [], cat: [], gear: [], fuel: [], seats: [], brand: [] };

function Box({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors duration-200 ${
        on ? "border-brand bg-brand text-white" : "border-foreground/30 bg-surface group-hover/o:border-foreground/50"
      }`}
    >
      <Check className={`h-3 w-3 transition-transform duration-200 ${on ? "scale-100" : "scale-0"}`} strokeWidth={3.5} />
    </span>
  );
}

function GroupBlock({
  group,
  selected,
  onToggle,
  defaultOpen,
}: {
  group: Group;
  selected: string[];
  onToggle: (v: string) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-start"
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-foreground rtl:normal-case rtl:tracking-normal">
          {group.title}
          {selected.length > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">{selected.length}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <Reveal show={open}>
        <ul className={`pb-3 ${group.kind === "list" ? "-mx-2 space-y-0.5" : "space-y-1"}`}>
          {group.options.map((o) => {
            const on = selected.includes(o.value);
            const off = !on && o.count === 0;
            const Icon = o.icon;
            return (
              <li key={o.value}>
                {group.kind === "list" ? (
                  <button
                    type="button"
                    onClick={() => onToggle(o.value)}
                    disabled={off}
                    aria-pressed={on}
                    className={`group/o flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      on ? "bg-brand/10 font-semibold text-foreground" : "text-foreground/80 hover:bg-surface-muted"
                    }`}
                  >
                    {Icon && (
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${on ? "bg-brand text-white" : "bg-surface-muted text-foreground/70"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate">{o.label}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{o.count}</span>
                    <span
                      aria-hidden
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all duration-200 ${
                        on ? "scale-100 bg-brand text-white" : "scale-75 opacity-0"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  </button>
                ) : (
                  <label className={`group/o flex items-center gap-3 rounded-lg py-1.5 text-sm ${off ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
                    <input type="checkbox" checked={on} disabled={off} onChange={() => onToggle(o.value)} className="peer sr-only" />
                    <Box on={on} />
                    <span className={`min-w-0 flex-1 truncate peer-focus-visible:underline ${on ? "font-semibold text-foreground" : "text-foreground/80"}`}>{o.label}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{o.count}</span>
                  </label>
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </div>
  );
}

export function FilterPanel({
  groups,
  selection,
  onToggle,
  onClear,
  headingId,
  closeSpace,
}: {
  closeSpace?: boolean;
  groups: Group[];
  selection: Selection;
  onToggle: (f: Facet, v: string) => void;
  onClear: () => void;
  headingId?: string;
}) {
  const t = useTranslations("Fleet");
  const active = Object.values(selection).some((v) => v.length > 0);
  return (
    <div>
      <div className={`flex items-center justify-between gap-3 border-b border-border pb-4 ${closeSpace ? "pe-12" : ""}`}>
        <h2 id={headingId} className="font-display text-xl font-semibold tracking-tight text-foreground">
          {t("filters")}
        </h2>
        <button
          type="button"
          onClick={onClear}
          disabled={!active}
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40 rtl:normal-case rtl:tracking-normal"
        >
          {t("clearAll")}
        </button>
      </div>
      {groups
        .filter((g) => g.options.length > 1 || selection[g.id].length > 0)
        .map((g, i) => (
          <GroupBlock key={g.id} group={g} selected={selection[g.id]} onToggle={(v) => onToggle(g.id, v)} defaultOpen={i < 3 || selection[g.id].length > 0} />
        ))}
    </div>
  );
}
