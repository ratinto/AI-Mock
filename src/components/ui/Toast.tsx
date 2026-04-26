import React, { useEffect, useState } from 'react';
import type { Notification, NotificationType } from '../../domain/notification';

/**
 * Toast — Individual toast notification component.
 *
 * Design Principles:
 *  - SRP: Only responsible for rendering a single notification.
 *  - Encapsulation: Auto-dismiss timer is managed internally.
 *
 * Features:
 *  - Color-coded by type (success/error/warning/info)
 *  - Auto-dismiss with progress bar
 *  - Manual dismiss button
 *  - Slide-in animation
 */

interface ToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

/** Color mapping for each notification type */
const typeConfig: Record<NotificationType, { color: string; bgColor: string; icon: string }> = {
  success: {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
    icon: '✓',
  },
  error: {
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.08)',
    icon: '✕',
  },
  warning: {
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    icon: '⚠',
  },
  info: {
    color: '#6366f1',
    bgColor: 'rgba(99, 102, 241, 0.08)',
    icon: 'ℹ',
  },
};

const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
  const { id, type, title, message, duration = 4000 } = notification;
  const config = typeConfig[type];
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  // Auto-dismiss timer with progress bar
  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsExiting(true);
        setTimeout(() => onDismiss(id), 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '16px 20px',
    borderRadius: '16px',
    background: config.bgColor,
    border: `1px solid ${config.color}25`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    minWidth: '320px',
    maxWidth: '420px',
    position: 'relative',
    overflow: 'hidden',
    animation: isExiting
      ? 'toastSlideOut 0.3s ease forwards'
      : 'toastSlideIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${config.color}10`,
  };

  const iconStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '10px',
    background: `${config.color}20`,
    color: config.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 700,
    flexShrink: 0,
  };

  const closeStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '1rem',
    lineHeight: 1,
    opacity: 0.6,
    transition: 'opacity 0.2s',
    flexShrink: 0,
  };

  const progressBarStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    width: `${progress}%`,
    background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
    borderRadius: '0 0 16px 16px',
    transition: 'width 0.05s linear',
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>{config.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: message ? '4px' : 0 }}>
          {title}
        </div>
        {message && (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {message}
          </div>
        )}
      </div>
      <button style={closeStyle} onClick={handleDismiss} aria-label="Dismiss">
        ✕
      </button>
      {duration > 0 && <div style={progressBarStyle} />}
    </div>
  );
};

export default Toast;
