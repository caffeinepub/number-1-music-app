import { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
}

export function WaveformVisualizer({
  analyserNode,
  isPlaying,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#050d1f";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(26,58,107,0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFD700";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#FFD700";
      ctx.beginPath();

      if (analyserNode && isPlaying) {
        const bufferLength = analyserNode.frequencyBinCount;
        if (
          !dataArrayRef.current ||
          dataArrayRef.current.length !== bufferLength
        ) {
          dataArrayRef.current = new Uint8Array(
            bufferLength,
          ) as Uint8Array<ArrayBuffer>;
        }
        analyserNode.getByteTimeDomainData(dataArrayRef.current);

        const sliceWidth = width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArrayRef.current[i] ?? 128) / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
      } else {
        phase += 0.05;
        const centerY = height / 2;
        for (let x = 0; x <= width; x += 2) {
          const pulse = Math.sin(x * 0.02 + phase) * 4;
          const y = centerY + pulse;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [analyserNode, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        canvas.width = entry.contentRect.width;
        canvas.height = entry.contentRect.height;
      }
    });
    observer.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: 120,
        border: "2px solid #1a3a6b",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow:
          "0 0 20px rgba(255,215,0,0.1), inset 0 0 20px rgba(0,0,50,0.5)",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 10,
          fontFamily: "Orbitron, sans-serif",
          fontSize: 9,
          color: "rgba(255,215,0,0.5)",
          letterSpacing: "0.2em",
          pointerEvents: "none",
        }}
      >
        AUDIO WAVEFORM
      </div>
    </div>
  );
}
