import { useState } from "react";

interface EpicenterProps {
  isActive: boolean;
  onChange: (v: number) => void;
}

export function Epicenter({ isActive, onChange }: EpicenterProps) {
  const [intensity, setIntensity] = useState(0);

  const handleChange = (val: number) => {
    setIntensity(val);
    onChange(val);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: `2px solid ${isActive ? "#FF9900" : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "16px 12px",
        boxShadow: isActive ? "0 0 20px rgba(255,153,0,0.3)" : "none",
        transition: "all 0.4s",
        opacity: isActive ? 1 : 0.5,
        pointerEvents: isActive ? "auto" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          color: "#FF9900",
          letterSpacing: "0.2em",
          textAlign: "center",
          textShadow: isActive ? "0 0 10px #FF9900" : "none",
        }}
      >
        EPICENTER
      </div>

      {/* Value display */}
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: intensity > 0 ? "#FF9900" : "rgba(255,153,0,0.4)",
          textShadow: intensity > 0 ? "0 0 12px #FF9900" : "none",
          minWidth: 36,
          textAlign: "center",
        }}
      >
        {intensity}
      </div>

      {/* Vertical slider */}
      <div className="epic-slider-container">
        <div className="epic-center-tick" />
        <input
          type="range"
          className="epic-vert-slider"
          min={0}
          max={100}
          step={1}
          value={intensity}
          data-ocid="epicenter.canvas_target"
          onChange={(e) => handleChange(Number.parseInt(e.target.value, 10))}
        />
      </div>

      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: 10,
          color: "rgba(255,153,0,0.7)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        BASS DEPTH
      </div>
    </div>
  );
}
