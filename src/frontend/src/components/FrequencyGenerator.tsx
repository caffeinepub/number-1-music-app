import { useEffect, useRef } from "react";

interface FrequencyGeneratorProps {
  isActive: boolean;
}

const FREQ_LABELS = ["20Hz", "100Hz", "500Hz", "1kHz", "5kHz", "20kHz"];

export function FrequencyGenerator({ isActive }: FrequencyGeneratorProps) {
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
      ctx.fillStyle = "#010811";
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(255,215,0,0.08)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (isActive) {
        // Multi-frequency display
        const freqs = [1, 2, 4, 8];
        freqs.forEach((freq, fi) => {
          const alpha = 1 - fi * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,215,0,${alpha})`;
          ctx.lineWidth = 1.5 - fi * 0.3;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#FFD700";
          for (let x = 0; x < w; x++) {
            const t = (x / w) * Math.PI * 2 * freq + phaseRef.current * freq;
            const y = h / 2 + Math.sin(t) * (h / 3 - fi * 4);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
        phaseRef.current += 0.04;

        // dB scale on right
        ctx.fillStyle = "rgba(255,215,0,0.5)";
        ctx.font = "7px Orbitron, sans-serif";
        ["+12", "0", "-12"].forEach((label, i) => {
          ctx.fillText(label, w - 18, 8 + i * (h / 2 - 4));
        });
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
        border: `2px solid ${isActive ? "#FFD700" : "#1a3a6b"}`,
        borderRadius: 12,
        padding: "16px 12px",
        boxShadow: isActive ? "0 0 20px rgba(255,215,0,0.25)" : "none",
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
          color: isActive ? "#FFD700" : "rgba(255,215,0,0.4)",
          letterSpacing: "0.12em",
          textAlign: "center",
          textShadow: isActive ? "0 0 10px #FFD700" : "none",
        }}
      >
        LM3204
        <br />
        <span style={{ fontSize: 8, color: "rgba(255,215,0,0.6)" }}>
          FREQUENCY GENERATOR
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={140}
        height={56}
        style={{ borderRadius: 4, border: "1px solid #1a3a6b" }}
      />

      {/* Frequency scale */}
      <div
        style={{
          display: "flex",
          gap: 4,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {FREQ_LABELS.map((f) => (
          <div
            key={f}
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 6,
              color: isActive ? "rgba(255,215,0,0.7)" : "rgba(255,215,0,0.2)",
              textAlign: "center",
            }}
          >
            {f}
          </div>
        ))}
      </div>

      {/* Engine connection indicators */}
      <div style={{ display: "flex", gap: 4 }}>
        {["B", "M", "H", "P"].map((e, i) => (
          <div
            key={e}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: isActive ? "#FFD700" : "#1a2a4a",
                boxShadow: isActive ? "0 0 6px #FFD700" : "none",
                animation: isActive
                  ? `orbPulse ${0.8 + i * 0.2}s ease-in-out infinite`
                  : "none",
              }}
            />
            <div
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: 7,
                color: "rgba(255,215,0,0.6)",
              }}
            >
              {e}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: 9,
          color: "rgba(255,215,0,0.5)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        AUTO-CONNECTS ALL 4 ENGINES • dB SCALE
      </div>
    </div>
  );
}
