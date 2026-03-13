import { useEffect, useRef, useState } from "react";

interface BatteryWidgetProps {
  id: 1 | 2;
  label: string;
  onChargeChange: (level: number) => void;
}

const ARC_POSITIONS = [
  { top: "-12px", left: "30%", width: "40%", height: "8px", key: "top" },
  {
    top: "20%",
    right: "-14px",
    width: "12px",
    height: "30px",
    key: "right-top",
  },
  {
    bottom: "25%",
    left: "-14px",
    width: "12px",
    height: "25px",
    key: "left-bot",
  },
  {
    top: "50%",
    right: "-10px",
    width: "10px",
    height: "20px",
    key: "right-mid",
  },
];

export function BatteryWidget({
  id,
  label,
  onChargeChange,
}: BatteryWidgetProps) {
  const [chargeLevel, setChargeLevel] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chargeRef = useRef(0);
  const onChargeChangeRef = useRef(onChargeChange);
  onChargeChangeRef.current = onChargeChange;

  const totalDuration = id === 1 ? 8000 : 10000;
  const stepsRef = useRef(totalDuration / 50);

  useEffect(() => {
    const steps = stepsRef.current;
    intervalRef.current = setInterval(() => {
      chargeRef.current = Math.min(chargeRef.current + 100 / steps, 100);
      const rounded = Math.min(Math.round(chargeRef.current * 10) / 10, 100);
      setChargeLevel(rounded);
      onChargeChangeRef.current(rounded);
      if (chargeRef.current >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isCharged = chargeLevel >= 100;
  const glowIntensity = (chargeLevel / 100) * 60;
  const glowColor = isCharged
    ? "0 0 30px #FFD700, 0 0 60px #FFD700, 0 0 90px rgba(255,215,0,0.5)"
    : `0 0 ${glowIntensity * 0.3}px rgba(255,215,0,0.6), 0 0 ${glowIntensity}px rgba(255,215,0,0.2)`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 120, height: 220 }}>
        {/* Terminal nub */}
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            width: 40,
            height: 14,
            background: isCharged ? "#FFD700" : "#8B7100",
            borderRadius: "4px 4px 0 0",
            boxShadow: isCharged ? "0 0 10px #FFD700" : "none",
            transition: "background 0.5s",
          }}
        />

        {/* Battery outer shell */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            border: `2px solid ${isCharged ? "#FFD700" : "#1a3a6b"}`,
            background: "#050d1f",
            overflow: "hidden",
            boxShadow: glowColor,
            transition: "border-color 0.5s, box-shadow 0.5s",
          }}
        >
          {/* Fill */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${chargeLevel}%`,
              background: isCharged
                ? "linear-gradient(180deg, #FFE44D 0%, #FFD700 50%, #CC9900 100%)"
                : "linear-gradient(180deg, rgba(255,215,0,0.9) 0%, rgba(255,180,0,0.7) 60%, rgba(200,140,0,0.5) 100%)",
              transition: "height 0.1s linear",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-50%",
                width: "200%",
                height: "12px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s linear infinite",
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Grid overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,215,0,0.05) 0px, rgba(255,215,0,0.05) 1px, transparent 1px, transparent 10px)",
              pointerEvents: "none",
            }}
          />

          {/* Charge % text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Orbitron, sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: chargeLevel > 50 ? "#050d1f" : "#FFD700",
              textShadow: chargeLevel > 50 ? "none" : "0 0 8px #FFD700",
              zIndex: 2,
            }}
          >
            {Math.floor(chargeLevel)}%
          </div>
        </div>

        {/* Electric arcs - only when charging */}
        {!isCharged &&
          ARC_POSITIONS.map((pos) => {
            const { key, ...style } = pos;
            const isHorizontal = key === "top";
            return (
              <span
                key={key}
                style={{
                  position: "absolute",
                  ...style,
                  background: isHorizontal
                    ? "linear-gradient(90deg, transparent, #FFD700, transparent)"
                    : "linear-gradient(180deg, transparent, #00BFFF, transparent)",
                  borderRadius: 2,
                  animation: `arcFlash ${isHorizontal ? 0.3 : 0.45}s ease-in-out infinite`,
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              />
            );
          })}

        {/* Charged indicator */}
        {isCharged && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 12,
              border: "2px solid #FFD700",
              animation: "pulseGlow 2s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: isCharged ? "#FFD700" : "#00BFFF",
          textShadow: isCharged ? "0 0 10px #FFD700" : "0 0 10px #00BFFF",
          letterSpacing: "0.15em",
          textAlign: "center",
        }}
      >
        {isCharged ? "CHARGED ✓" : "CHARGING..."}
      </div>

      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(255,215,0,0.8)",
          letterSpacing: "0.2em",
          textAlign: "center",
          animation: "float 2s ease-in-out infinite",
        }}
      >
        ⚡ ANTIGRAVITY
      </div>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 10,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.15em",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
}
