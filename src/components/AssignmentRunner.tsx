import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Flag,
  HelpCircle,
  Printer,
  RotateCcw,
  Send,
  SkipForward,
  XCircle,
} from 'lucide-react';
import { CHAPTERS, STUDENT_PROFILE, TASK_BUNDLES } from '@/src/data/collisionCurriculum';
import { downloadAttemptReportHtml } from '@/src/utils/reportExport';
import type {
  DraftTaskState,
  Question,
  QuestionAttemptDetail,
  TaskAttempt,
  TaskBundle,
  UserAccount,
} from '@/src/types/academic';

interface AssignmentRunnerProps {
  activeTaskId: string | null;
  onSelectTask: (taskId: string | null) => void;
  drafts: Record<string, DraftTaskState>;
  onUpdateDraft: (taskId: string, draft: DraftTaskState) => void;
  onSubmitAttempt: (attempt: TaskAttempt) => void;
  attempts: TaskAttempt[];
  onNavigateToResults: (attemptId: string) => void;
  studentInfo: Pick<UserAccount, 'name' | 'nim' | 'program' | 'semester'>;
}

export const AssignmentRunner: React.FC<AssignmentRunnerProps> = ({
  activeTaskId,
  onSelectTask,
  drafts,
  onUpdateDraft,
  onSubmitAttempt,
  attempts,
  onNavigateToResults,
  studentInfo,
}) => {
  const [filterKind, setFilterKind] = useState<'all' | 'tugas' | 'pretest' | 'posttest' | 'tantangan'>('all');
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [justSubmittedAttempt, setJustSubmittedAttempt] = useState<TaskAttempt | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const activeTask: TaskBundle | undefined = useMemo(
    () => TASK_BUNDLES.find((t) => t.id === activeTaskId),
    [activeTaskId]
  );

  const currentDraft: DraftTaskState | null = useMemo(() => {
    if (!activeTask) return null;
    return (
      drafts[activeTask.id] || {
        taskId: activeTask.id,
        currentQuestionIndex: 0,
        answers: {},
        flaggedIds: [],
        startedAtMs: Date.now(),
      }
    );
  }, [activeTask, drafts]);

  // Reset transient result/review modals when switching to another task
  useEffect(() => {
    setShowReviewModal(false);
    setJustSubmittedAttempt((prev) =>
      prev && prev.taskId === activeTaskId ? prev : null
    );
  }, [activeTaskId]);

  // Close review modal on Escape key
  useEffect(() => {
    if (!showReviewModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowReviewModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showReviewModal]);

  // Ensure active task always has a persisted draft with stable startedAtMs
  useEffect(() => {
    if (activeTask && !drafts[activeTask.id] && !justSubmittedAttempt) {
      onUpdateDraft(activeTask.id, {
        taskId: activeTask.id,
        currentQuestionIndex: 0,
        answers: {},
        flaggedIds: [],
        startedAtMs: Date.now(),
      });
    }
  }, [activeTask, drafts, justSubmittedAttempt, onUpdateDraft]);

  // Live timer while working on a task (only re-subscribe when task or start timestamp changes)
  const draftStartMs = currentDraft?.startedAtMs;
  const isPostSubmit = Boolean(justSubmittedAttempt);
  useEffect(() => {
    if (!activeTaskId || !draftStartMs || isPostSubmit) return;
    const update = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - draftStartMs) / 1000)));
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [activeTaskId, draftStartMs, isPostSubmit]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startOrResumeTask = (taskId: string) => {
    setJustSubmittedAttempt(null);
    setShowReviewModal(false);
    if (!drafts[taskId]) {
      onUpdateDraft(taskId, {
        taskId,
        currentQuestionIndex: 0,
        answers: {},
        flaggedIds: [],
        startedAtMs: Date.now(),
      });
    }
    onSelectTask(taskId);
  };

  const isQuestionAnswered = (q: Question, answers: Record<string, number | string>) => {
    const val = answers[q.id];
    if (q.format === 'multiple-choice') {
      return typeof val === 'number';
    }
    return typeof val === 'string' && val.trim().length > 0;
  };

  const jumpToQuestion = (index: number) => {
    if (!activeTask || !currentDraft) return;
    const bounded = Math.max(0, Math.min(activeTask.questions.length - 1, index));
    onUpdateDraft(activeTask.id, {
      ...currentDraft,
      currentQuestionIndex: bounded,
    });
  };

  const setQuestionAnswer = (questionId: string, value: number | string) => {
    if (!activeTask || !currentDraft) return;
    onUpdateDraft(activeTask.id, {
      ...currentDraft,
      answers: {
        ...currentDraft.answers,
        [questionId]: value,
      },
    });
  };

  const clearQuestionAnswer = (questionId: string) => {
    if (!activeTask || !currentDraft) return;
    const nextAnswers = { ...currentDraft.answers };
    delete nextAnswers[questionId];
    onUpdateDraft(activeTask.id, {
      ...currentDraft,
      answers: nextAnswers,
    });
  };

  const toggleFlag = (questionId: string) => {
    if (!activeTask || !currentDraft) return;
    const exists = currentDraft.flaggedIds.includes(questionId);
    const flaggedIds = exists
      ? currentDraft.flaggedIds.filter((id) => id !== questionId)
      : [...currentDraft.flaggedIds, questionId];
    onUpdateDraft(activeTask.id, {
      ...currentDraft,
      flaggedIds,
    });
  };

  const handleFinalizeSubmit = () => {
    if (!activeTask || !currentDraft) return;

    let earnedTotal = 0;
    let maxTotal = 0;
    let correctCount = 0;
    const weakTags: string[] = [];
    const strongTags: string[] = [];

    const details: QuestionAttemptDetail[] = activeTask.questions.map((q) => {
      maxTotal += q.points;
      const ans = currentDraft.answers[q.id];
      let isCorrect = false;

      if (q.format === 'multiple-choice') {
        isCorrect = typeof ans === 'number' && ans === q.correctOptionIndex;
        if (isCorrect) {
          earnedTotal += q.points;
          correctCount += 1;
          strongTags.push(q.conceptTag);
        } else {
          weakTags.push(q.conceptTag);
        }
        return {
          questionId: q.id,
          selectedOptionIndex: typeof ans === 'number' ? ans : undefined,
          isCorrect,
          earnedPoints: isCorrect ? q.points : 0,
          maxPoints: q.points,
        };
      } else {
        const raw = typeof ans === 'string' ? ans.replace(',', '.').trim() : '';
        const parsed = Number(raw);
        const tol = q.numericTolerance ?? 0.05;
        isCorrect =
          raw.length > 0 &&
          Number.isFinite(parsed) &&
          q.correctNumericValue !== undefined &&
          Math.abs(parsed - q.correctNumericValue) <= tol;

        if (isCorrect) {
          earnedTotal += q.points;
          correctCount += 1;
          strongTags.push(q.conceptTag);
        } else {
          weakTags.push(q.conceptTag);
        }
        return {
          questionId: q.id,
          numericInput: typeof ans === 'string' ? ans : undefined,
          isCorrect,
          earnedPoints: isCorrect ? q.points : 0,
          maxPoints: q.points,
        };
      }
    });

    const score = maxTotal > 0 ? Math.round((earnedTotal / maxTotal) * 100) : 0;
    const durationSeconds = Math.max(
      10,
      Math.floor((Date.now() - currentDraft.startedAtMs) / 1000)
    );

    const strengthNote =
      strongTags.length > 0
        ? `Menguasai konsep: ${Array.from(new Set(strongTags)).slice(0, 2).join(', ')}.`
        : 'Sudah mencoba seluruh rangkaian soal evaluasi.';

    const improvementNote =
      weakTags.length > 0
        ? `Perlu pendalaman ulang pada: ${Array.from(new Set(weakTags)).slice(0, 2).join(', ')}.`
        : 'Semua indikator kompetensi pada evaluasi ini tercapai sangat baik.';

    let lecturerFeedback = '';
    if (score >= 85) {
      lecturerFeedback =
        'Hasil sangat memuaskan! Pemahaman vektor momentum, koefisien restitusi, dan analisis energi kinetik sudah konsisten.';
    } else if (score >= activeTask.passingScore) {
      lecturerFeedback =
        'Sudah melampaui batas kelulusan. Tinjau kembali pembahasan pada butir soal yang masih keliru untuk menyempurnakan ketelitian perhitungan.';
    } else {
      lecturerFeedback =
        'Nilai belum mencapai batas kelulusan. Disarankan memutar ulang Simulasi Tumbukan di Ruang Belajar sambil memeriksa tanda positif-negatif kecepatan sebelum mengerjakan ulang.';
    }

    const attempt: TaskAttempt = {
      id: `att-${Date.now()}`,
      taskId: activeTask.id,
      chapterId: activeTask.chapterId,
      kind: activeTask.kind,
      taskTitle: activeTask.title,
      submittedAt: new Date().toISOString(),
      score,
      correctCount,
      totalQuestions: activeTask.questions.length,
      durationSeconds,
      details,
      lecturerFeedback,
      strengthNote,
      improvementNote,
    };

    onSubmitAttempt(attempt);
    setShowReviewModal(false);
    setJustSubmittedAttempt(attempt);
  };

  // 1. Immediate Post-Submit Result & Feedback Screen
  if (activeTask && justSubmittedAttempt) {
    const passed = justSubmittedAttempt.score >= activeTask.passingScore;
    return (
      <div className="space-y-6">
        {/* Print-only Official Header */}
        <div className="hidden print-only border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-blue-700">SIVEMA EdLink</div>
              <div className="text-xs text-slate-600">{STUDENT_PROFILE.course}</div>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div>Mahasiswa: <strong>{studentInfo.name}</strong> ({studentInfo.nim})</div>
              <div>Dosen Pengampu: {STUDENT_PROFILE.lecturer}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            type="button"
            onClick={() => {
              setJustSubmittedAttempt(null);
              onSelectTask(null);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Tugas
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / PDF
            </button>
            <button
              type="button"
              onClick={() => downloadAttemptReportHtml(justSubmittedAttempt, studentInfo)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Laporan
            </button>
            <button
              type="button"
              onClick={() => onNavigateToResults(justSubmittedAttempt.id)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Lihat di Grafik Nilai & Riwayat
            </button>
          </div>
        </div>

        {/* Score Summary Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 print-clean">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs text-slate-500">
                Hasil Evaluasi · {justSubmittedAttempt.taskTitle}
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-display font-bold text-slate-900 tabular-nums">
                  {justSubmittedAttempt.score}
                </span>
                <span className="text-sm text-slate-500 tabular-nums">/ 100</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    passed ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {passed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {passed ? 'Lulus Batas Minimal' : 'Perlu Pengulangan'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 tabular-nums">
                <span>
                  Benar {justSubmittedAttempt.correctCount} dari {justSubmittedAttempt.totalQuestions} soal
                </span>
                <span aria-hidden="true">·</span>
                <span>Durasi {formatDuration(justSubmittedAttempt.durationSeconds)}</span>
                <span aria-hidden="true">·</span>
                <span>KKM {activeTask.passingScore}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 no-print">
              <button
                type="button"
                onClick={() => {
                  onUpdateDraft(activeTask.id, {
                    taskId: activeTask.id,
                    currentQuestionIndex: 0,
                    answers: {},
                    flaggedIds: [],
                    startedAtMs: Date.now(),
                  });
                  setElapsedSeconds(0);
                  setJustSubmittedAttempt(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Kerjakan Ulang
              </button>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
              <div className="font-semibold text-slate-800 mb-1">Umpan Balik Akademik</div>
              <p className="text-slate-600 leading-relaxed">
                {justSubmittedAttempt.lecturerFeedback}
              </p>
            </div>
            <div className="bg-emerald-50/60 rounded-lg p-3.5 border border-emerald-200">
              <div className="font-semibold text-emerald-900 mb-1">Kekuatan Teridentifikasi</div>
              <p className="text-emerald-800 leading-relaxed">
                {justSubmittedAttempt.strengthNote}
              </p>
            </div>
            <div className="bg-amber-50/60 rounded-lg p-3.5 border border-amber-200">
              <div className="font-semibold text-amber-900 mb-1">Saran Perbaikan</div>
              <p className="text-amber-800 leading-relaxed">
                {justSubmittedAttempt.improvementNote}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Per-Question Pembahasan */}
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
          <div className="px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">
              Pembahasan & Umpan Balik Per Soal
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Periksa perbandingan jawaban Anda dengan kunci penyelesaian langkah demi langkah
            </p>
          </div>
          {activeTask.questions.map((q, idx) => {
            const detail = justSubmittedAttempt.details.find((d) => d.questionId === q.id);
            const isCorrect = detail?.isCorrect ?? false;
            const userAnswerText =
              q.format === 'multiple-choice'
                ? detail?.selectedOptionIndex !== undefined && q.options
                  ? q.options[detail.selectedOptionIndex]
                  : 'Tidak dijawab (dilewati)'
                : detail?.numericInput
                ? `${detail.numericInput} ${q.unit || ''}`.trim()
                : 'Tidak dijawab (dilewati)';

            const correctAnswerText =
              q.format === 'multiple-choice' && q.options && q.correctOptionIndex !== undefined
                ? q.options[q.correctOptionIndex]
                : `${q.correctNumericValue} ${q.unit || ''}`.trim();

            return (
              <div key={q.id} className="p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-500">
                    Soal {idx + 1} · {q.conceptTag} · Bobot {q.points} poin
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      isCorrect ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {isCorrect
                      ? `Benar (+${detail?.earnedPoints} poin)`
                      : 'Belum Tepat (0 poin)'}
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {q.prompt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-slate-500">Jawaban Anda</div>
                    <div
                      className={`font-semibold mt-0.5 ${
                        isCorrect ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {userAnswerText}
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-slate-500">Kunci Jawaban</div>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {correctAnswerText}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-blue-900">Pembahasan: </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Active Task Runner with Free Question Jumping
  if (activeTask && currentDraft) {
    const totalQ = activeTask.questions.length;
    const qIndex = Math.max(0, Math.min(totalQ - 1, currentDraft.currentQuestionIndex));
    const currentQuestion = activeTask.questions[qIndex];
    const isFlagged = currentDraft.flaggedIds.includes(currentQuestion.id);

    const answeredCount = activeTask.questions.filter((q) =>
      isQuestionAnswered(q, currentDraft.answers)
    ).length;
    const flaggedCount = currentDraft.flaggedIds.length;
    const unansweredQuestions = activeTask.questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => !isQuestionAnswered(q, currentDraft.answers));

    return (
      <div className="space-y-5">
        {/* Top contextual bar */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onSelectTask(null)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Daftar Tugas
            </button>
            <span className="text-slate-300" aria-hidden="true">
              /
            </span>
            <h2 className="text-sm font-semibold text-slate-900 truncate">
              {activeTask.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowFormulaSheet((s) => !s)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Rumus Tumbukan
              {showFormulaSheet ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatDuration(elapsedSeconds)}
            </div>
          </div>
        </div>

        {/* Optional collapsible formula sheet */}
        {showFormulaSheet && (
          <div className="bg-white border border-blue-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="font-semibold text-slate-800">Momentum & Impuls</div>
              <code className="block font-mono text-blue-700 mt-1">
                p = m·v &nbsp;|&nbsp; I = F·Δt = m(v₂ − v₁)
              </code>
            </div>
            <div>
              <div className="font-semibold text-slate-800">Kekekalan Momentum & Restitusi</div>
              <code className="block font-mono text-blue-700 mt-1">
                m₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′
              </code>
              <code className="block font-mono text-slate-600 mt-0.5">
                e = −(v₁′ − v₂′) / (v₁ − v₂)
              </code>
            </div>
            <div>
              <div className="font-semibold text-slate-800">Pantulan & Tidak Lenting</div>
              <code className="block font-mono text-blue-700 mt-1">
                e = √(h₂/h₁) &nbsp;|&nbsp; v′ = (m₁v₁+m₂v₂)/(m₁+m₂)
              </code>
            </div>
          </div>
        )}

        {/* Quick Mobile Jump Strip */}
        <div className="lg:hidden bg-white border border-slate-200 rounded-xl p-3">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            Lompat ke Nomor Soal ({answeredCount}/{totalQ} terjawab):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeTask.questions.map((q, idx) => {
              const answered = isQuestionAnswered(q, currentDraft.answers);
              const flagged = currentDraft.flaggedIds.includes(q.id);
              const isCurrent = idx === qIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => jumpToQuestion(idx)}
                  className={`w-9 h-9 rounded-lg text-xs font-mono font-semibold border transition-colors tabular-nums ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600'
                      : flagged
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : answered
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-column workspace: Question Stage + Peta Nomor Soal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Question Stage */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-slate-900">
                  Soal {qIndex + 1} dari {totalQ}
                </span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span>{currentQuestion.conceptTag}</span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span className="tabular-nums">Bobot {currentQuestion.points} poin</span>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isFlagged
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {isFlagged ? 'Ditandai Ragu-ragu' : 'Tandai Ragu-ragu'}
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-base font-medium text-slate-900 leading-relaxed">
                {currentQuestion.prompt}
              </p>
              {currentQuestion.equationHint && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-600 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Petunjuk Persamaan:{' '}
                    <code className="font-mono font-medium text-slate-900">
                      {currentQuestion.equationHint}
                    </code>
                  </span>
                </div>
              )}
            </div>

            {/* Answer input area */}
            {currentQuestion.format === 'multiple-choice' && currentQuestion.options ? (
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, optIdx) => {
                  const selected = currentDraft.answers[currentQuestion.id] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx);
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setQuestionAnswer(currentQuestion.id, optIdx)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${
                        selected
                          ? 'bg-blue-50 border-blue-500 text-slate-900'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5 ${
                          selected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Masukkan Jawaban Numerik Anda
                </label>
                {(() => {
                  const rawVal = ((currentDraft.answers[currentQuestion.id] as string) || '').trim();
                  const normalized = rawVal.replace(',', '.');
                  const isInvalidNumeric =
                    rawVal.length > 0 && !Number.isFinite(Number(normalized));
                  return (
                    <>
                      <div className="flex items-center gap-3 max-w-sm">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Contoh: 4.5 atau 4,5"
                          value={(currentDraft.answers[currentQuestion.id] as string) || ''}
                          onChange={(e) => setQuestionAnswer(currentQuestion.id, e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 outline-none text-sm font-mono text-slate-900 ${
                            isInvalidNumeric
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                          }`}
                        />
                        {currentQuestion.unit && (
                          <span className="text-xs font-mono font-medium text-slate-600 whitespace-nowrap shrink-0">
                            {currentQuestion.unit}
                          </span>
                        )}
                      </div>
                      {isInvalidNumeric ? (
                        <p className="text-xs text-red-600 font-medium">
                          Format angka belum valid — masukkan angka saja tanpa satuan (contoh: 4.5 atau -2).
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500">
                          Gunakan titik atau koma untuk bilangan desimal. Jika belum yakin, langsung klik soal berikutnya atau nomor soal lain.
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Clear + Free navigation controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={qIndex === 0}
                  onClick={() => jumpToQuestion(qIndex - 1)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Sebelumnya
                </button>
                {isQuestionAnswered(currentQuestion, currentDraft.answers) && (
                  <button
                    type="button"
                    onClick={() => clearQuestionAnswer(currentQuestion.id)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
                  >
                    Hapus Jawaban
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {qIndex < totalQ - 1 ? (
                  <button
                    type="button"
                    onClick={() => jumpToQuestion(qIndex + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    {isQuestionAnswered(currentQuestion, currentDraft.answers) ? (
                      <>
                        Berikutnya
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Lewati ke Soal {qIndex + 2}
                        <SkipForward className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Tinjau & Kumpulkan
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Peta Nomor Soal (Always-accessible free jump panel) */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Peta Nomor Soal (Navigasi Bebas)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Klik nomor mana saja untuk langsung melompat ke soal berikutnya atau kembali ke soal yang belum dijawab kapan saja.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {activeTask.questions.map((q, idx) => {
                const answered = isQuestionAnswered(q, currentDraft.answers);
                const flagged = currentDraft.flaggedIds.includes(q.id);
                const isCurrent = idx === qIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => jumpToQuestion(idx)}
                    title={`Soal ${idx + 1}: ${
                      isCurrent
                        ? 'Sedang dibuka'
                        : flagged
                        ? 'Ditandai ragu-ragu'
                        : answered
                        ? 'Sudah dijawab'
                        : 'Belum dijawab'
                    }`}
                    className={`relative h-10 rounded-lg border text-xs font-mono font-semibold transition-colors tabular-nums flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600'
                        : flagged
                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        : answered
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                    {flagged && !isCurrent && (
                      <Flag className="w-2.5 h-2.5 absolute top-1 right-1 text-amber-600" />
                    )}
                    {answered && !flagged && !isCurrent && (
                      <CheckCircle2 className="w-2.5 h-2.5 absolute top-1 right-1 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dual-coded legend (icon + text) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-blue-600 inline-block shrink-0" />
                <span>Aktif dibuka</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Terjawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Ragu-ragu ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded border border-slate-300 bg-white inline-block shrink-0" />
                <span>Belum ({totalQ - answeredCount})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Selesai & Kumpulkan Tugas
            </button>
          </aside>
        </div>

        {/* Pre-Submit Review Modal */}
        {showReviewModal && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Ringkasan Sebelum Mengumpulkan
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Anda masih dapat melompat kembali ke soal yang belum dijawab atau ditandai ragu-ragu.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="text-lg font-mono font-bold text-emerald-800 tabular-nums">
                    {answeredCount}
                  </div>
                  <div className="text-[11px] text-emerald-700">Terjawab</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="text-lg font-mono font-bold text-amber-800 tabular-nums">
                    {flaggedCount}
                  </div>
                  <div className="text-[11px] text-amber-700">Ragu-ragu</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="text-lg font-mono font-bold text-slate-800 tabular-nums">
                    {totalQ - answeredCount}
                  </div>
                  <div className="text-[11px] text-slate-600">Belum Dijawab</div>
                </div>
              </div>

              {unansweredQuestions.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-semibold text-amber-900">
                    Soal belum dijawab — klik nomor untuk kembali mengerjakan:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unansweredQuestions.map(({ q, idx }) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setShowReviewModal(false);
                          jumpToQuestion(idx);
                        }}
                        className="px-2.5 py-1 rounded-md bg-white border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
                      >
                        Kembali ke Soal {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Lanjut Mengerjakan
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeSubmit}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  Kumpulkan & Nilai Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Task Picker View
  const filteredTasks = TASK_BUNDLES.filter(
    (t) => filterKind === 'all' || t.kind === filterKind
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Tugas & Evaluasi Akademik
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Dilengkapi Peta Nomor Soal bebas lompat: lewati soal sulit dan kembali kapan saja sebelum dikumpulkan.
          </p>
        </div>

        {/* Interactive filter tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          {(
            [
              { id: 'all', label: 'Semua' },
              { id: 'tugas', label: 'Tugas' },
              { id: 'pretest', label: 'Pre-test' },
              { id: 'posttest', label: 'Post-test' },
              { id: 'tantangan', label: 'Latihan Tantangan' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterKind(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterKind === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTasks.map((task) => {
          const chapter = CHAPTERS.find((c) => c.id === task.chapterId);
          const taskAttempts = attempts.filter((a) => a.taskId === task.id);
          const bestScore =
            taskAttempts.length > 0
              ? Math.max(...taskAttempts.map((a) => a.score))
              : null;
          const hasDraft =
            drafts[task.id] && Object.keys(drafts[task.id].answers).length > 0;

          return (
            <div
              key={task.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  <span
                    className={
                      task.kind === 'tantangan' ? 'font-semibold text-amber-700' : ''
                    }
                  >
                    {task.kind === 'pretest'
                      ? 'Pre-test'
                      : task.kind === 'posttest'
                      ? 'Post-test'
                      : task.kind === 'tantangan'
                      ? 'Latihan Tantangan'
                      : 'Tugas Terstruktur'}
                  </span>
                  <span className="mx-1.5" aria-hidden="true">
                    ·
                  </span>
                  <span>
                    Bab {chapter?.babNumber}: {chapter?.title}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {task.description}
                </p>

                <div className="pt-1 text-xs text-slate-500 tabular-nums">
                  {task.questions.length} Soal · Estimasi {task.estimatedMinutes} menit · KKM{' '}
                  {task.passingScore}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  {bestScore !== null ? (
                    <span className="font-medium text-emerald-700 tabular-nums">
                      Nilai Tertinggi: {bestScore}/100 ({taskAttempts.length}× percobaan)
                    </span>
                  ) : hasDraft ? (
                    <span className="font-medium text-blue-700">
                      Draf tersimpan ({Object.keys(drafts[task.id].answers).length}/
                      {task.questions.length} dijawab)
                    </span>
                  ) : (
                    <span className="text-slate-500">Belum dikerjakan</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => startOrResumeTask(task.id)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  {hasDraft
                    ? 'Lanjutkan Tugas'
                    : bestScore !== null
                    ? 'Kerjakan Ulang'
                    : 'Mulai Kerjakan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
