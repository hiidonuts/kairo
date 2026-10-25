import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { EASE_GSAP, heroReveal } from "../config/motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import HeroPoster from "../components/HeroPoster";
import MiniKairoApp from "../mini-app/MiniKairoApp";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.get("kairo") ?? CustomEase.create("kairo", EASE_GSAP);

const lines = ["Study smarter.", "Keep it yours."];

type Props = {
  ready: boolean;
  webgl: boolean;
};

export default function HeroSection({ ready, webgl }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el.querySelectorAll("[data-reveal]"), { autoAlpha: 0 });
      return;
    }
    gsap.set(el.querySelectorAll("[data-line]"), { yPercent: 110 });
    gsap.set(el.querySelectorAll("[data-fade]"), { autoAlpha: 0 });
  }, [reduced]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !ready) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.to("[data-reveal]", { autoAlpha: 1, duration: 0.4, stagger: 0.05 });
        return;
      }
      gsap.to("[data-line]", {
        yPercent: 0,
        duration: heroReveal.lineDuration,
        stagger: heroReveal.lineStagger,
        ease,
      });
      gsap.to("[data-fade]", {
        autoAlpha: 1,
        duration: heroReveal.fadeDuration,
        delay: heroReveal.fadeDelay,
        stagger: 0.06,
        ease,
      });
    }, el);

    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <section
      id="top"
      ref={root}
      className="relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-32"
    >
      {!webgl && <HeroPoster />}

      <div className="page-grid relative z-10">
        <div className="col-span-12 mx-auto max-w-3xl text-center">
          <h1
            className="font-display text-charcoal"
            style={{
              fontSize: "var(--text-display)",
              lineHeight: "var(--leading-display)",
              letterSpacing: "-0.02em",
            }}
          >
            {lines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span data-line data-reveal className="block pb-[0.06em]">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-fade
            data-reveal
            className="mx-auto mt-8 max-w-md text-base leading-relaxed text-charcoal/70"
          >
            Your notes, your flashcards and your AI, all on your own computer.
          </p>
        </div>

        <div
          id="product"
          data-fade
          data-reveal
          className="col-span-12 mt-10 md:mt-14"
        >
          <MiniKairoApp />
        </div>
      </div>
    </section>
  );
}
