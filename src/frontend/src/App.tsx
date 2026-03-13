import { useCallback, useRef, useState } from "react";
import { BassStabilizer } from "./components/BassStabilizer";
import { BatteryWidget } from "./components/BatteryWidget";
import { BookCover } from "./components/BookCover";
import { ChainLink } from "./components/ChainLink";
import { CircuitLines } from "./components/CircuitLines";
import { EQSliders } from "./components/EQSliders";
import { Epicenter } from "./components/Epicenter";
import { FrequencyGenerator } from "./components/FrequencyGenerator";
import { HarmonicProcessor } from "./components/HarmonicProcessor";
import { MonitorCompressor } from "./components/MonitorCompressor";
import { PlaybackControls } from "./components/PlaybackControls";
import { PowerStabilizer } from "./components/PowerStabilizer";
import { SmartChipPanel } from "./components/SmartChipPanel";
import { SoundEnginePanel } from "./components/SoundEnginePanel";
import { SpecialProcessor } from "./components/SpecialProcessor";
import { StereoLineMixer } from "./components/StereoLineMixer";
import { StudioSwitches } from "./components/StudioSwitches";
import { WaveformVisualizer } from "./components/WaveformVisualizer";
import { useAudioEngine } from "./hooks/useAudioEngine";

const PANEL_STYLE: React.CSSProperties = {
  background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
  border: "2px solid #1a3a6b",
  borderRadius: 12,
};

