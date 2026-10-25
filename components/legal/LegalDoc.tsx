import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { TermsBlock, TermsContent } from "@/lib/rental-terms";

function Block({ block }: { block: TermsBlock }) {
  if (block.type === "p") {
    return <p className="text-[15px] leading-relaxed text-foreground/90">{block.text}</p>;
  }
  if (block.type === "ul") {
    return (
      <ul className="space-y-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/90">
            <span className="mt-[0.55rem] h-1.5 w-1.5 flex-none rounded-full bg-brand" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ol className="space-y-2.5">
      {block.items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/90">
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">{i + 1}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function LegalDoc({ c, children }: { c: TermsContent; children?: ReactNode }) {
  const toc = (
    <ol className="space-y-0.5">
      {c.articles.map((a) => (
        <li key={a.n}>
          <a
            href={`#clanak-${a.n}`}
            className="flex gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-brand"
          >
            <span className="font-medium text-brand-strong">{String(a.n).padStart(2, "0")}</span>
            {a.topic}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="mt-16 grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <details className="group rounded-2xl bg-surface-muted p-2 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-foreground">
              {c.indexLabel}
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <nav className="px-1 pb-1">{toc}</nav>
          </details>
          <nav className="hidden lg:block">
            <p className="px-3 text-sm font-semibold text-foreground">{c.indexLabel}</p>
            <div className="mt-3">{toc}</div>
          </nav>
          {children && <div className="mt-6 hidden lg:block">{children}</div>}
        </aside>

        <div>
          {c.articles.map((a) => (
            <section key={a.n} id={`clanak-${a.n}`} className="scroll-mt-28 border-t border-border py-8 first:border-t-0 first:pt-0">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-sm font-semibold text-brand-strong">{String(a.n).padStart(2, "0")}</span>
                <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{a.topic}</h2>
              </div>
              <div className="mt-4 space-y-4 ps-9">
                {a.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
          {children && <div className="mt-4 lg:hidden">{children}</div>}
        </div>
      </div>
    </div>
  );
}
