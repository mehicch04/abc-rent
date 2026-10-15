import { Clock3, Plane, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [Plane, Wallet, Clock3];

export function Features() {
  const t = useTranslations("Features");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
        {items.map((item, i) => {
          const Icon = ICONS[i] ?? Plane;
          return (
            <div key={item.title} className="flex gap-4 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-strong">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
