import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Variant = "brand" | "light" | "dark" | "outline";

const BASE =
  "group inline-flex shrink-0 items-center gap-3 rounded-full font-medium transition-colors";

const VARIANTS: Record<Variant, { btn: string; dot: string }> = {
  brand: {
    btn: "bg-brand text-white hover:bg-brand-700",
    dot: "bg-white text-brand",
  },
  light: {
    btn: "bg-white text-ink hover:bg-white/90",
    dot: "bg-ink text-white",
  },
  dark: {
    btn: "bg-ink text-white hover:bg-ink-700 dark:bg-white dark:text-ink dark:hover:bg-white/90",
    dot: "bg-white text-ink dark:bg-ink dark:text-white",
  },
  outline: {
    btn: "border border-border bg-surface text-foreground hover:border-foreground/30",
    dot: "bg-ink text-white dark:bg-white dark:text-ink",
  },
};

export function PillLink({
  href,
  children,
  variant = "brand",
  size = "md",
  icon,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
}) {
  const v = VARIANTS[variant];
  const pad = size === "sm" ? "py-1 ps-4 pe-1 text-xs" : "py-1.5 ps-5 pe-1.5 text-sm";
  const dot = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const cls = `${BASE} ${pad} ${v.btn} ${className}`;
  const inner = (
    <>
      {children}
      <span
        className={`inline-flex ${dot} items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${v.dot}`}
      >
        {icon ?? <ArrowUpRight className="rtl:-scale-x-100 h-4 w-4" />}
      </span>
    </>
  );

  if (/^(https?:|tel:|mailto:|#)/.test(href)) {
    const ext = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
