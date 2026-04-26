import type { HistoryItem, UserData } from '../domain/user';
import { api, clearAuthStorage, getStoredUser } from '../lib/api';
import { createFeedbackUseCases } from '../application/useCases/feedback';
import { LocalStorageFeedbackRepository } from '../infrastructure/repositories/localStorageFeedbackRepository';
import { browserLocalStorage } from '../infrastructure/storage/browserStorage';

/**
 * ARCHITECTURAL DEBT NOTICE (Frontend Clean Architecture):
 * 
 * 1. Persistence Layer Inconsistency:
 *    Currently, `services.ts` acts as a partial Composition Root, but relies on a mix of 
 *    remote API calls (`api.*`) and local storage (`getStoredUser()`, `sessionStorage`).
 *    In a strict Clean Architecture, this file should instantiate concrete repositories 
 *    (e.g., `RemoteUserRepository`, `LocalAuthTokenRepository`) that implement domain interfaces.
 * 
 * 2. Missing FeedbackRepository:
 *    Currently, feedback evaluation (Resume AI) and interview tracking either float 
 *    in UI components or directly hit the `api` singleton. We need to define a 
 *    `FeedbackRepository` interface in the domain layer and inject its implementation here.
 *    This will decouple the UI from knowing whether feedback is stored locally or remotely.
 * 
 * Future Refactoring Steps:
 * - Define standard Repository interfaces in `src/domain/ports/`.
 * - Move `lib/api.ts` into `src/infrastructure/apiClient.ts`.
 * - Inject repositories into Use Cases, rather than calling `api` directly from here.
 */
export function createServices() {
  const auth = {
    loginByEmail: async (email: string, password: string) => {
      const user = await api.login(email.trim().toLowerCase(), password);
      return { ok: true as const, user };
    },
    loginWithGoogle: async (credential: string) => {
      const user = await api.googleLogin(credential);
      return { ok: true as const, user };
    },
    signup: async (email: string, name: string, password: string) => {
      return api.signup(email.trim().toLowerCase(), name.trim(), password);
    },
    getCurrentUser: (): UserData | null => getStoredUser(),
    hydrateCurrentUser: async (): Promise<UserData | null> => {
      try {
        return await api.me();
      } catch {
        return getStoredUser();
      }
    },
    logout: () => {
      clearAuthStorage();
      sessionStorage.removeItem('antriview_view');
      sessionStorage.removeItem('antriview_dash_view');
    },
  };

  const sessions = {
    addSession: async (email: string, item: HistoryItem, track: 'dsa' | 'hr' | 'dev') => {
      const user = getStoredUser();
      if (!user || user.email !== email) return;
      await api.addSession(item, track);
    },
  };

  const profile = {
    updateUser: async (email: string, updates: Partial<UserData> & { password?: string }) => {
      const user = getStoredUser();
      if (!user || user.email !== email) return null;
      return api.updateMe(updates);
    },
  };

  // --- Feedback Module (Clean Architecture composition) ---
  // Repository: concrete localStorage implementation
  const feedbackRepo = new LocalStorageFeedbackRepository(browserLocalStorage, {
    storageKey: 'antriview_feedback',
  });
  // Use Cases: business logic, depends on the repository PORT (interface)
  const feedback = createFeedbackUseCases({ feedbackRepo });

  return { auth, sessions, profile, feedback } as const;
}

export type Services = ReturnType<typeof createServices>;

