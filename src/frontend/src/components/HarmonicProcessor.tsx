import { useEffect, useRef, useState } from "react";

interface HarmonicProcessorProps {
  isActive: boolean;
  onDriveChange?: (v: number) => void;
}

export function HarmonicProcessor({
  isActive,
  onDriveChange,
}: HarmonicProcessorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const [drive, setDrive] = useState(0);

  const handleDrive = (v: number) => {
    setDrive(v);
    onDriveChange?.(v);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#010811";
      ctx.fillRect(0, 0, w, h);

      if (isActive) {
        ctx.beginPath();
        ctx.strokeStyle = drive > 0 ? "#FFD700" : "#00FF88";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = drive > 0 ? "#FFD700" : "#00FF88";
        const driveFactor = 1 + drive / 50;
        for (let x = 0; x < w; x++) {
          const t = (x / w) * Math.PI * 4 + phaseRef.current;
          const y =
            h / 2 +
            Math.sin(t) * (h / 4) * driveFactor +
            Math.sin(t * 2) * (h / 8) +
            Math.sin(t * 3) * (h / 16);
          if (x === 0) ctx.moveTo(x, Math.min(Math.max(y, 0), h));
          else ctx.lineTo(x, Math.min(Math.max(y, 0), h));
        }
        ctx.stroke();
        phaseRef.current += 0.06;
      } else {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,255,136,0.2)";
        ctx.lineWidth = 1;
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, drive]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: `2px solid ${isActive ? "#00FF88" : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "16px 12px",
        boxShadow: isActive ? "0 0 20px rgba(0,255,136,0.25)" : "none",
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
          color: isActive ? "#00FF88" : "rgba(0,255,136,0.4)",
          letterSpacing: "0.15em",
          textAlign: "center",
        }}
      >
        HARMONIC PROCESSOR
      </div>

      <canvas
        ref={canvasRef}
        width={120}
        height={50}
        style={{ borderRadius: 4, border: "1px solid #1a3a6b" }}
      />

      {/* DRIVE vertical slider */}
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
            color: drive > 0 ? "rgba(255,215,0,0.9)" : "rgba(0,255,136,0.7)",
            letterSpacing: "0.1em",
          }}
        >
          DRIVE
        </div>
        <div className="eq-slider-container" style={{ height: 80, width: 28 }}>
          <input
            type="range"
            className="eq-vert-slider"
            data-ocid="harmonic.drive_input"
            min={0}
            max={100}
            step={1}
            value={drive}
            style={{
              width: 80,
              opacity: isActive ? 1 : 0.4,
              pointerEvents: isActive ? "auto" : "none",
            }}
            onChange={(e) => handleDrive(Number.parseInt(e.target.value))}
          />
        </div>
        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 9,
            fontWeight: 700,
            color: drive > 30 ? "#FFD700" : "#00FF88",
            textShadow: isActive
              ? `0 0 6px ${drive > 30 ? "#FFD700" : "#00FF88"}`
              : "none",
          }}
        >
          {drive}%
        </div>
      </div>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 7,
          color: "rgba(0,255,136,0.5)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        WAVESHAPER · HARMONIC DIST
      </div>
    </div>
  );
}
