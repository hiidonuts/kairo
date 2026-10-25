import { useEffect, useState } from "react";

/** Frosted glass dynamic-island nav. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-site-nav
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]"
    >
      <nav
        aria-label="Primary"
        className={`pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-center gap-1.5 rounded-[var(--radius-pill)] border px-1.5 py-1.5 pl-3 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 min-[520px]:max-w-[calc(100vw-2rem)] min-[520px]:gap-3 min-[520px]:px-2.5 min-[520px]:pl-4 sm:gap-4 sm:pl-5 ${
          scrolled
            ? "border-black/[0.08] bg-white/70 shadow-[0_10px_40px_rgb(15_23_42/0.12)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-black/[0.06] bg-white/45 backdrop-blur-xl backdrop-saturate-150"
        }`}
        style={{
          WebkitBackdropFilter: scrolled
            ? "saturate(1.5) blur(24px)"
            : "saturate(1.5) blur(18px)",
        }}
      >
        <a
          href="#kairo"
          className="font-display flex shrink-0 items-center gap-1.5 leading-none text-base font-semibold tracking-tight text-charcoal min-[520px]:gap-2 min-[520px]:text-[1.05rem] sm:text-lg"
        >
          <img
            src="/kairo-ai.png"
            alt=""
            width={22}
            height={22}
            className="h-[1.15em] w-[1.15em] shrink-0 rounded-[6px] object-cover"
          />
          <span className="translate-y-[0.04em]">Kairo</span>
        </a>

        <div className="mx-0.5 hidden h-4 w-px bg-charcoal/10 min-[520px]:block" aria-hidden />

        <div className="hidden items-center gap-0.5 min-[520px]:flex">
          {[
            ["Features", "#features"],
            ["FAQs", "#faq"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-[var(--radius-pill)] px-2 py-1.5 font-nav text-[11px] font-semibold tracking-[0.04em] text-charcoal/50 uppercase transition-colors hover:bg-charcoal/[0.04] hover:text-charcoal sm:px-3 sm:text-[12px]"
            >
              {label}
            </a>
          ))}
        </div>

        <a href="#download" className="btn-nav ml-auto shrink-0 px-3 text-[12px] sm:ml-0 sm:px-4 sm:text-[var(--text-sm)]">
          Try Kairo
        </a>
      </nav>
    </header>
  );
}
