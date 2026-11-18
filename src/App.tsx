import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PlaySquare,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  INITIAL_ATTEMPTS,
  INITIAL_REFLECTIONS,
  INITIAL_STAGE_PROGRESS,
  STUDENT_PROFILE,
} from '@/src/data/collisionCurriculum';
import type {
  ChapterStageProgress,
  DraftTaskState,
  NavTab,
  StudentReflection,
  TaskAttempt,
  UserAccount,
} from '@/src/types/academic';
import { AuthGate } from '@/src/components/AuthGate';
import { DashboardView } from '@/src/components/DashboardView';
import { LearningSpace } from '@/src/components/LearningSpace';
import { AssignmentRunner } from '@/src/components/AssignmentRunner';
import { GradesAndCharts } from '@/src/components/GradesAndCharts';
import { CollisionSimulator } from '@/src/components/CollisionSimulator';
import { MediaGallery } from '@/src/components/MediaGallery';

const ACCOUNTS_STORAGE_KEY = 'sivema_edlink_accounts_v1';
const SESSION_STORAGE_KEY = 'sivema_edlink_session_v1';
const STATE_PREFIX = 'sivema_edlink_state_v2_';

const DEFAULT_DEMO_ACCOUNT: UserAccount = {
  id: 'amanda-default',
  name: 'Amanda Asti Vania',
  nim: '06111182429012',
  email: '06111182429012@student.unsri.ac.id',
  password: 'sivema2026',
  program: STUDENT_PROFILE.program,
  semester: STUDENT_PROFILE.semester,
};

interface PersistedState {
  selectedChapterId: string;
  stageProgress: Record<string, ChapterStageProgress>;
  attempts: TaskAttempt[];
  drafts: Record<string, DraftTaskState>;
  reflections: StudentReflection[];
}

function loadAccounts(): UserAccount[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UserAccount[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasDefault = parsed.some((a) => a.id === DEFAULT_DEMO_ACCOUNT.id);
        const synced = parsed.map((a) =>
          a.id === DEFAULT_DEMO_ACCOUNT.id ? DEFAULT_DEMO_ACCOUNT : a
        );
        return hasDefault ? synced : [DEFAULT_DEMO_ACCOUNT, ...synced];
      }
    }
  } catch {
    // Fallback
  }
  return [DEFAULT_DEMO_ACCOUNT];
}

function loadSessionAccount(accounts: UserAccount[]): UserAccount | null {
  try {
    const rememberedId =
      window.localStorage.getItem(SESSION_STORAGE_KEY) ||
      window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (rememberedId) {
      return accounts.find((a) => a.id === rememberedId) || null;
    }
  } catch {
    // Fallback
  }
  return null;
}

function getFreshState(isDefaultAccount: boolean): PersistedState {
  if (isDefaultAccount) {
    return {
      selectedChapterId: 'bab-3',
      stageProgress: INITIAL_STAGE_PROGRESS,
      attempts: INITIAL_ATTEMPTS,
      drafts: {},
      reflections: INITIAL_REFLECTIONS,
    };
  }
  return {
    selectedChapterId: 'bab-1',
    stageProgress: {
      'bab-1': { mediaCompleted: false, pretestCompleted: false, moduleCompleted: false, tugasCompleted: false, posttestCompleted: false },
      'bab-2': { mediaCompleted: false, pretestCompleted: false, moduleCompleted: false, tugasCompleted: false, posttestCompleted: false },
      'bab-3': { mediaCompleted: false, pretestCompleted: false, moduleCompleted: false, tugasCompleted: false, posttestCompleted: false },
      'bab-4': { mediaCompleted: false, pretestCompleted: false, moduleCompleted: false, tugasCompleted: false, posttestCompleted: false },
      'bab-5': { mediaCompleted: false, pretestCompleted: false, moduleCompleted: false, tugasCompleted: false, posttestCompleted: false },
    },
    attempts: [],
    drafts: {},
    reflections: [],
  };
}

