/**
 * UI Component Library — Barrel Export
 *
 * This module re-exports all reusable UI primitives from a single entry point.
 * Other components can import them as:
 *
 *   import { Button, Card, Input, Badge, Spinner, Modal } from '../ui';
 *
 * Design Pattern: Façade Pattern — provides a simplified, unified interface
 * to the set of UI components, hiding individual file structure.
 */

export { default as Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as Card } from './Card';
export type { CardProps } from './Card';

export { default as Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';

export { default as Spinner } from './Spinner';
export type { SpinnerProps, SpinnerSize } from './Spinner';

export { default as Modal } from './Modal';
export type { ModalProps } from './Modal';
