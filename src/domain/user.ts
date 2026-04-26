export interface UserStats {
  sessions: number;
  progress: number;
}

export interface HistoryItem {
  id: string;
  role: string;
  date: string;
  score: string;
  type: string;
  report?: SessionReport;
}

export interface ResumeData {
  fileName: string;
  extractedText: string;
  skills: string[];
  experiences: string[];
  focusAreas: string[];
  parsedAt: string;
}

export interface InterviewConfig {
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'DSA' | 'System Design' | 'HR / Behavioral' | 'Case Study' | 'Mixed';
  personaStyle: string;
  jobDescription?: string;
  timePressure: boolean;
  peerMode: boolean;
}

export interface QuestionAnalysis {
  question: string;
  userAnswer: string;
  idealAnswer: string;
  followUp?: string;
  score: number;
  communication: number;
  confidence: number;
  conciseness: number;
  fillerWords: number;
  speakingPaceWpm: number;
  bodyLanguageScore: number;
  finishedInTime: boolean;
}

export interface SessionReport {
  id: string;
  date: string;
  config: InterviewConfig;
  overall: number;
  technicalKnowledge: number;
  communication: number;
  problemSolving: number;
  confidence: number;
  conciseness: number;
  bodyLanguage: number;
  questionAnalyses: QuestionAnalysis[];
  strengths: string[];
  improvements: string[];
}

export interface UserData {
  email: string;
  name: string;
  password?: string;
  stats: {
    dsa: UserStats;
    hr: UserStats;
    dev: UserStats;
  };
  history: HistoryItem[];
  streak: number;
  lastSessionDate?: string;
  selectedPersona?: string;
  resumeData?: ResumeData;
  skills: { label: string; score: number; color: string }[];
}

