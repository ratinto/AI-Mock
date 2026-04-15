import type { UserRepository } from '../../domain/ports/userRepository';
import type { KeyValueStorage } from '../storage/browserStorage';
import type { UserData } from '../../domain/user';

export type LocalStorageUserRepositoryConfig = {
  storageKey: string;
};

export class LocalStorageUserRepository implements UserRepository {
  private readonly storage: KeyValueStorage;
  private readonly config: LocalStorageUserRepositoryConfig;

  constructor(storage: KeyValueStorage, config: LocalStorageUserRepositoryConfig) {
    this.storage = storage;
    this.config = config;
  }

  getAll(): Record<string, UserData> {
    const raw = this.storage.getItem(this.config.storageKey);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Record<string, UserData>;
    } catch {
      return {};
    }
  }

  getByEmail(email: string): UserData | null {
    const all = this.getAll();
    return all[email] ?? null;
  }

  save(user: UserData): void {
    const all = this.getAll();
    all[user.email] = { ...user };
    this.storage.setItem(this.config.storageKey, JSON.stringify(all));
  }
}

