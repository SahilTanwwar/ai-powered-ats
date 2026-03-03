/**
 * ScoreRing â€” SVG circular progress indicator
 * Props: score (0-100), size (px), strokeWidth
 */
export default function ScoreRing({ score = 0, size = 96, strokeWidth = 8 }) {
  const radius    = (size - strokeWidth) / 2;
  const circ      = 2 * Math.PI * radius;
  const pct       = Math.min(100, Math.max(0, score));
  const dashOffset = circ * (1 - pct / 100);

  // Color by score
  const color =
    pct >= 80 ? "#10B981" :   // green
    pct >= 60 ? "#F59E0B" :   // amber
                "#EF4444";    // red

  const label =
    pct >= 80 ? "Excellent" :
    pct >= 60 ? "Good" :
    pct >= 40 ? "Average" :
                "Poor";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        {/* Center text â€” un-rotate for readability */}
        <g style={{ transform: `rotate(90deg) translate(0, -${size}px)` }}>
          <text
            x={size / 2} y={size / 2 + 2}
            textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: size / 4.2, fontWeight: 700, fill: color }}
          >
            {pct}
          </text>
        </g>
      </svg>
      <span className="text-xs font-medium text-slate-500">{label} Match</span>
    </div>
  );
}
