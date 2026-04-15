import type { UserRepository } from '../../domain/ports/userRepository';
import type { HistoryItem, UserData } from '../../domain/user';

export type SessionTrack = 'dsa' | 'hr' | 'dev';

export type SessionUseCases = {
  addSession: (email: string, item: HistoryItem, track: SessionTrack) => void;
};

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isYesterday(d1: Date, today: Date): boolean {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(d1, yesterday);
}

function computeStreak(user: UserData): number {
  const today = new Date();

  if (!user.lastSessionDate) {
    // First ever session
    return 1;
  }

  const lastDate = new Date(user.lastSessionDate);

  if (isSameDay(lastDate, today)) {
    // Already practiced today — streak stays the same (at least 1)
    return Math.max(user.streak, 1);
  }

  if (isYesterday(lastDate, today)) {
    // Practiced yesterday — extend the streak
    return user.streak + 1;
  }

  // Gap > 1 day — reset streak
  return 1;
}

export function createSessionUseCases(deps: { users: UserRepository }): SessionUseCases {
  const addSession: SessionUseCases['addSession'] = (email, item, track) => {
    const user = deps.users.getByEmail(email);
    if (!user) return;

    user.history.unshift(item);
    user.stats[track].sessions += 1;

    const newProgress = Math.min(100, user.stats[track].progress + 15);
    user.stats[track].progress = newProgress;

    const skillIdx = Math.floor(Math.random() * user.skills.length);
    user.skills[skillIdx].score = Math.min(100, user.skills[skillIdx].score + 10);

    // --- Streak computation ---
    user.streak = computeStreak(user);
    user.lastSessionDate = new Date().toISOString().split('T')[0];

    deps.users.save(user as UserData);
  };

  return { addSession };
}
