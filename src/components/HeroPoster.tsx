/** Static fallback when WebGL is disabled (mobile / reduced motion / low power). */
export default function HeroPoster() {
  const labels = [
    [820, 300, "Physics"],
    [700, 240, "Biology"],
    [920, 260, "History"],
    [640, 380, "Calculus"],
    [880, 420, "Ethics"],
    [760, 480, "Poetry"],
    [980, 360, "Ecology"],
  ] as const;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" fill="none">
        <path
          d="M780 340 L700 240 L920 260 L780 340 L640 380 L880 420 L780 340 L760 480 L980 360 L920 260"
          stroke="var(--charcoal)"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        {[
          [780, 340, 5],
          [700, 240, 3],
          [920, 260, 3],
          [640, 380, 3.5],
          [880, 420, 3],
          [760, 480, 2.5],
          [980, 360, 3],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="var(--maroon)" fillOpacity="0.55" />
        ))}
        {labels.map(([x, y, text]) => (
          <text
            key={text}
            x={x + 10}
            y={y + 4}
            fill="var(--charcoal)"
            fillOpacity="0.4"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="13"
          >
            {text}
          </text>
        ))}
      </svg>
    </div>
  );
}
