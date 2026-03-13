interface MonitorCompressorProps {
  isActive: boolean;
  onThresholdChange: (v: number) => void;
}

export function MonitorCompressor({
  isActive,
  onThresholdChange,
}: MonitorCompressorProps) {
  const stats = [
    { label: "THRESHOLD", value: "-24dB" },
    { label: "RATIO", value: "12:1" },
    { label: "ATTACK", value: "3ms" },
    { label: "RELEASE", value: "250ms" },
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
        MONITOR COMPRESSOR
      </div>

      {/* Harmonic badge */}
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 7,
          padding: "3px 8px",
          border: "1px solid rgba(255,215,0,0.5)",
          borderRadius: 10,
          color: "#FFD700",
          letterSpacing: "0.1em",
          background: "rgba(255,215,0,0.08)",
        }}
      >
        100% HARMONIC PROCESSOR
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          width: "100%",
        }}
      >
        {stats.map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid #1a3a6b",
              borderRadius: 4,
              padding: "4px 6px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: 6,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#FFD700",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Threshold slider */}
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
          THRESHOLD
        </div>
        <div
          className="eq-slider-container"
          style={{ height: 120, width: "100%" }}
        >
          <input
            type="range"
            className="eq-vert-slider"
            data-ocid="compressor.threshold_input"
            min={-40}
            max={0}
            step={1}
            defaultValue={-24}
            style={{
              width: 120,
              opacity: isActive ? 1 : 0.4,
              pointerEvents: isActive ? "auto" : "none",
            }}
            onChange={(e) =>
              onThresholdChange(Number.parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      {/* GR meter */}
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
          GAIN REDUCTION
        </div>
        <div
          style={{
            height: 6,
            background: "#010811",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #1a3a6b",
          }}
        >
          <div
            style={{
              height: "100%",
              width: isActive ? "45%" : "0%",
              background: "linear-gradient(90deg, #00FF88, #FFD700, #FF4444)",
              borderRadius: 3,
              transition: "width 0.5s",
              animation: isActive
                ? "meterBar1 1.5s ease-in-out infinite"
                : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
