"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const method = /^https:\/\/(wa\.me|api\.whatsapp\.com)/.test(href) ? "whatsapp" : href.startsWith("tel:") ? "phone" : href.startsWith("mailto:") ? "email" : null;
      if (method) track("contact", { method, page: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
