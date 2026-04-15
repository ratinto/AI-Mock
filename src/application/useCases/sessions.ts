import type { UserRepository } from '../../domain/ports/userRepository';
import type { HistoryItem, UserData } from '../../domain/user';

export type SessionTrack = 'dsa' | 'hr' | 'dev';

export type SessionUseCases = {
  addSession: (email: string, item: HistoryItem, track: SessionTrack) => void;
};

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

    deps.users.save(user as UserData);
  };

  return { addSession };
}

