import type { FeedbackRepository } from '../../domain/ports/feedbackRepository';
import type { KeyValueStorage } from '../storage/browserStorage';
import type { Feedback } from '../../domain/feedback';

/**
 * LocalStorageFeedbackRepository — Infrastructure Layer Implementation.
 *
 * This is the INFRASTRUCTURE LAYER — the outermost circle of Clean Architecture.
 * It provides a CONCRETE implementation of the FeedbackRepository port.
 *
 * System Design Concepts:
 *
 *  1. REPOSITORY PATTERN (concrete):
 *     - Implements the FeedbackRepository interface (port).
 *     - Encapsulates all localStorage access logic.
 *     - The rest of the app never touches localStorage directly for feedback.
 *
 *  2. DEPENDENCY INVERSION (implementation side):
 *     - This class IMPLEMENTS the interface defined in the domain layer.
 *     - It depends "upward" toward the domain — following the Dependency Rule.
 *
 *  3. ADAPTER PATTERN:
 *     - Adapts the browser's localStorage API to our FeedbackRepository interface.
 *     - If you switch to IndexedDB or a REST API, you write a new adapter.
 *     - No changes needed in domain or application layers.
 *
 * Configuration is injected via constructor (storageKey), making it flexible.
 */

export type LocalStorageFeedbackRepositoryConfig = {
  storageKey: string;
};

export class LocalStorageFeedbackRepository implements FeedbackRepository {
  private readonly storage: KeyValueStorage;
  private readonly config: LocalStorageFeedbackRepositoryConfig;

  constructor(storage: KeyValueStorage, config: LocalStorageFeedbackRepositoryConfig) {
    this.storage = storage;
    this.config = config;
  }

  /** Read all feedback from storage */
  private readAll(): Feedback[] {
    const raw = this.storage.getItem(this.config.storageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Feedback[];
    } catch {
      return [];
    }
  }

  /** Write all feedback to storage */
  private writeAll(feedbacks: Feedback[]): void {
    this.storage.setItem(this.config.storageKey, JSON.stringify(feedbacks));
  }

  save(feedback: Feedback): void {
    const all = this.readAll();
    all.push(feedback);
    this.writeAll(all);
  }

  getAll(): Feedback[] {
    return this.readAll();
  }

  getByUser(email: string): Feedback[] {
    return this.readAll().filter((f) => f.userEmail === email);
  }

  getByCategory(category: string): Feedback[] {
    return this.readAll().filter((f) => f.category === category);
  }
}
