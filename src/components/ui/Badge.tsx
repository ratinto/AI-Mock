import React from 'react';

/**
 * Badge — Status indicator component.
 *
 * Design Principles:
 *  - SRP: Only renders a small status badge.
 *  - DRY: Replaces the repeated inline badge-status patterns.
 *
 * Use Cases: interview status (completed, pending), skill level, track labels.
 */

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: React.CSSProperties;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-glass)',
  },
  success: {
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.25)',
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.12)',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.25)',
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.25)',
  },
  info: {
    background: 'rgba(59, 130, 246, 0.12)',
    color: '#3b82f6',
    border: '1px solid rgba(59, 130, 246, 0.25)',
  },
  accent: {
    background: 'rgba(99, 102, 241, 0.12)',
    color: '#6366f1',
    border: '1px solid rgba(99, 102, 241, 0.25)',
  },
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', style }) => {
  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    ...variantStyles[variant],
    ...style,
  };

  return <span style={badgeStyle}>{children}</span>;
};

export default Badge;
