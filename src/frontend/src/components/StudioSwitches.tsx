interface StudioSwitchesProps {
  switches: Record<string, boolean>;
  onToggle: (key: string) => void;
}

const SWITCH_DEFS = [
  { key: "EQ", label: "EQ" },
  { key: "COMP", label: "COMP" },
  { key: "STAB", label: "STAB" },
  { key: "EPIC", label: "EPIC" },
  { key: "AMP", label: "AMP" },
  { key: "MIX", label: "MIX" },
];

export function StudioSwitches({ switches, onToggle }: StudioSwitchesProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: "2px solid #1a3a6b",
        borderRadius: 12,
        padding: "16px 24px",
      }}
    >
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: "#FFD700",
          letterSpacing: "0.2em",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        ◈ STUDIO BUTTON SWITCHES
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {SWITCH_DEFS.map(({ key, label }, i) => {
          const on = switches[key] ?? true;
          return (
            <button
              key={key}
              type="button"
              data-ocid={`studio.switch_toggle.${i + 1}`}
              onClick={() => onToggle(key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                background: on
                  ? "linear-gradient(180deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))"
                  : "linear-gradient(180deg, rgba(10,20,50,0.8), rgba(5,13,31,0.8))",
                border: `2px solid ${on ? "#FFD700" : "#1a3a6b"}`,
                borderRadius: 10,
                padding: "14px 18px",
                cursor: "pointer",
                boxShadow: on
                  ? "0 0 20px rgba(255,215,0,0.4), inset 0 0 10px rgba(255,215,0,0.1)"
                  : "none",
                transition: "all 0.2s",
                minWidth: 64,
              }}
            >
              {/* Switch body */}
              <div style={{ position: "relative", width: 24, height: 40 }}>
                {/* Track */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 10,
                    height: 40,
                    background: on
                      ? "rgba(255,215,0,0.3)"
                      : "rgba(10,20,50,0.8)",
                    border: `1px solid ${on ? "#FFD700" : "#1a3a6b"}`,
                    borderRadius: 5,
                  }}
                />
                {/* Thumb */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: on ? 2 : 20,
                    width: 18,
                    height: 18,
                    background: on
                      ? "radial-gradient(circle, #FFE44D, #FFD700, #CC9900)"
                      : "#1a3a6b",
                    borderRadius: 4,
                    boxShadow: on
                      ? "0 0 10px #FFD700, 0 0 20px rgba(255,215,0,0.5)"
                      : "none",
                    transition: "top 0.2s, background 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  color: on ? "#FFD700" : "rgba(255,255,255,0.3)",
                  letterSpacing: "0.15em",
                  textShadow: on ? "0 0 8px #FFD700" : "none",
                }}
              >
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
