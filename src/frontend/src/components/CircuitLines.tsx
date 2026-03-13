interface CircuitLinesProps {
  powered: boolean;
}

const BRANCH_X = [110, 230, 370, 490] as const;
const BRANCH_KEYS = ["bass", "mid", "high", "presence"] as const;

export function CircuitLines({ powered }: CircuitLinesProps) {
  const strokeColor = powered ? "#FFD700" : "#1a3a6b";
  const strokeOpacity = powered ? 1 : 0.4;
  const glowId = "circuitGlow";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 80,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <svg
        width="100%"
        height="80"
        viewBox="0 0 600 80"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
        aria-label="Circuit power lines"
      >
        <title>Circuit power lines</title>
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {powered && (
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
          )}
        </defs>

        <line
          x1="90"
          y1="0"
          x2="90"
          y2="30"
          stroke={strokeColor}
          strokeWidth={powered ? 2.5 : 1.5}
          strokeOpacity={strokeOpacity}
          filter={powered ? `url(#${glowId})` : undefined}
        />
        <line
          x1="510"
          y1="0"
          x2="510"
          y2="30"
          stroke={strokeColor}
          strokeWidth={powered ? 2.5 : 1.5}
          strokeOpacity={strokeOpacity}
          filter={powered ? `url(#${glowId})` : undefined}
        />
        <line
          x1="90"
          y1="30"
          x2="510"
          y2="30"
          stroke={strokeColor}
          strokeWidth={powered ? 3 : 2}
          strokeOpacity={strokeOpacity}
          filter={powered ? `url(#${glowId})` : undefined}
        />

        {BRANCH_X.map((x, i) => (
          <line
            key={BRANCH_KEYS[i]}
            x1={x}
            y1="30"
            x2={x}
            y2="80"
            stroke={strokeColor}
            strokeWidth={powered ? 2 : 1.5}
            strokeOpacity={strokeOpacity}
            filter={powered ? `url(#${glowId})` : undefined}
          />
        ))}

        <line
          x1="90"
          y1="30"
          x2="110"
          y2="30"
          stroke={strokeColor}
          strokeWidth={powered ? 2 : 1.5}
          strokeOpacity={strokeOpacity}
        />
        <line
          x1="510"
          y1="30"
          x2="490"
          y2="30"
          stroke={strokeColor}
          strokeWidth={powered ? 2 : 1.5}
          strokeOpacity={strokeOpacity}
        />

        {powered && (
          <>
            <circle r="4" fill="#FFD700" opacity="0.9">
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                path="M90,0 L90,30 L300,30"
              />
            </circle>
            <circle r="4" fill="#FFD700" opacity="0.9">
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                begin="0.75s"
                path="M510,0 L510,30 L300,30"
              />
            </circle>
            <circle r="3" fill="#FFE44D" opacity="0.8">
              <animateMotion
                dur="1s"
                repeatCount="indefinite"
                path="M300,30 L110,30 L110,80"
              />
            </circle>
            <circle r="3" fill="#FFE44D" opacity="0.8">
              <animateMotion
                dur="1s"
                repeatCount="indefinite"
                begin="0.25s"
                path="M300,30 L230,30 L230,80"
              />
            </circle>
            <circle r="3" fill="#FFE44D" opacity="0.8">
              <animateMotion
                dur="1s"
                repeatCount="indefinite"
                begin="0.5s"
                path="M300,30 L370,30 L370,80"
              />
            </circle>
            <circle r="3" fill="#FFE44D" opacity="0.8">
              <animateMotion
                dur="1s"
                repeatCount="indefinite"
                begin="0.75s"
                path="M300,30 L490,30 L490,80"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}
