import { useId } from "react";
import type { AppLocale } from "@/i18n/routing";

function Ba() {
  return (
    <svg viewBox="0 0 20 10" preserveAspectRatio="none" className="h-full w-full">
      <rect width="20" height="10" fill="#002395" />
      <path d="M5.4 0H15.4V10Z" fill="#FECB00" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <circle key={i} cx={4.6 + i * 1.12} cy={0.55 + i * 1.12} r="0.42" fill="#fff" />
      ))}
    </svg>
  );
}

function Gb() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none" className="h-full w-full">
      <clipPath id={`gb${id}`}>
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30M60 0L0 30" clipPath={`url(#gb${id})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function De() {
  return (
    <svg viewBox="0 0 5 3" preserveAspectRatio="none" className="h-full w-full">
      <rect width="5" height="1" fill="#000" />
      <rect y="1" width="5" height="1" fill="#DD0000" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  );
}

function Ae() {
  return (
    <svg viewBox="0 0 12 6" preserveAspectRatio="none" className="h-full w-full">
      <rect width="12" height="2" fill="#00732F" />
      <rect y="2" width="12" height="2" fill="#fff" />
      <rect y="4" width="12" height="2" fill="#000" />
      <rect width="3" height="6" fill="#FF0000" />
    </svg>
  );
}

const FLAGS: Record<AppLocale, () => JSX.Element> = { bs: Ba, en: Gb, de: De, ar: Ae };

export function Flag({ locale, className = "h-3.5 w-5" }: { locale: AppLocale; className?: string }) {
  const F = FLAGS[locale];
  return (
    <span aria-hidden className={`inline-block shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(11,18,32,0.12)] ${className}`}>
      <F />
    </span>
  );
}
