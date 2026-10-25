import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_GSAP, sectionReveal } from "../config/motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, CustomEase);
const ease = CustomEase.get("kairo") ?? CustomEase.create("kairo", EASE_GSAP);

/** Fade-up children marked with [data-reveal] when the section enters view. */
export function useSectionReveal(root: RefObject<HTMLElement | null>) {
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    if (reduced) {
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { autoAlpha: 0, y: sectionReveal.y });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: sectionReveal.duration,
        stagger: sectionReveal.stagger,
        ease,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [root, reduced]);
}
