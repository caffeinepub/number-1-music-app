import { useState } from "react";

interface EQSlidersProps {
  onFilterChange: (band: string, gainDb: number) => void;
  isActive: boolean;
}

const bands = [
  { key: "bass", label: "60Hz" },
  { key: "midLow", label: "250Hz" },
  { key: "mid", label: "1kHz" },
  { key: "midHigh", label: "4kHz" },
  { key: "treble", label: "8kHz" },
  { key: "presence", label: "16kHz" },
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
        border: "2px solid #1a3a6b",
        borderRadius: 12,
        padding: "20px 16px",
        opacity: isActive ? 1 : 0.5,
        pointerEvents: isActive ? "auto" : "none",
        transition: "opacity 0.4s",
      }}
    >
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "#FFD700",
          letterSpacing: "0.2em",
          marginBottom: 8,
          textAlign: "center",
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
          marginBottom: 16,
          letterSpacing: "0.15em",
        }}
      >
        VERTICAL · DRAG UP TO BOOST · +20dB MAX
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        {bands.map((band) => {
          const val = values[band.key];
          // Convert gain (-20 to +20 dB) to a 0–100% position
          const pct = ((val + 20) / 40) * 100;

          return (
            <div
              key={band.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* dB value */}
              <div
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  color: val === 0 ? "rgba(255,215,0,0.4)" : "#FFD700",
                  textShadow: val !== 0 ? "0 0 8px #FFD700" : "none",
                  textAlign: "center",
                  minWidth: 40,
                }}
              >
                {val >= 0 ? "+" : ""}
                {val.toFixed(1)}
              </div>

              {/* Vertical slider container */}
              <div className="eq-slider-container">
                {/* Center (0dB) tick mark */}
                <div className="eq-center-tick" />
                <input
                  type="range"
                  className="eq-vert-slider"
                  min={-20}
                  max={20}
                  step={0.5}
                  value={val}
                  data-ocid={ocids[band.key]}
                  style={
                    {
                      // Dynamic fill: pct = thumb position, 50 = center (0dB)
                      "--eq-pct": `${pct}%`,
                      "--eq-center": "50%",
                    } as React.CSSProperties
                  }
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
                  color: "rgba(255,215,0,0.7)",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  minWidth: 40,
                }}
              >
                {band.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
