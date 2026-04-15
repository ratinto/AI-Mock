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
}

export interface ResumeData {
  fileName: string;
  extractedText: string;
  skills: string[];
  experiences: string[];
  focusAreas: string[];
  parsedAt: string;
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

