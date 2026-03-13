# Number 1 Music App

## Current State
New project with no existing frontend or backend logic.

## Requested Changes (Diff)

### Add
- Book-open animation on launch revealing a cover page with gold text "2026 to 2027 Number 1 Winning Music App"
- File picker to load local audio files into a playlist
- 2 animated antigravity battery widgets with charging animations (fill, glow, arcs, percentage) -- music locked until both are fully charged
- 4 sound engine panels (Bass, Mid, High, Presence) connected to batteries via animated circuit/power line SVG visualization
- Full 6-band equalizer (bass, mid-low, mid, mid-high, treble, presence) using Web Audio API BiquadFilterNodes
- Chain link/block visual element that animates when EQ sliders move
- Audio waveform/visualizer using AnalyserNode and Canvas
- Standard playback controls: play, pause, skip forward/back, volume, seek bar
- Web Audio API audio graph: source -> gain nodes -> biquad filter nodes (6 bands) -> analyser -> destination
- Dark blue (#0a0f2e, #0d1b4b) and yellow (#FFD700, #FFC300) neon glowing UI

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Create BookCover component with CSS 3D book-open animation on mount
2. Create BatteryWidget component: animated charging fill, percentage counter, glow/spark/arc effects using CSS + SVG
3. Create CircuitLines component: SVG power lines connecting batteries to engine panels
4. Create SoundEnginePanel x4: shows powered/unpowered state
5. Create EQSlider component: 6-band sliders wired to BiquadFilterNodes
6. Create ChainLink component: animates/stretches based on EQ slider aggregate movement
7. Create Waveform component: Canvas-based visualizer reading AnalyserNode data
8. Create PlaybackControls: file picker, play/pause, skip, seek, volume
9. Wire Web Audio API graph in a custom hook useAudioEngine
10. Compose all components in App.tsx with dark blue/yellow theme
