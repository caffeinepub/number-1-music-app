import { useState } from "react";

interface EQSlidersProps {
  onFilterChange: (band: string, gainDb: number) => void;
  isActive: boolean;
}

const bands = [
  { key: "bass", label: "BASS" },
  { key: "midLow", label: "MID-LOW" },
  { key: "mid", label: "MID" },
  { key: "midHigh", label: "MID-HIGH" },
  { key: "treble", label: "TREBLE" },
  { key: "presence", label: "PRESENCE" },
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
        padding: "20px 24px",
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
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        ⚙ EQUALIZER
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {bands.map((band) => {
          const val = values[band.key];
          const fillPct = ((val + 12) / 24) * 100;
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
                  fontSize: 10,
                  fontWeight: 700,
                  color: val === 0 ? "rgba(255,215,0,0.5)" : "#FFD700",
                  textShadow: val !== 0 ? "0 0 8px #FFD700" : "none",
                  minWidth: 50,
                  textAlign: "center",
                }}
              >
                {val >= 0 ? "+" : ""}
                {val.toFixed(1)} dB
              </div>

              {/* Vertical slider */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="range"
                  className="eq-slider"
                  min={-12}
                  max={12}
                  step={0.5}
                  value={val}
                  data-ocid={ocids[band.key]}
                  style={
                    {
                      "--fill-pct": `${fillPct}%`,
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
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,215,0,0.7)",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  maxWidth: 50,
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
