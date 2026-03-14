import { useEffect, useRef, useState } from "react";

interface PowerStabilizerProps {
  isActive: boolean;
  onActiveChange?: (active: boolean) => void;
}

export function PowerStabilizer({
  isActive,
  onActiveChange,
}: PowerStabilizerProps) {
  const [needleAngle, setNeedleAngle] = useState(-90);
  const [power, setPower] = useState(0);
  const [limiterOn, setLimiterOn] = useState(true);
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
      setPower(Math.round(currentRef.current * 800));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive]);

  const handleToggle = () => {
    const next = !limiterOn;
    setLimiterOn(next);
    onActiveChange?.(next);
  };

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
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#1a3a6b"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d="M 20 80 A 60 60 0 0 1 80 20"
          fill="none"
          stroke="#00CC44"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={isActive ? 1 : 0.3}
        />
        <path
          d="M 80 20 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#FF4400"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={isActive ? 1 : 0.3}
        />
        <text
          x="18"
          y="92"
          fill="rgba(255,215,0,0.6)"
          fontSize="8"
          fontFamily="Orbitron"
        >
          {"0"}
        </text>
        <text
          x="74"
          y="16"
          fill="rgba(255,215,0,0.6)"
          fontSize="8"
          fontFamily="Orbitron"
        >
          {"40k"}
        </text>
        <text
          x="130"
          y="92"
          fill="rgba(255,215,0,0.6)"
          fontSize="8"
          fontFamily="Orbitron"
        >
          {"80k"}
        </text>
        {isActive && (
          <line
            x1="80"
            y1="80"
            x2={needleX}
            y2={needleY}
            stroke="#FFD700"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}
        <circle cx="80" cy="80" r="5" fill={isActive ? "#FFD700" : "#1a3a6b"} />
      </svg>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: isActive ? "#FFD700" : "rgba(255,215,0,0.3)",
          textShadow: isActive ? "0 0 12px #FFD700" : "none",
          letterSpacing: "0.1em",
        }}
      >
        {power.toLocaleString()}W
      </div>

      {/* LIMITER toggle */}
      <button
        type="button"
        data-ocid="power.limiter_toggle"
        onClick={handleToggle}
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 8,
          padding: "5px 12px",
          background: limiterOn
            ? "linear-gradient(180deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))"
            : "rgba(0,0,0,0.4)",
          border: `1px solid ${limiterOn ? "#FFD700" : "#1a3a6b"}`,
          borderRadius: 6,
          color: limiterOn ? "#FFD700" : "rgba(255,215,0,0.3)",
          cursor: "pointer",
          letterSpacing: "0.15em",
          boxShadow: limiterOn ? "0 0 10px rgba(255,215,0,0.3)" : "none",
        }}
      >
        LIMITER {limiterOn ? "ON" : "OFF"}
      </button>
    </div>
  );
}
