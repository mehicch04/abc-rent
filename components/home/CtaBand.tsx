import Image from "next/image";
import { useTranslations } from "next-intl";
import { PillLink } from "@/components/ui/PillLink";

export function CtaBand() {
  const t = useTranslations("Cta");

  return (
    <section className="px-3 sm:px-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink">
        <Image
          src="/img/cta-fleet.webp"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[72%_70%] sm:object-[center_68%]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r rtl:bg-gradient-to-l from-ink/95 via-ink/70 via-45% to-ink/10" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink/50 to-transparent" />
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
          <h2 className="max-w-xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-white/70">{t("body")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PillLink href="/vozila">{t("primary")}</PillLink>
            <PillLink href="/kontakt" variant="light">
              {t("secondary")}
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
