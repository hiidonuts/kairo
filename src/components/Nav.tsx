import { useEffect, useState } from "react";

/**
 * Dynamic-island nav: floating glass capsule that stays put while
 * page content scrolls underneath (blur reads through the frosted shell).
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <nav
        aria-label="Primary"
        className={`pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border px-2 py-1.5 pl-4 shadow-[0_8px_32px_rgb(15_23_42/0.08)] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:gap-5 sm:px-2.5 sm:pl-5 ${
          scrolled
            ? "border-black/[0.06] bg-white/70 shadow-[0_10px_40px_rgb(15_23_42/0.12)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-black/[0.04] bg-white/45 backdrop-blur-xl backdrop-saturate-150"
        }`}
        style={{
          WebkitBackdropFilter: scrolled
            ? "saturate(1.5) blur(24px)"
            : "saturate(1.5) blur(18px)",
        }}
      >
        <a
          href="#top"
          className="font-display shrink-0 text-[1.05rem] font-semibold tracking-tight text-charcoal sm:text-lg"
        >
          Kairo
        </a>

        <div className="mx-1 hidden h-4 w-px bg-charcoal/10 sm:block" aria-hidden />

        <div className="hidden items-center gap-1 sm:flex">
          <a
            href="#product"
            className="rounded-full px-3 py-1.5 font-nav text-[13px] font-medium text-charcoal/55 transition-colors hover:bg-charcoal/[0.04] hover:text-charcoal"
          >
            Product
          </a>
          <a
            href="#top"
            className="rounded-full px-3 py-1.5 font-nav text-[13px] font-medium text-charcoal/55 transition-colors hover:bg-charcoal/[0.04] hover:text-charcoal"
          >
            Try demo
          </a>
        </div>

        <button type="button" className="btn-island ml-auto sm:ml-0">
          Download
        </button>
      </nav>
    </header>
  );
}
