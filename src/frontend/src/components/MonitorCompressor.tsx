import { useState } from "react";

interface MonitorCompressorProps {
  isActive: boolean;
  onThresholdChange: (v: number) => void;
  onRatioChange?: (v: number) => void;
  onAttackChange?: (v: number) => void;
  onReleaseChange?: (v: number) => void;
}

export function MonitorCompressor({
  isActive,
  onThresholdChange,
  onRatioChange,
  onAttackChange,
  onReleaseChange,
}: MonitorCompressorProps) {
  const [threshold, setThreshold] = useState(-24);
  const [ratio, setRatio] = useState(12);
  const [attack, setAttack] = useState(3); // ms display
  const [release, setRelease] = useState(250); // ms display

  const handleThreshold = (v: number) => {
    setThreshold(v);
    onThresholdChange(v);
  };

  const handleRatio = (v: number) => {
    setRatio(v);
    onRatioChange?.(v);
  };

  const handleAttack = (v: number) => {
    setAttack(v);
    onAttackChange?.(v / 1000); // convert ms to seconds
  };

  const handleRelease = (v: number) => {
    setRelease(v);
    onReleaseChange?.(v / 1000); // convert ms to seconds
  };

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

      {/* 4 vertical sliders: THRESH, RATIO, ATTACK, RELEASE */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        {/* THRESHOLD */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 6,
              color: "rgba(255,215,0,0.7)",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            THR
          </div>
          <div
            className="eq-slider-container"
            style={{ height: 80, width: 24 }}
          >
            <input
              type="range"
              className="eq-vert-slider"
              data-ocid="compressor.threshold_input"
              min={-60}
              max={0}
              step={1}
              value={threshold}
              style={{
                width: 80,
                opacity: isActive ? 1 : 0.4,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onChange={(e) => handleThreshold(Number.parseInt(e.target.value))}
            />
          </div>
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 7,
              fontWeight: 700,
              color: "#FFD700",
              textShadow: isActive ? "0 0 6px #FFD700" : "none",
            }}
          >
            {threshold}dB
          </div>
        </div>

        {/* RATIO */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 6,
              color: "rgba(0,191,255,0.7)",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            RATIO
          </div>
          <div
            className="eq-slider-container"
            style={{ height: 80, width: 24 }}
          >
            <input
              type="range"
              className="eq-vert-slider"
              data-ocid="compressor.ratio_input"
              min={1}
              max={20}
              step={0.5}
              value={ratio}
              style={{
                width: 80,
                opacity: isActive ? 1 : 0.4,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onChange={(e) => handleRatio(Number.parseFloat(e.target.value))}
            />
          </div>
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 7,
              fontWeight: 700,
              color: "#00BFFF",
              textShadow: isActive ? "0 0 6px #00BFFF" : "none",
            }}
          >
            {ratio}:1
          </div>
        </div>

        {/* ATTACK */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 6,
              color: "rgba(0,255,136,0.7)",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            ATK
          </div>
          <div
            className="eq-slider-container"
            style={{ height: 80, width: 24 }}
          >
            <input
              type="range"
              className="eq-vert-slider"
              data-ocid="compressor.attack_input"
              min={1}
              max={500}
              step={1}
              value={attack}
              style={{
                width: 80,
                opacity: isActive ? 1 : 0.4,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onChange={(e) => handleAttack(Number.parseInt(e.target.value))}
            />
          </div>
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 7,
              fontWeight: 700,
              color: "#00FF88",
              textShadow: isActive ? "0 0 6px #00FF88" : "none",
            }}
          >
            {attack}ms
          </div>
        </div>

        {/* RELEASE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 6,
              color: "rgba(255,100,100,0.8)",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            REL
          </div>
          <div
            className="eq-slider-container"
            style={{ height: 80, width: 24 }}
          >
            <input
              type="range"
              className="eq-vert-slider"
              data-ocid="compressor.release_input"
              min={50}
              max={2000}
              step={10}
              value={release}
              style={{
                width: 80,
                opacity: isActive ? 1 : 0.4,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onChange={(e) => handleRelease(Number.parseInt(e.target.value))}
            />
          </div>
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 7,
              fontWeight: 700,
              color: "#FF6464",
              textShadow: isActive ? "0 0 6px #FF6464" : "none",
            }}
          >
            {release}ms
          </div>
        </div>
      </div>
    </div>
  );
}
