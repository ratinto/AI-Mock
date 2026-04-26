import type { HistoryItem, UserData } from '../domain/user';
import { api, clearAuthStorage, getStoredUser } from '../lib/api';

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

  return { auth, sessions, profile } as const;
}

export type Services = ReturnType<typeof createServices>;