function loadAccountState(accountId: string): PersistedState {
  const isDefault = accountId === DEFAULT_DEMO_ACCOUNT.id;
  try {
    const raw = window.localStorage.getItem(`${STATE_PREFIX}${accountId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed.stageProgress && Array.isArray(parsed.attempts)) {
        return {
          selectedChapterId: parsed.selectedChapterId || (isDefault ? 'bab-3' : 'bab-1'),
          stageProgress: parsed.stageProgress,
          attempts: parsed.attempts,
          drafts: parsed.drafts || {},
          reflections: parsed.reflections || (isDefault ? INITIAL_REFLECTIONS : []),
        };
      }
    }
  } catch {
    // Fallback
  }
  return getFreshState(isDefault);
}

export function App() {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => loadAccounts());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadSessionAccount(loadAccounts())
  );

  const [activeTab, setActiveTab] = useState<NavTab>('ruang-belajar');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const [state, setState] = useState<PersistedState>(() =>
    loadAccountState(currentUser?.id || DEFAULT_DEMO_ACCOUNT.id)
  );
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(
    () => state.attempts[state.attempts.length - 1]?.id || null
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch {
      // Ignore storage quota errors
    }
  }, [accounts]);

  useEffect(() => {
    if (!currentUser) return;
    try {
      window.localStorage.setItem(
        `${STATE_PREFIX}${currentUser.id}`,
        JSON.stringify(state)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [state, currentUser]);

  const handleLoginSuccess = (account: UserAccount, remember: boolean) => {
    const nextState = loadAccountState(account.id);
    setCurrentUser(account);
    setState(nextState);
    setSelectedAttemptId(
      nextState.attempts[nextState.attempts.length - 1]?.id || null
    );
    setActiveTab('ruang-belajar');
    setActiveTaskId(null);
    try {
      if (remember) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, account.id);
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } else {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, account.id);
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  };

  const handleRegisterAccount = (newAccount: UserAccount, remember: boolean) => {
    setAccounts((prev) => [...prev, newAccount]);
    handleLoginSuccess(newAccount, remember);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTaskId(null);
    setMobileMenuOpen(false);
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  if (!currentUser) {
    return (
      <AuthGate
        accounts={accounts}
        onLoginSuccess={handleLoginSuccess}
        onRegisterAccount={handleRegisterAccount}
      />
    );
  }

  const handleSelectChapter = (chapterId: string) => {
    setState((prev) => ({ ...prev, selectedChapterId: chapterId }));
  };

  const handleMarkStageComplete = (
    chapterId: string,
    stage: keyof ChapterStageProgress
  ) => {
    setState((prev) => {
      const current = prev.stageProgress[chapterId] || {
        mediaCompleted: false,
        pretestCompleted: false,
        moduleCompleted: false,
        tugasCompleted: false,
        posttestCompleted: false,
      };
      return {
        ...prev,
        stageProgress: {
          ...prev.stageProgress,
          [chapterId]: {
            ...current,
            [stage]: true,
          },
        },
      };
    });
  };

  const handleUpdateDraft = (taskId: string, draft: DraftTaskState) => {
    setState((prev) => ({
      ...prev,
      drafts: {
        ...prev.drafts,
        [taskId]: draft,
      },
    }));
  };

  const handleSubmitAttempt = (attempt: TaskAttempt) => {
    setState((prev) => {
      const nextDrafts = { ...prev.drafts };
      delete nextDrafts[attempt.taskId];

      const chapProg = prev.stageProgress[attempt.chapterId] || {
        mediaCompleted: false,
        pretestCompleted: false,
        moduleCompleted: false,
        tugasCompleted: false,
        posttestCompleted: false,
      };

      const updatedChapProg = { ...chapProg };
      if (attempt.kind === 'pretest') updatedChapProg.pretestCompleted = true;
      if (attempt.kind === 'tugas') updatedChapProg.tugasCompleted = true;
      if (attempt.kind === 'posttest') updatedChapProg.posttestCompleted = true;

      return {
        ...prev,
        attempts: [...prev.attempts, attempt],
        drafts: nextDrafts,
        stageProgress: {
          ...prev.stageProgress,
          [attempt.chapterId]: updatedChapProg,
        },
      };
    });
    setSelectedAttemptId(attempt.id);
  };

  const handleAddReflection = (chapterId: string, message: string) => {
    const autoReply =
      'Terima kasih atas catatannya. Pertanyaan Anda sudah masuk ke log bimbingan SIVEMA EdLink. Untuk langkah cepat, periksa kembali arah vektor kecepatan (±) dan terapkan persamaan kekekalan momentum sebelum mengevaluasi koefisien restitusi.';

    const entry: StudentReflection = {
      id: `ref-${Date.now()}`,
      chapterId,
      author: currentUser.name,
      message,
      createdAt: new Date().toISOString(),
      lecturerReply: autoReply,
    };

    setState((prev) => ({
      ...prev,
      reflections: [entry, ...prev.reflections],
    }));
  };

  const handleOpenTask = (taskId: string) => {
    setState((prev) => {
      if (prev.drafts[taskId]) return prev;
      return {
        ...prev,
        drafts: {
          ...prev.drafts,
          [taskId]: {
            taskId,
            currentQuestionIndex: 0,
            answers: {},
            flaggedIds: [],
            startedAtMs: Date.now(),
          },
        },
      };
    });
    setActiveTaskId(taskId);
    setActiveTab('tugas');
    setMobileMenuOpen(false);
  };

  const handleResetDemo = () => {
    const fresh = getFreshState(currentUser.id === DEFAULT_DEMO_ACCOUNT.id);
    setState(fresh);
    setActiveTaskId(null);
    setConfirmReset(false);
    setSelectedAttemptId(fresh.attempts[fresh.attempts.length - 1]?.id || null);
  };

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ruang-belajar', label: 'Ruang Belajar', icon: BookOpen },
    { id: 'tugas', label: 'Tugas & Evaluasi', icon: ClipboardList },
    { id: 'hasil-belajar', label: 'Hasil & Grafik Nilai', icon: BarChart3 },
    { id: 'media-simulasi', label: 'Media & Simulasi', icon: PlaySquare },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'tugas') {
      setActiveTaskId(null);
    }
    setConfirmReset(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Clean 3-Zone Top Header Bar */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-8 no-print">
        {/* Zone 1: Brand Wordmark + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('ruang-belajar')}
            className="flex items-center gap-2.5 text-left cursor-pointer whitespace-nowrap shrink-0"
          >
            <svg
              viewBox="0 0 36 36"
              className="w-8 h-8 shrink-0"
              aria-hidden="true"
            >
              <rect width="36" height="36" rx="9" fill="#2563EB" />
              <circle cx="13" cy="18" r="5" fill="#FFFFFF" />
              <circle cx="24" cy="18" r="5" fill="#93C5FD" />
              <path
                d="M17.5 11.5L19.5 18L17.5 24.5"
                stroke="#FDE68A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
              SIVEMA EdLink
            </span>
          </button>
        </div>

        {/* Zone 2: Quick Top Navigation Links on Desktop */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => handleNavClick('ruang-belajar')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'ruang-belajar'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Materi Tumbukan
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('tugas')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'tugas'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Kerjakan Tugas
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('hasil-belajar')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'hasil-belajar'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Nilai & Grafik
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('media-simulasi')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'media-simulasi'
                ? 'text-blue-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Video Animasi
          </button>
        </nav>

        {/* Zone 3: Student Identity & Keluar Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-900 whitespace-nowrap">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 whitespace-nowrap">
              Mahasiswa · {currentUser.nim}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar
          </button>
        </div>
      </header>

      {/* Main Workspace Container: Left Sidebar + Content Viewport */}
      <div className="flex-1 flex relative">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-200 lg:translate-x-0 no-print ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="px-2 text-xs text-slate-500 leading-relaxed">
              <div className="font-semibold text-slate-700">
                {STUDENT_PROFILE.course}
              </div>
              <div className="mt-0.5">{STUDENT_PROFILE.lecturer}</div>
            </div>
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Progres Latihan
              </button>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 space-y-2 text-xs">
                <div className="font-medium text-amber-900">
                  Reset seluruh progres akun ini?
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleResetDemo}
                    className="flex-1 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Ya, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              studentName={currentUser.name}
              studentSemester={currentUser.semester}
              attempts={state.attempts}
              stageProgress={state.stageProgress}
              onNavigateTab={handleNavClick}
              onSelectChapterAndOpen={(chapId) => {
                handleSelectChapter(chapId);
                setActiveTab('ruang-belajar');
              }}
              onOpenTask={handleOpenTask}
            />
          )}

          {activeTab === 'ruang-belajar' && (
            <LearningSpace
              selectedChapterId={state.selectedChapterId}
              onSelectChapter={handleSelectChapter}
              stageProgress={state.stageProgress}
              onMarkStageComplete={handleMarkStageComplete}
              onOpenTask={handleOpenTask}
              onOpenMediaTab={() => setActiveTab('media-simulasi')}
              attempts={state.attempts}
            />
          )}

          {activeTab === 'tugas' && (
            <AssignmentRunner
              activeTaskId={activeTaskId}
              onSelectTask={setActiveTaskId}
              drafts={state.drafts}
              onUpdateDraft={handleUpdateDraft}
              onSubmitAttempt={handleSubmitAttempt}
              attempts={state.attempts}
              onNavigateToResults={(attemptId) => {
                setSelectedAttemptId(attemptId);
                setActiveTaskId(null);
                setActiveTab('hasil-belajar');
              }}
              studentInfo={{
                name: currentUser.name,
                nim: currentUser.nim,
                program: currentUser.program,
                semester: currentUser.semester,
              }}
            />
          )}

          {activeTab === 'hasil-belajar' && (
            <GradesAndCharts
              attempts={state.attempts}
              stageProgress={state.stageProgress}
              selectedAttemptId={selectedAttemptId}
              onSelectAttempt={setSelectedAttemptId}
              reflections={state.reflections}
              onAddReflection={handleAddReflection}
              studentInfo={{
                name: currentUser.name,
                nim: currentUser.nim,
                program: currentUser.program,
                semester: currentUser.semester,
              }}
              onOpenTask={handleOpenTask}
            />
          )}

          {activeTab === 'media-simulasi' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Media Pembelajaran & Simulasi Lab Tumbukan
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Eksplorasi video animasi fisika interaktif dan dokumentasi foto praktikum tumbukan di laboratorium.
                </p>
              </div>
              <CollisionSimulator initialPreset="elastic" />
              <MediaGallery
                onSelectChapter={(chapId) => {
                  handleSelectChapter(chapId);
                  setActiveTab('ruang-belajar');
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
