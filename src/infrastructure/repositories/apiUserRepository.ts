/**
 * ApiUserRepository — Infrastructure Layer.
 *
 * Implements the UserRepository port using REST API calls to the backend.
 *
 * System Design Concepts:
 *
 *  1. REPOSITORY PATTERN (Remote):
 *     - Implements the same UserRepository port as localStorageUserRepository.
 *     - But instead of localStorage, it communicates with the backend API.
 *     - The application layer doesn't know (or care) which one is used.
 *
 *  2. ADAPTER PATTERN:
 *     - Adapts the REST API response format to the UserRepository interface.
 *     - Translates HTTP responses into domain objects.
 *
 *  3. DEPENDENCY INVERSION PRINCIPLE (DIP):
 *     - Use cases depend on the UserRepository PORT (interface).
 *     - This file provides the concrete API-backed implementation.
 *     - Swapping to a different backend requires only changing this file.
 *
 * Implements: UserRepository
 * @see ../../domain/ports/userRepository.ts
 */

import { getStoredUser } from '../../lib/api';
import type { UserRepository } from '../../domain/ports/userRepository';
import type { UserData } from '../../domain/user';

/**
 * Remote API implementation of UserRepository.
 * Stores user data in the backend PostgreSQL database via REST API.
 */
export class ApiUserRepository implements UserRepository {
  /**
   * Get all users — not applicable for remote repository.
   * Returns only the current user as a map.
   */
  getAll(): Record<string, UserData> {
    const user = getStoredUser();
    if (!user) return {};
    return { [user.email]: user };
  }

  /**
   * Get user by email.
   * Returns the cached user from sessionStorage if it matches.
   */
  getByEmail(email: string): UserData | null {
    const user = getStoredUser();
    if (user && user.email === email) return user;
    return null;
  }

  /**
   * Save/update a user.
   * For remote repository, this is a no-op since the API handles persistence.
   */
  save(_user: UserData): void {
    // Persistence is handled by API calls in the service layer.
    // The cached user in sessionStorage is updated by the API module.
  }
}
