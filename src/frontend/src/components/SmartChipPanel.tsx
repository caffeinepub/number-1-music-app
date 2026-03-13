import { useEffect, useRef, useState } from "react";

interface SmartChipPanelProps {
  isActive: boolean;
  onBoostChange?: (v: number) => void;
  onVolumeChange?: (v: number) => void;
}

const LEFT_PINS = [15, 30, 45, 55];
const RIGHT_PINS = [15, 30, 45, 55];

export function SmartChipPanel({
  isActive,
  onBoostChange,
  onVolumeChange,
}: SmartChipPanelProps) {
  const scanRef = useRef<HTMLDivElement>(null);
  const [boostWatts, setBoostWatts] = useState(375);
  const [volPct, setVolPct] = useState(100);

  useEffect(() => {
    if (!scanRef.current) return;
    scanRef.current.style.animationPlayState = isActive ? "running" : "paused";
  }, [isActive]);

  const handleBoost = (v: number) => {
    const watts = Math.round(((v - 0.5) / 2.5) * 1500);
    setBoostWatts(watts);
    onBoostChange?.(v);
  };

  const handleVol = (v: number) => {
    setVolPct(Math.round(v * 100));
    onVolumeChange?.(v);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #060e22 0%, #040b1c 100%)",
        border: `2px solid ${isActive ? "#00BFFF" : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "16px",
        boxShadow: isActive ? "0 0 24px rgba(0,191,255,0.3)" : "none",
        transition: "all 0.4s",
        position: "relative",
        overflow: "hidden",
        minWidth: 220,
      }}
    >
      {/* Circuit board background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg,rgba(0,191,255,0.04) 0,rgba(0,191,255,0.04) 1px,transparent 1px,transparent 16px)," +
            "repeating-linear-gradient(90deg,rgba(0,191,255,0.04) 0,rgba(0,191,255,0.04) 1px,transparent 1px,transparent 16px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: isActive ? "#00BFFF" : "rgba(0,191,255,0.4)",
          letterSpacing: "0.15em",
          textAlign: "center",
          marginBottom: 10,
          textShadow: isActive ? "0 0 10px #00BFFF" : "none",
        }}
      >
        2026-2027 SMART CHIP
      </div>

      {/* Chip + sliders side by side */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {/* Chip visual */}
        <div
          style={{
            position: "relative",
            width: 70,
            height: 90,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              background: "linear-gradient(135deg, #0a1e3d, #162a50)",
              border: `2px solid ${isActive ? "#00BFFF" : "#1a3a6b"}`,
              borderRadius: 6,
              position: "relative",
              boxShadow: isActive ? "0 0 15px rgba(0,191,255,0.4)" : "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 4,
                backgroundImage:
                  "repeating-linear-gradient(0deg,rgba(0,191,255,0.12) 0,rgba(0,191,255,0.12) 1px,transparent 1px,transparent 8px)," +
                  "repeating-linear-gradient(90deg,rgba(0,191,255,0.12) 0,rgba(0,191,255,0.12) 1px,transparent 1px,transparent 8px)",
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Orbitron, sans-serif",
                fontSize: 9,
                fontWeight: 700,
                color: isActive ? "#00BFFF" : "rgba(0,191,255,0.3)",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              5RS22
              <br />
              CHIP
            </div>
            <div
              ref={scanRef}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background: "rgba(0,191,255,0.7)",
                boxShadow: "0 0 6px #00BFFF",
                animation: "scanline 2s linear infinite",
                animationPlayState: isActive ? "running" : "paused",
              }}
            />
            {LEFT_PINS.map((top) => (
              <div
                key={`lpin-${top}`}
                style={{
                  position: "absolute",
                  left: -8,
                  top: `${top}%`,
                  width: 8,
                  height: 3,
                  background: isActive ? "#00BFFF" : "#1a3a6b",
                  borderRadius: "2px 0 0 2px",
                }}
              />
            ))}
            {RIGHT_PINS.map((top) => (
              <div
                key={`rpin-${top}`}
                style={{
                  position: "absolute",
                  right: -8,
                  top: `${top}%`,
                  width: 8,
                  height: 3,
                  background: isActive ? "#00BFFF" : "#1a3a6b",
                  borderRadius: "0 2px 2px 0",
                }}
              />
            ))}
          </div>
          {/* Labels below chip */}
          <div style={{ marginTop: 6, textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: 7,
                color: "rgba(0,191,255,0.6)",
                letterSpacing: "0.1em",
              }}
            >
              300W LOAD AMP
            </div>
            <div
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: 6,
                color: "rgba(255,215,0,0.5)",
              }}
            >
              5RS22 AMP
            </div>
          </div>
        </div>

        {/* Booster slider */}
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
              color: "rgba(255,215,0,0.7)",
              letterSpacing: "0.1em",
              textAlign: "center",
            }}
          >
            1500W
            <br />
            BOOST
          </div>
          <div
            className="eq-slider-container"
            style={{ height: 90, width: 28 }}
          >
            <input
              type="range"
              className="eq-vert-slider"
              data-ocid="chip.boost_input"
              min={0.5}
              max={3.0}
              step={0.05}
              defaultValue={1.0}
              style={{
                width: 90,
                opacity: isActive ? 1 : 0.4,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onChange={(e) => handleBoost(Number.parseFloat(e.target.value))}
            />
          </div>
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 9,
              fontWeight: 700,
              color: "#FFD700",
              textShadow: isActive ? "0 0 8px #FFD700" : "none",
            }}
          >
            {boostWatts}W
          </div>
        </div>

        {/* Volume slider */}
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
              color: "rgba(0,191,255,0.7)",
              letterSpacing: "0.1em",
              textAlign: "center",
            }}
          >
            VOL
            <br />
            AMP
          </div>
          <div
            className="eq-slider-container"
            style={{ height: 90, width: 28 }}
          >
            <input
              type="range"
              className="eq-vert-slider"
              data-ocid="chip.volume_input"
              min={0}
              max={1}
              step={0.01}
              defaultValue={1.0}
              style={{
                width: 90,
                opacity: isActive ? 1 : 0.4,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onChange={(e) => handleVol(Number.parseFloat(e.target.value))}
            />
          </div>
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 9,
              fontWeight: 700,
              color: "#00BFFF",
              textShadow: isActive ? "0 0 8px #00BFFF" : "none",
            }}
          >
            {volPct}
          </div>
        </div>
      </div>

      {/* LEDs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 10,
        }}
      >
        {(["PWR", "CLK", "SIG"] as const).map((label, i) => (
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
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isActive ? "#00FF88" : "#0a2a1a",
                boxShadow: isActive ? "0 0 8px #00FF88" : "none",
                animation: isActive
                  ? `orbPulse ${1.2 + i * 0.3}s ease-in-out infinite`
                  : "none",
              }}
            />
            <div
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: 7,
                color: "rgba(0,255,136,0.6)",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
