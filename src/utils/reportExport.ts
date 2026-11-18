import { CHAPTERS, STUDENT_PROFILE, TASK_BUNDLES } from '@/src/data/collisionCurriculum';
import type { ChapterStageProgress, TaskAttempt, UserAccount } from '@/src/types/academic';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateId(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDurationId(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m} menit ${s} detik`;
}

function triggerHtmlDownload(filename: string, htmlContent: string) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const REPORT_CSS = `
  body { font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #0f172a; background: #f8fafc; margin: 0; padding: 32px 20px; line-height: 1.55; }
  .sheet { max-width: 860px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 32px; }
  .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
  .brand { font-size: 20px; font-weight: 800; color: #1d4ed8; margin: 0; }
  .sub { font-size: 13px; color: #475569; margin: 4px 0 0; }
  .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px; font-size: 13px; }
  .meta-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
  .meta-val { font-weight: 700; color: #0f172a; margin-top: 2px; }
  .score-box { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; padding: 16px; border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 10px; margin-bottom: 24px; }
  .score-num { font-size: 36px; font-weight: 800; color: #1d4ed8; font-variant-numeric: tabular-nums; }
  .section-title { font-size: 16px; font-weight: 700; margin: 24px 0 12px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .feedback-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 24px; font-size: 13px; }
  .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; background: #ffffff; }
  .q-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 14px; page-break-inside: avoid; }
  .q-head { display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-bottom: 8px; font-weight: 600; }
  .ok { color: #047857; }
  .bad { color: #b91c1c; }
  .q-prompt { font-size: 14px; font-weight: 600; margin: 0 0 10px; }
  .ans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 13px; margin-bottom: 10px; }
  .ans-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; }
  .expl { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 12px; font-size: 13px; color: #1e293b; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; }
  th, td { border-bottom: 1px solid #e2e8f0; padding: 9px 10px; text-align: left; }
  th { background: #f8fafc; color: #475569; font-size: 12px; }
  .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  @media print { body { background: #ffffff; padding: 0; } .sheet { border: none; padding: 0; } }
`;

export function downloadAttemptReportHtml(
  attempt: TaskAttempt,
  student: Pick<UserAccount, 'name' | 'nim' | 'program' | 'semester'>
) {
  const bundle = TASK_BUNDLES.find((b) => b.id === attempt.taskId);
  const passingScore = bundle?.passingScore ?? 75;
  const passed = attempt.score >= passingScore;

  const questionsHtml = attempt.details
    .map((det, idx) => {
      const q = bundle?.questions.find((item) => item.id === det.questionId);
      const userAns =
        q?.format === 'multiple-choice'
          ? det.selectedOptionIndex !== undefined && q.options
            ? q.options[det.selectedOptionIndex]
            : 'Tidak dijawab (dilewati)'
          : det.numericInput
          ? `${det.numericInput} ${q?.unit || ''}`.trim()
          : 'Tidak dijawab (dilewati)';

      const keyAns =
        q?.format === 'multiple-choice' && q.options && q.correctOptionIndex !== undefined
          ? q.options[q.correctOptionIndex]
          : q?.correctNumericValue !== undefined
          ? `${q.correctNumericValue} ${q.unit || ''}`.trim()
          : '-';

      return `
        <div class="q-card">
          <div class="q-head">
            <span>Soal ${idx + 1} · ${escapeHtml(q?.conceptTag || 'Konsep Tumbukan')} · Bobot ${det.maxPoints} poin</span>
            <span class="${det.isCorrect ? 'ok' : 'bad'}">${det.isCorrect ? `Benar (+${det.earnedPoints} poin)` : 'Belum Tepat (0 poin)'}</span>
          </div>
          <p class="q-prompt">${escapeHtml(q?.prompt || 'Pertanyaan evaluasi')}</p>
          <div class="ans-grid">
            <div class="ans-box">
              <div class="meta-label">Jawaban Mahasiswa</div>
              <div class="${det.isCorrect ? 'ok' : 'bad'}" style="font-weight:600;margin-top:2px;">${escapeHtml(userAns)}</div>
            </div>
            <div class="ans-box">
              <div class="meta-label">Kunci Jawaban</div>
              <div style="font-weight:600;margin-top:2px;">${escapeHtml(keyAns)}</div>
            </div>
          </div>
          ${q ? `<div class="expl"><strong>Pembahasan:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
        </div>
      `;
    })
    .join('');

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Laporan Nilai & Pembahasan — ${escapeHtml(attempt.taskTitle)}</title>
  <style>${REPORT_CSS}</style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <h1 class="brand">SIVEMA EdLink</h1>
        <p class="sub">Laporan Nilai & Pembahasan Evaluasi · ${escapeHtml(STUDENT_PROFILE.course)}</p>
      </div>
      <div style="text-align:right;font-size:12px;color:#475569;">
        <div>Dicetak: ${escapeHtml(formatDateId(new Date().toISOString()))}</div>
        <div>Dosen Pengampu: ${escapeHtml(STUDENT_PROFILE.lecturer)}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div><div class="meta-label">Nama Mahasiswa</div><div class="meta-val">${escapeHtml(student.name)}</div></div>
      <div><div class="meta-label">NIM / ID Akun</div><div class="meta-val">${escapeHtml(student.nim)}</div></div>
      <div><div class="meta-label">Program Studi</div><div class="meta-val">${escapeHtml(student.program)}</div></div>
      <div><div class="meta-label">Waktu Pengumpulan</div><div class="meta-val">${escapeHtml(formatDateId(attempt.submittedAt))}</div></div>
    </div>

    <div class="score-box">
      <div class="score-num">${attempt.score}<span style="font-size:16px;font-weight:500;color:#475569;"> / 100</span></div>
      <div style="font-size:13px;">
        <div style="font-weight:700;font-size:15px;">${escapeHtml(attempt.taskTitle)}</div>
        <div style="margin-top:4px;color:#334155;">
          Status: <strong class="${passed ? 'ok' : 'bad'}">${passed ? 'Tuntas (≥ KKM ' + passingScore + ')' : 'Perlu Pengulangan (< KKM ' + passingScore + ')'}</strong>
          · Benar ${attempt.correctCount} dari ${attempt.totalQuestions} soal
          · Durasi ${escapeHtml(formatDurationId(attempt.durationSeconds))}
        </div>
      </div>
    </div>

    <div class="feedback-grid">
      <div class="card"><div class="meta-label">Umpan Balik Akademik</div><div style="margin-top:4px;">${escapeHtml(attempt.lecturerFeedback)}</div></div>
      <div class="card"><div class="meta-label">Kekuatan</div><div style="margin-top:4px;">${escapeHtml(attempt.strengthNote)}</div></div>
      <div class="card"><div class="meta-label">Saran Perbaikan</div><div style="margin-top:4px;">${escapeHtml(attempt.improvementNote)}</div></div>
    </div>

    <h2 class="section-title">Rincian Jawaban & Pembahasan Langkah demi Langkah</h2>
    ${questionsHtml}

    <div class="footer">
      <span>SIVEMA EdLink · Arsip Akademik Mahasiswa</span>
      <span>Dosen Pengampu: ${escapeHtml(STUDENT_PROFILE.lecturer)}</span>
    </div>
  </div>
</body>
</html>`;

  const safeSlug = attempt.taskId.replace(/[^a-z0-9-_]/gi, '_');
  triggerHtmlDownload(`Laporan_${safeSlug}_${student.nim}.html`, html);
}

export function downloadFullAcademicReportHtml(
  attempts: TaskAttempt[],
  stageProgress: Record<string, ChapterStageProgress>,
  student: Pick<UserAccount, 'name' | 'nim' | 'program' | 'semester'>
) {
  const ordered = [...attempts].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );
  const avg =
    ordered.length > 0
      ? Math.round(ordered.reduce((s, a) => s + a.score, 0) / ordered.length)
      : 0;
  const highest = ordered.length > 0 ? Math.max(...ordered.map((a) => a.score)) : 0;

  const chapterRows = CHAPTERS.map((chap) => {
    const prog = stageProgress[chap.id];
    const done = prog ? Object.values(prog).filter(Boolean).length : 0;
    const chapAttempts = ordered.filter((a) => a.chapterId === chap.id);
    const best =
      chapAttempts.length > 0 ? Math.max(...chapAttempts.map((a) => a.score)) : null;
    return `
      <tr>
        <td><strong>Bab ${chap.babNumber}: ${escapeHtml(chap.title)}</strong></td>
        <td>${done} / 5 tahap (${Math.round((done / 5) * 100)}%)</td>
        <td style="font-weight:700;">${best !== null ? `${best} / 100` : '—'}</td>
        <td>${best !== null ? (best >= 75 ? '<span class="ok">Tuntas</span>' : '<span class="bad">Perlu Pengayaan</span>') : 'Belum Dievaluasi'}</td>
      </tr>
    `;
  }).join('');

  const attemptRows = ordered.length
    ? [...ordered]
        .reverse()
        .map(
          (att) => `
          <tr>
            <td>
              <strong>${escapeHtml(att.taskTitle)}</strong><br/>
              <span style="font-size:11px;color:#64748b;">${escapeHtml(formatDateId(att.submittedAt))} · Benar ${att.correctCount}/${att.totalQuestions}</span>
            </td>
            <td style="font-weight:700;">${att.score}</td>
            <td>${att.score >= 75 ? '<span class="ok">Tuntas</span>' : '<span class="bad">Review</span>'}</td>
            <td>${escapeHtml(att.lecturerFeedback)}</td>
          </tr>
        `
        )
        .join('')
    : '<tr><td colspan="4" style="text-align:center;color:#64748b;padding:18px;">Belum ada riwayat evaluasi terekam.</td></tr>';

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Transkrip Progres & Nilai SIVEMA EdLink — ${escapeHtml(student.name)}</title>
  <style>${REPORT_CSS}</style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <h1 class="brand">SIVEMA EdLink</h1>
        <p class="sub">Rekapitulasi Nilai, Penguasaan Bab & Umpan Balik · ${escapeHtml(STUDENT_PROFILE.course)}</p>
      </div>
      <div style="text-align:right;font-size:12px;color:#475569;">
        <div>Tanggal Unduh: ${escapeHtml(formatDateId(new Date().toISOString()))}</div>
        <div>Dosen Pengampu: ${escapeHtml(STUDENT_PROFILE.lecturer)}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div><div class="meta-label">Nama Mahasiswa</div><div class="meta-val">${escapeHtml(student.name)}</div></div>
      <div><div class="meta-label">NIM / ID Akun</div><div class="meta-val">${escapeHtml(student.nim)}</div></div>
      <div><div class="meta-label">Program Studi</div><div class="meta-val">${escapeHtml(student.program)} (${escapeHtml(student.semester)})</div></div>
      <div><div class="meta-label">Ringkasan Nilai</div><div class="meta-val">Rata-rata ${ordered.length > 0 ? avg : '—'} · Tertinggi ${ordered.length > 0 ? highest : '—'}</div></div>
    </div>

    <h2 class="section-title">Penguasaan Materi Per Bab Tumbukan</h2>
    <table>
      <thead>
        <tr><th>Bab Materi</th><th>Progres Tahapan</th><th>Nilai Terbaik</th><th>Status KKM (75)</th></tr>
      </thead>
      <tbody>${chapterRows}</tbody>
    </table>

    <h2 class="section-title">Riwayat Nilai & Umpan Balik Dosen</h2>
    <table>
      <thead>
        <tr><th>Evaluasi</th><th>Nilai</th><th>Status</th><th>Umpan Balik</th></tr>
      </thead>
      <tbody>${attemptRows}</tbody>
    </table>

    <div class="footer">
      <span>SIVEMA EdLink · Transkrip Akademik Mahasiswa</span>
      <span>Dosen Pengampu: ${escapeHtml(STUDENT_PROFILE.lecturer)}</span>
    </div>
  </div>
</body>
</html>`;

  triggerHtmlDownload(`Rekap_Nilai_SIVEMA_${student.nim}.html`, html);
}
