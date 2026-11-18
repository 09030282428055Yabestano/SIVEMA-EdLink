export type NavTab =
  | 'dashboard'
  | 'ruang-belajar'
  | 'tugas'
  | 'hasil-belajar'
  | 'media-simulasi';

export type TaskKind = 'pretest' | 'tugas' | 'posttest' | 'tantangan';

export type QuestionFormat = 'multiple-choice' | 'numeric';

export interface FormulaItem {
  label: string;
  equation: string;
  variables: string;
}

export interface WorkedExample {
  title: string;
  problem: string;
  given: string[];
  steps: string[];
  answer: string;
}

export interface ChapterMaterial {
  id: string;
  babNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  summary: string;
  keyConcepts: string[];
  formulas: FormulaItem[];
  workedExample: WorkedExample;
  realWorldContext: string;
  simulationPresetId: 'elastic' | 'partial' | 'inelastic' | 'different-mass';
  relatedPhotoId: string;
}

export interface Question {
  id: string;
  chapterId: string;
  format: QuestionFormat;
  prompt: string;
  equationHint?: string;
  options?: string[];
  correctOptionIndex?: number;
  correctNumericValue?: number;
  numericTolerance?: number;
  unit?: string;
  points: number;
  explanation: string;
  conceptTag: string;
}

export interface TaskBundle {
  id: string;
  chapterId: string;
  kind: TaskKind;
  title: string;
  description: string;
  estimatedMinutes: number;
  passingScore: number;
  questions: Question[];
}

export interface QuestionAttemptDetail {
  questionId: string;
  selectedOptionIndex?: number;
  numericInput?: string;
  isCorrect: boolean;
  earnedPoints: number;
  maxPoints: number;
}

export interface TaskAttempt {
  id: string;
  taskId: string;
  chapterId: string;
  kind: TaskKind;
  taskTitle: string;
  submittedAt: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  details: QuestionAttemptDetail[];
  lecturerFeedback: string;
  strengthNote: string;
  improvementNote: string;
}

export interface StudentReflection {
  id: string;
  chapterId: string;
  author: string;
  message: string;
  createdAt: string;
  lecturerReply?: string;
}

export interface MediaPhoto {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  caption: string;
  experimentNotes: string[];
  formulaObserved: string;
  chapterId: string;
}

export interface ChapterStageProgress {
  mediaCompleted: boolean;
  pretestCompleted: boolean;
  moduleCompleted: boolean;
  tugasCompleted: boolean;
  posttestCompleted: boolean;
}

export interface DraftTaskState {
  taskId: string;
  currentQuestionIndex: number;
  answers: Record<string, number | string>;
  flaggedIds: string[];
  startedAtMs: number;
}

export interface UserAccount {
  id: string;
  name: string;
  nim: string;
  email: string;
  password: string;
  program: string;
  semester: string;
}

