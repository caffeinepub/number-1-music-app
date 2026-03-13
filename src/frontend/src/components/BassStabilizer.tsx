import { useState } from "react";

interface BassStabilizerProps {
  isActive: boolean;
  bassLevel: number;
}

const BAR_DEFS = [
  { id: "bar1", mult: 0.8, offset: 0.1, animDelay: "1.2s" },
  { id: "bar2", mult: 0.9, offset: 0.05, animDelay: "1.4s" },
  { id: "bar3", mult: 0.7, offset: 0.15, animDelay: "1.6s" },
  { id: "bar4", mult: 0.85, offset: 0.1, animDelay: "1.8s" },
];

const ANIM_NAMES = ["meterBar1", "meterBar2", "meterBar3", "meterBar1"];

export function BassStabilizer({ isActive, bassLevel }: BassStabilizerProps) {
  const [enabled, setEnabled] = useState(true);
  const normalizedBass = Math.min(Math.max((bassLevel + 12) / 24, 0), 1);
  const active = isActive && enabled;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: `2px solid ${active ? "#FFD700" : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "16px 12px",
        boxShadow: active ? "0 0 20px rgba(255,215,0,0.3)" : "none",
        transition: "all 0.4s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          color: "#FFD700",
          letterSpacing: "0.15em",
          textAlign: "center",
        }}
      >
        BASS STABILIZER
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "flex-end",
          height: 60,
          padding: "0 4px",
        }}
      >
        {BAR_DEFS.map(({ id, mult, offset, animDelay }, idx) => {
          const h = normalizedBass * mult + offset;
          return (
            <div
              key={id}
              style={{
                width: 14,
                height: 60,
                background: "#010811",
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                border: "1px solid #1a3a6b",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${h * 100}%`,
                  background: active
                    ? "linear-gradient(180deg, #00FF88, #00CC66)"
                    : "linear-gradient(180deg, #FF4444, #CC2222)",
                  borderRadius: 3,
                  transition: "height 0.3s ease, background 0.4s",
                  animation: active
                    ? `${ANIM_NAMES[idx]} ${animDelay} ease-in-out infinite`
                    : "none",
                }}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        data-ocid="stabilizer.toggle"
        onClick={() => setEnabled((p) => !p)}
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.1em",
          padding: "5px 12px",
          borderRadius: 4,
          border: `1px solid ${enabled ? "#FFD700" : "#1a3a6b"}`,
          background: enabled ? "rgba(255,215,0,0.15)" : "rgba(10,20,40,0.8)",
          color: enabled ? "#FFD700" : "rgba(255,255,255,0.4)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {enabled ? "STABILIZER ON" : "STABILIZER OFF"}
      </button>
    </div>
  );
}
