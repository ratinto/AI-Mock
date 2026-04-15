import type { SessionRepository } from '../../domain/ports/sessionRepository';
import type { UserRepository } from '../../domain/ports/userRepository';
import type { UserData } from '../../domain/user';
import { createDefaultUser } from '../userDefaults';

export type AuthUseCases = {
  loginByEmail: (email: string) => { ok: true; user: UserData } | { ok: false };
  signup: (email: string, name: string) => UserData;
  getCurrentUser: () => UserData | null;
  logout: () => void;
};

export function createAuthUseCases(deps: {
  users: UserRepository;
  session: SessionRepository;
}): AuthUseCases {
  const loginByEmail: AuthUseCases['loginByEmail'] = (email) => {
    const user = deps.users.getByEmail(email);
    if (!user) return { ok: false };
    deps.session.setCurrentUserEmail(email);
    return { ok: true, user };
  };

  const signup: AuthUseCases['signup'] = (email, name) => {
    const user = createDefaultUser(email, name);
    deps.users.save(user);
    deps.session.setCurrentUserEmail(email);
    return user;
  };

  const getCurrentUser: AuthUseCases['getCurrentUser'] = () => {
    const email = deps.session.getCurrentUserEmail();
    if (!email) return null;
    return deps.users.getByEmail(email);
  };

  const logout: AuthUseCases['logout'] = () => deps.session.clearCurrentUser();

  return { loginByEmail, signup, getCurrentUser, logout };
}

