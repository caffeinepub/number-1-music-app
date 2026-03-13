import { useEffect, useState } from "react";

interface BookCoverProps {
  onComplete: () => void;
}

const CORNERS = [
  { top: "12px", left: "12px" },
  { top: "12px", right: "12px" },
  { bottom: "12px", left: "12px" },
  { bottom: "12px", right: "12px" },
] as const;

const CORNER_KEYS = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export function BookCover({ onComplete }: BookCoverProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = () => {
    if (animating) {
      onComplete();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${animating ? "book-opening" : ""}`}
      style={{
        background: "#050d1f",
        transformOrigin: "left center",
        backfaceVisibility: "hidden",
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, #0d2a6b 0%, #050d1f 60%), radial-gradient(ellipse at 70% 70%, #1a0a00 0%, transparent 50%)",
        }}
      />

      <div
        className="absolute inset-4"
        style={{
          border: "3px solid #FFD700",
          boxShadow:
            "0 0 30px rgba(255,215,0,0.4), inset 0 0 30px rgba(255,215,0,0.05)",
        }}
      />
      <div
        className="absolute inset-6"
        style={{ border: "1px solid rgba(255,215,0,0.4)" }}
      />

      {CORNERS.map((pos, i) => (
        <div
          key={CORNER_KEYS[i]}
          className="absolute text-2xl"
          style={{ ...pos, color: "#FFD700", lineHeight: 1 }}
        >
          ✦
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-12 text-center">
        <div className="flex gap-3 text-3xl" style={{ color: "#FFD700" }}>
          ★ ★ ★ ★ ★
        </div>

        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "clamp(1.5rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "#FFD700",
            letterSpacing: "0.3em",
            textShadow: "0 0 20px #FFD700, 0 0 40px rgba(255,215,0,0.5)",
          }}
        >
          2026 to 2027
        </div>

        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            background:
              "linear-gradient(90deg, #CC9900, #FFD700, #FFE44D, #FFD700, #CC9900)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "titleShimmer 3s linear infinite",
            filter: "drop-shadow(0 0 20px rgba(255,215,0,0.8))",
          }}
        >
          Number 1 Winning
          <br />
          Music App
        </div>

        <div
          style={{
            width: "60%",
            height: "2px",
            background:
              "linear-gradient(to right, transparent, #FFD700, transparent)",
          }}
        />

        <div
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "clamp(0.9rem, 2vw, 1.4rem)",
            fontWeight: 600,
            color: "rgba(255,215,0,0.7)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Powered by Advanced Sound Engineering
        </div>

        <div className="flex gap-3 text-xl" style={{ color: "#FFD700" }}>
          ★ ★ ★
        </div>

        <div
          className="text-sm"
          style={{
            color: "rgba(255,215,0,0.4)",
            letterSpacing: "0.2em",
            fontFamily: "Rajdhani, sans-serif",
            animation: "orbPulse 2s ease-in-out infinite",
          }}
        >
          OPENING...
        </div>
      </div>
    </div>
  );
}
