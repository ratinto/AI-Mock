/**
 * Notification Domain Model
 *
 * This file defines the core data types for the notification/toast system.
 * Following Clean Architecture, domain types live at the center
 * and have NO dependencies on infrastructure or UI.
 *
 * System Design Concept:
 *  - Domain-Driven Design (DDD): Types represent the business concept of a "notification."
 *  - SRP: This file only defines data shapes, no behavior.
 */

/** Severity level of the notification */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/** A notification message to display to the user */
export interface Notification {
  /** Unique identifier */
  id: string;
  /** The type determines color and icon */
  type: NotificationType;
  /** Title text (bold) */
  title: string;
  /** Optional longer description */
  message?: string;
  /** Auto-dismiss duration in ms (default: 4000). Set to 0 for persistent. */
  duration?: number;
}
