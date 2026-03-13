import { useState } from "react";

interface StereoLineMixerProps {
  onPanChange: (v: number) => void;
  isActive: boolean;
}

export function StereoLineMixer({
  onPanChange,
  isActive,
}: StereoLineMixerProps) {
  const [panVal, setPanVal] = useState(0);

  const handlePan = (v: number) => {
    setPanVal(v);
    onPanChange(v);
  };

  const lLevel = Math.max(0, 1 - panVal);
  const rLevel = Math.max(0, 1 + panVal);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: `2px solid ${isActive ? "#FFD700" : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "16px 12px",
        boxShadow: isActive ? "0 0 20px rgba(255,215,0,0.3)" : "none",
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
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        STEREO LINE MIXER
      </div>

      {/* Zero noise LED */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: isActive ? "#00FF88" : "#0a2a1a",
            boxShadow: isActive ? "0 0 8px #00FF88" : "none",
            animation: isActive ? "orbPulse 2s ease-in-out infinite" : "none",
          }}
        />
        <span
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 7,
            color: isActive ? "#00FF88" : "rgba(0,255,136,0.3)",
            letterSpacing: "0.1em",
          }}
        >
          ZERO NOISE
        </span>
      </div>

      {/* L/R meters */}
      <div
        style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 60 }}
      >
        {[
          { label: "L", level: lLevel },
          { label: "R", level: rLevel },
        ].map(({ label, level }) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <div
              style={{
                width: 16,
                height: 50,
                background: "#010811",
                border: "1px solid #1a3a6b",
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${level * 80}%`,
                  background: "linear-gradient(180deg, #FFD700, #FF9900)",
                  transition: "height 0.3s",
                  animation: isActive
                    ? "meterBar1 1.3s ease-in-out infinite"
                    : "none",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: 8,
                color: "rgba(255,215,0,0.7)",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Pan slider (horizontal) */}
      <div style={{ width: "100%" }}>
        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 7,
            color: "rgba(255,215,0,0.6)",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          PAN:{" "}
          {panVal === 0
            ? "CENTER"
            : panVal > 0
              ? `R${Math.round(panVal * 100)}`
              : `L${Math.round(-panVal * 100)}`}
        </div>
        <input
          type="range"
          data-ocid="mixer.pan_input"
          min={-1}
          max={1}
          step={0.01}
          value={panVal}
          style={{
            WebkitAppearance: "none",
            appearance: "none",
            width: "100%",
            height: 6,
            background:
              "linear-gradient(to right, #0a1e3d 0%, #ffd700 50%, #0a1e3d 100%)",
            borderRadius: 3,
            cursor: isActive ? "pointer" : "not-allowed",
            opacity: isActive ? 1 : 0.4,
            outline: "none",
          }}
          onChange={(e) => handlePan(Number.parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}
