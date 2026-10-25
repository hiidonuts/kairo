import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  src: string;
  alt: string;
  /** Intrinsic pixel size — keeps the frame at the source aspect ratio. */
  width: number;
  height: number;
};

/**
 * Clipped plate at native aspect. Slight vertical oversize for scroll drift
 * without cropping hard into the image.
 */
export default function FeatureParallaxFrame({
  src,
  alt,
  width,
  height,
}: Props) {
  const frame = useRef<HTMLElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const plate = frame.current;
    const mover = layer.current;
    if (!plate || !mover) return;

    if (reduced) {
      gsap.set(mover, { yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mover,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: plate,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    }, plate);

    return () => ctx.revert();
  }, [reduced, src]);

  return (
    <figure
      ref={frame}
      className="relative mt-5 w-full overflow-hidden bg-white/[0.04] sm:mt-7 md:mt-8"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        ref={layer}
        className="absolute inset-x-0 top-[-5%] h-[110%] w-full will-change-transform"
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </figure>
  );
}
