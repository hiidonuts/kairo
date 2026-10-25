import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoPlayer from "../components/VideoPlayer";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  webgl: boolean;
};

export default function VideoSection({ webgl }: Props) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = section.current;
    const card = frame.current;
    if (!el || !card) return;

    if (reduced || !webgl) {
      gsap.set(card, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(card, { autoAlpha: 0, scale: 0.92 });

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Fade the frame in as the camera arrives
          const appear = gsap.utils.clamp(0, 1, (p - 0.15) / 0.25);
          gsap.set(card, {
            autoAlpha: appear,
            scale: 0.92 + appear * 0.08,
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, webgl]);

  return (
    <section
      ref={section}
      id="video"
      className={`relative z-10 ${webgl && !reduced ? "h-[100svh]" : "min-h-[100svh] py-24"}`}
    >
      <div className="page-grid h-full items-center">
        <div ref={frame} className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
          <VideoPlayer />
          <p className="mt-5 text-center font-display text-xl text-charcoal md:text-2xl">
            A minute with Kairo.
          </p>
        </div>
      </div>
    </section>
  );
}
