import { useTranslations } from "next-intl";
import type { Guide } from "@/lib/guides";
import { GuideCard } from "@/components/guides/GuideCard";
import { PillLink } from "@/components/ui/PillLink";
import { Heading } from "./Heading";

export function GuidesTeaser({ guides }: { guides: Guide[] }) {
  const t = useTranslations("Guides");
  if (!guides.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <Heading eyebrow={t("eyebrow")} title={t("title")} accent={t("accent")} subtitle={t("lead")} />
        <PillLink href="/vodici" variant="outline" className="self-start sm:self-auto">
          {t("all")}
        </PillLink>
      </div>
      <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
        {guides.slice(0, 3).map((g) => (
          <li key={g.slug} className="w-[84%] shrink-0 snap-start md:w-auto">
            <GuideCard guide={g} readLabel={t("read")} minutesLabel={t("minutes", { n: g.minutes })} />
          </li>
        ))}
      </ul>
    </section>
  );
}
