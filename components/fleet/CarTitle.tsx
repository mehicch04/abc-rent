export function splitTitle(title: string, model?: string | null): [string, string] {
  const t = title.trim();
  if (model) {
    const i = t.toLowerCase().indexOf(model.trim().toLowerCase());
    if (i >= 0) {
      const end = i + model.trim().length;
      const rest = t.slice(end).trim();
      if (rest) return [t.slice(0, end), rest];
      return [t, ""];
    }
  }
  const words = t.split(/\s+/);
  return words.length > 2 ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : [t, ""];
}

export function CarTitle({ title, model, variantClassName = "" }: { title: string; model?: string | null; variantClassName?: string }) {
  const [base, variant] = splitTitle(title, model);
  return (
    <>
      {base}
      {variant && <span className={`font-medium text-muted-foreground ${variantClassName}`}> {variant}</span>}
    </>
  );
}
