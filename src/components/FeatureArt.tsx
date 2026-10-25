/** Custom maroon line art per feature — not stock icons. */

type Props = { kind: string; className?: string };

export default function FeatureArt({ kind, className = "" }: Props) {
  const common = {
    className,
    viewBox: "0 0 320 200",
    fill: "none",
    "aria-hidden": true as const,
  };

  switch (kind) {
    case "capture":
      return (
        <svg {...common}>
          <rect x="48" y="36" width="160" height="128" stroke="currentColor" strokeWidth="1.25" />
          <path d="M48 60h160M72 84h80M72 104h112M72 124h64" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="236" cy="100" r="36" stroke="currentColor" strokeWidth="1.25" />
          <path d="M236 76v48M212 100h48" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "practice":
      return (
        <svg {...common}>
          <rect x="70" y="28" width="140" height="90" stroke="currentColor" strokeWidth="1.25" />
          <path d="M90 56h100M90 76h72" stroke="currentColor" strokeWidth="1.25" />
          <rect x="100" y="88" width="120" height="84" stroke="currentColor" strokeWidth="1.25" opacity="0.7" />
          <path d="M120 120h80M120 140h48" stroke="currentColor" strokeWidth="1.25" opacity="0.7" />
        </svg>
      );
    case "connect":
      return (
        <svg {...common}>
          <circle cx="80" cy="100" r="10" fill="currentColor" />
          <circle cx="160" cy="56" r="8" fill="currentColor" />
          <circle cx="220" cy="120" r="12" fill="currentColor" />
          <circle cx="140" cy="150" r="7" fill="currentColor" />
          <path
            d="M80 100L160 56L220 120L140 150L80 100"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </svg>
      );
    case "assist":
      return (
        <svg {...common}>
          <path
            d="M60 140V70c0-12 10-22 22-22h100c12 0 22 10 22 22v40c0 12-10 22-22 22H120l-28 28v-28H82c-12 0-22-10-22-22Z"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="110" cy="98" r="3.5" fill="currentColor" />
          <circle cx="140" cy="98" r="3.5" fill="currentColor" />
          <circle cx="170" cy="98" r="3.5" fill="currentColor" />
        </svg>
      );
    case "focus":
      return (
        <svg {...common}>
          <circle cx="160" cy="100" r="54" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="160" cy="100" r="36" stroke="currentColor" strokeWidth="1.25" opacity="0.55" />
          <circle cx="160" cy="100" r="6" fill="currentColor" />
          <path d="M160 40v18M160 142v18M100 100h-18M238 100h-18" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "own":
      return (
        <svg {...common}>
          <rect x="108" y="70" width="104" height="78" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M128 70V58c0-18 14-32 32-32s32 14 32 32v12"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="160" cy="108" r="8" stroke="currentColor" strokeWidth="1.25" />
          <path d="M160 116v16" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    default:
      return null;
  }
}
