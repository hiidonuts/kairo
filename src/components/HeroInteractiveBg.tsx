import { useEffect, useRef, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const HOME = { x: 0.5, y: 0.32 };
/** Tiny travel range — wash barely leaves home. */
const DRIFT = { x: 0.05, y: 0.035 };
/** Very slow ease so cursor motion barely registers. */
const EASE = 0.0018;

/**
 * Soft gradient wash that drifts with the pointer.
 * No backdrop-filter / animated masks — those flash dark when the hero scrolls.
 */
export default function HeroInteractiveBg() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const pos = useRef({ ...HOME });
  const target = useRef({ ...HOME });

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const setVars = (x: number, y: number) => {
      el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
    };

    setVars(pos.current.x, pos.current.y);

    if (reduced) return;

    const onMove = (event: PointerEvent) => {
      const section = el.parentElement;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Stop reacting once the hero has mostly left the viewport
      if (rect.bottom < 120 || rect.top > window.innerHeight * 0.75) {
        target.current.x = HOME.x;
        target.current.y = HOME.y;
        return;
      }

      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      target.current.x = HOME.x + (nx - 0.5) * DRIFT.x * 2;
      target.current.y = HOME.y + (ny - 0.5) * DRIFT.y * 2;
    };

    let raf = 0;
    const tick = () => {
      const p = pos.current;
      const t = target.current;
      p.x += (t.x - p.x) * EASE;
      p.y += (t.y - p.y) * EASE;
      setVars(p.x, p.y);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={root}
      className="hero-interactive-bg"
      aria-hidden
      style={
        {
          ["--mx"]: "50%",
          ["--my"]: "32%",
        } as CSSProperties
      }
    >
      <div className="hero-interactive-bg__field" />
      <div className="hero-interactive-bg__glow" />
      <div className="hero-interactive-bg__soft" />
    </div>
  );
}
