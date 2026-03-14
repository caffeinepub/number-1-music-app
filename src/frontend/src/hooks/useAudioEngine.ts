import { useCallback, useEffect, useRef, useState } from "react";

function makeDistortionCurve(drive: number): Float32Array {
  const n = 256;
  const curve = new Float32Array(n);
  const k = drive * 200;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    if (k === 0) {
      curve[i] = x;
    } else {
      curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
    }
  }
  return curve;
}

interface AudioEngineReturn {
  analyserNode: AnalyserNode | null;
  compressorNode: DynamicsCompressorNode | null;
  loadFile: (file: File) => Promise<void>;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  setFilterGain: (band: string, gainDb: number) => void;
  setBoosterGain: (v: number) => void;
  setCompressorThreshold: (v: number) => void;
  setPan: (v: number) => void;
  bypassEQ: (bypass: boolean) => void;
  bypassCompressor: (bypass: boolean) => void;
  bypassBooster: (bypass: boolean) => void;
  setEpicenterIntensity: (v: number) => void;
  // New engine functions
  setEngineGain: (
    engine: "bass" | "mid" | "high" | "presence",
    gainDb: number,
  ) => void;
  setBassStabilizerAmount: (v: number) => void;
  setHarmonicDrive: (v: number) => void;
  setFreqGenTone: (freq: number, mix: number) => void;
  setPowerStabilizerActive: (active: boolean) => void;
  setSpecialProcessorMode: (mode: "AT" | "BT", intensity: number) => void;
  setCompressorRatio: (v: number) => void;
  setCompressorAttack: (v: number) => void;
  setCompressorRelease: (v: number) => void;
  setSmartChipEnhance: (v: number) => void;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  currentTrack: string;
}

