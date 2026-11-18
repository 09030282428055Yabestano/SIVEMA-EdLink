import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Camera,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  PlayCircle,
  Sparkles,
  Video,
} from 'lucide-react';
import { CHAPTERS, MEDIA_PHOTOS, TASK_BUNDLES } from '@/src/data/collisionCurriculum';
import { CollisionSimulator } from '@/src/components/CollisionSimulator';
import type { ChapterStageProgress, TaskAttempt } from '@/src/types/academic';

interface LearningSpaceProps {
  selectedChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  stageProgress: Record<string, ChapterStageProgress>;
  onMarkStageComplete: (
    chapterId: string,
    stage: keyof ChapterStageProgress
  ) => void;
  onOpenTask: (taskId: string) => void;
  onOpenMediaTab: () => void;
  attempts: TaskAttempt[];
}

export const LearningSpace: React.FC<LearningSpaceProps> = ({
  selectedChapterId,
  onSelectChapter,
  stageProgress,
  onMarkStageComplete,
  onOpenTask,
  onOpenMediaTab,
  attempts,
}) => {
  const [materialTab, setMaterialTab] = useState<'konsep' | 'simulasi' | 'contoh'>('konsep');
  const workspaceRef = useRef<HTMLElement | null>(null);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const activeChapter =
    CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0];
  const progress = stageProgress[activeChapter.id] || {
    mediaCompleted: false,
    pretestCompleted: false,
    moduleCompleted: false,
    tugasCompleted: false,
    posttestCompleted: false,
  };

  const relatedPhoto =
    MEDIA_PHOTOS.find((p) => p.id === activeChapter.relatedPhotoId) || MEDIA_PHOTOS[0];

  // Match chapter-relevant tasks
  const chapterPostOrTugas =
    TASK_BUNDLES.find(
      (t) => t.chapterId === activeChapter.id && t.kind === 'posttest'
    ) ||
    TASK_BUNDLES.find(
      (t) => t.chapterId === activeChapter.id && t.kind === 'tugas'
    ) ||
    TASK_BUNDLES[0];

  const chapterPretest =
    TASK_BUNDLES.find(
      (t) => t.chapterId === activeChapter.id && t.kind === 'pretest'
    ) || TASK_BUNDLES.find((t) => t.kind === 'pretest')!;

  const chapterMainTugas =
    TASK_BUNDLES.find(
      (t) => t.chapterId === activeChapter.id && t.kind === 'tugas'
    ) || TASK_BUNDLES[0];

  const chapterChallenge =
    TASK_BUNDLES.find(
      (t) => t.chapterId === activeChapter.id && t.kind === 'tantangan'
    ) || TASK_BUNDLES.find((t) => t.kind === 'tantangan')!;

  const targetAttempts = attempts.filter(
    (a) => a.taskId === chapterPostOrTugas.id
  );
  const highestTargetScore =
    targetAttempts.length > 0
      ? Math.max(...targetAttempts.map((a) => a.score))
      : null;

  const tugasAttempts = attempts.filter(
    (a) => a.taskId === chapterMainTugas.id
  );
  const highestTugasScore =
    tugasAttempts.length > 0
      ? Math.max(...tugasAttempts.map((a) => a.score))
      : null;

  const stages: {
    key: keyof ChapterStageProgress;
    number: number;
    label: string;
    completed: boolean;
    onClick: () => void;
  }[] = [
    {
      key: 'mediaCompleted',
      number: 1,
      label: 'Video & Simulasi',
      completed: progress.mediaCompleted,
      onClick: () => {
        setMaterialTab('simulasi');
        onMarkStageComplete(activeChapter.id, 'mediaCompleted');
        scrollToWorkspace();
      },
    },
    {
      key: 'pretestCompleted',
      number: 2,
      label: 'Pre-test',
      completed: progress.pretestCompleted,
      onClick: () => onOpenTask(chapterPretest.id),
    },
    {
      key: 'moduleCompleted',
      number: 3,
      label: 'Pelajari Modul',
      completed: progress.moduleCompleted,
      onClick: () => {
        setMaterialTab('konsep');
        onMarkStageComplete(activeChapter.id, 'moduleCompleted');
        scrollToWorkspace();
      },
    },
    {
      key: 'tugasCompleted',
      number: 4,
      label: 'Kerjakan Tugas',
      completed: progress.tugasCompleted,
      onClick: () => onOpenTask(chapterMainTugas.id),
    },
    {
      key: 'posttestCompleted',
      number: 5,
      label: 'Post-test',
      completed: progress.posttestCompleted,
      onClick: () => onOpenTask(chapterPostOrTugas.id),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title matching addel.id clarity */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ruang Belajar</h1>
        <p className="text-sm text-slate-600 mt-1">
          Pelajari materi tumbukan secara bertahap atau buka langsung simulasi, modul konsep, dan tugas dengan navigasi bebas.
        </p>
      </div>

      {/* 1 · PILIH BAB Card (Inspired by addel.id layout) */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-blue-600 tracking-wide">
            1 · Pilih Bab Materi Tumbukan
          </div>
          <div className="text-xs text-slate-500">
            5 Bab Terstruktur · Fisika Mekanika
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CHAPTERS.map((chap) => {
            const isSelected = chap.id === activeChapter.id;
            const prog = stageProgress[chap.id];
            const completedSteps = prog
              ? Object.values(prog).filter(Boolean).length
              : 0;

            return (
              <button
                key={chap.id}
                type="button"
                onClick={() => onSelectChapter(chap.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm font-bold ${
                      isSelected ? 'text-blue-950' : 'text-slate-900'
                    }`}
                  >
                    Bab {chap.babNumber}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {completedSteps}/5 tahap
                  </span>
                </div>
                <div
                  className={`text-xs mt-1 font-medium ${
                    isSelected ? 'text-blue-800' : 'text-slate-600'
                  }`}
                >
                  {chap.title}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tahap 1–5 Interactive Stage Row (like addel.id green stage cards) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stages.map((st) => (
          <button
            key={st.key}
            type="button"
            onClick={st.onClick}
            className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
              st.completed
                ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-50'
                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
            }`}
          >
            <div className="text-[11px] font-medium text-slate-500">
              Tahap {st.number}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              {st.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span
                className={`text-xs font-semibold truncate ${
                  st.completed ? 'text-emerald-800' : 'text-slate-800'
                }`}
              >
                {st.label}
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* Active Chapter Interactive Material Workspace */}
      <section
        ref={workspaceRef}
        className="bg-white border border-slate-200 rounded-xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">
              Bab {activeChapter.babNumber} · Estimasi {activeChapter.durationMinutes} menit
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {activeChapter.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {activeChapter.subtitle}
            </p>
          </div>

          {/* Segmented control tabs for active chapter material */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start md:self-auto">
            <button
              type="button"
              onClick={() => setMaterialTab('konsep')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                materialTab === 'konsep'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Materi & Rumus
            </button>
            <button
              type="button"
              onClick={() => {
                setMaterialTab('simulasi');
                onMarkStageComplete(activeChapter.id, 'mediaCompleted');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                materialTab === 'simulasi'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Video Animasi
            </button>
            <button
              type="button"
              onClick={() => setMaterialTab('contoh')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                materialTab === 'contoh'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Contoh Soal
            </button>
          </div>
        </div>

        <div className="p-5">
          {materialTab === 'konsep' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Ringkasan Konsep Inti
                  </h3>
                  <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
                    {activeChapter.summary}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-700">
                    Poin Penting yang Wajib Dipahami
                  </h4>
                  <ul className="space-y-2">
                    {activeChapter.keyConcepts.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Formulas */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-700">
                    Persamaan Matematis Utama
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeChapter.formulas.map((f, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5"
                      >
                        <div className="text-xs font-semibold text-slate-800">
                          {f.label}
                        </div>
                        <div className="text-sm font-mono font-semibold text-blue-700">
                          {f.equation}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-relaxed">
                          {f.variables}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      onMarkStageComplete(activeChapter.id, 'moduleCompleted')
                    }
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      progress.moduleCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {progress.moduleCompleted
                      ? 'Modul Telah Ditandai Selesai'
                      : 'Tandai Modul Selesai Dipelajari'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialTab('simulasi')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    <PlayCircle className="w-4 h-4 text-blue-600" />
                    Lihat Video Animasi Bab Ini
                  </button>
                </div>
              </div>

              {/* Right Column: Lab Photo Card + Real-world context */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                    <img
                      src={relatedPhoto.imageSrc}
                      alt={relatedPhoto.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{relatedPhoto.category}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900">
                      {relatedPhoto.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {relatedPhoto.caption}
                    </p>
                    <button
                      type="button"
                      onClick={onOpenMediaTab}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-1"
                    >
                      Buka Semua Foto & Media Lab
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-800">
                    Aplikasi Nyata
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {activeChapter.realWorldContext}
                  </p>
                </div>
              </div>
            </div>
          )}

          {materialTab === 'simulasi' && (
            <CollisionSimulator
              initialPreset={activeChapter.simulationPresetId}
              chapterKey={activeChapter.id}
              onCompleteMedia={() =>
                onMarkStageComplete(activeChapter.id, 'mediaCompleted')
              }
            />
          )}

          {materialTab === 'contoh' && (
            <div className="max-w-3xl space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div>
                  <div className="text-xs text-blue-700 font-semibold">
                    Contoh Penyelesaian Langkah Demi Langkah
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {activeChapter.workedExample.title}
                  </h3>
                  <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                    {activeChapter.workedExample.problem}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                    <div className="font-semibold text-slate-800 mb-1.5">
                      Diketahui
                    </div>
                    <ul className="space-y-1 font-mono text-slate-700">
                      {activeChapter.workedExample.given.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5">
                    <div className="font-semibold text-emerald-900 mb-1.5">
                      Hasil Akhir
                    </div>
                    <div className="font-mono font-semibold text-emerald-800 text-sm">
                      {activeChapter.workedExample.answer}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-800">
                    Langkah Perhitungan
                  </div>
                  <ol className="space-y-1.5 text-xs text-slate-700 list-decimal list-inside">
                    {activeChapter.workedExample.steps.map((s, i) => (
                      <li key={i} className="leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Action Card: Akses Tugas, Post-test & Tantangan HOTS */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-semibold text-slate-900">
              Akses Tugas & Evaluasi — Bab {activeChapter.babNumber}: {activeChapter.title}
            </h3>
          </div>
          <div className="text-xs text-slate-600 tabular-nums flex flex-wrap items-center gap-2">
            <span>
              Tugas:{' '}
              <strong className="text-slate-900">
                {highestTugasScore !== null
                  ? `Nilai tertinggi ${highestTugasScore}% (${tugasAttempts.length}×)`
                  : 'Belum dikerjakan'}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Post-test:{' '}
              <strong className="text-blue-700">
                {highestTargetScore !== null
                  ? `Nilai tertinggi ${highestTargetScore}% (${targetAttempts.length}×)`
                  : `Belum dikerjakan (${chapterPostOrTugas.questions.length} Soal)`}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenTask(chapterMainTugas.id)}
            className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {tugasAttempts.length > 0 ? 'Ulangi Tugas' : 'Kerjakan Tugas'}
          </button>
          <button
            type="button"
            onClick={() => onOpenTask(chapterChallenge.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Latihan Tantangan
          </button>
          <button
            type="button"
            onClick={() => onOpenTask(chapterPostOrTugas.id)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {targetAttempts.length > 0 ? 'Kerjakan Ulang Post-test' : 'Mulai Post-test'}
          </button>
        </div>
      </section>
    </div>
  );
};
