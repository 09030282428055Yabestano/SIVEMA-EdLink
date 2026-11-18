import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sliders,
  Video,
} from 'lucide-react';

export type PresetKey = 'elastic' | 'partial' | 'inelastic' | 'different-mass';

interface SimParams {
  m1: number;
  m2: number;
  v1: number;
  v2: number;
  e: number;
}

const PRESETS: Record<
  PresetKey,
  { label: string; shortDesc: string; params: SimParams }
> = {
  elastic: {
    label: 'Lenting Sempurna (e = 1)',
    shortDesc: 'Massa sama bertukar kecepatan; energi kinetik total 100% kekal.',
    params: { m1: 2, m2: 2, v1: 4.5, v2: -2.0, e: 1.0 },
  },
  partial: {
    label: 'Lenting Sebagian (e = 0,6)',
    shortDesc: 'Tumbukan nyata; momentum kekal namun sebagian energi terdisipasi.',
    params: { m1: 2.5, m2: 2.0, v1: 5.0, v2: -1.5, e: 0.6 },
  },
  inelastic: {
    label: 'Tidak Lenting (e = 0)',
    shortDesc: 'Kedua benda menyatu setelah kontak dan bergerak dengan v′ sama.',
    params: { m1: 3.0, m2: 2.0, v1: 5.0, v2: 0.0, e: 0.0 },
  },
  'different-mass': {
    label: 'Massa Berbeda (m₁ < m₂)',
    shortDesc: 'Benda ringan memantul balik saat menumbuk benda bermassa besar.',
    params: { m1: 1.0, m2: 4.5, v1: 6.0, v2: 0.0, e: 0.9 },
  },
};

interface CollisionSimulatorProps {
  initialPreset?: PresetKey;
  chapterKey?: string;
  compact?: boolean;
  onCompleteMedia?: () => void;
}