export default function App() {
  const [showCover, setShowCover] = useState(true);
  const [battery1Level, setBattery1Level] = useState(0);
  const [battery2Level, setBattery2Level] = useState(0);
  const [eqValues, setEqValues] = useState<Record<string, number>>({
    bass: 0,
    midLow: 0,
    mid: 0,
    midHigh: 0,
    treble: 0,
    presence: 0,
  });
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    EQ: true,
    COMP: true,
    STAB: true,
    EPIC: true,
    AMP: true,
    MIX: true,
  });

  const audioEngine = useAudioEngine();
  const analyserNodeRef = useRef(audioEngine.analyserNode);
  analyserNodeRef.current = audioEngine.analyserNode;

  const bothCharged = battery1Level >= 100 && battery2Level >= 100;

  const handleFilterChange = useCallback(
    (band: string, gainDb: number) => {
      setEqValues((prev) => ({ ...prev, [band]: gainDb }));
      audioEngine.setFilterGain(band, gainDb);
    },
    [audioEngine],
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      await audioEngine.loadFile(file);
    },
    [audioEngine],
  );

  const handleToggleSwitch = (key: string) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050d1f",
        color: "#fff",
        fontFamily: "Rajdhani, sans-serif",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* Ambient glow background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(0,50,150,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(255,150,0,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {showCover && <BookCover onComplete={() => setShowCover(false)} />}

      {!showCover && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 0.8s ease-out forwards",
          }}
        >
          {/* HEADER */}
          <header
            style={{
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background:
                "linear-gradient(180deg, #0a1628 0%, transparent 100%)",
              borderBottom: "1px solid rgba(255,215,0,0.2)",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: "clamp(13px, 2vw, 20px)",
                fontWeight: 900,
                color: "#FFD700",
                textShadow: "0 0 20px rgba(255,215,0,0.7)",
                letterSpacing: "0.1em",
              }}
            >
              ⚡ NUMBER 1 WINNING MUSIC APP
            </div>
            <div
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "clamp(12px, 1.5vw, 15px)",
                fontWeight: 600,
                color: audioEngine.currentTrack
                  ? "#FFD700"
                  : "rgba(255,255,255,0.3)",
                textAlign: "center",
                flex: 1,
                padding: "0 16px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {audioEngine.currentTrack || "─── Select a track to begin ───"}
            </div>
            <div
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: "clamp(10px, 1.3vw, 13px)",
                fontWeight: 700,
                color: "rgba(255,215,0,0.6)",
                letterSpacing: "0.15em",
                padding: "3px 10px",
                border: "1px solid rgba(255,215,0,0.3)",
                borderRadius: 20,
              }}
            >
              2026 — 2027
            </div>
          </header>

          <main
            style={{
              flex: 1,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* ROW 1 — POWER SECTION */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "stretch",
                flexWrap: "wrap",
              }}
            >
              <SmartChipPanel
                isActive={bothCharged}
                onBoostChange={audioEngine.setBoosterGain}
                onVolumeChange={audioEngine.setVolume}
              />

              <div
                style={{
                  ...PANEL_STYLE,
                  flex: 1,
                  padding: "16px",
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  minWidth: 280,
                }}
              >
                <div data-ocid="battery.1_panel">
                  <BatteryWidget
                    id={1}
                    label="POWER CELL A"
                    onChargeChange={setBattery1Level}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {!bothCharged ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "8px 12px",
                        background: "rgba(0,100,200,0.1)",
                        border: "1px solid rgba(0,191,255,0.3)",
                        borderRadius: 8,
                        fontFamily: "Rajdhani, sans-serif",
                        fontSize: 11,
                        color: "rgba(0,191,255,0.8)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      ⚡ A: {Math.floor(battery1Level)}%<br />⚡ B:{" "}
                      {Math.floor(battery2Level)}%
                    </div>
                  ) : (
                    <div
                      data-ocid="battery.success_state"
                      style={{
                        textAlign: "center",
                        padding: "8px 12px",
                        background: "rgba(255,215,0,0.08)",
                        border: "1px solid rgba(255,215,0,0.4)",
                        borderRadius: 8,
                        fontFamily: "Orbitron, sans-serif",
                        fontSize: 9,
                        color: "#FFD700",
                        letterSpacing: "0.1em",
                        animation: "pulseGlow 2s ease-in-out infinite",
                      }}
                    >
                      ✓ ALL SYSTEMS
                      <br />
                      POWERED
                    </div>
                  )}
                  {/* Fuse indicators */}
                  <div style={{ display: "flex", gap: 6 }}>
                    {["120W", "40W"].map((fuse) => (
                      <div
                        key={fuse}
                        style={{
                          fontFamily: "Orbitron, sans-serif",
                          fontSize: 7,
                          color: bothCharged
                            ? "#FFD700"
                            : "rgba(255,215,0,0.3)",
                          border: `1px solid ${bothCharged ? "#FFD700" : "#1a3a6b"}`,
                          borderRadius: 3,
                          padding: "2px 5px",
                          letterSpacing: "0.1em",
                          textShadow: bothCharged ? "0 0 6px #FFD700" : "none",
                        }}
                      >
                        {fuse} FUSE
                      </div>
                    ))}
                  </div>
                </div>

                <div data-ocid="battery.2_panel">
                  <BatteryWidget
                    id={2}
                    label="POWER CELL B"
                    onChargeChange={setBattery2Level}
                  />
                </div>
              </div>

              <PowerStabilizer isActive={bothCharged} />
            </div>

            {/* ROW 2 — WAVEFORM + ENGINES */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <WaveformVisualizer
                analyserNode={audioEngine.analyserNode}
                isPlaying={audioEngine.isPlaying}
              />
              <CircuitLines powered={bothCharged} />
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {(
                  [
                    { name: "BASS ENGINE", type: "bass" },
                    { name: "MID ENGINE", type: "mid" },
                    { name: "HIGH ENGINE", type: "high" },
                    { name: "PRESENCE ENGINE", type: "presence" },
                  ] as const
                ).map(({ name, type }) => (
                  <div key={type} data-ocid={`engine.${type}_panel`}>
                    <SoundEnginePanel
                      name={name}
                      engineType={type}
                      isActive={bothCharged}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 3 — PROCESSING MODULES */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              <SpecialProcessor isActive={bothCharged && switches.COMP} />
              <BassStabilizer
                isActive={bothCharged && switches.STAB}
                bassLevel={eqValues.bass}
              />
              <MonitorCompressor
                isActive={bothCharged && switches.COMP}
                onThresholdChange={audioEngine.setCompressorThreshold}
              />
              <StereoLineMixer
                onPanChange={audioEngine.setPan}
                isActive={bothCharged && switches.MIX}
              />
              <Epicenter
                isActive={bothCharged && switches.EPIC}
                onChange={() => {}}
              />
              <HarmonicProcessor isActive={bothCharged} />
              <FrequencyGenerator isActive={bothCharged} />
            </div>

            {/* ROW 4 — STUDIO SWITCHES */}
            <StudioSwitches switches={switches} onToggle={handleToggleSwitch} />

            {/* ROW 5 — EQ + CHAIN */}
            <ChainLink eqValues={eqValues} />
            <EQSliders
              onFilterChange={handleFilterChange}
              isActive={bothCharged && switches.EQ}
            />

            {/* ROW 6 — PLAYBACK CONTROLS */}
            <PlaybackControls
              onFileSelect={handleFileSelect}
              onPlay={audioEngine.play}
              onPause={audioEngine.pause}
              onSeek={audioEngine.seek}
              onVolumeChange={audioEngine.setVolume}
              currentTime={audioEngine.currentTime}
              duration={audioEngine.duration}
              isPlaying={audioEngine.isPlaying}
              isEnabled={bothCharged}
              currentTrack={audioEngine.currentTrack}
            />
          </main>

          <footer
            style={{
              padding: "14px 24px",
              textAlign: "center",
              borderTop: "1px solid rgba(255,215,0,0.1)",
              fontFamily: "Rajdhani, sans-serif",
              fontSize: 12,
              color: "rgba(255,215,0,0.4)",
              letterSpacing: "0.1em",
            }}
          >
            © {new Date().getFullYear()}. Built with ❤ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,215,0,0.6)", textDecoration: "none" }}
            >
              caffeine.ai
            </a>
          </footer>
        </div>
      )}
    </div>
  );
}
