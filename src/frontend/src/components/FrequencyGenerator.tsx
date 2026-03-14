import { useEffect, useRef, useState } from "react";

interface FrequencyGeneratorProps {
  isActive: boolean;
  onToneChange?: (freq: number, mix: number) => void;
}

const FREQ_LABELS = ["20Hz", "100Hz", "500Hz", "1kHz", "5kHz", "20kHz"];

export function FrequencyGenerator({
  isActive,
  onToneChange,
}: FrequencyGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const [freq, setFreq] = useState(60);
  const [mix, setMix] = useState(0);

  const handleFreq = (v: number) => {
    setFreq(v);
    onToneChange?.(v, mix);
  };

  const handleMix = (v: number) => {
    setMix(v);
    onToneChange?.(freq, v);
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
        const freqs = [1, 2, 4, 8];
        freqs.forEach((f, fi) => {
          const alpha = 1 - fi * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,215,0,${alpha})`;
          ctx.lineWidth = 1.5 - fi * 0.3;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#FFD700";
          for (let x = 0; x < w; x++) {
            const t = (x / w) * Math.PI * 2 * f + phaseRef.current * f;
            const y = h / 2 + Math.sin(t) * (h / 3 - fi * 4);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
        phaseRef.current += 0.04;

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
        gap: 10,
      }}
    >
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          color: isActive ? "#FFD700" : "rgba(255,215,0,0.4)",
          letterSpacing: "0.15em",
          textAlign: "center",
        }}
      >
        FREQUENCY GENERATOR
      </div>

      <canvas
        ref={canvasRef}
        width={120}
        height={48}
        style={{ borderRadius: 4, border: "1px solid #1a3a6b" }}
      />

      {/* Freq labels row */}
      <div
        style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {FREQ_LABELS.map((label) => (
          <div
            key={label}
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 6,
              color: "rgba(255,215,0,0.5)",
              padding: "1px 3px",
              border: "1px solid rgba(255,215,0,0.2)",
              borderRadius: 2,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* FREQ + MIX vertical sliders side by side */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
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
            }}
          >
            FREQ
          </div>
          <div
            className="eq-slider-container"
            style={{ height: 80, width: 28 }}
          >
            <input
              type="range"
              className="eq-vert-slider"
              data-ocid="freqgen.freq_input"
              min={20}
              max={200}
              step={1}
              value={freq}
              style={{
                width: 80,
                opacity: isActive ? 1 : 0.4,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onChange={(e) => handleFreq(Number.parseInt(e.target.value))}
            />
          </div>
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 8,
              fontWeight: 700,
              color: "#FFD700",
              textShadow: isActive ? "0 0 6px #FFD700" : "none",
            }}
          >
            {freq}Hz
          </div>
        </div>

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
            }}
          >
            MIX
          </div>
          <div
            className="eq-slider-container"
            style={{ height: 80, width: 28 }}
          >
            <input
              type="range"
              className="eq-vert-slider"
              data-ocid="freqgen.mix_input"
              min={0}
              max={100}
              step={1}
              value={mix}
              style={{
                width: 80,
                opacity: isActive ? 1 : 0.4,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onChange={(e) => handleMix(Number.parseInt(e.target.value))}
            />
          </div>
          <div
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: 8,
              fontWeight: 700,
              color: "#00BFFF",
              textShadow: isActive ? "0 0 6px #00BFFF" : "none",
            }}
          >
            {mix}%
          </div>
        </div>
      </div>
    </div>
  );
}
