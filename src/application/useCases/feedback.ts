import type { FeedbackRepository } from '../../domain/ports/feedbackRepository';
import type { Feedback, FeedbackCategory, FeedbackRating, FeedbackSummary } from '../../domain/feedback';

/**
 * Feedback Use Cases — Application Layer.
 *
 * This is the APPLICATION LAYER — it contains the business logic/rules
 * for the feedback feature. It sits between the UI (presentation) and
 * the Infrastructure (data access).
 *
 * System Design Concepts:
 *
 *  1. CLEAN ARCHITECTURE — APPLICATION LAYER:
 *     - Orchestrates domain objects and repository calls.
 *     - Contains business rules (e.g., validate before saving).
 *     - Depends on PORTS (interfaces), NOT concrete implementations.
 *
 *  2. USE CASE PATTERN:
 *     - Each function represents one user action (submit, view history, get summary).
 *     - SRP: Each use case does one thing.
 *
 *  3. DEPENDENCY INJECTION:
 *     - The repository is injected via the `deps` parameter.
 *     - This makes the use case testable — you can inject a mock repository.
 *
 * Notice: This file imports from `domain/ports/` (the interface),
 * never from `infrastructure/` (the implementation). That's DIP in action.
 */

export type FeedbackUseCases = {
  /** Submit new feedback — validates and persists */
  submitFeedback: (
    email: string,
    category: FeedbackCategory,
    rating: FeedbackRating,
    comment: string
  ) => Feedback;

  /** Get all feedback submitted by a specific user */
  getUserFeedback: (email: string) => Feedback[];

  /** Get aggregated feedback statistics */
  getFeedbackSummary: () => FeedbackSummary;
};

/** Simple unique ID generator for feedback entries */
let feedbackCounter = 0;
function generateFeedbackId(): string {
  feedbackCounter += 1;
  return `fb-${Date.now()}-${feedbackCounter}`;
}

export function createFeedbackUseCases(deps: {
  feedbackRepo: FeedbackRepository;
}): FeedbackUseCases {
  /**
   * submitFeedback — Core use case.
   *
   * Business rules applied here:
   *  1. Trim the comment (input sanitization)
   *  2. Generate a unique ID
   *  3. Timestamp the submission
   *  4. Persist via repository
   */
  const submitFeedback: FeedbackUseCases['submitFeedback'] = (
    email,
    category,
    rating,
    comment
  ) => {
    const feedback: Feedback = {
      id: generateFeedbackId(),
      userEmail: email,
      category,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    deps.feedbackRepo.save(feedback);
    return feedback;
  };

  /**
   * getUserFeedback — Retrieves feedback history for a user.
   */
  const getUserFeedback: FeedbackUseCases['getUserFeedback'] = (email) => {
    return deps.feedbackRepo.getByUser(email);
  };

  /**
   * getFeedbackSummary — Aggregates all feedback into stats.
   *
   * Business logic: calculates average rating and count per category.
   * This logic belongs in the Application layer, NOT in the repository.
   */
  const getFeedbackSummary: FeedbackUseCases['getFeedbackSummary'] = () => {
    const all = deps.feedbackRepo.getAll();

    const totalCount = all.length;
    const averageRating =
      totalCount > 0 ? all.reduce((sum, f) => sum + f.rating, 0) / totalCount : 0;

    const byCategory: FeedbackSummary['byCategory'] = {
      interview: 0,
      resume: 0,
      persona: 0,
      general: 0,
    };

    for (const f of all) {
      byCategory[f.category] += 1;
    }

    return { totalCount, averageRating, byCategory };
  };

  return { submitFeedback, getUserFeedback, getFeedbackSummary };
}
