interface PatternDividerProps {
  className?: string;
  flip?: boolean;
}

/**
 * The brand's signature motif: a single continuous hand-drawn mehndi paisley
 * line, used sparingly as a section divider instead of a generic rule.
 * Rendered with a stroke-dashoffset animation so it "draws" in on load.
 */
export default function PatternDivider({ className = "", flip = false }: PatternDividerProps) {
  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 40"
        className={`h-8 w-full text-gold-400 ${flip ? "-scale-y-100" : ""}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M0 20 C 40 5, 60 5, 80 20 C 92 28, 100 34, 110 26 C 118 20, 112 10, 102 12 C 94 14, 96 22, 104 22 C 130 22, 140 6, 170 6 C 210 6, 210 34, 250 34 C 280 34, 290 14, 320 20 C 350 26, 360 12, 400 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[drawLine_1.8s_ease-out_forwards]"
        />
        <circle cx="200" cy="20" r="2.5" fill="currentColor" />
      </svg>
    </div>
  );
}
