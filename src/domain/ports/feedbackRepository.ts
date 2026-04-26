import type { Feedback } from '../feedback';

/**
 * FeedbackRepository — Port (Interface) for feedback persistence.
 *
 * This is the PORT — an abstraction that sits between the Application layer
 * and the Infrastructure layer.
 *
 * System Design Concepts:
 *
 *  1. DEPENDENCY INVERSION PRINCIPLE (DIP — the "D" in SOLID):
 *     - The Application layer (use cases) depends on THIS interface, not on
 *       the concrete localStorage implementation.
 *     - The Infrastructure layer IMPLEMENTS this interface.
 *     - Both layers depend on the abstraction, not on each other.
 *
 *  2. REPOSITORY PATTERN:
 *     - Provides a collection-like interface for accessing domain objects.
 *     - Hides the storage mechanism (could be localStorage, REST API, IndexedDB).
 *
 *  3. INTERFACE SEGREGATION PRINCIPLE (ISP — the "I" in SOLID):
 *     - Small, focused interface with only the methods needed.
 *     - Not polluted with unrelated methods.
 *
 * If tomorrow you switch from localStorage to a real database,
 * you only change the Infrastructure implementation — NOT the use cases.
 */
export interface FeedbackRepository {
  /** Save a new feedback submission */
  save(feedback: Feedback): void;

  /** Get all feedback entries */
  getAll(): Feedback[];

  /** Get feedback filtered by user email */
  getByUser(email: string): Feedback[];

  /** Get feedback filtered by category */
  getByCategory(category: string): Feedback[];
}
