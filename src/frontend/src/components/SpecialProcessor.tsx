import { useState } from "react";

interface SpecialProcessorProps {
  isActive: boolean;
  onModeChange?: (mode: "AT" | "BT", intensity: number) => void;
}

type ProcMode = "AT" | "BT";

export function SpecialProcessor({
  isActive,
  onModeChange,
}: SpecialProcessorProps) {
  const [mode, setProcMode] = useState<ProcMode>("AT");
  const [intensity, setIntensity] = useState(50);

  const handleMode = (m: ProcMode) => {
    setProcMode(m);
    onModeChange?.(m, intensity);
  };

  const handleIntensity = (v: number) => {
    setIntensity(v);
    onModeChange?.(mode, v);
  };

  const modeColors: Record<ProcMode, string> = {
    AT: "#00BFFF",
    BT: "#FFD700",
  };
  const color = modeColors[mode];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: `2px solid ${isActive ? color : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "16px 12px",
        boxShadow: isActive ? `0 0 20px ${color}44` : "none",
        transition: "all 0.4s",
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
          color: isActive ? color : "rgba(255,215,0,0.4)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        SPECIAL PROCESSOR
        <br />
        <span style={{ fontSize: 7, color: "rgba(255,215,0,0.6)" }}>
          SUPER MODERN · CLEAR CLARITY
        </span>
      </div>

      {/* Oscilloscope waveform */}
      <div
        style={{
          width: "100%",
          height: 36,
          background: "#010811",
          border: "1px solid #1a3a6b",
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 120 36"
          preserveAspectRatio="none"
        >
          <title>Processor signal waveform</title>
          {mode === "AT" ? (
            <polyline
              points="0,18 20,18 20,8 40,8 40,28 60,28 60,8 80,8 80,28 100,28 100,18 120,18"
              fill="none"
              stroke={isActive ? "#00BFFF" : "rgba(0,191,255,0.2)"}
              strokeWidth={1.5}
            />
          ) : (
            <path
              d="M0,18 Q15,5 30,18 Q45,31 60,18 Q75,5 90,18 Q105,31 120,18"
              fill="none"
              stroke={isActive ? "#FFD700" : "rgba(255,215,0,0.2)"}
              strokeWidth={1.5}
            />
          )}
        </svg>
      </div>

      {/* AT / BT mode buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        {(["AT", "BT"] as ProcMode[]).map((m) => (
          <button
            key={m}
            type="button"
            data-ocid={`processor.${m.toLowerCase()}_button`}
            onClick={() => handleMode(m)}
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              padding: "5px 14px",
              background:
                mode === m
                  ? `linear-gradient(180deg, ${modeColors[m]}33, ${modeColors[m]}11)`
                  : "rgba(0,0,0,0.3)",
              border: `2px solid ${mode === m ? modeColors[m] : "#1a3a6b"}`,
              borderRadius: 6,
              color: mode === m ? modeColors[m] : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              letterSpacing: "0.15em",
              boxShadow:
                mode === m && isActive ? `0 0 12px ${modeColors[m]}66` : "none",
              transition: "all 0.2s",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* INTENSITY vertical slider */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 7,
            color: isActive ? `${color}cc` : "rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
          }}
        >
          INTENSITY
        </div>
        <div className="eq-slider-container" style={{ height: 90, width: 28 }}>
          <input
            type="range"
            className="eq-vert-slider"
            data-ocid="processor.intensity_input"
            min={0}
            max={100}
            step={1}
            value={intensity}
            style={{
              width: 90,
              opacity: isActive ? 1 : 0.4,
              pointerEvents: isActive ? "auto" : "none",
            }}
            onChange={(e) => handleIntensity(Number.parseInt(e.target.value))}
          />
        </div>
        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 9,
            fontWeight: 700,
            color: isActive ? color : "rgba(255,255,255,0.3)",
            textShadow: isActive ? `0 0 8px ${color}` : "none",
          }}
        >
          {intensity}%
        </div>
      </div>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 7,
          color: isActive ? `${color}88` : "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        MODE: {mode} · {mode === "AT" ? "BANDPASS" : "ALLPASS"}
      </div>
    </div>
  );
}
