import { useRef, useState } from "react";

interface EpicenterProps {
  isActive: boolean;
  onChange: (v: number) => void;
}

export function Epicenter({ isActive, onChange }: EpicenterProps) {
  const [intensity, setIntensity] = useState(0);
  const knobRef = useRef<SVGCircleElement>(null);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startValRef = useRef(0);

  const rotation = -135 + (intensity / 100) * 270;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    draggingRef.current = true;
    startYRef.current = e.clientY;
    startValRef.current = intensity;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;
    const delta = startYRef.current - e.clientY;
    const newVal = Math.min(100, Math.max(0, startValRef.current + delta));
    setIntensity(newVal);
    onChange(newVal);
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
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
          color: "#FF9900",
          letterSpacing: "0.2em",
          textAlign: "center",
          textShadow: isActive ? "0 0 10px #FF9900" : "none",
        }}
      >
        EPICENTER
      </div>

      {/* Knob SVG */}
      <div
        style={{
          cursor: isActive ? "grab" : "not-allowed",
          position: "relative",
        }}
        onMouseDown={handleMouseDown}
        data-ocid="epicenter.canvas_target"
      >
        <svg width={80} height={80} viewBox="0 0 80 80">
          <title>Bass epicenter control</title>
          {/* Concentric rings */}
          {isActive &&
            [38, 32, 26].map((r, i) => (
              <circle
                key={r}
                cx={40}
                cy={40}
                r={r}
                fill="none"
                stroke="rgba(255,153,0,0.15)"
                strokeWidth={1}
                style={{
                  animation: `orbPulse ${1.5 + i * 0.4}s ease-in-out infinite`,
                }}
              />
            ))}
          {/* Track arc */}
          <circle
            cx={40}
            cy={40}
            r={30}
            fill="none"
            stroke="#1a3a6b"
            strokeWidth={4}
          />
          {/* Fill arc (approximate) */}
          <circle
            cx={40}
            cy={40}
            r={30}
            fill="none"
            stroke={isActive ? "#FF9900" : "#2a3a5b"}
            strokeWidth={4}
            strokeDasharray={`${(intensity / 100) * 188.5} 188.5`}
            strokeDashoffset={47}
            strokeLinecap="round"
            style={{
              transform: "rotate(-135deg)",
              transformOrigin: "40px 40px",
              transition: "stroke-dasharray 0.1s",
            }}
          />
          {/* Knob */}
          <circle
            ref={knobRef}
            cx={40 + 30 * Math.cos(((rotation - 90) * Math.PI) / 180)}
            cy={40 + 30 * Math.sin(((rotation - 90) * Math.PI) / 180)}
            r={6}
            fill={isActive ? "#FF9900" : "#2a3a5b"}
            style={{
              filter: isActive ? "drop-shadow(0 0 6px #FF9900)" : "none",
            }}
          />
          {/* Center label */}
          <text
            x={40}
            y={44}
            textAnchor="middle"
            fill={isActive ? "#FF9900" : "#2a3a5b"}
            fontSize={10}
            fontFamily="Orbitron, sans-serif"
            fontWeight="700"
          >
            {Math.round(intensity)}
          </text>
        </svg>
      </div>

      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: 11,
          color: "rgba(255,153,0,0.7)",
          letterSpacing: "0.1em",
        }}
      >
        BASS EPICENTER
      </div>
    </div>
  );
}
