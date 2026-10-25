import { BAM_PER_EUR } from "@/lib/currency";

type Params = Record<string, unknown>;
type Item = { id: string; title: string; brand?: string | null; category?: string | null; priceBam?: number | null };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const eurValue = (bam: number) => Math.round((bam / BAM_PER_EUR) * 100) / 100;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function trackItem(event: "view_item" | "begin_checkout" | "generate_lead", item: Item, extra: Params = {}, valueBam?: number) {
  const value = eurValue(valueBam ?? item.priceBam ?? 0);
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
  }
  track(event, {
    currency: "EUR",
    value,
    ecommerce: {
      currency: "EUR",
      value,
      items: [
        {
          item_id: item.id,
          item_name: item.title,
          item_brand: item.brand ?? undefined,
          item_category: item.category ?? undefined,
          price: item.priceBam != null ? eurValue(item.priceBam) : undefined,
        },
      ],
    },
    ...extra,
  });
}
