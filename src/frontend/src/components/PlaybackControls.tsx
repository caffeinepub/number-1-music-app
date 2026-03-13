import { useRef } from "react";

interface PlaybackControlsProps {
  onFileSelect: (file: File) => void;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (t: number) => void;
  onVolumeChange: (v: number) => void;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isEnabled: boolean;
  currentTrack: string;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function PlaybackControls({
  onFileSelect,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  currentTime,
  duration,
  isPlaying,
  isEnabled,
  currentTrack,
}: PlaybackControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };

  const seekPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const activeColor = isEnabled ? "#FFD700" : "#1a3a6b";

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px #FFD700";
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.boxShadow =
      "0 0 12px rgba(255,215,0,0.5)";
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #080f22 0%, #050d1f 100%)",
        border: "2px solid #1a3a6b",
        borderRadius: 14,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: isEnabled ? "0 0 30px rgba(255,215,0,0.15)" : "none",
        transition: "box-shadow 0.5s",
      }}
    >
      {/* Row 1: File select + track name + time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          data-ocid="player.upload_button"
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "#050d1f",
            background: "#FFD700",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            cursor: "pointer",
            letterSpacing: "0.1em",
            boxShadow: "0 0 12px rgba(255,215,0,0.5)",
            transition: "box-shadow 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          📁 SELECT FILE
        </button>

        <div
          style={{
            flex: 1,
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            color: currentTrack ? "#FFD700" : "rgba(255,255,255,0.3)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {currentTrack || "No track loaded"}
        </div>

        <div
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#FFD700",
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
          }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Row 2: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          disabled={!isEnabled}
          style={{
            background: "transparent",
            border: `2px solid ${activeColor}`,
            borderRadius: 8,
            color: activeColor,
            fontSize: 18,
            width: 38,
            height: 38,
            cursor: isEnabled ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onClick={() => isEnabled && onSeek(0)}
        >
          ⏮
        </button>

        <button
          type="button"
          data-ocid="player.primary_button"
          disabled={!isEnabled}
          onClick={() => {
            if (!isEnabled) return;
            if (isPlaying) onPause();
            else onPlay();
          }}
          title={!isEnabled ? "⚡ Charge batteries first" : undefined}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: isEnabled
              ? isPlaying
                ? "linear-gradient(135deg, #FFD700, #FF9900)"
                : "linear-gradient(135deg, #FFD700, #FFE44D)"
              : "#1a3a6b",
            border: "none",
            cursor: isEnabled ? "pointer" : "not-allowed",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isEnabled ? "0 0 20px rgba(255,215,0,0.6)" : "none",
            transition: "all 0.3s",
            color: "#050d1f",
            flexShrink: 0,
          }}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          type="button"
          disabled={!isEnabled}
          style={{
            background: "transparent",
            border: `2px solid ${activeColor}`,
            borderRadius: 8,
            color: activeColor,
            fontSize: 18,
            width: 38,
            height: 38,
            cursor: isEnabled ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onClick={() => isEnabled && onSeek(0)}
        >
          ⏭
        </button>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <input
            type="range"
            className="seek-slider"
            data-ocid="player.seek_input"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            disabled={!isEnabled || duration === 0}
            style={
              {
                width: "100%",
                opacity: isEnabled && duration > 0 ? 1 : 0.4,
                cursor: isEnabled && duration > 0 ? "pointer" : "not-allowed",
                "--seek-pct": `${seekPct}%`,
              } as React.CSSProperties
            }
            onChange={(e) =>
              isEnabled && onSeek(Number.parseFloat(e.target.value))
            }
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16 }}>🔊</span>
          <input
            type="range"
            className="volume-slider"
            data-ocid="player.volume_input"
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            style={{ width: 80, "--vol-pct": "100%" } as React.CSSProperties}
            onChange={(e) => {
              const v = Number.parseFloat(e.target.value);
              onVolumeChange(v);
              e.currentTarget.style.setProperty("--vol-pct", `${v * 100}%`);
            }}
          />
        </div>
      </div>

      {!isEnabled && (
        <div
          style={{
            textAlign: "center",
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 13,
            color: "rgba(255,150,0,0.8)",
            animation: "orbPulse 2s ease-in-out infinite",
          }}
        >
          ⚡ Charge both batteries to enable playback
        </div>
      )}
    </div>
  );
}
