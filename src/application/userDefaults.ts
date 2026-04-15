import type { UserData } from '../domain/user';

export function createDefaultUser(email: string, name: string): UserData {
  return {
    email,
    name,
    stats: {
      dsa: { sessions: 0, progress: 0 },
      hr: { sessions: 0, progress: 0 },
      dev: { sessions: 0, progress: 0 },
    },
    history: [],
    streak: 0,
    skills: [
      { label: 'OS & Networking', score: 0, color: '#3b82f6' },
      { label: 'Data Structures', score: 0, color: '#10b981' },
      { label: 'System Design', score: 0, color: '#f59e0b' },
      { label: 'Behavioral', score: 0, color: '#8b5cf6' },
    ],
  };
}