export function useAudioEngine(): AudioEngineReturn {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const boosterGainRef = useRef<GainNode | null>(null);
  // EQ filters (6-band)
  const filtersRef = useRef<Record<string, BiquadFilterNode>>({});
  const filterGainsRef = useRef<Record<string, number>>({});
  // Engine filters (4)
  const engineFiltersRef = useRef<Record<string, BiquadFilterNode>>({});
  const analyserRef = useRef<AnalyserNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseOffsetRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const boosterValueRef = useRef<number>(1.0);
  // New nodes
  const bassStabCompRef = useRef<DynamicsCompressorNode | null>(null);
  const waveShaperRef = useRef<WaveShaperNode | null>(null);
  const powerLimiterRef = useRef<DynamicsCompressorNode | null>(null);
  const specialProcFilterRef = useRef<BiquadFilterNode | null>(null);
  const smartChipFilterRef = useRef<BiquadFilterNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const subGainRef = useRef<GainNode | null>(null);
  const subOscStartedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState("");

  const getOrCreateContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const buildGraph = useCallback(() => {
    const ctx = getOrCreateContext();

    // === INPUT GAIN ===
    const gain = ctx.createGain();
    gain.gain.value = 1.0;
    gainNodeRef.current = gain;

    // === BOOSTER ===
    const booster = ctx.createGain();
    booster.gain.value = 1.0;
    boosterGainRef.current = booster;

    // === ENGINE FILTERS (4) ===
    const engineDefs: Array<{
      key: string;
      type: BiquadFilterType;
      freq: number;
    }> = [
      { key: "bassEngine", type: "lowshelf", freq: 80 },
      { key: "midEngine", type: "peaking", freq: 1000 },
      { key: "highEngine", type: "highshelf", freq: 8000 },
      { key: "presenceEngine", type: "peaking", freq: 6000 },
    ];
    const engineFilters: BiquadFilterNode[] = engineDefs.map(
      ({ key, type, freq }) => {
        const f = ctx.createBiquadFilter();
        f.type = type;
        f.frequency.value = freq;
        f.gain.value = 0;
        if (type === "peaking") f.Q.value = 1;
        engineFiltersRef.current[key] = f;
        return f;
      },
    );

    // === SMART CHIP FILTER ===
    const smartChipFilter = ctx.createBiquadFilter();
    smartChipFilter.type = "highshelf";
    smartChipFilter.frequency.value = 12000;
    smartChipFilter.gain.value = 0;
    smartChipFilterRef.current = smartChipFilter;

    // === SPECIAL PROCESSOR FILTER ===
    const specialProcFilter = ctx.createBiquadFilter();
    specialProcFilter.type = "allpass";
    specialProcFilter.frequency.value = 1000;
    specialProcFilter.Q.value = 1;
    specialProcFilterRef.current = specialProcFilter;

    // === WAVE SHAPER (harmonic drive) ===
    const waveShaper = ctx.createWaveShaper();
    waveShaper.curve = makeDistortionCurve(0) as Float32Array<ArrayBuffer>; // bypass by default
    waveShaper.oversample = "4x";
    waveShaperRef.current = waveShaper;

    // === EQ FILTERS (6-band) ===
    const filterDefs: Array<{
      key: string;
      type: BiquadFilterType;
      freq: number;
    }> = [
      { key: "bass", type: "lowshelf", freq: 80 },
      { key: "midLow", type: "peaking", freq: 250 },
      { key: "mid", type: "peaking", freq: 1000 },
      { key: "midHigh", type: "peaking", freq: 3500 },
      { key: "treble", type: "highshelf", freq: 8000 },
      { key: "presence", type: "peaking", freq: 6000 },
    ];
    const filters: BiquadFilterNode[] = filterDefs.map(
      ({ key, type, freq }) => {
        const f = ctx.createBiquadFilter();
        f.type = type;
        f.frequency.value = freq;
        f.gain.value = 0;
        if (type === "peaking") f.Q.value = 1;
        filtersRef.current[key] = f;
        filterGainsRef.current[key] = 0;
        return f;
      },
    );

    // === BASS STABILIZER COMPRESSOR ===
    const bassStabComp = ctx.createDynamicsCompressor();
    bassStabComp.threshold.value = -20;
    bassStabComp.knee.value = 10;
    bassStabComp.ratio.value = 4;
    bassStabComp.attack.value = 0.005;
    bassStabComp.release.value = 0.1;
    bassStabCompRef.current = bassStabComp;

    // === MAIN COMPRESSOR ===
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressorRef.current = compressor;

    // === PANNER ===
    const panner = ctx.createStereoPanner();
    panner.pan.value = 0;
    pannerRef.current = panner;

    // === POWER LIMITER ===
    const powerLimiter = ctx.createDynamicsCompressor();
    powerLimiter.threshold.value = -3;
    powerLimiter.knee.value = 0;
    powerLimiter.ratio.value = 20;
    powerLimiter.attack.value = 0.001;
    powerLimiter.release.value = 0.1;
    powerLimiterRef.current = powerLimiter;

    // === ANALYSER ===
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    // === SUB OSCILLATOR ===
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.value = 60;
    const subGain = ctx.createGain();
    subGain.gain.value = 0;
    subOscRef.current = subOsc;
    subGainRef.current = subGain;
    subOsc.connect(subGain);

    // === SIGNAL CHAIN ===
    // source -> gain -> booster -> engine[4] -> smartChip -> specialProc -> waveShaper -> eq[6] -> bassStab -> compressor -> panner -> powerLimiter -> analyser + subGain -> destination
    gain.connect(booster);
    booster.connect(engineFilters[0]);
    for (let i = 0; i < engineFilters.length - 1; i++) {
      engineFilters[i].connect(engineFilters[i + 1]);
    }
    engineFilters[engineFilters.length - 1].connect(smartChipFilter);
    smartChipFilter.connect(specialProcFilter);
    specialProcFilter.connect(waveShaper);
    waveShaper.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(bassStabComp);
    bassStabComp.connect(compressor);
    compressor.connect(panner);
    panner.connect(powerLimiter);
    powerLimiter.connect(analyser);
    analyser.connect(ctx.destination);
    // sub osc also connects to analyser for mixing
    subGain.connect(analyser);
  }, [getOrCreateContext]);

  const loadFile = useCallback(
    async (file: File) => {
      const ctx = getOrCreateContext();
      if (!gainNodeRef.current) {
        buildGraph();
        // Start sub osc after graph built
        if (subOscRef.current && !subOscStartedRef.current) {
          subOscRef.current.start();
          subOscStartedRef.current = true;
        }
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = await ctx.decodeAudioData(arrayBuffer);
      audioBufferRef.current = buffer;
      setDuration(buffer.duration);
      setCurrentTime(0);
      pauseOffsetRef.current = 0;
      setCurrentTrack(file.name.replace(/\.[^.]+$/, ""));
      setIsPlaying(false);

      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (_) {
          /* ignore */
        }
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
    },
    [getOrCreateContext, buildGraph],
  );

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    const ctx = audioCtxRef.current;
    const buffer = audioBufferRef.current;
    if (!ctx || !buffer || !gainNodeRef.current) return;

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (_) {
        /* ignore */
      }
      sourceNodeRef.current.disconnect();
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNodeRef.current);
    source.start(0, pauseOffsetRef.current);
    source.onended = () => {
      if (isPlaying) {
        setIsPlaying(false);
        setCurrentTime(0);
        pauseOffsetRef.current = 0;
        stopInterval();
      }
    };

    sourceNodeRef.current = source;
    startTimeRef.current = ctx.currentTime - pauseOffsetRef.current;
    setIsPlaying(true);

    stopInterval();
    intervalRef.current = setInterval(() => {
      if (audioCtxRef.current) {
        const t = audioCtxRef.current.currentTime - startTimeRef.current;
        setCurrentTime(Math.min(t, buffer.duration));
      }
    }, 200);
  }, [isPlaying, stopInterval]);

  const pause = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (sourceNodeRef.current) {
      pauseOffsetRef.current = ctx.currentTime - startTimeRef.current;
      try {
        sourceNodeRef.current.stop();
      } catch (_) {
        /* ignore */
      }
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    stopInterval();
  }, [stopInterval]);

  const seek = useCallback(
    (time: number) => {
      pauseOffsetRef.current = time;
      setCurrentTime(time);
      if (isPlaying) {
        pause();
        setTimeout(() => play(), 50);
      }
    },
    [isPlaying, pause, play],
  );

  const setVolume = useCallback((v: number) => {
    if (gainNodeRef.current) gainNodeRef.current.gain.value = v;
  }, []);

  const setFilterGain = useCallback((band: string, gainDb: number) => {
    filterGainsRef.current[band] = gainDb;
    const f = filtersRef.current[band];
    if (f) f.gain.value = gainDb;
  }, []);

  const setBoosterGain = useCallback((v: number) => {
    boosterValueRef.current = v;
    if (boosterGainRef.current) boosterGainRef.current.gain.value = v;
  }, []);

  const setCompressorThreshold = useCallback((v: number) => {
    if (compressorRef.current) compressorRef.current.threshold.value = v;
  }, []);

  const setPan = useCallback((v: number) => {
    if (pannerRef.current) pannerRef.current.pan.value = v;
  }, []);

  const bypassEQ = useCallback((bypass: boolean) => {
    const filters = filtersRef.current;
    const stored = filterGainsRef.current;
    for (const key of Object.keys(filters)) {
      const node = filters[key];
      if (node) {
        node.gain.value = bypass ? 0 : (stored[key] ?? 0);
      }
    }
  }, []);

  const bypassCompressor = useCallback((bypass: boolean) => {
    const c = compressorRef.current;
    if (!c) return;
    if (bypass) {
      c.ratio.value = 1;
      c.threshold.value = 0;
    } else {
      c.ratio.value = 12;
      c.threshold.value = -24;
    }
  }, []);

  const bypassBooster = useCallback((bypass: boolean) => {
    if (boosterGainRef.current) {
      boosterGainRef.current.gain.value = bypass ? 0 : boosterValueRef.current;
    }
  }, []);

  const setEpicenterIntensity = useCallback((v: number) => {
    // Map 0-100 to bass boost 0-12dB
    const bassFilter = filtersRef.current.bass;
    if (bassFilter) {
      bassFilter.gain.value = (v / 100) * 12;
    }
  }, []);

  // === NEW ENGINE FUNCTIONS ===

  const setEngineGain = useCallback(
    (engine: "bass" | "mid" | "high" | "presence", gainDb: number) => {
      const keyMap: Record<string, string> = {
        bass: "bassEngine",
        mid: "midEngine",
        high: "highEngine",
        presence: "presenceEngine",
      };
      const f = engineFiltersRef.current[keyMap[engine]];
      if (f) f.gain.value = gainDb;
    },
    [],
  );

  const setBassStabilizerAmount = useCallback((v: number) => {
    // 0-100 -> ratio 1-8, threshold -40 to -10
    const c = bassStabCompRef.current;
    if (!c) return;
    if (v === 0) {
      c.ratio.value = 1;
      c.threshold.value = 0;
    } else {
      c.ratio.value = 1 + (v / 100) * 7;
      c.threshold.value = -40 + (v / 100) * 30;
    }
  }, []);

  const setHarmonicDrive = useCallback((v: number) => {
    const ws = waveShaperRef.current;
    if (!ws) return;
    if (v === 0) {
      // flat passthrough
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) curve[i] = (i * 2) / 256 - 1;
      ws.curve = curve as Float32Array<ArrayBuffer>;
    } else {
      ws.curve = makeDistortionCurve(v / 100) as Float32Array<ArrayBuffer>;
    }
  }, []);

  const setFreqGenTone = useCallback((freq: number, mix: number) => {
    if (subOscRef.current) {
      subOscRef.current.frequency.value = freq;
    }
    if (subGainRef.current) {
      subGainRef.current.gain.value = (mix / 100) * 0.3; // max 0.3 to not overwhelm
    }
  }, []);

  const setPowerStabilizerActive = useCallback((active: boolean) => {
    const pl = powerLimiterRef.current;
    if (!pl) return;
    if (active) {
      pl.threshold.value = -3;
      pl.ratio.value = 20;
    } else {
      pl.threshold.value = 0;
      pl.ratio.value = 1;
    }
  }, []);

  const setSpecialProcessorMode = useCallback(
    (mode: "AT" | "BT", intensity: number) => {
      const f = specialProcFilterRef.current;
      if (!f) return;
      if (mode === "AT") {
        f.type = "bandpass";
        f.frequency.value = 1000 + (intensity / 100) * 4000;
        f.Q.value = 1 + (intensity / 100) * 4;
      } else {
        f.type = "allpass";
        f.frequency.value = 500 + (intensity / 100) * 2000;
        f.Q.value = 0.5 + (intensity / 100) * 2;
      }
    },
    [],
  );

  const setCompressorRatio = useCallback((v: number) => {
    if (compressorRef.current) compressorRef.current.ratio.value = v;
  }, []);

  const setCompressorAttack = useCallback((v: number) => {
    if (compressorRef.current) compressorRef.current.attack.value = v;
  }, []);

  const setCompressorRelease = useCallback((v: number) => {
    if (compressorRef.current) compressorRef.current.release.value = v;
  }, []);

  const setSmartChipEnhance = useCallback((v: number) => {
    const f = smartChipFilterRef.current;
    if (!f) return;
    f.gain.value = (v / 100) * 12; // 0-12dB shelf boost
  }, []);

  // Cleanup sub osc on unmount
  useEffect(() => {
    return () => {
      if (subOscRef.current && subOscStartedRef.current) {
        try {
          subOscRef.current.stop();
        } catch (_) {
          /* ignore */
        }
      }
    };
  }, []);

  return {
    analyserNode: analyserRef.current,
    compressorNode: compressorRef.current,
    loadFile,
    play,
    pause,
    seek,
    setVolume,
    setFilterGain,
    setBoosterGain,
    setCompressorThreshold,
    setPan,
    bypassEQ,
    bypassCompressor,
    bypassBooster,
    setEpicenterIntensity,
    setEngineGain,
    setBassStabilizerAmount,
    setHarmonicDrive,
    setFreqGenTone,
    setPowerStabilizerActive,
    setSpecialProcessorMode,
    setCompressorRatio,
    setCompressorAttack,
    setCompressorRelease,
    setSmartChipEnhance,
    currentTime,
    duration,
    isPlaying,
    currentTrack,
  };
}
