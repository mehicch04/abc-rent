"use client";

import { usePathname } from "@/i18n/navigation";

const VARIANTS: { match: string; cls: string }[] = [
  { match: "/o-nama", cls: "page-bg--tl" },
  { match: "/vozila", cls: "page-bg--top" },
  { match: "/uvjeti-najma", cls: "page-bg--bottom" },
  { match: "/kontakt", cls: "page-bg--center" },
];

export function PageBackground() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const variant =
    VARIANTS.find((v) => pathname.startsWith(v.match))?.cls ?? "page-bg--tr";

  return <div aria-hidden className={`page-bg ${variant}`} />;
}
