import { ArrowUpRight, BookOpenText, CarFront, Gauge, Plane, Route, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Guide, GuideIcon } from "@/lib/guides";

const ICONS: Record<GuideIcon, typeof Gauge> = {
  fines: Gauge,
  rules: CarFront,
  airport: Plane,
  trips: Route,
  family: Users,
};

export function GuideCard({
  guide,
  readLabel,
  minutesLabel,
  level = 3,
}: {
  guide: Guide;
  readLabel: string;
  minutesLabel: string;
  level?: 2 | 3;
}) {
  const Icon = ICONS[guide.icon] ?? BookOpenText;
  const H = level === 2 ? "h2" : "h3";
  return (
    <Link
      href={`/vodici/${guide.slug}`}
      className="group flex h-full flex-col rounded-[22px] bg-surface p-6 ring-1 ring-border transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:p-7"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 text-brand-strong">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs text-muted-foreground">{minutesLabel}</span>
      </div>
      <H className="mt-6 text-balance font-display text-lg font-semibold leading-snug text-foreground">{guide.title}</H>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{guide.lead}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-strong">
        {readLabel}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
      </span>
    </Link>
  );
}
