import { useCallback, useRef, useState } from "react";
import { BatteryWidget } from "./components/BatteryWidget";
import { BookCover } from "./components/BookCover";
import { ChainLink } from "./components/ChainLink";
import { CircuitLines } from "./components/CircuitLines";
import { EQSliders } from "./components/EQSliders";
import { PlaybackControls } from "./components/PlaybackControls";
import { SoundEnginePanel } from "./components/SoundEnginePanel";
import { WaveformVisualizer } from "./components/WaveformVisualizer";
import { useAudioEngine } from "./hooks/useAudioEngine";

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
      {/* Background atmosphere */}
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

      {/* Book Cover overlay */}
      {showCover && <BookCover onComplete={() => setShowCover(false)} />}

      {/* Main app */}
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
              padding: "16px 24px",
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
                fontSize: "clamp(14px, 2vw, 20px)",
                fontWeight: 900,
                color: "#FFD700",
                textShadow: "0 0 20px rgba(255,215,0,0.7)",
                letterSpacing: "0.1em",
              }}
            >
              ⚡ NUMBER 1 MUSIC APP
            </div>

            <div
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "clamp(12px, 1.5vw, 16px)",
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
                fontSize: "clamp(11px, 1.5vw, 14px)",
                fontWeight: 700,
                color: "rgba(255,215,0,0.6)",
                letterSpacing: "0.15em",
              }}
            >
              2026 — 2027
            </div>
          </header>

          {/* MIDDLE: Batteries + Visualizer + Engines */}
          <main
            style={{
              flex: 1,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Battery 1 */}
              <div
                data-ocid="battery.1_panel"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px 16px",
                  background:
                    "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
                  border: "2px solid #1a3a6b",
                  borderRadius: 14,
                  minWidth: 160,
                }}
              >
                <BatteryWidget
                  id={1}
                  label="POWER CELL A"
                  onChargeChange={setBattery1Level}
                />
              </div>

              {/* Center panel */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  minWidth: 300,
                }}
              >
                {/* Waveform */}
                <WaveformVisualizer
                  analyserNode={audioEngine.analyserNode}
                  isPlaying={audioEngine.isPlaying}
                />

                {/* Circuit lines */}
                <CircuitLines powered={bothCharged} />

                {/* Engine panels */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div data-ocid="engine.bass_panel">
                    <SoundEnginePanel
                      name="BASS ENGINE"
                      engineType="bass"
                      isActive={bothCharged}
                    />
                  </div>
                  <div data-ocid="engine.mid_panel">
                    <SoundEnginePanel
                      name="MID ENGINE"
                      engineType="mid"
                      isActive={bothCharged}
                    />
                  </div>
                  <div data-ocid="engine.high_panel">
                    <SoundEnginePanel
                      name="HIGH ENGINE"
                      engineType="high"
                      isActive={bothCharged}
                    />
                  </div>
                  <div data-ocid="engine.presence_panel">
                    <SoundEnginePanel
                      name="PRESENCE ENGINE"
                      engineType="presence"
                      isActive={bothCharged}
                    />
                  </div>
                </div>

                {/* Charge status banner */}
                {!bothCharged && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      background: "rgba(0,100,200,0.1)",
                      border: "1px solid rgba(0,191,255,0.3)",
                      borderRadius: 8,
                      fontFamily: "Rajdhani, sans-serif",
                      fontSize: 13,
                      color: "rgba(0,191,255,0.8)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    ⚡ Charging: Cell A {Math.floor(battery1Level)}% · Cell B{" "}
                    {Math.floor(battery2Level)}%
                  </div>
                )}
                {bothCharged && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      background: "rgba(255,215,0,0.08)",
                      border: "1px solid rgba(255,215,0,0.4)",
                      borderRadius: 8,
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: 12,
                      color: "#FFD700",
                      letterSpacing: "0.15em",
                      animation: "pulseGlow 2s ease-in-out infinite",
                    }}
                  >
                    ✓ ALL SYSTEMS POWERED — READY FOR PLAYBACK
                  </div>
                )}
              </div>

              {/* Battery 2 */}
              <div
                data-ocid="battery.2_panel"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px 16px",
                  background:
                    "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
                  border: "2px solid #1a3a6b",
                  borderRadius: 14,
                  minWidth: 160,
                }}
              >
                <BatteryWidget
                  id={2}
                  label="POWER CELL B"
                  onChargeChange={setBattery2Level}
                />
              </div>
            </div>

            {/* Chain EQ link */}
            <ChainLink eqValues={eqValues} />

            {/* EQ Sliders */}
            <EQSliders
              onFilterChange={handleFilterChange}
              isActive={bothCharged}
            />

            {/* Playback Controls */}
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

          {/* FOOTER */}
          <footer
            style={{
              padding: "16px 24px",
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
