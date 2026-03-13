import { useCallback, useEffect, useRef, useState } from "react";

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
  const filtersRef = useRef<Record<string, BiquadFilterNode>>({});
  const analyserRef = useRef<AnalyserNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseOffsetRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

    const gain = ctx.createGain();
    gain.gain.value = 1.0;
    gainNodeRef.current = gain;

    const booster = ctx.createGain();
    booster.gain.value = 1.0;
    boosterGainRef.current = booster;

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
        return f;
      },
    );

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressorRef.current = compressor;

    const panner = ctx.createStereoPanner();
    panner.pan.value = 0;
    pannerRef.current = panner;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    // Chain: gain -> booster -> filter1...filter6 -> compressor -> panner -> analyser -> destination
    gain.connect(booster);
    booster.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(compressor);
    compressor.connect(panner);
    panner.connect(analyser);
    analyser.connect(ctx.destination);
  }, [getOrCreateContext]);

  const loadFile = useCallback(
    async (file: File) => {
      const ctx = getOrCreateContext();
      if (!gainNodeRef.current) {
        buildGraph();
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
    const f = filtersRef.current[band];
    if (f) f.gain.value = gainDb;
  }, []);

  const setBoosterGain = useCallback((v: number) => {
    if (boosterGainRef.current) boosterGainRef.current.gain.value = v;
  }, []);

  const setCompressorThreshold = useCallback((v: number) => {
    if (compressorRef.current) compressorRef.current.threshold.value = v;
  }, []);

  const setPan = useCallback((v: number) => {
    if (pannerRef.current) pannerRef.current.pan.value = v;
  }, []);

  useEffect(() => {
    return () => {
      stopInterval();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [stopInterval]);

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
    currentTime,
    duration,
    isPlaying,
    currentTrack,
  };
}
