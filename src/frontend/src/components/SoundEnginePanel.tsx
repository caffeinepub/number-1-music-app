import { useState } from "react";

interface SoundEnginePanelProps {
  name: string;
  engineType: "bass" | "mid" | "high" | "presence";
  isActive: boolean;
  onGainChange?: (
    engine: "bass" | "mid" | "high" | "presence",
    gainDb: number,
  ) => void;
}

const engineIcons: Record<string, string> = {
  bass: "🔊",
  mid: "〰️",
  high: "✦",
  presence: "◉",
};

const METER_BARS = [
  { anim: "meterBar1", key: "bar-1" },
  { anim: "meterBar2", key: "bar-2" },
  { anim: "meterBar3", key: "bar-3" },
];

export function SoundEnginePanel({
  name,
  engineType,
  isActive,
  onGainChange,
}: SoundEnginePanelProps) {
  const icon = engineIcons[engineType] ?? "⚡";
  const [gainDb, setGainDb] = useState(0);

  const handleGain = (v: number) => {
    setGainDb(v);
    onGainChange?.(engineType, v);
  };

  return (
    <div
      style={{
        width: 150,
        minHeight: 180,
        background: isActive
          ? "linear-gradient(135deg, #0d2040 0%, #0a1628 100%)"
          : "#070f22",
        border: `2px solid ${isActive ? "#FFD700" : "#1a3a6b"}`,
        borderRadius: 10,
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        position: "relative",
        overflow: "hidden",
        boxShadow: isActive
          ? "0 0 20px rgba(255,215,0,0.3), 0 0 40px rgba(255,215,0,0.1)"
          : "none",
        transition: "all 0.5s ease",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "20%",
            background:
              "linear-gradient(180deg, transparent, rgba(255,215,0,0.06), transparent)",
            animation: "scanline 3s linear infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      <div style={{ fontSize: 22, zIndex: 1 }}>{icon}</div>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          color: isActive ? "#FFD700" : "#4a6a9b",
          letterSpacing: "0.1em",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {name}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 5, zIndex: 1 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: isActive ? "#00FF88" : "#FF3333",
            boxShadow: isActive ? "0 0 8px #00FF88" : "0 0 4px #FF3333",
            animation: isActive ? "orbPulse 1.5s ease-in-out infinite" : "none",
          }}
        />
        <span
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: isActive ? "#00FF88" : "#FF3333",
            letterSpacing: "0.1em",
          }}
        >
          {isActive ? "ACTIVE" : "STANDBY"}
        </span>
      </div>

      {/* Meter bars */}
      <div
        style={{
          display: "flex",
          gap: 4,
          alignItems: "flex-end",
          height: 28,
          zIndex: 1,
        }}
      >
        {METER_BARS.map(({ key, anim }) => (
          <div
            key={key}
            style={{
              width: 10,
              height: 28,
              background: "#010811",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #1a3a6b",
            }}
          >
            <div
              style={{
                position: "relative" as const,
                bottom: 0,
                width: "100%",
                height: isActive ? "70%" : "20%",
                background: isActive
                  ? "linear-gradient(180deg, #FFD700, #FF8800)"
                  : "#1a3a6b",
                borderRadius: 2,
                marginTop: "auto",
                animation: isActive
                  ? `${anim} 1.4s ease-in-out infinite`
                  : "none",
                transition: "height 0.4s",
              }}
            />
          </div>
        ))}
      </div>

      {/* Vertical GAIN slider */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          zIndex: 1,
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 7,
            color: "rgba(255,215,0,0.7)",
            letterSpacing: "0.1em",
          }}
        >
          GAIN
        </div>
        <div className="eq-slider-container" style={{ height: 80, width: 28 }}>
          <input
            type="range"
            className="eq-vert-slider"
            data-ocid={`engine.${engineType}_input`}
            min={-12}
            max={12}
            step={0.5}
            value={gainDb}
            style={{
              width: 80,
              opacity: isActive ? 1 : 0.4,
              pointerEvents: isActive ? "auto" : "none",
            }}
            onChange={(e) => handleGain(Number.parseFloat(e.target.value))}
          />
        </div>
        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 9,
            fontWeight: 700,
            color: gainDb > 0 ? "#FFD700" : gainDb < 0 ? "#00BFFF" : "#fff",
            textShadow: isActive
              ? `0 0 6px ${gainDb > 0 ? "#FFD700" : "#00BFFF"}`
              : "none",
          }}
        >
          {gainDb > 0 ? `+${gainDb}` : gainDb}dB
        </div>
      </div>
    </div>
  );
}
