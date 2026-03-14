import { useState } from "react";

interface EQSlidersProps {
  onFilterChange: (band: string, gainDb: number) => void;
  isActive: boolean;
}

const bands = [
  { key: "bass", label: "60Hz", color: "#FF4444" },
  { key: "midLow", label: "250Hz", color: "#FF9900" },
  { key: "mid", label: "1kHz", color: "#FFD700" },
  { key: "midHigh", label: "4kHz", color: "#00FF88" },
  { key: "treble", label: "8kHz", color: "#00BFFF" },
  { key: "presence", label: "16kHz", color: "#CC44FF" },
];

const ocids: Record<string, string> = {
  bass: "eq.bass_input",
  midLow: "eq.midlow_input",
  mid: "eq.mid_input",
  midHigh: "eq.midhigh_input",
  treble: "eq.treble_input",
  presence: "eq.presence_input",
};

export function EQSliders({ onFilterChange, isActive }: EQSlidersProps) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(bands.map((b) => [b.key, 0])),
  );

  const handleChange = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    onFilterChange(key, val);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: `2px solid ${isActive ? "#FFD700" : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "20px 16px",
        opacity: isActive ? 1 : 0.5,
        transition: "opacity 0.4s, border-color 0.4s",
        boxShadow: isActive ? "0 0 20px rgba(255,215,0,0.15)" : "none",
      }}
    >
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "#FFD700",
          letterSpacing: "0.2em",
          marginBottom: 4,
          textAlign: "center",
          textShadow: isActive ? "0 0 10px rgba(255,215,0,0.5)" : "none",
        }}
      >
        ⚙ 6-BAND EQUALIZER
      </div>
      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: 10,
          color: "rgba(255,215,0,0.5)",
          textAlign: "center",
          marginBottom: 20,
          letterSpacing: "0.15em",
        }}
      >
        {isActive
          ? "DRAG UP = BOOST · DRAG DOWN = CUT · EQ SWITCH = ON/OFF"
          : "EQ BYPASSED — FLIP EQ SWITCH TO ENABLE"}
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          alignItems: "flex-start",
          pointerEvents: isActive ? "auto" : "none",
        }}
      >
        {bands.map((band) => {
          const val = values[band.key];
          const isBoost = val > 0;
          const isCut = val < 0;

          return (
            <div
              key={band.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* dB value */}
              <div
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  color: isBoost
                    ? band.color
                    : isCut
                      ? "#FF4444"
                      : "rgba(255,215,0,0.4)",
                  textShadow:
                    val !== 0
                      ? `0 0 8px ${isBoost ? band.color : "#FF4444"}`
                      : "none",
                  textAlign: "center",
                  minWidth: 36,
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
              >
                {val >= 0 ? "+" : ""}
                {val.toFixed(1)}
              </div>

              {/* Vertical slider container */}
              <div className="eq-slider-container">
                {/* Center 0dB tick */}
                <div className="eq-center-tick" />
                <input
                  type="range"
                  className="eq-vert-slider"
                  min={-20}
                  max={20}
                  step={0.5}
                  value={val}
                  data-ocid={ocids[band.key]}
                  onChange={(e) =>
                    handleChange(band.key, Number.parseFloat(e.target.value))
                  }
                />
              </div>

              {/* Band label */}
              <div
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  color: val !== 0 ? band.color : "rgba(255,215,0,0.7)",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  minWidth: 36,
                  transition: "color 0.2s",
                }}
              >
                {band.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset all to 0 button */}
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <button
          type="button"
          data-ocid="eq.reset_button"
          disabled={!isActive}
          onClick={() => {
            const zeros = Object.fromEntries(bands.map((b) => [b.key, 0]));
            setValues(zeros);
            for (const band of bands) onFilterChange(band.key, 0);
          }}
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 8,
            fontWeight: 700,
            color: isActive ? "#FFD700" : "rgba(255,215,0,0.3)",
            background: "transparent",
            border: `1px solid ${isActive ? "rgba(255,215,0,0.4)" : "#1a3a6b"}`,
            borderRadius: 6,
            padding: "4px 12px",
            cursor: isActive ? "pointer" : "not-allowed",
            letterSpacing: "0.12em",
            transition: "all 0.2s",
          }}
        >
          FLAT
        </button>
      </div>
    </div>
  );
}
