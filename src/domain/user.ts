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
  skills: { label: string; score: number; color: string }[];
}

