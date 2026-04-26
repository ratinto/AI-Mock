/**
 * ApiSessionRepository — Infrastructure Layer.
 *
 * Implements the SessionRepository port using the browser's sessionStorage.
 * This manages the current user's authentication session state.
 *
 * System Design Concepts:
 *
 *  1. REPOSITORY PATTERN:
 *     - Implements the SessionRepository port for auth state management.
 *     - Uses sessionStorage for the current browser session.
 *
 *  2. ADAPTER PATTERN:
 *     - Adapts browser sessionStorage API to the SessionRepository interface.
 *
 * Implements: SessionRepository
 * @see ../../domain/ports/sessionRepository.ts
 */

import type { SessionRepository } from '../../domain/ports/sessionRepository';

/**
 * SessionStorage-backed implementation of SessionRepository.
 * Manages which user is currently authenticated in the browser.
 */
export class ApiSessionRepository implements SessionRepository {
  private readonly storageKey = 'antriview_current_user';

  setCurrentUserEmail(email: string): void {
    sessionStorage.setItem(this.storageKey, email);
  }

  getCurrentUserEmail(): string | null {
    return sessionStorage.getItem(this.storageKey);
  }

  clearCurrentUser(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
