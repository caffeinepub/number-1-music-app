import { useEffect, useRef } from "react";

interface HarmonicProcessorProps {
  isActive: boolean;
}

export function HarmonicProcessor({ isActive }: HarmonicProcessorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = "#010811";
      ctx.fillRect(0, 0, w, h);

      if (isActive) {
        // Harmonic waveform
        ctx.beginPath();
        ctx.strokeStyle = "#00FF88";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#00FF88";
        for (let x = 0; x < w; x++) {
          const t = (x / w) * Math.PI * 4 + phaseRef.current;
          const y =
            h / 2 +
            Math.sin(t) * (h / 4) +
            Math.sin(t * 2) * (h / 8) +
            Math.sin(t * 3) * (h / 16);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        phaseRef.current += 0.06;
      } else {
        // flat line
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
  }, [isActive]);

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
          textShadow: isActive ? "0 0 10px #00FF88" : "none",
        }}
      >
        HARMONIC PROCESSOR
      </div>

      <canvas
        ref={canvasRef}
        width={120}
        height={48}
        style={{ borderRadius: 4, border: "1px solid #1a3a6b" }}
      />

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: isActive ? "#00FF88" : "rgba(0,255,136,0.3)",
          textShadow: isActive ? "0 0 8px #00FF88" : "none",
          letterSpacing: "0.1em",
        }}
      >
        100% HARMONIC CORRECTION
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {["H1", "H2", "H3"].map((h, i) => (
          <div
            key={h}
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
                  ? `orbPulse ${1.0 + i * 0.3}s ease-in-out infinite`
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
              {h}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: 10,
          color: "rgba(0,255,136,0.5)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        SIGNAL PROCESSOR
      </div>
    </div>
  );
}
