import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function isLowPowerDevice() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return true;
  if (nav.connection?.saveData) return true;
  return false;
}

function computeEnabled(reduced: boolean) {
  if (reduced || isMobileViewport() || isLowPowerDevice()) return false;
  return true;
}

/** False → use static poster + normal scroll instead of the R3F scene. */
export function useWebGLEnabled() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(() =>
    typeof window !== "undefined" ? computeEnabled(reduced) : false
  );

  useEffect(() => {
    const update = () => setEnabled(computeEnabled(reduced));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduced]);

  return enabled;
}
