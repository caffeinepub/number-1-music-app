interface SoundEnginePanelProps {
  name: string;
  engineType: string;
  isActive: boolean;
}

const engineIcons: Record<string, string> = {
  bass: "🔊",
  mid: "〰️",
  high: "✦",
  presence: "◉",
};

const METER_BARS = [
  { anim: "meterBar1", key: "bar-1" },
  { anim: "meterBar2", key: "bar-2" },
  { anim: "meterBar3", key: "bar-3" },
];

export function SoundEnginePanel({
  name,
  engineType,
  isActive,
}: SoundEnginePanelProps) {
  const icon = engineIcons[engineType] ?? "⚡";

  return (
    <div
      style={{
        width: 140,
        minHeight: 110,
        background: isActive
          ? "linear-gradient(135deg, #0d2040 0%, #0a1628 100%)"
          : "#070f22",
        border: `2px solid ${isActive ? "#FFD700" : "#1a3a6b"}`,
        borderRadius: 10,
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        position: "relative",
        overflow: "hidden",
        boxShadow: isActive
          ? "0 0 20px rgba(255,215,0,0.3), 0 0 40px rgba(255,215,0,0.1)"
          : "none",
        transition: "all 0.5s ease",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "20%",
            background:
              "linear-gradient(180deg, transparent, rgba(255,215,0,0.06), transparent)",
            animation: "scanline 3s linear infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      <div style={{ fontSize: 22, zIndex: 1 }}>{icon}</div>

      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          color: isActive ? "#FFD700" : "#4a6a9b",
          letterSpacing: "0.1em",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {name}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 5, zIndex: 1 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: isActive ? "#00FF88" : "#FF3333",
            boxShadow: isActive ? "0 0 8px #00FF88" : "0 0 4px #FF3333",
            animation: isActive ? "orbPulse 1.5s ease-in-out infinite" : "none",
          }}
        />
        <span
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: isActive ? "#00FF88" : "#FF3333",
            letterSpacing: "0.1em",
          }}
        >
          {isActive ? "ONLINE" : "OFFLINE"}
        </span>
      </div>

      {isActive && (
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "flex-end",
            height: 24,
            zIndex: 1,
          }}
        >
          {METER_BARS.map(({ anim, key }, i) => (
            <div
              key={key}
              style={{
                width: 6,
                background: "linear-gradient(to top, #FFD700, #FFE44D)",
                borderRadius: 2,
                boxShadow: "0 0 4px #FFD700",
                animation: `${anim} ${0.7 + i * 0.15}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
