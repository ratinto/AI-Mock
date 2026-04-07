import { createAuthUseCases } from '../application/useCases/auth';
import { createSessionUseCases } from '../application/useCases/sessions';
import { createUserProfileUseCases } from '../application/useCases/userProfile';
import { browserLocalStorage, browserSessionStorage } from '../infrastructure/storage/browserStorage';
import { LocalStorageUserRepository } from '../infrastructure/repositories/localStorageUserRepository';
import { SessionStorageSessionRepository } from '../infrastructure/repositories/sessionStorageSessionRepository';

export function createServices() {
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

  return { auth, sessions, profile } as const;
}

export type Services = ReturnType<typeof createServices>;

