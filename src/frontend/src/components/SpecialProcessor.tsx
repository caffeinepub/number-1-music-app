import { useState } from "react";

interface SpecialProcessorProps {
  isActive: boolean;
}

type ProcessorMode = "zero_distortion" | "no_clip" | "standard" | "custom";

export function SpecialProcessor({ isActive }: SpecialProcessorProps) {
  const [mode, setMode] = useState<ProcessorMode>("zero_distortion");
  const [noOverBass, setNoOverBass] = useState(false);
  const [atMode, setAtMode] = useState(true);
  const [btMode, setBtMode] = useState(false);

  const buttons: { key: ProcessorMode; label: string }[] = [
    { key: "zero_distortion", label: "ZERO DISTORTION" },
    { key: "no_clip", label: "NO CLIP" },
    { key: "standard", label: "STANDARD" },
    { key: "custom", label: "CUSTOM" },
  ];

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
        gap: 8,
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
        SPECIAL PROCESSOR
        <br />
        <span style={{ fontSize: 7, color: "rgba(255,215,0,0.6)" }}>
          SUPER MODERN · CLEAR CLARITY
        </span>
      </div>

      {/* Oscilloscope */}
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
          {mode === "zero_distortion" ? (
            <line
              x1="0"
              y1="18"
              x2="120"
              y2="18"
              stroke="#00FF88"
              strokeWidth="1.5"
            />
          ) : mode === "no_clip" ? (
            <path
              d="M0 18 Q15 5 30 18 Q45 31 60 18 Q75 5 90 18 Q105 31 120 18"
              fill="none"
              stroke="#FFD700"
              strokeWidth="1.5"
            />
          ) : mode === "custom" ? (
            <path
              d="M0 18 Q20 2 40 18 Q60 34 80 10 Q100 26 120 18"
              fill="none"
              stroke="#00BFFF"
              strokeWidth="1.5"
            />
          ) : (
            <path
              d="M0 18 L20 5 L40 31 L60 5 L80 31 L100 5 L120 18"
              fill="none"
              stroke="rgba(255,100,0,0.8)"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>

      {/* Mode buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
          width: "100%",
        }}
      >
        {buttons.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            data-ocid={`processor.${key}_button`}
            onClick={() => isActive && setMode(key)}
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: "0.05em",
              padding: "5px 4px",
              borderRadius: 4,
              border: `1px solid ${mode === key ? "#FFD700" : "#1a3a6b"}`,
              background:
                mode === key ? "rgba(255,215,0,0.15)" : "rgba(10,20,40,0.8)",
              color: mode === key ? "#FFD700" : "rgba(255,255,255,0.4)",
              cursor: isActive ? "pointer" : "not-allowed",
              textShadow: mode === key ? "0 0 6px #FFD700" : "none",
              transition: "all 0.2s",
              opacity: isActive ? 1 : 0.5,
            }}
          >
            {mode === key ? "●" : "○"} {label}
          </button>
        ))}
      </div>

      {/* AT / BT toggles */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {(
          [
            { label: "AT", val: atMode, set: setAtMode },
            { label: "BT", val: btMode, set: setBtMode },
          ] as const
        ).map(({ label, val, set }) => (
          <button
            key={label}
            type="button"
            data-ocid={`processor.${label.toLowerCase()}_toggle`}
            onClick={() => isActive && set(!val)}
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 9,
              fontWeight: 700,
              padding: "5px 14px",
              borderRadius: 4,
              border: `1px solid ${val ? "#00BFFF" : "#1a3a6b"}`,
              background: val ? "rgba(0,191,255,0.15)" : "rgba(10,20,40,0.8)",
              color: val ? "#00BFFF" : "rgba(255,255,255,0.3)",
              cursor: isActive ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              opacity: isActive ? 1 : 0.5,
            }}
          >
            {label} {val ? "ON" : "OFF"}
          </button>
        ))}
      </div>

      {/* No Over Bass toggle */}
      <button
        type="button"
        data-ocid="processor.no_over_bass_toggle"
        onClick={() => isActive && setNoOverBass(!noOverBass)}
        style={{
          width: "100%",
          fontFamily: "Orbitron, sans-serif",
          fontSize: 7,
          fontWeight: 700,
          padding: "5px",
          borderRadius: 4,
          border: `1px solid ${noOverBass ? "#FF9900" : "#1a3a6b"}`,
          background: noOverBass
            ? "rgba(255,153,0,0.15)"
            : "rgba(10,20,40,0.8)",
          color: noOverBass ? "#FF9900" : "rgba(255,255,255,0.3)",
          cursor: isActive ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          opacity: isActive ? 1 : 0.5,
          letterSpacing: "0.08em",
        }}
      >
        {noOverBass ? "● NO OVER BASS: ON" : "○ NO OVER BASS: OFF"}
      </button>

      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: 9,
          color: "rgba(255,215,0,0.4)",
          textAlign: "center",
          letterSpacing: "0.1em",
        }}
      >
        EQ BAND: ALL THE WAY UP
      </div>
    </div>
  );
}
