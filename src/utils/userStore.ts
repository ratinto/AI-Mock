// Backwards-compatible facade for existing imports.
// New code should depend on application use-cases (via `useServices()`).

import type { HistoryItem, UserData } from '../domain/user';
import { createAuthUseCases } from '../application/useCases/auth';
import { createSessionUseCases } from '../application/useCases/sessions';
import { createUserProfileUseCases } from '../application/useCases/userProfile';
import { LocalStorageUserRepository } from '../infrastructure/repositories/localStorageUserRepository';
import { SessionStorageSessionRepository } from '../infrastructure/repositories/sessionStorageSessionRepository';
import { browserLocalStorage, browserSessionStorage } from '../infrastructure/storage/browserStorage';

export type { HistoryItem, UserData };

const usersRepo = new LocalStorageUserRepository(browserLocalStorage, {
  storageKey: 'antriview_user_db',
});

const sessionRepo = new SessionStorageSessionRepository(browserSessionStorage, {
  sessionKey: 'antriview_current_user',
  additionalKeysToClear: ['antriview_view', 'antriview_dash_view'],
});

const auth = createAuthUseCases({ users: usersRepo, session: sessionRepo });
const sessions = createSessionUseCases({ users: usersRepo });
const profile = createUserProfileUseCases({ users: usersRepo });

export const UserStore = {
  getAllUsers: (): Record<string, UserData> => usersRepo.getAll(),
  saveUser: (user: UserData) => usersRepo.save(user),
  getUser: (email: string): UserData | null => usersRepo.getByEmail(email),
  updateUser: (email: string, updates: Partial<UserData>) => profile.updateUser(email, updates),
  createUser: (email: string, name: string): UserData => auth.signup(email, name),
  setCurrentUser: (email: string) => {
    // Preserve legacy behavior: it sets session if user exists.
    auth.loginByEmail(email);
  },
  getCurrentUser: (): UserData | null => auth.getCurrentUser(),
  logout: () => auth.logout(),
  addSession: (email: string, item: HistoryItem, track: 'dsa' | 'hr' | 'dev') =>
    sessions.addSession(email, item, track),
};
