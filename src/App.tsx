import { useCallback, useState } from "react";
import Intro from "./components/Intro";
import Nav from "./components/Nav";
import SiteFooter from "./components/SiteFooter";
import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import FaqSection from "./sections/FaqSection";
import { useSmoothScroll } from "./lib/smoothScroll";

export default function App() {
  const [ready, setReady] = useState(false);
  const reveal = useCallback(() => setReady(true), []);

  useSmoothScroll();

  return (
    <div className="ios-canvas min-h-[100svh] text-charcoal">
      {!ready && <Intro onComplete={reveal} />}
      {ready && <Nav />}

      <main className="relative z-[2]">
        <HeroSection ready={ready} />
        <FeaturesSection />
        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
