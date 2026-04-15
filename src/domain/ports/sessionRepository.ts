export interface SessionRepository {
  setCurrentUserEmail(email: string): void;
  getCurrentUserEmail(): string | null;
  clearCurrentUser(): void;
}

