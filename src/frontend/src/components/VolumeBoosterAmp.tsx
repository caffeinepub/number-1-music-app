interface VolumeBoosterAmpProps {
  onBoostChange: (v: number) => void;
  isActive: boolean;
}

export function VolumeBoosterAmp({
  onBoostChange,
  isActive,
}: VolumeBoosterAmpProps) {
  const toWatts = (v: number) => Math.round(((v - 0.5) / 2.5) * 1500);

  return (
    <div
      data-ocid="booster.panel"
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
          letterSpacing: "0.15em",
          textAlign: "center",
        }}
      >
        BOOSTER AMP
      </div>
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 8,
          color: "rgba(255,215,0,0.5)",
          letterSpacing: "0.1em",
        }}
      >
        1500W
      </div>

      <div className="eq-slider-container" style={{ height: 140 }}>
        <input
          type="range"
          className="eq-vert-slider"
          data-ocid="booster.input"
          min={0.5}
          max={3.0}
          step={0.05}
          defaultValue={1.0}
          style={{
            width: 140,
            opacity: isActive ? 1 : 0.4,
            pointerEvents: isActive ? "auto" : "none",
          }}
          onChange={(e) => {
            const v = Number.parseFloat(e.target.value);
            onBoostChange(v);
            const display = e.currentTarget
              .closest("[data-ocid='booster.panel']")
              ?.querySelector("[data-watts]") as HTMLElement | null;
            if (display) display.textContent = `${toWatts(v)}W`;
          }}
        />
      </div>

      <div
        data-watts
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: "#FFD700",
          textShadow: isActive ? "0 0 10px #FFD700" : "none",
          letterSpacing: "0.1em",
        }}
      >
        375W
      </div>
    </div>
  );
}