export const CollisionSimulator: React.FC<CollisionSimulatorProps> = ({
  initialPreset = 'elastic',
  chapterKey,
  compact = false,
  onCompleteMedia,
}) => {
  const [activePreset, setActivePreset] = useState<PresetKey>(initialPreset);
  const [params, setParams] = useState<SimParams>(PRESETS[initialPreset].params);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);
  const [simTime, setSimTime] = useState(0);
  const [chartMode, setChartMode] = useState<'both' | 'momentum' | 'energy'>('both');
  const [canvasWidth, setCanvasWidth] = useState(720);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const markedCompleteRef = useRef(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setCanvasWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setActivePreset(initialPreset);
    setParams(PRESETS[initialPreset].params);
    setSimTime(0);
    setIsPlaying(true);
    markedCompleteRef.current = false;
  }, [initialPreset, chapterKey]);

  // Physics calculations on linear air track
  const physics = useMemo(() => {
    const { m1, m2, v1, v2, e } = params;
    const x1Start = 2.6;
    const x2Start = 8.4;
    const r1 = 0.36 + Math.min(0.28, m1 * 0.045);
    const r2 = 0.36 + Math.min(0.28, m2 * 0.045);
    const contactDist = r1 + r2;
    const initialGap = x2Start - x1Start - contactDist;
    const relV = v1 - v2;
    const willCollide = relV > 0.05;
    const tColl = willCollide ? initialGap / relV : null;

    const p1Before = m1 * v1;
    const p2Before = m2 * v2;
    const totalMomentum = p1Before + p2Before;
    const v1After = (m1 * v1 + m2 * v2 - m2 * e * (v1 - v2)) / (m1 + m2);
    const v2After = (m1 * v1 + m2 * v2 + m1 * e * (v1 - v2)) / (m1 + m2);
    const p1After = m1 * v1After;
    const p2After = m2 * v2After;

    const ek1Before = 0.5 * m1 * v1 * v1;
    const ek2Before = 0.5 * m2 * v2 * v2;
    const ekBefore = ek1Before + ek2Before;
    const ek1After = 0.5 * m1 * v1After * v1After;
    const ek2After = 0.5 * m2 * v2After * v2After;
    const ekAfter = ek1After + ek2After;
    const ekLoss = Math.max(0, ekBefore - ekAfter);
    const ekLossPct = ekBefore > 0 ? (ekLoss / ekBefore) * 100 : 0;

    // Ensure slow relative collisions still visibly occur inside the video duration
    const totalDuration = tColl !== null ? Math.min(12, Math.max(3.6, tColl + 1.8)) : 4.0;

    // Compute stationary track range enclosing full motion across [0, totalDuration]
    const samplesX: number[] = [x1Start - r1, x2Start + r2];
    if (tColl !== null) {
      const x1AtC = x1Start + v1 * tColl;
      const x2AtC = x2Start + v2 * tColl;
      const dtEnd = totalDuration - tColl;
      samplesX.push(
        x1AtC - r1,
        x2AtC + r2,
        x1AtC + v1After * dtEnd - r1,
        x1AtC + v1After * dtEnd + r1,
        x2AtC + v2After * dtEnd - r2,
        x2AtC + v2After * dtEnd + r2
      );
    } else {
      samplesX.push(
        x1Start + v1 * totalDuration - r1,
        x2Start + v2 * totalDuration + r2
      );
    }
    const trackMin = Math.min(0, Math.floor(Math.min(...samplesX) - 0.8));
    const trackMax = Math.max(12, Math.ceil(Math.max(...samplesX) + 0.8));

    return {
      x1Start,
      x2Start,
      r1,
      r2,
      tColl,
      willCollide,
      p1Before,
      p2Before,
      p1After,
      p2After,
      totalMomentum,
      v1After,
      v2After,
      ek1Before,
      ek2Before,
      ek1After,
      ek2After,
      ekBefore,
      ekAfter,
      ekLoss,
      ekLossPct,
      totalDuration,
      trackMin,
      trackMax,
    };
  }, [params]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000) * speed;
      lastTs = now;
      setSimTime((prev) => {
        const next = prev + dt;
        return next >= physics.totalDuration ? 0 : next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, speed, physics.totalDuration]);

  // Mark media stage complete safely outside state updater
  useEffect(() => {
    if (
      onCompleteMedia &&
      !markedCompleteRef.current &&
      simTime >= physics.totalDuration * 0.85
    ) {
      markedCompleteRef.current = true;
      onCompleteMedia();
    }
  }, [simTime, physics.totalDuration, onCompleteMedia]);

  // Current phase & positions at simTime
  const stateAtTime = useMemo(() => {
    const { tColl, x1Start, x2Start } = physics;
    const { v1, v2 } = params;
    const hasCollided = tColl !== null && simTime >= tColl;
    const isContactWindow = tColl !== null && Math.abs(simTime - tColl) <= 0.14;

    let x1: number;
    let x2: number;
    let currV1: number;
    let currV2: number;

    if (!hasCollided || tColl === null) {
      x1 = x1Start + v1 * simTime;
      x2 = x2Start + v2 * simTime;
      currV1 = v1;
      currV2 = v2;
    } else {
      const dtAfter = simTime - tColl;
      const x1AtColl = x1Start + v1 * tColl;
      const x2AtColl = x2Start + v2 * tColl;
      x1 = x1AtColl + physics.v1After * dtAfter;
      x2 = x2AtColl + physics.v2After * dtAfter;
      currV1 = physics.v1After;
      currV2 = physics.v2After;
    }

    let phaseTitle = 'Fase 1: Sebelum Tumbukan';
    let narration = `Benda A (${params.m1} kg) dan Benda B (${params.m2} kg) bergerak dengan momentum total ${physics.totalMomentum.toFixed(1)} kg·m/s.`;

    if (!physics.willCollide) {
      phaseTitle = 'Tidak Terjadi Tumbukan';
      narration = 'Kecepatan relatif v₁ − v₂ ≤ 0 sehingga Benda A tidak mengejar Benda B. Naikkan v₁ atau kurangi v₂.';
    } else if (isContactWindow) {
      phaseTitle = 'Fase 2: Kontak & Gaya Impuls';
      narration = `Gaya aksi-reaksi F₁₂ = −F₂₁ bekerja singkat; koefisien restitusi e = ${params.e.toFixed(2)} menentukan laju pemisahan.`;
    } else if (hasCollided) {
      phaseTitle = 'Fase 3: Pasca-Tumbukan';
      narration =
        params.e === 0
          ? `Kedua benda menyatu pada kecepatan bersama v′ = ${physics.v1After.toFixed(2)} m/s. Energi terdisipasi ${physics.ekLoss.toFixed(1)} J.`
          : `v₁′ = ${physics.v1After.toFixed(2)} m/s dan v₂′ = ${physics.v2After.toFixed(2)} m/s. Momentum total tetap ${physics.totalMomentum.toFixed(1)} kg·m/s.`;
    }

    return {
      x1,
      x2,
      currV1,
      currV2,
      hasCollided,
      isContactWindow,
      phaseTitle,
      narration,
    };
  }, [physics, params, simTime]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 720;
    const height = compact ? 230 : 280;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Background laboratory grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    const gridStep = 36;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Track rail
    const trackY = height - 54;
    const padX = 48;
    const trackW = width - padX * 2;
    const trackSpan = Math.max(12, physics.trackMax - physics.trackMin);
    const metersToPx = (m: number) =>
      padX + ((m - physics.trackMin) / trackSpan) * trackW;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(padX, trackY, trackW, 12);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(padX, trackY, trackW, 12);

    // Ruler ticks across dynamic track span
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const tickStep = trackSpan > 18 ? 4 : 2;
    const firstTick = Math.ceil(physics.trackMin / tickStep) * tickStep;
    for (let m = firstTick; m <= physics.trackMax; m += tickStep) {
      const px = metersToPx(m);
      ctx.fillRect(px - 0.5, trackY + 12, 1, 6);
      ctx.fillText(`${m}m`, px, trackY + 30);
    }

    // Draw contact shockwave when colliding
    const px1 = metersToPx(stateAtTime.x1);
    const px2 = metersToPx(stateAtTime.x2);
    const pr1 = (physics.r1 / trackSpan) * trackW;
    const pr2 = (physics.r2 / trackSpan) * trackW;

    if (stateAtTime.isContactWindow) {
      const contactX = (px1 + pr1 + (px2 - pr2)) / 2;
      const contactY = trackY - Math.min(pr1, pr2);
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(contactX, contactY, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(contactX, contactY, 34, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.stroke();

      ctx.fillStyle = '#fcd34d';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('IMPULS F·Δt', contactX, Math.max(16, contactY - 40));
      ctx.restore();
    }

    const drawVelocityArrow = (
      cx: number,
      cy: number,
      radius: number,
      velocity: number,
      colorHighlight: string,
      yOffset: number,
      customPrefix?: string
    ) => {
      const ay = Math.max(24, cy - radius - 18 - yOffset);
      if (Math.abs(velocity) > 0.05) {
        const arrowLen = Math.min(84, Math.max(22, Math.abs(velocity) * 10)) * Math.sign(velocity);
        ctx.strokeStyle = colorHighlight;
        ctx.fillStyle = colorHighlight;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, ay);
        ctx.lineTo(cx + arrowLen, ay);
        ctx.stroke();

        const dir = Math.sign(arrowLen);
        ctx.beginPath();
        ctx.moveTo(cx + arrowLen, ay);
        ctx.lineTo(cx + arrowLen - 7 * dir, ay - 4.5);
        ctx.lineTo(cx + arrowLen - 7 * dir, ay + 4.5);
        ctx.closePath();
        ctx.fill();

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const labelX = Math.max(54, Math.min(width - 54, cx + arrowLen / 2));
        const txt = `${customPrefix ? `${customPrefix} ` : ''}${velocity >= 0 ? '+' : ''}${velocity.toFixed(2)} m/s`;
        ctx.fillText(txt, labelX, ay - 6);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(
          `${customPrefix ? `${customPrefix} ` : ''}v = 0.00 m/s`,
          Math.max(54, Math.min(width - 54, cx)),
          ay - 2
        );
      }
    };

    const drawSphere = (
      cx: number,
      radius: number,
      colorMain: string,
      colorHighlight: string,
      label: string,
      mass: number
    ) => {
      const cy = trackY - radius;

      // Shadow
      ctx.fillStyle = 'rgba(2, 6, 23, 0.45)';
      ctx.beginPath();
      ctx.ellipse(cx, trackY, radius * 0.85, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sphere body
      const grad = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        radius * 0.15,
        cx,
        cy,
        radius
      );
      grad.addColorStop(0, colorHighlight);
      grad.addColorStop(1, colorMain);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label inside sphere
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, cx, cy - 5);
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText(`${mass.toFixed(1)}kg`, cx, cy + 9);
    };

    drawSphere(px1, pr1, '#2563eb', '#60a5fa', 'A', params.m1);
    drawSphere(px2, pr2, '#059669', '#34d399', 'B', params.m2);

    const mergedAfterCollision = params.e === 0 && stateAtTime.hasCollided;
    if (mergedAfterCollision) {
      const midX = (px1 + px2) / 2;
      const topR = Math.max(pr1, pr2);
      drawVelocityArrow(midX, trackY - topR, topR, stateAtTime.currV1, '#fbbf24', 2, 'v′');
    } else {
      const closeHorizontal = Math.abs(px1 - px2) < 92;
      drawVelocityArrow(px1, trackY - pr1, pr1, stateAtTime.currV1, '#60a5fa', 0);
      drawVelocityArrow(
        px2,
        trackY - pr2,
        pr2,
        stateAtTime.currV2,
        '#34d399',
        closeHorizontal ? 24 : 0
      );
    }

    ctx.restore();
  }, [
    canvasWidth,
    compact,
    params.e,
    params.m1,
    params.m2,
    physics.r1,
    physics.r2,
    physics.trackMax,
    physics.trackMin,
    stateAtTime,
  ]);

  const applyPreset = (key: PresetKey) => {
    setActivePreset(key);
    setParams(PRESETS[key].params);
    setSimTime(0);
    setIsPlaying(true);
  };

  const progressPct = Math.min(100, (simTime / physics.totalDuration) * 100);
  const collPct =
    physics.tColl !== null && physics.tColl <= physics.totalDuration
      ? (physics.tColl / physics.totalDuration) * 100
      : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Video className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Video Animasi & Simulasi Tumbukan Interaktif
            </h3>
            <p className="text-xs text-slate-500">
              Putar, jeda, geser timeline video, atau ubah massa, kecepatan, dan koefisien restitusi secara langsung
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {([0.5, 1, 1.5] as const).map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setSpeed(spd)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                speed === spd
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Preset selector */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2">
        {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => applyPreset(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              activePreset === key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {PRESETS[key].label}
          </button>
        ))}
      </div>

      {/* Canvas stage */}
      <div className="relative bg-slate-900">
        <canvas
          ref={canvasRef}
          style={{ height: compact ? 230 : 280 }}
          className="w-full block"
        />

        {/* Dynamic synchronized subtitle / phase readout */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-100">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-blue-400">
              {stateAtTime.phaseTitle}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {stateAtTime.narration}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 tabular-nums whitespace-nowrap shrink-0">
            t = {simTime.toFixed(2)}s / {physics.totalDuration.toFixed(2)}s
          </div>
        </div>

        {/* Video-style scrubber & playback bar */}
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2.5">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={physics.totalDuration}
              step={0.01}
              value={simTime}
              aria-label="Timeline animasi tumbukan"
              onChange={(e) => {
                setIsPlaying(false);
                setSimTime(parseFloat(e.target.value));
              }}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
            {collPct !== null && (
              <div
                title="Titik Momen Tumbukan"
                style={{ left: `${collPct}%` }}
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-2 h-3.5 bg-amber-400 rounded-xs"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSimTime((t) => Math.max(0, t - 0.25));
                }}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Mundur 0.25 detik"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Jeda Animasi' : 'Putar Animasi'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSimTime((t) => Math.min(physics.totalDuration, t + 0.25));
                }}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Maju 0.25 detik"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimTime(0);
                  setIsPlaying(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ulangi
              </button>
            </div>

            <div className="text-xs text-slate-400 tabular-nums">
              Progres Video: {Math.round(progressPct)}%
              {physics.tColl !== null && ` · Momen Kontak di t = ${physics.tColl.toFixed(2)}s`}
            </div>
          </div>
        </div>
      </div>

      {/* Parameter controls & live quantitative comparison */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Parameter Laboratorium Virtual</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">Massa Benda A (m₁)</span>
                <span className="font-mono font-semibold text-blue-700 tabular-nums">
                  {params.m1.toFixed(1)} kg
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={6}
                step={0.5}
                value={params.m1}
                onChange={(e) => {
                  setParams((p) => ({ ...p, m1: parseFloat(e.target.value) }));
                  setSimTime(0);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="block">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">Massa Benda B (m₂)</span>
                <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                  {params.m2.toFixed(1)} kg
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={6}
                step={0.5}
                value={params.m2}
                onChange={(e) => {
                  setParams((p) => ({ ...p, m2: parseFloat(e.target.value) }));
                  setSimTime(0);
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </label>

            <label className="block">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">Kecepatan Awal A (v₁)</span>
                <span className="font-mono font-semibold text-blue-700 tabular-nums">
                  {params.v1 >= 0 ? '+' : ''}
                  {params.v1.toFixed(1)} m/s
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={8}
                step={0.5}
                value={params.v1}
                onChange={(e) => {
                  setParams((p) => ({ ...p, v1: parseFloat(e.target.value) }));
                  setSimTime(0);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="block">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">Kecepatan Awal B (v₂)</span>
                <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                  {params.v2 >= 0 ? '+' : ''}
                  {params.v2.toFixed(1)} m/s
                </span>
              </div>
              <input
                type="range"
                min={-6}
                max={4}
                step={0.5}
                value={params.v2}
                onChange={(e) => {
                  setParams((p) => ({ ...p, v2: parseFloat(e.target.value) }));
                  setSimTime(0);
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </label>

            <label className="block sm:col-span-2">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">
                  Koefisien Restitusi (e) — Jenis Tumbukan
                </span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  e = {params.e.toFixed(2)}{' '}
                  <span className="text-slate-500 font-sans font-normal">
                    (
                    {params.e === 1
                      ? 'Lenting Sempurna'
                      : params.e === 0
                      ? 'Tidak Lenting'
                      : 'Lenting Sebagian'}
                    )
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={params.e}
                onChange={(e) => {
                  setParams((p) => ({ ...p, e: parseFloat(e.target.value) }));
                  setSimTime(0);
                }}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Live telemetry readout */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-700">
            Pembacaan Fisika Real-Time
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-slate-500">Kecepatan Akhir A (v₁′)</div>
              <div className="text-base font-mono font-semibold text-blue-700 tabular-nums mt-0.5">
                {physics.v1After >= 0 ? '+' : ''}
                {physics.v1After.toFixed(2)} m/s
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-slate-500">Kecepatan Akhir B (v₂′)</div>
              <div className="text-base font-mono font-semibold text-emerald-700 tabular-nums mt-0.5">
                {physics.v2After >= 0 ? '+' : ''}
                {physics.v2After.toFixed(2)} m/s
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Momentum Total Sistem</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {physics.totalMomentum.toFixed(2)} kg·m/s (Kekal)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Energi Kinetik Awal → Akhir</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {physics.ekBefore.toFixed(1)} J → {physics.ekAfter.toFixed(1)} J
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Energi Terdisipasi (ΔEk)</span>
              <span className="font-mono font-semibold text-amber-700 tabular-nums">
                {physics.ekLoss.toFixed(1)} J ({physics.ekLossPct.toFixed(1)}%)
              </span>
            </div>

            {/* Energy retention bar */}
            <div className="pt-1">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Retensi Energi Kinetik</span>
                <span className="font-mono tabular-nums">
                  {(100 - physics.ekLossPct).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-200"
                  style={{ width: `${Math.max(0, 100 - physics.ekLossPct)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW FEATURE: Real-Time Momentum & Kinetic Energy Time-Series Charts */}
      <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-slate-900">
                Grafik Momentum & Energi Kinetik Waktu Nyata
              </h4>
              <p className="text-[11px] text-slate-500">
                Garis vertikal biru mengikuti posisi waktu animasi (klik area grafik untuk melompat ke waktu tertentu)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            {(
              [
                { id: 'both', label: 'Keduanya' },
                { id: 'momentum', label: 'Momentum p(t)' },
                { id: 'energy', label: 'Energi Ek(t)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setChartMode(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  chartMode === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {(() => {
          const tColl =
            physics.tColl !== null && physics.tColl <= physics.totalDuration
              ? physics.tColl
              : null;
          const totalT = physics.totalDuration;
          const curP1 = params.m1 * stateAtTime.currV1;
          const curP2 = params.m2 * stateAtTime.currV2;
          const curPTotal = curP1 + curP2;
          const curEk1 = 0.5 * params.m1 * stateAtTime.currV1 * stateAtTime.currV1;
          const curEk2 = 0.5 * params.m2 * stateAtTime.currV2 * stateAtTime.currV2;
          const curEkTotal = curEk1 + curEk2;

          const svgW = 420;
          const svgH = 152;
          const pL = 42;
          const pR = 14;
          const pT = 14;
          const pB = 24;
          const gW = svgW - pL - pR;
          const gH = svgH - pT - pB;

          const timeToX = (t: number) => pL + (t / totalT) * gW;
          const playX = timeToX(simTime);
          const collX = tColl !== null ? timeToX(tColl) : null;

          const handleSvgScrub = (e: React.MouseEvent<SVGSVGElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * svgW;
            const ratio = Math.max(0, Math.min(1, (relX - pL) / gW));
            setIsPlaying(false);
            setSimTime(ratio * totalT);
          };

          // Momentum bounds
          const pVals = [
            physics.p1Before,
            physics.p2Before,
            physics.totalMomentum,
            physics.p1After,
            physics.p2After,
            0,
          ];
          const rawPMin = Math.min(...pVals);
          const rawPMax = Math.max(...pVals);
          const pPad = Math.max(2, (rawPMax - rawPMin) * 0.18);
          const pMin = rawPMin - pPad;
          const pMax = rawPMax + pPad;
          const pToY = (val: number) =>
            pT + ((pMax - val) / Math.max(1, pMax - pMin)) * gH;

          const buildStepPath = (
            beforeVal: number,
            afterVal: number,
            toY: (v: number) => number
          ) => {
            const yB = toY(beforeVal);
            if (tColl === null) {
              return `M ${pL} ${yB} L ${svgW - pR} ${yB}`;
            }
            const yA = toY(afterVal);
            const cx = timeToX(tColl);
            return `M ${pL} ${yB} L ${cx} ${yB} L ${cx} ${yA} L ${svgW - pR} ${yA}`;
          };

          // Energy bounds
          const eMaxRaw = Math.max(
            physics.ekBefore,
            physics.ekAfter,
            physics.ek1Before,
            physics.ek2Before,
            physics.ek1After,
            physics.ek2After,
            10
          );
          const eMax = eMaxRaw * 1.15;
          const eToY = (val: number) => pT + ((eMax - val) / eMax) * gH;

          return (
            <div
              className={`grid grid-cols-1 ${
                chartMode === 'both' ? 'lg:grid-cols-2' : ''
              } gap-4`}
            >
              {(chartMode === 'both' || chartMode === 'momentum') && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-900">
                      Momentum Linear (kg·m/s)
                    </span>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tabular-nums">
                      <span className="text-blue-700">
                        p_A: {curP1 >= 0 ? '+' : ''}
                        {curP1.toFixed(1)}
                      </span>
                      <span className="text-emerald-700">
                        p_B: {curP2 >= 0 ? '+' : ''}
                        {curP2.toFixed(1)}
                      </span>
                      <span className="font-semibold text-slate-900">
                        Σp: {curPTotal >= 0 ? '+' : ''}
                        {curPTotal.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <svg
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    onClick={handleSvgScrub}
                    className="w-full h-auto cursor-pointer select-none"
                    role="img"
                    aria-label="Grafik momentum benda A, B, dan momentum total terhadap waktu"
                  >
                    {/* Zero axis */}
                    <line
                      x1={pL}
                      x2={svgW - pR}
                      y1={pToY(0)}
                      y2={pToY(0)}
                      stroke="#cbd5e1"
                      strokeWidth={1}
                    />
                    <text
                      x={pL - 6}
                      y={pToY(0) + 3}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      0
                    </text>
                    <text
                      x={pL - 6}
                      y={pT + 6}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      {pMax.toFixed(0)}
                    </text>
                    <text
                      x={pL - 6}
                      y={pT + gH}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      {pMin.toFixed(0)}
                    </text>

                    {collX !== null && (
                      <line
                        x1={collX}
                        x2={collX}
                        y1={pT}
                        y2={pT + gH}
                        stroke="#f59e0b"
                        strokeWidth={1.25}
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* p1, p2, p_total curves */}
                    <path
                      d={buildStepPath(physics.p1Before, physics.p1After, pToY)}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                    <path
                      d={buildStepPath(physics.p2Before, physics.p2After, pToY)}
                      fill="none"
                      stroke="#059669"
                      strokeWidth={2}
                    />
                    <path
                      d={buildStepPath(physics.totalMomentum, physics.totalMomentum, pToY)}
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth={2}
                      strokeDasharray="5 3"
                    />

                    {/* Playhead */}
                    <line
                      x1={playX}
                      x2={playX}
                      y1={pT}
                      y2={pT + gH}
                      stroke="#2563eb"
                      strokeWidth={1.5}
                      strokeOpacity={0.75}
                    />
                    <circle cx={playX} cy={pToY(curP1)} r={3.5} fill="#2563eb" />
                    <circle cx={playX} cy={pToY(curP2)} r={3.5} fill="#059669" />
                    <circle cx={playX} cy={pToY(curPTotal)} r={3.5} fill="#0f172a" />

                    <text
                      x={pL}
                      y={svgH - 6}
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      0s
                    </text>
                    {collX !== null && (
                      <text
                        x={collX}
                        y={svgH - 6}
                        textAnchor="middle"
                        className="fill-amber-700 text-[9px] font-mono font-semibold"
                      >
                        t_kontak
                      </text>
                    )}
                    <text
                      x={svgW - pR}
                      y={svgH - 6}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      {totalT.toFixed(1)}s
                    </text>
                  </svg>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-blue-600 inline-block" />
                      Benda A (p₁)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-emerald-600 inline-block" />
                      Benda B (p₂)
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                      <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-900 inline-block" />
                      Momentum Total (Kekal)
                    </span>
                  </div>
                </div>
              )}

              {(chartMode === 'both' || chartMode === 'energy') && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-900">
                      Energi Kinetik (Joule)
                    </span>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tabular-nums">
                      <span className="text-blue-700">Ek_A: {curEk1.toFixed(1)}</span>
                      <span className="text-emerald-700">Ek_B: {curEk2.toFixed(1)}</span>
                      <span className="font-semibold text-amber-700">
                        ΣEk: {curEkTotal.toFixed(1)} J
                      </span>
                    </div>
                  </div>

                  <svg
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    onClick={handleSvgScrub}
                    className="w-full h-auto cursor-pointer select-none"
                    role="img"
                    aria-label="Grafik energi kinetik benda A, B, dan energi total terhadap waktu"
                  >
                    <line
                      x1={pL}
                      x2={svgW - pR}
                      y1={eToY(0)}
                      y2={eToY(0)}
                      stroke="#cbd5e1"
                      strokeWidth={1}
                    />
                    <text
                      x={pL - 6}
                      y={eToY(0) + 3}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      0
                    </text>
                    <text
                      x={pL - 6}
                      y={pT + 6}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      {eMax.toFixed(0)}J
                    </text>

                    {collX !== null && (
                      <line
                        x1={collX}
                        x2={collX}
                        y1={pT}
                        y2={pT + gH}
                        stroke="#f59e0b"
                        strokeWidth={1.25}
                        strokeDasharray="3 3"
                      />
                    )}

                    <path
                      d={buildStepPath(physics.ek1Before, physics.ek1After, eToY)}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                    <path
                      d={buildStepPath(physics.ek2Before, physics.ek2After, eToY)}
                      fill="none"
                      stroke="#059669"
                      strokeWidth={2}
                    />
                    <path
                      d={buildStepPath(physics.ekBefore, physics.ekAfter, eToY)}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth={2.25}
                      strokeDasharray={params.e === 1 ? '5 3' : undefined}
                    />

                    {/* Playhead */}
                    <line
                      x1={playX}
                      x2={playX}
                      y1={pT}
                      y2={pT + gH}
                      stroke="#2563eb"
                      strokeWidth={1.5}
                      strokeOpacity={0.75}
                    />
                    <circle cx={playX} cy={eToY(curEk1)} r={3.5} fill="#2563eb" />
                    <circle cx={playX} cy={eToY(curEk2)} r={3.5} fill="#059669" />
                    <circle cx={playX} cy={eToY(curEkTotal)} r={3.5} fill="#d97706" />

                    <text
                      x={pL}
                      y={svgH - 6}
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      0s
                    </text>
                    {collX !== null && (
                      <text
                        x={collX}
                        y={svgH - 6}
                        textAnchor="middle"
                        className="fill-amber-700 text-[9px] font-mono font-semibold"
                      >
                        t_kontak
                      </text>
                    )}
                    <text
                      x={svgW - pR}
                      y={svgH - 6}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      {totalT.toFixed(1)}s
                    </text>
                  </svg>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-blue-600 inline-block" />
                      Ek A
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-emerald-600 inline-block" />
                      Ek B
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-amber-800">
                      <span className="w-3 h-0.5 bg-amber-600 inline-block" />
                      Total ΣEk ({params.e === 1 ? 'Kekal' : `Turun ${physics.ekLossPct.toFixed(0)}%`})
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
