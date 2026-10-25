/** All motion values live here so they can be tuned in one place. */

export const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";
export const EASE_GSAP = "0.22, 1, 0.36, 1";

export const intro = {
  duration: 1.6,
  wordRise: 0.7,
  fadeOut: 0.45,
  wordStagger: 0.06,
} as const;

export const heroReveal = {
  lineDuration: 0.9,
  lineStagger: 0.08,
  fadeDuration: 0.55,
  fadeDelay: 0.18,
} as const;

export const nav = {
  hideDuration: 0.45,
} as const;

export const camera = {
  hero: { position: [0, 0.15, 13.5] as const, lookAt: [0, 0, 0] as const },
  /** Keep parallax low so the graph does not shake with the mouse */
  parallax: 0.1,
  lerp: 0.045,
} as const;

export const graph = {
  nodeCount: 30,
  /** Whole graph fade (nodes, lines, labels) */
  opacity: 0.2,
  /** Cursor parting — readable, then settles when still */
  cursorRepelRadius: 3.2,
  cursorRepelStrength: 1.1,
  /** Lower = silkier chase of sim positions */
  displayLerp: 0.032,
  /** Graph-space cursor follow */
  cursorLerp: 0.08,
  labelNear: 2.2,
  labelBaseOpacity: 0.7,
  labelNearOpacity: 1,
} as const;

export const scroll = {
  /** Progress where hero graph begins to fade/settle as the mini app takes focus */
  heroEnd: 0.45,
} as const;

/** Shared pointer smoothing for camera + graph */
export const pointerSmooth = 0.08;
