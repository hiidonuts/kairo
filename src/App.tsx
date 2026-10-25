import { lazy, Suspense, useCallback, useState } from "react";
import Intro from "./components/Intro";
import Nav from "./components/Nav";
import HeroSection from "./sections/HeroSection";
import ScrollPlaceholder from "./sections/ScrollPlaceholder";
import { useSmoothScroll, usePointerStore } from "./lib/smoothScroll";
import { useWebGLEnabled } from "./hooks/useWebGLEnabled";

const SceneCanvas = lazy(() => import("./canvas/SceneCanvas"));

export default function App() {
  const webgl = useWebGLEnabled();
  const [ready, setReady] = useState(false);
  const reveal = useCallback(() => setReady(true), []);

  useSmoothScroll();
  usePointerStore();

  return (
    <div className="ios-canvas min-h-[100svh] text-charcoal">
      {!ready && <Intro webgl={webgl} onComplete={reveal} />}
      <Nav />

      {webgl && (
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      )}

      <main className="relative z-[2]">
        <HeroSection ready={ready} webgl={webgl} />
        <ScrollPlaceholder />
      </main>
    </div>
  );
}
