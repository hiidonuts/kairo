import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { EASE_GSAP, intro } from "../config/motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.get("kairo") ?? CustomEase.create("kairo", EASE_GSAP);

type Props = {
  onComplete: () => void;
};

export default function Intro({ onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const reduced = usePrefersReducedMotion();

  const finish = () => {
    if (done.current) return;
    done.current = true;
    const el = root.current;
    if (!el) {
      onComplete();
      return;
    }
    gsap.to(el, {
      autoAlpha: 0,
      duration: reduced ? 0.25 : intro.fadeOut,
      ease,
      onComplete,
    });
  };

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-intro-line]", { yPercent: 0 });
      } else {
        gsap.fromTo(
          "[data-intro-line]",
          { yPercent: 110 },
          { yPercent: 0, duration: intro.wordRise, ease }
        );
      }
    }, el);

    const skip = () => finish();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === " ") {
        event.preventDefault();
        skip();
      }
    };

    el.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", skip, { passive: true });
    const leave = window.setTimeout(finish, reduced ? 200 : 900);
    const maxWait = window.setTimeout(finish, 1800);

    return () => {
      ctx.revert();
      window.clearTimeout(leave);
      window.clearTimeout(maxWait);
      el.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ivory"
      role="status"
      aria-live="polite"
      aria-label="Loading Kairo"
    >
      <div className="overflow-hidden font-display text-[clamp(3rem,9vw,5.5rem)] leading-none tracking-tight text-charcoal">
        <span className="block overflow-hidden">
          <span
            data-intro-line
            className="flex items-center justify-center gap-[0.28em]"
          >
            <img
              src="/kairo-ai.png"
              alt=""
              width={88}
              height={88}
              className="h-[0.92em] w-[0.92em] shrink-0 rounded-[0.18em] object-cover"
            />
            <span className="translate-y-[0.04em]">Kairo</span>
          </span>
        </span>
      </div>
    </div>
  );
}
