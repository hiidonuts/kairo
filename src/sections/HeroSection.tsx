import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { EASE_GSAP, heroReveal } from "../config/motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import HeroInteractiveBg from "../components/HeroInteractiveBg";
import MiniKairoApp from "../mini-app/MiniKairoApp";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.get("kairo") ?? CustomEase.create("kairo", EASE_GSAP);

const LINE_ONE = "Study smarter.";
const LINE_TWO = "Keep it yours.";

function WindowsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill="currentColor">
      <path d="M0 2.25 6.75 1.3v6.45H0Zm7.5-.95L16 0v7.75H7.5ZM0 8.55h6.75v6.45L0 13.95Zm7.5.1H16V16l-8.5-1.2Z" />
    </svg>
  );
}

type Props = {
  ready: boolean;
};

export default function HeroSection({ ready }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [typed, setTyped] = useState(reduced ? LINE_TWO : "");
  const [typingDone, setTypingDone] = useState(reduced);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el.querySelectorAll("[data-reveal]"), { autoAlpha: 0 });
      return;
    }
    gsap.set(el.querySelectorAll("[data-line]"), { yPercent: 110 });
    gsap.set(el.querySelectorAll("[data-fade]"), { autoAlpha: 0 });
    gsap.set(el.querySelectorAll("[data-type-line]"), { autoAlpha: 0 });
  }, [reduced]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !ready) return;

    let cancelled = false;
    let typeTimer: number | undefined;
    setTyped(reduced ? LINE_TWO : "");
    setTypingDone(!!reduced);

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.to("[data-reveal]", { autoAlpha: 1, duration: 0.4, stagger: 0.05 });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (cancelled) return;
          let i = 0;
          typeTimer = window.setInterval(() => {
            if (cancelled) {
              window.clearInterval(typeTimer);
              return;
            }
            i += 1;
            setTyped(LINE_TWO.slice(0, i));
            if (i >= LINE_TWO.length) {
              window.clearInterval(typeTimer);
              setTypingDone(true);
            }
          }, 48);
        },
      });

      tl.to("[data-line]", {
        yPercent: 0,
        duration: heroReveal.lineDuration,
        ease,
      }).to(
        "[data-type-line]",
        {
          autoAlpha: 1,
          duration: 0.2,
          ease,
        },
        "-=0.35"
      );

      tl.to(
        "[data-fade]",
        {
          autoAlpha: 1,
          duration: heroReveal.fadeDuration,
          stagger: 0.06,
          ease,
        },
        heroReveal.fadeDelay
      );
    }, el);

    return () => {
      cancelled = true;
      if (typeTimer !== undefined) window.clearInterval(typeTimer);
      ctx.revert();
    };
  }, [ready, reduced]);

  return (
    <section
      id="kairo"
      ref={root}
      className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36"
    >
      <HeroInteractiveBg />

      <div className="page-grid relative z-10">
        <div className="col-span-12 mx-auto max-w-4xl text-center">
          <h1
            className="font-display text-charcoal"
            style={{
              fontSize: "var(--text-display)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            <span className="block overflow-hidden py-[0.06em]">
              <span data-line data-reveal className="block">
                {LINE_ONE}
              </span>
            </span>
            <span
              data-type-line
              data-reveal
              className="mt-[-0.08em] block min-h-[1.05em]"
              aria-label={LINE_TWO}
            >
              <span aria-hidden="true">
                {typed}
                {!typingDone && (
                  <span className="ml-[0.02em] inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] bg-charcoal align-baseline animate-pulse" />
                )}
              </span>
            </span>
          </h1>

          <p
            data-fade
            data-reveal
            className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-[var(--muted)] md:text-base"
          >
            A study companion that improves your study workflow.
          </p>

          <div
            id="download"
            data-fade
            data-reveal
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a href="#faq" className="btn-solid">
              <WindowsIcon className="h-4 w-4" />
              Download for Windows
            </a>
          </div>
        </div>

        <div
          id="product"
          data-fade
          data-reveal
          className="col-span-12 mt-12 md:mt-16"
        >
          <MiniKairoApp />
        </div>
      </div>
    </section>
  );
}
