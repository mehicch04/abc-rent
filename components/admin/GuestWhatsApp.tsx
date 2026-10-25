import { ChevronDown, MessageCircle } from "lucide-react";
import { guestTemplates, waLink, type WaGuest, type WaLang } from "@/lib/wa-messages";

export function GuestWhatsApp({ phone, guest, lang }: { phone: string; guest: WaGuest; lang: WaLang }) {
  const list = guestTemplates(guest, lang);
  return (
    <details className="group/wa relative inline-block">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-full bg-[#25D366]/15 px-2.5 py-1 text-[11px] font-semibold text-[#128C4B] transition-colors hover:bg-[#25D366]/25 [&::-webkit-details-marker]:hidden">
        <MessageCircle className="h-3.5 w-3.5" />
        WhatsApp
        <ChevronDown className="h-3 w-3 transition-transform group-open/wa:rotate-180" />
      </summary>
      <div className="absolute start-0 z-30 mt-2 w-72 rounded-2xl border border-border bg-surface p-1.5 shadow-[0_24px_50px_-24px_rgba(11,18,32,0.45)]">
        <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Poruka gostu{lang === "EN" ? " (engleski)" : ""}
        </p>
        {list.map((m) => (
          <a
            key={m.key}
            href={waLink(phone, m.text)}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl px-2.5 py-2 transition-colors hover:bg-surface-muted"
          >
            <span className="block text-sm font-semibold text-foreground">{m.label}</span>
            <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{m.text}</span>
          </a>
        ))}
        <a
          href={waLink(phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block rounded-xl border-t border-border px-2.5 py-2 text-xs font-semibold text-[#128C4B] transition-colors hover:bg-surface-muted"
        >
          Otvori prazan chat
        </a>
      </div>
    </details>
  );
}
