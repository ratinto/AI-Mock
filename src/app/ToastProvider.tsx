import React, { createContext, useCallback, useContext, useState } from 'react';
import type { Notification, NotificationType } from '../domain/notification';
import Toast from '../components/ui/Toast';

/**
 * ToastProvider — Centralized notification management using Observer Pattern.
 *
 * System Design Concepts:
 *
 *  1. OBSERVER PATTERN:
 *     - Any component calls `toast.success("Done!")` → this is the "publish" step.
 *     - ToastProvider listens (observes) and renders the notification → "subscribe" step.
 *     - Components don't know about each other — they're fully decoupled.
 *
 *  2. DEPENDENCY INJECTION (DI):
 *     - The `toast` function is injected via React Context (like a DI container).
 *     - Components don't create their own toast logic; they receive it from the provider.
 *     - This matches the DIP (Dependency Inversion Principle) from SOLID.
 *
 *  3. EVENT-DRIVEN ARCHITECTURE:
 *     - Notifications are events — fire and forget. The publisher doesn't wait for a response.
 *
 * Usage in any component:
 *   const toast = useToast();
 *   toast.success('Interview saved!');
 *   toast.error('Something went wrong', 'Please try again.');
 */

/** The interface that components receive via Context (DI) */
interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Simple unique ID generator */
let toastCounter = 0;
function generateId(): string {
  toastCounter += 1;
  return `toast-${Date.now()}-${toastCounter}`;
}

/** Maximum number of visible toasts at once */
const MAX_TOASTS = 5;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /** Core add function — creates a notification and adds it to the list */
  const addNotification = useCallback((type: NotificationType, title: string, message?: string) => {
    const newNotification: Notification = {
      id: generateId(),
      type,
      title,
      message,
      duration: 4000,
    };

    setNotifications((prev) => {
      // Keep only the latest MAX_TOASTS notifications (queue behavior)
      const updated = [...prev, newNotification];
      return updated.slice(-MAX_TOASTS);
    });
  }, []);

  /** Dismiss a notification by ID */
  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /** Convenience methods — one for each notification type */
  const contextValue: ToastContextValue = {
    success: useCallback((title, message) => addNotification('success', title, message), [addNotification]),
    error: useCallback((title, message) => addNotification('error', title, message), [addNotification]),
    warning: useCallback((title, message) => addNotification('warning', title, message), [addNotification]),
    info: useCallback((title, message) => addNotification('info', title, message), [addNotification]),
    dismiss,
  };

  /** Toast container — fixed at top-right of viewport */
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    pointerEvents: 'none',
  };

  const itemStyle: React.CSSProperties = {
    pointerEvents: 'auto',
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Render active toasts */}
      {notifications.length > 0 && (
        <div style={containerStyle}>
          {notifications.map((n) => (
            <div key={n.id} style={itemStyle}>
              <Toast notification={n} onDismiss={dismiss} />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

/**
 * useToast — Hook to access the toast notification system.
 *
 * This is the Dependency Injection point — components call this hook
 * to get the toast functions without knowing about the implementation.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>. Wrap your app in ToastProvider.');
  }
  return ctx;
}
