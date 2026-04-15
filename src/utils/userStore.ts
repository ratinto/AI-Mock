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

const STORAGE_KEY = 'antriview_user_db';
const SESSION_KEY = 'antriview_current_user';

export const UserStore = {
  // Get all users from localStorage
  getAllUsers: (): Record<string, UserData> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Save/Update a user
  saveUser: (user: UserData) => {
    const users = UserStore.getAllUsers();
    users[user.email] = { ...user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  updateUser: (email: string, updates: Partial<UserData>) => {
    const user = UserStore.getUser(email);
    if (user) {
      const updatedUser = { ...user, ...updates };
      UserStore.saveUser(updatedUser);
      return updatedUser;
    }
    return null;
  },

  // Get a specific user by email
  getUser: (email: string): UserData | null => {
    const users = UserStore.getAllUsers();
    return users[email] || null;
  },

  // Create a new user with default stats
  createUser: (email: string, name: string): UserData => {
    const newUser: UserData = {
      email,
      name,
      stats: {
        dsa: { sessions: 0, progress: 0 },
        hr: { sessions: 0, progress: 0 },
        dev: { sessions: 0, progress: 0 }
      },
      history: [],
      streak: 0,
      skills: [
        { label: 'OS & Networking', score: 0, color: '#3b82f6' },
        { label: 'Data Structures', score: 0, color: '#10b981' },
        { label: 'System Design', score: 0, color: '#f59e0b' },
        { label: 'Behavioral', score: 0, color: '#8b5cf6' }
      ]
    };
    UserStore.saveUser(newUser);
    return newUser;
  },

  // Session Management
  setCurrentUser: (email: string) => {
    sessionStorage.setItem(SESSION_KEY, email);
  },

  getCurrentUser: (): UserData | null => {
    const email = sessionStorage.getItem(SESSION_KEY);
    if (!email) return null;
    return UserStore.getUser(email);
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('antriview_view');
    sessionStorage.removeItem('antriview_dash_view');
  },

  // Update stats after a session
  addSession: (email: string, item: HistoryItem, track: 'dsa' | 'hr' | 'dev') => {
    const user = UserStore.getUser(email);
    if (user) {
      user.history.unshift(item);
      user.stats[track].sessions += 1;
      
      // Basic progress simulation logic
      const newProgress = Math.min(100, user.stats[track].progress + 15);
      user.stats[track].progress = newProgress;
      
      // Update a random skill for mock feedback
      const skillIdx = Math.floor(Math.random() * user.skills.length);
      user.skills[skillIdx].score = Math.min(100, user.skills[skillIdx].score + 10);
      
      UserStore.saveUser(user);
    }
  }
};
