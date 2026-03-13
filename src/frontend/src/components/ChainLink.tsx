interface ChainLinkProps {
  eqValues: Record<string, number>;
}

export function ChainLink({ eqValues }: ChainLinkProps) {
  const totalDistortion = Object.values(eqValues).reduce(
    (acc, v) => acc + Math.abs(v),
    0,
  );
  const normalizedDistortion = Math.min(totalDistortion / 72, 1);

  const numLinks = 12;
  const linkWidth = 32;
  const linkHeight = 16;
  const svgWidth = numLinks * (linkWidth + 4) + 20;
  const svgHeight = 60;

  const links = Array.from({ length: numLinks }, (_, i) => {
    const isVertical = i % 2 === 1;
    const cx = 22 + i * (linkWidth + 4);
    const cy = svgHeight / 2;
    const distortOffset =
      normalizedDistortion * Math.sin((i / numLinks) * Math.PI * 2) * 8;
    const scaleX = 1 + (isVertical ? 0 : normalizedDistortion * 0.3);
    const scaleY = 1 + (isVertical ? normalizedDistortion * 0.3 : 0);
    return { cx, cy: cy + distortOffset, isVertical, scaleX, scaleY, idx: i };
  });

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: "2px solid #1a3a6b",
        borderRadius: 12,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: "#FFD700",
          letterSpacing: "0.2em",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        ⛓ EQ CHAIN LINK
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            animation: "chainSway 3s ease-in-out infinite",
            display: "block",
            margin: "0 auto",
          }}
          aria-label="EQ chain link visualization"
        >
          <title>EQ chain link visualization</title>
          <defs>
            <filter id="chainGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {links.map(({ cx, cy, isVertical, scaleX, scaleY, idx }) => (
            <ellipse
              key={`link-${idx}`}
              cx={cx}
              cy={cy}
              rx={
                isVertical
                  ? (linkHeight / 2) * scaleX
                  : (linkWidth / 2) * scaleX
              }
              ry={
                isVertical
                  ? (linkWidth / 2) * scaleY
                  : (linkHeight / 2) * scaleY
              }
              fill={`rgba(255,215,0,${0.08 + normalizedDistortion * 0.12})`}
              stroke="#FFD700"
              strokeWidth={1.5 + normalizedDistortion}
              filter="url(#chainGlow)"
              style={{ transition: "all 0.3s ease" }}
            />
          ))}

          {normalizedDistortion > 0.1 && (
            <text
              x={svgWidth / 2}
              y={svgHeight - 4}
              textAnchor="middle"
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: 9,
                fill: "rgba(255,215,0,0.6)",
              }}
            >
              TENSION: {Math.round(normalizedDistortion * 100)}%
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
