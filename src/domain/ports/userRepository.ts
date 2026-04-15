import type { UserData } from '../user';

export interface UserRepository {
  getAll(): Record<string, UserData>;
  getByEmail(email: string): UserData | null;
  save(user: UserData): void;
}

