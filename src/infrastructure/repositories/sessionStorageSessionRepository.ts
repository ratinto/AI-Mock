import type { SessionRepository } from '../../domain/ports/sessionRepository';
import type { KeyValueStorage } from '../storage/browserStorage';

export type SessionStorageSessionRepositoryConfig = {
  sessionKey: string;
  additionalKeysToClear: string[];
};

export class SessionStorageSessionRepository implements SessionRepository {
  private readonly storage: KeyValueStorage;
  private readonly config: SessionStorageSessionRepositoryConfig;

  constructor(storage: KeyValueStorage, config: SessionStorageSessionRepositoryConfig) {
    this.storage = storage;
    this.config = config;
  }

  setCurrentUserEmail(email: string): void {
    this.storage.setItem(this.config.sessionKey, email);
  }

  getCurrentUserEmail(): string | null {
    return this.storage.getItem(this.config.sessionKey);
  }

  clearCurrentUser(): void {
    this.storage.removeItem(this.config.sessionKey);
    for (const k of this.config.additionalKeysToClear) this.storage.removeItem(k);
  }
}

