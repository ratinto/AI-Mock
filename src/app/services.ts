/**
 * Services Composition Root — Application Entry Point.
 *
 * This is the COMPOSITION ROOT for the frontend — the single place where
 * all dependencies are wired together using Dependency Injection.
 *
 * System Design Concepts:
 *
 *  1. COMPOSITION ROOT PATTERN:
 *     - All DI wiring happens HERE, in one place.
 *     - Repositories are instantiated first (infrastructure).
 *     - Use cases receive repositories via constructor/parameter injection.
 *     - The returned `services` object is the DI container.
 *
 *  2. DEPENDENCY INVERSION PRINCIPLE (DIP):
 *     - Use cases depend on PORT interfaces (UserRepository, SessionRepository).
 *     - This file resolves ports to concrete implementations
 *       (ApiUserRepository, ApiSessionRepository).
 *
 *  3. FACTORY PATTERN:
 *     - `createServices()` is a factory that produces a fully wired service container.
 *     - Called once in ServicesProvider, shared via React Context.
 *
 *  4. SEPARATION OF CONCERNS:
 *     - Auth service: authentication and session management.
 *     - Sessions service: interview session recording.
 *     - Profile service: user profile updates.
 *     - Feedback service: feedback submission (Clean Architecture example).
 *
 * Dependency Flow:
 *   UI Components → Services (this file) → Use Cases → Ports ← Repositories
 */

import type { HistoryItem, UserData } from '../domain/user';
import { api, clearAuthStorage, getStoredUser } from '../lib/api';

// --- Clean Architecture: Feedback Module (fully wired) ---
import { createFeedbackUseCases } from '../application/useCases/feedback';
import { LocalStorageFeedbackRepository } from '../infrastructure/repositories/localStorageFeedbackRepository';
import { browserLocalStorage } from '../infrastructure/storage/browserStorage';

/**
 * Create the application's service container.
 *
 * This function is the Composition Root — it:
 *  1. Creates infrastructure implementations (repositories).
 *  2. Injects them into application use cases.
 *  3. Returns a unified service interface for the UI layer.
 *
 * @returns {Services} The fully wired service container
 */
export function createServices() {
  // ========================================================
  // AUTH SERVICE
  // ========================================================
  // Handles authentication flows: email login, Google OAuth, signup.
  // Uses the API module (infrastructure) for backend communication.
  const auth = {
    /**
     * Login with email and password.
     * Delegates to backend API, which handles password verification.
     */
    loginByEmail: async (email: string, password: string) => {
      const user = await api.login(email.trim().toLowerCase(), password);
      return { ok: true as const, user };
    },

    /**
     * Login with Google OAuth credential.
     * Backend verifies the Google token and creates/finds the user.
     */
    loginWithGoogle: async (credential: string) => {
      const user = await api.googleLogin(credential);
      return { ok: true as const, user };
    },

    /**
     * Register a new user account.
     * Backend handles duplicate checking and password hashing.
     */
    signup: async (email: string, name: string, password: string) => {
      return api.signup(email.trim().toLowerCase(), name.trim(), password);
    },

    /**
     * Get the currently authenticated user from session cache.
     * Returns null if not logged in.
     */
    getCurrentUser: (): UserData | null => getStoredUser(),

    /**
     * Hydrate user data from the backend.
     * Refreshes the cached user with the latest data from the server.
     * Falls back to cached data if the API call fails.
     */
    hydrateCurrentUser: async (): Promise<UserData | null> => {
      try {
        return await api.me();
      } catch {
        return getStoredUser();
      }
    },

    /**
     * Logout the current user.
     * Clears all session state and cached data.
     */
    logout: () => {
      clearAuthStorage();
      sessionStorage.removeItem('antriview_view');
      sessionStorage.removeItem('antriview_dash_view');
    },
  };

  // ========================================================
  // SESSIONS SERVICE
  // ========================================================
  // Records completed interview sessions to the backend.
  const sessions = {
    /**
     * Add a completed interview session.
     * Sends session data to the backend which updates stats, streak, and skills.
     */
    addSession: async (email: string, item: HistoryItem, track: 'dsa' | 'hr' | 'dev') => {
      const user = getStoredUser();
      if (!user || user.email !== email) return;
      await api.addSession(item, track);
    },
  };

  // ========================================================
  // PROFILE SERVICE
  // ========================================================
  // Handles user profile updates.
  const profile = {
    /**
     * Update user profile data.
     * Sends partial updates to the backend PATCH endpoint.
     */
    updateUser: async (email: string, updates: Partial<UserData> & { password?: string }) => {
      const user = getStoredUser();
      if (!user || user.email !== email) return null;
      return api.updateMe(updates);
    },
  };

  // ========================================================
  // FEEDBACK SERVICE (Clean Architecture — Full DI Example)
  // ========================================================
  // This module demonstrates the complete Clean Architecture pattern:
  //   Domain (feedback.ts) → Port (FeedbackRepository) → Use Cases → Infrastructure
  //
  // Repository: concrete localStorage implementation (Adapter pattern)
  const feedbackRepo = new LocalStorageFeedbackRepository(browserLocalStorage, {
    storageKey: 'antriview_feedback',
  });
  // Use Cases: business logic, depends on the repository PORT (DIP)
  const feedback = createFeedbackUseCases({ feedbackRepo });

  return { auth, sessions, profile, feedback } as const;
}

/** TypeScript type for the service container */
export type Services = ReturnType<typeof createServices>;
