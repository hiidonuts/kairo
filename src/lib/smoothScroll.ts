import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollStore } from "../store/scrollStore";

gsap.registerPlugin(ScrollTrigger);

/** Distance from viewport top to clear the fixed island nav (+ a little air). */
function navClearance() {
  const header = document.querySelector<HTMLElement>("[data-site-nav]");
  if (!header) return -72;
  return -(Math.ceil(header.getBoundingClientRect().bottom) + 8);
}

function scrollToHash(hash: string, lenis?: Lenis) {
  const id = hash.slice(1);
  if (!id) return false;
  const target = document.getElementById(id);
  if (!target) return false;

  const offset = navClearance();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.15 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "auto" });
  }
  history.replaceState(null, "", hash);
  return true;
}

export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const setProgress = useScrollStore.getState().setProgress;

    const updateProgress = () => {
      const hero = document.getElementById("kairo");
      if (!hero) {
        setProgress(0);
        return;
      }
      const { top, height } = hero.getBoundingClientRect();
      if (height <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, -top / height)));
    };

    if (reduced) {
      const onClick = (event: MouseEvent) => {
        const anchor = (event.target as Element | null)?.closest?.(
          'a[href^="#"]'
        ) as HTMLAnchorElement | null;
        if (!anchor?.hash) return;
        if (!scrollToHash(anchor.hash)) return;
        event.preventDefault();
      };

      window.addEventListener("scroll", updateProgress, { passive: true });
      document.addEventListener("click", onClick);
      updateProgress();
      return () => {
        window.removeEventListener("scroll", updateProgress);
        document.removeEventListener("click", onClick);
      };
    }

    // Manual anchors: measure the live nav height. Avoid CSS scroll-padding /
    // Lenis anchors.offset stacking, which left the previous section on screen.
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      allowNestedScroll: true,
      anchors: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", updateProgress);

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor?.hash) return;
      if (!scrollToHash(anchor.hash, lenis)) return;
      event.preventDefault();
    };
    document.addEventListener("click", onClick);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    updateProgress();

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced]);
}
