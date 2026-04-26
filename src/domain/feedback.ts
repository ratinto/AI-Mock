/**
 * Feedback Domain Model
 *
 * This is the DOMAIN LAYER — the innermost circle of Clean Architecture.
 * Domain types have ZERO dependencies on external libraries, UI, or infrastructure.
 * They represent pure business concepts.
 *
 * System Design Concepts:
 *  - Clean Architecture: Domain is at the center, depends on nothing.
 *  - Domain-Driven Design (DDD): Models real-world concept of "user feedback."
 *  - SRP: Only defines data shapes — no behavior, no side effects.
 *
 * Use Case: After completing an interview or using a feature, users can
 * submit feedback (rating + comment) to help improve the platform.
 */

/** The category of feature being reviewed */
export type FeedbackCategory = 'interview' | 'resume' | 'persona' | 'general';

/** Star-based rating */
export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

/** A single feedback submission */
export interface Feedback {
  /** Unique identifier */
  id: string;
  /** Email of the user who submitted */
  userEmail: string;
  /** Which feature is this feedback about */
  category: FeedbackCategory;
  /** 1-5 star rating */
  rating: FeedbackRating;
  /** Optional written comment */
  comment: string;
  /** ISO date string of submission */
  createdAt: string;
}

/** Summary statistics for feedback (aggregated view) */
export interface FeedbackSummary {
  totalCount: number;
  averageRating: number;
  byCategory: Record<FeedbackCategory, number>;
}
