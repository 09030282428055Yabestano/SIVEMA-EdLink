import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  MessageSquare,
  Printer,
  Send,
  TrendingUp,
} from 'lucide-react';
import { CHAPTERS, STUDENT_PROFILE, TASK_BUNDLES } from '@/src/data/collisionCurriculum';
import {
  downloadAttemptReportHtml,
  downloadFullAcademicReportHtml,
} from '@/src/utils/reportExport';
import type {
  ChapterStageProgress,
  StudentReflection,
  TaskAttempt,
  UserAccount,
} from '@/src/types/academic';

interface GradesAndChartsProps {
  attempts: TaskAttempt[];
  stageProgress: Record<string, ChapterStageProgress>;
  selectedAttemptId: string | null;
  onSelectAttempt: (id: string | null) => void;
  reflections: StudentReflection[];
  onAddReflection: (chapterId: string, message: string) => void;
  studentInfo: Pick<UserAccount, 'name' | 'nim' | 'program' | 'semester'>;
  onOpenTask: (taskId: string) => void;
}

export const GradesAndCharts: React.FC<GradesAndChartsProps> = ({
  attempts,
  stageProgress,
  selectedAttemptId,
  onSelectAttempt,
  reflections,
  onAddReflection,
  studentInfo,
  onOpenTask,
}) => {
  const [filterKind, setFilterKind] = useState<'all' | 'pretest' | 'tugas' | 'posttest' | 'tantangan'>('all');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [reflectionChapter, setReflectionChapter] = useState<string>('bab-3');
  const [reflectionText, setReflectionText] = useState<string>('');

  const orderedAttempts = useMemo(
    () =>
      [...attempts].sort(
        (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      ),
    [attempts]
  );

  const filteredAttempts = useMemo(
    () =>
      [...orderedAttempts]
        .reverse()
        .filter((a) => filterKind === 'all' || a.kind === filterKind),
    [orderedAttempts, filterKind]
  );

  const inspectedAttempt = useMemo(() => {
    if (selectedAttemptId) {
      return attempts.find((a) => a.id === selectedAttemptId) || filteredAttempts[0] || null;
    }
    return filteredAttempts[0] || null;
  }, [attempts, filteredAttempts, selectedAttemptId]);

  const stats = useMemo(() => {
    if (attempts.length === 0) {
      return { avg: 0, highest: 0, total: 0, passedCount: 0 };
    }
    const avg = Math.round(
      attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
    );
    const highest = Math.max(...attempts.map((a) => a.score));
    const passedCount = attempts.filter((a) => a.score >= 75).length;
    return { avg, highest, total: attempts.length, passedCount };
  }, [attempts]);

  // Chapter mastery breakdown for bar chart (chronological from orderedAttempts)
  const chapterScores = useMemo(() => {
    return CHAPTERS.map((chap) => {
      const chapAttempts = orderedAttempts.filter((a) => a.chapterId === chap.id);
      const best =
        chapAttempts.length > 0 ? Math.max(...chapAttempts.map((a) => a.score)) : 0;
      const latest =
        chapAttempts.length > 0
          ? chapAttempts[chapAttempts.length - 1].score
          : 0;
      return {
        id: chap.id,
        label: `Bab ${chap.babNumber}`,
        title: chap.title,
        best,
        latest,
        hasData: chapAttempts.length > 0,
      };
    });
  }, [orderedAttempts]);

  // SVG Line Chart geometry
  const chartW = 640;
  const chartH = 224;
  const padL = 38;
  const padR = 20;
  const padT = 24;
  const padB = 34;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const linePoints = useMemo(() => {
    if (orderedAttempts.length === 0) return [];
    return orderedAttempts.map((att, i) => {
      const x =
        orderedAttempts.length === 1
          ? padL + plotW / 2
          : padL + (i / (orderedAttempts.length - 1)) * plotW;
      const y = padT + ((100 - att.score) / 100) * plotH;
      return { x, y, att };
    });
  }, [orderedAttempts, plotH, plotW]);

  const linePath =
    linePoints.length > 0
      ? linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
      : '';

  const areaPath =
    linePoints.length > 1
      ? `${linePath} L ${linePoints[linePoints.length - 1].x} ${padT + plotH} L ${linePoints[0].x} ${padT + plotH} Z`
      : '';

  const kkmY = padT + ((100 - 75) / 100) * plotH;

  const handleReflectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    onAddReflection(reflectionChapter, reflectionText.trim());
    setReflectionText('');
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Print-only Official Transcript Header */}
      <div className="hidden print-only border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-blue-700">SIVEMA EdLink</div>
            <div className="text-xs text-slate-600">
              Transkrip Nilai, Grafik & Umpan Balik · {STUDENT_PROFILE.course}
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div>
              Mahasiswa: <strong>{studentInfo.name}</strong> ({studentInfo.nim})
            </div>
            <div>
              {studentInfo.program} · Dosen: {STUDENT_PROFILE.lecturer}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Hasil Belajar, Grafik Nilai & Umpan Balik
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Pantau perkembangan nilai, tinjau pembahasan soal, serta unduh atau cetak laporan akademik Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
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
            onClick={() =>
              downloadFullAcademicReportHtml(attempts, stageProgress, studentInfo)
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh Rekap Laporan
          </button>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 print-clean">
          <div className="text-xs text-slate-500">Rata-rata Nilai</div>
          <div className="text-2xl font-display font-bold text-slate-900 tabular-nums mt-1">
            {attempts.length > 0 ? (
              <>
                {stats.avg}
                <span className="text-xs font-normal text-slate-400"> / 100</span>
              </>
            ) : (
              '—'
            )}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 print-clean">
          <div className="text-xs text-slate-500">Nilai Tertinggi</div>
          <div className="text-2xl font-display font-bold text-blue-700 tabular-nums mt-1">
            {attempts.length > 0 ? (
              <>
                {stats.highest}
                <span className="text-xs font-normal text-slate-400"> / 100</span>
              </>
            ) : (
              '—'
            )}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 print-clean">
          <div className="text-xs text-slate-500">Evaluasi Selesai</div>
          <div className="text-2xl font-display font-bold text-slate-900 tabular-nums mt-1">
            {stats.total}
            <span className="text-xs font-normal text-slate-500"> percobaan</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 print-clean">
          <div className="text-xs text-slate-500">Capaian ≥ KKM (75)</div>
          <div className="text-2xl font-display font-bold text-emerald-700 tabular-nums mt-1">
            {stats.passedCount}
            <span className="text-xs font-normal text-slate-500"> dari {stats.total}</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Score Progression */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Grafik Tren Perkembangan Nilai
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Garis putus-putus = Batas KKM (75)
            </span>
          </div>

          {orderedAttempts.length > 0 ? (
            <div className="relative">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full h-auto overflow-visible"
                role="img"
                aria-label="Grafik tren nilai mahasiswa"
              >
                <defs>
                  <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Horizontal gridlines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = padT + ((100 - val) / 100) * plotH;
                  return (
                    <g key={val}>
                      <line
                        x1={padL}
                        x2={chartW - padR}
                        y1={y}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeWidth={1}
                      />
                      <text
                        x={padL - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="fill-slate-400 text-[10px] font-mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* KKM threshold line */}
                <line
                  x1={padL}
                  x2={chartW - padR}
                  y1={kkmY}
                  y2={kkmY}
                  stroke="#059669"
                  strokeWidth={1.25}
                  strokeDasharray="4 4"
                />

                {areaPath && <path d={areaPath} fill="url(#scoreAreaGrad)" />}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {linePoints.map((pt, idx) => {
                  const isHovered = hoveredIdx === idx;
                  const isSelected = inspectedAttempt?.id === pt.att.id;
                  return (
                    <g
                      key={pt.att.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onClick={() => onSelectAttempt(pt.att.id)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered || isSelected ? 7 : 5}
                        fill={pt.att.score >= 75 ? '#2563eb' : '#d97706'}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                      <text
                        x={pt.x}
                        y={padT + plotH + 18}
                        textAnchor="middle"
                        className="fill-slate-500 text-[10px] font-mono"
                      >
                        #{idx + 1}
                      </text>
                      <text
                        x={pt.x}
                        y={pt.y - 11}
                        textAnchor="middle"
                        className="fill-slate-800 text-[11px] font-mono font-semibold"
                      >
                        {pt.att.score}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {(() => {
                const activePt =
                  hoveredIdx !== null
                    ? linePoints[hoveredIdx]
                    : linePoints.find((p) => p.att.id === inspectedAttempt?.id) || null;
                if (!activePt) return null;
                return (
                  <div className="mt-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium truncate">
                      {activePt.att.taskTitle}
                    </span>
                    <span className="font-mono tabular-nums text-blue-300">
                      Nilai: {activePt.att.score}/100 ·{' '}
                      {formatDate(activePt.att.submittedAt)}
                    </span>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center gap-3 text-center px-4">
              <p className="text-xs text-slate-500 max-w-sm">
                Belum ada riwayat evaluasi terekam. Kerjakan Pre-test, Tugas, atau Latihan Tantangan untuk menampilkan grafik tren nilai Anda.
              </p>
              <button
                type="button"
                onClick={() => onOpenTask('pretest-bab-1')}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer no-print"
              >
                Mulai Pre-test Bab 1
              </button>
            </div>
          )}
        </div>

        {/* Bar Chart: Mastery per Bab */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Grafik Penguasaan per Bab Tumbukan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nilai terbaik yang dicapai pada Bab 1 hingga Bab 5
            </p>
          </div>

          <div className="space-y-3.5 my-4">
            {chapterScores.map((c) => (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate pr-2">
                    {c.label}: {c.title}
                  </span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
                    {c.hasData ? `${c.best}%` : '—'}
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                  {/* KKM marker at 75% */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-slate-400 z-10"
                    style={{ left: '75%' }}
                    title="KKM 75%"
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      c.best >= 75 ? 'bg-emerald-600' : c.hasData ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                    style={{ width: `${c.best}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Garis vertikal tipis menandai target ketuntasan minimal 75%.
          </div>
        </div>
      </div>

      {/* Attempt History Table + Selected Attempt Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Riwayat Nilai Tugas & Ujian
            </h3>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg no-print">
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
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                  <th className="py-2.5 px-4">Evaluasi</th>
                  <th className="py-2.5 px-3 text-right">Nilai</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 px-4 text-center text-xs text-slate-500">
                      Belum ada riwayat nilai pada kategori ini.
                    </td>
                  </tr>
                ) : (
                  filteredAttempts.map((att) => {
                  const isSelected = inspectedAttempt?.id === att.id;
                  const passed = att.score >= 75;
                  return (
                    <tr
                      key={att.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{att.taskTitle}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                          {formatDate(att.submittedAt)} · Benar {att.correctCount}/
                          {att.totalQuestions}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {att.score}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-medium whitespace-nowrap ${
                            passed ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          {passed ? 'Tuntas' : 'Review'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectAttempt(att.id)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Umpan Balik
                        </button>
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Umpan Balik Detail & Pembahasan */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4 print-clean">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Umpan Balik Dosen & Rincian Soal
              </h3>
            </div>
            {inspectedAttempt && (
              <button
                type="button"
                onClick={() => downloadAttemptReportHtml(inspectedAttempt, studentInfo)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer no-print"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Pembahasan
              </button>
            )}
          </div>

          {inspectedAttempt ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">
                    {inspectedAttempt.taskTitle}
                  </span>
                  <span className="font-mono font-bold text-blue-700 tabular-nums">
                    {inspectedAttempt.score}/100
                  </span>
                </div>
                <p className="text-slate-700 mt-2 leading-relaxed">
                  {inspectedAttempt.lecturerFeedback}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                  <span className="font-semibold text-emerald-900">Kekuatan: </span>
                  <span className="text-emerald-800">{inspectedAttempt.strengthNote}</span>
                </div>
                <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                  <span className="font-semibold text-amber-900">Perbaikan: </span>
                  <span className="text-amber-800">{inspectedAttempt.improvementNote}</span>
                </div>
              </div>

              {/* Detailed per-question breakdown with prompt, user answer & key */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="font-semibold text-slate-700">
                  Ringkasan Jawaban ({inspectedAttempt.correctCount}/
                  {inspectedAttempt.totalQuestions} Benar)
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {inspectedAttempt.details.map((det, idx) => {
                    const bundle = TASK_BUNDLES.find(
                      (b) => b.id === inspectedAttempt.taskId
                    );
                    const q = bundle?.questions.find((item) => item.id === det.questionId);
                    const userAns =
                      q?.format === 'multiple-choice'
                        ? det.selectedOptionIndex !== undefined && q.options
                          ? q.options[det.selectedOptionIndex]
                          : 'Tidak dijawab'
                        : det.numericInput
                        ? `${det.numericInput} ${q?.unit || ''}`.trim()
                        : 'Tidak dijawab';

                    const keyAns =
                      q?.format === 'multiple-choice' &&
                      q.options &&
                      q.correctOptionIndex !== undefined
                        ? q.options[q.correctOptionIndex]
                        : q?.correctNumericValue !== undefined
                        ? `${q.correctNumericValue} ${q.unit || ''}`.trim()
                        : '—';

                    return (
                      <div
                        key={det.questionId}
                        className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800">
                            Soal {idx + 1} · {q?.conceptTag || 'Konsep Tumbukan'}
                          </span>
                          <span
                            className={`font-semibold ${
                              det.isCorrect ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {det.isCorrect ? 'Benar' : 'Keliru'}
                          </span>
                        </div>
                        {q && (
                          <>
                            <p className="text-[11px] font-medium text-slate-800 leading-relaxed">
                              {q.prompt}
                            </p>
                            <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5">
                              <span>
                                Jawaban Anda:{' '}
                                <strong
                                  className={
                                    det.isCorrect ? 'text-emerald-700' : 'text-red-700'
                                  }
                                >
                                  {userAns}
                                </strong>
                              </span>
                              <span>
                                Kunci: <strong className="text-slate-900">{keyAns}</strong>
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 rounded p-2 border border-slate-100">
                              <span className="font-semibold text-slate-700">Pembahasan: </span>
                              {q.explanation}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
              {attempts.length === 0
                ? 'Belum ada evaluasi yang dikerjakan. Setelah mengumpulkan tugas atau kuis, umpan balik dosen beserta kunci dan pembahasan per soal akan muncul di sini.'
                : 'Pilih salah satu riwayat di samping untuk membaca umpan balik dan pembahasan detail.'}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Student Reflection & Lecturer Dialogue */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 no-print">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Catatan Refleksi Mahasiswa & Tanya Dosen
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tuliskan kendala konsep tumbukan atau pertanyaan perhitungan untuk mendapatkan arahan langsung.
          </p>
        </div>

        <form onSubmit={handleReflectionSubmit} className="flex flex-col sm:flex-row gap-3">
          <select
            value={reflectionChapter}
            onChange={(e) => setReflectionChapter(e.target.value)}
            aria-label="Pilih bab untuk refleksi"
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white sm:w-56 shrink-0"
          >
            {CHAPTERS.map((c) => (
              <option key={c.id} value={c.id}>
                Bab {c.babNumber}: {c.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Contoh: Mengapa energi kinetik hilang saat tumbukan tidak lenting?"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:border-blue-600 outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Kirim Catatan
          </button>
        </form>

        <div className="space-y-3 pt-2">
          {reflections.length === 0 ? (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs text-slate-500 text-center">
              Belum ada catatan refleksi atau pertanyaan terkirim. Kirim pertanyaan pertama Anda di kolom atas.
            </div>
          ) : (
            reflections.map((ref) => {
              const chap = CHAPTERS.find((c) => c.id === ref.chapterId);
              return (
                <div
                  key={ref.id}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2.5 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500">
                    <span className="font-semibold text-slate-800">
                      {ref.author} · Bab {chap?.babNumber} ({chap?.title})
                    </span>
                    <span className="tabular-nums">{formatDate(ref.createdAt)}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{ref.message}</p>
                  {ref.lecturerReply && (
                    <div className="bg-white border border-blue-200 rounded-lg p-3 text-slate-700">
                      <span className="font-semibold text-blue-800">
                        Tanggapan Dosen (Amanda Asti Vania):{' '}
                      </span>
                      {ref.lecturerReply}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
