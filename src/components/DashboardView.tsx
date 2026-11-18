import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  ClipboardList,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { CHAPTERS, STUDENT_PROFILE, TASK_BUNDLES } from '@/src/data/collisionCurriculum';
import type { ChapterStageProgress, NavTab, TaskAttempt } from '@/src/types/academic';

interface DashboardViewProps {
  studentName: string;
  studentSemester: string;
  attempts: TaskAttempt[];
  stageProgress: Record<string, ChapterStageProgress>;
  onNavigateTab: (tab: NavTab) => void;
  onSelectChapterAndOpen: (chapterId: string) => void;
  onOpenTask: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  studentName,
  studentSemester,
  attempts,
  stageProgress,
  onNavigateTab,
  onSelectChapterAndOpen,
  onOpenTask,
}) => {
  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
      : null;

  const totalStagesCompleted = Object.values(stageProgress).reduce(
    (sum, p) => sum + Object.values(p).filter(Boolean).length,
    0
  );
  const totalStagesPossible = CHAPTERS.length * 5;
  const overallProgressPct = Math.round(
    (totalStagesCompleted / totalStagesPossible) * 100
  );

  const latestAttempt =
    attempts.length > 0
      ? [...attempts].sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        )[0]
      : null;

  // Smart next task: first uncompleted chapter's pretest/tugas, fallback to comprehensive task
  const completedTaskIds = new Set(attempts.map((a) => a.taskId));
  const nextRecommendedTask =
    TASK_BUNDLES.find((t) => !completedTaskIds.has(t.id)) || TASK_BUNDLES[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-medium text-blue-700">
            {STUDENT_PROFILE.course} · {studentSemester}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {attempts.length === 0 && totalStagesCompleted === 0
              ? `Selamat datang, ${studentName}`
              : `Selamat datang kembali, ${studentName}`}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Lanjutkan eksplorasi materi Tumbukan, amati grafik momentum dan energi di simulasi animasi, atau kerjakan tugas dan Latihan Tantangan dengan navigasi soal bebas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('ruang-belajar')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Buka Ruang Belajar
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onOpenTask(nextRecommendedTask.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {attempts.length === 0 ? 'Mulai Pre-test Bab 1' : 'Lanjutkan Tugas Berikutnya'}
          </button>
        </div>
      </section>

      {/* 4-column Academic KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Progres Materi</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-display font-bold text-slate-900 tabular-nums">
            {overallProgressPct}%
          </div>
          <div className="text-[11px] text-slate-500 tabular-nums">
            {totalStagesCompleted} dari {totalStagesPossible} tahap selesai
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata Nilai</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-display font-bold text-slate-900 tabular-nums">
            {avgScore !== null ? (
              <>
                {avgScore}
                <span className="text-xs font-normal text-slate-400"> / 100</span>
              </>
            ) : (
              '—'
            )}
          </div>
          <div className="text-[11px] text-slate-500">
            {avgScore !== null ? 'Target KKM 75' : 'Belum ada nilai tercatat'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tugas & Ujian</span>
            <ClipboardList className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-display font-bold text-slate-900 tabular-nums">
            {attempts.length}
          </div>
          <div className="text-[11px] text-slate-500">Riwayat terekam</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Dosen Pengampu</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm font-semibold text-slate-900 pt-1 truncate">
            {STUDENT_PROFILE.lecturer}
          </div>
          <div className="text-[11px] text-slate-500">Umpan balik aktif</div>
        </div>
      </section>

      {/* Two-Column: Chapter Roadmap + Latest Lecturer Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Peta Bab Materi Tumbukan
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('ruang-belajar')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {CHAPTERS.map((chap) => {
              const prog = stageProgress[chap.id];
              const done = prog
                ? Object.values(prog).filter(Boolean).length
                : 0;
              const pct = Math.round((done / 5) * 100);
              return (
                <div
                  key={chap.id}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900">
                      Bab {chap.babNumber}: {chap.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {chap.subtitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-600 tabular-nums w-9 text-right">
                      {pct}%
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectChapterAndOpen(chap.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Buka
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Umpan Balik Terkini
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('hasil-belajar')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Grafik & Riwayat
            </button>
          </div>

          {latestAttempt ? (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900 truncate">
                    {latestAttempt.taskTitle}
                  </span>
                  <span className="font-mono font-bold text-blue-700 tabular-nums shrink-0">
                    {latestAttempt.score}/100
                  </span>
                </div>
                <p className="text-slate-600 mt-2 leading-relaxed">
                  {latestAttempt.lecturerFeedback}
                </p>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3">
                <span className="font-semibold text-emerald-900">Kekuatan: </span>
                <span className="text-emerald-800">{latestAttempt.strengthNote}</span>
              </div>
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3">
                <span className="font-semibold text-amber-900">Saran: </span>
                <span className="text-amber-800">{latestAttempt.improvementNote}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda memulai dari awal (0%). Kerjakan Pre-test Bab 1 atau simulasi di Ruang Belajar untuk melihat grafik nilai serta umpan balik dari dosen pengampu.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenTask('pretest-bab-1')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Mulai Pre-test Bab 1
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTask('tantangan-bab-1')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Coba Latihan Tantangan
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
