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

export const sectionReveal = {
  duration: 0.75,
  stagger: 0.08,
  y: 28,
} as const;
