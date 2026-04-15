import type { UserRepository } from '../../domain/ports/userRepository';
import type { UserData } from '../../domain/user';

export type UserProfileUseCases = {
  updateUser: (email: string, updates: Partial<UserData>) => UserData | null;
};

export function createUserProfileUseCases(deps: { users: UserRepository }): UserProfileUseCases {
  const updateUser: UserProfileUseCases['updateUser'] = (email, updates) => {
    const existing = deps.users.getByEmail(email);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    deps.users.save(updated);
    return updated;
  };

  return { updateUser };
}

