import { useEffect, useRef, useState } from "react";

interface PowerStabilizerProps {
  isActive: boolean;
}

export function PowerStabilizer({ isActive }: PowerStabilizerProps) {
  const [needleAngle, setNeedleAngle] = useState(-90);
  const [power, setPower] = useState(0);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      targetRef.current = 0;
    } else {
      targetRef.current = 100;
    }

    const animate = () => {
      const diff = targetRef.current - currentRef.current;
      currentRef.current += diff * 0.03;
      const angle = -90 + (currentRef.current / 100) * 180;
      setNeedleAngle(angle);
      // Scale up to 80,000W
      setPower(Math.round(currentRef.current * 800));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive]);

  const needleX = 80 + 60 * Math.cos(((needleAngle - 90) * Math.PI) / 180);
  const needleY = 80 + 60 * Math.sin(((needleAngle - 90) * Math.PI) / 180);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: `2px solid ${isActive ? "#FFD700" : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "16px",
        boxShadow: isActive ? "0 0 20px rgba(255,215,0,0.3)" : "none",
        transition: "all 0.4s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        minWidth: 180,
      }}
    >
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: "#FFD700",
          letterSpacing: "0.15em",
          textAlign: "center",
        }}
      >
        80,000W POWER STABILIZER
      </div>

      <svg width={160} height={90} viewBox="0 0 160 90">
        <title>80000W Power stabilizer gauge</title>
        {/* Background arc */}
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#1a3a6b"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Color zones */}
        <path
          d="M 20 80 A 60 60 0 0 1 80 20"
          fill="none"
          stroke="rgba(0,255,136,0.3)"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d="M 80 20 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="rgba(255,60,60,0.2)"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Fill arc */}
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke={isActive ? "#FFD700" : "#2a3a5b"}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${(Math.max(0, needleAngle + 90) / 180) * 188.5} 188.5`}
          style={{
            transition: "stroke-dasharray 0.1s",
            filter: isActive ? "drop-shadow(0 0 4px #FFD700)" : "none",
          }}
        />
        {/* Tick marks */}
        {[-90, -60, -30, 0, 30, 60, 90].map((a) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const x1 = 80 + 55 * Math.cos(rad);
          const y1 = 80 + 55 * Math.sin(rad);
          const x2 = 80 + 65 * Math.cos(rad);
          const y2 = 80 + 65 * Math.sin(rad);
          return (
            <line
              key={a}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#1a3a6b"
              strokeWidth={1.5}
            />
          );
        })}
        {/* Watt labels */}
        {[0, 20, 40, 60, 80].map((kw, i) => {
          const angle = -90 + i * 45;
          const rad = ((angle - 90) * Math.PI) / 180;
          const x = 80 + 48 * Math.cos(rad);
          const y = 80 + 48 * Math.sin(rad);
          return (
            <text
              key={kw}
              x={x}
              y={y}
              textAnchor="middle"
              fill="rgba(255,215,0,0.4)"
              fontSize={5}
              fontFamily="Orbitron, sans-serif"
            >
              {kw}k
            </text>
          );
        })}
        {/* Needle */}
        <line
          x1={80}
          y1={80}
          x2={needleX}
          y2={needleY}
          stroke={isActive ? "#FF4444" : "#2a3a5b"}
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ filter: isActive ? "drop-shadow(0 0 4px #FF4444)" : "none" }}
        />
        <circle cx={80} cy={80} r={5} fill={isActive ? "#FFD700" : "#2a3a5b"} />
      </svg>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: isActive ? "#FFD700" : "#2a3a5b",
          textShadow: isActive ? "0 0 15px #FFD700" : "none",
          letterSpacing: "0.1em",
        }}
      >
        {power.toLocaleString()}W
      </div>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 7,
          color: isActive ? "rgba(0,255,136,0.8)" : "rgba(255,255,255,0.3)",
          letterSpacing: "0.15em",
          textShadow: isActive ? "0 0 8px #00FF88" : "none",
        }}
      >
        {isActive ? "✓ AMP + APP STABILIZER ONLINE" : "STABILIZER OFFLINE"}
      </div>
    </div>
  );
}
