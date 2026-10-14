const BRANDS = ["Mercedes-Benz", "Audi", "Škoda", "Volkswagen", "Peugeot", "Seat"];

export function BrandMarquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee items-center gap-10 motion-reduce:animate-none">
        {[...row, ...row].map((b, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-outline whitespace-nowrap font-display text-4xl font-extrabold uppercase tracking-tight text-foreground/25 sm:text-5xl">
              {b}
            </span>
            <span className="h-2.5 w-2.5 rotate-45 rounded-[3px] bg-brand-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
