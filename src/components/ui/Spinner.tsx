import React from 'react';

/**
 * Spinner — Loading indicator component.
 *
 * Design Principles:
 *  - SRP: Only handles loading animation rendering.
 *  - Reuse: Consistent loading experience throughout the app.
 *
 * Features:
 *  - Gradient spinning ring
 *  - Size variants
 *  - Optional label
 */

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  style?: React.CSSProperties;
}

const sizeDimensions: Record<SpinnerSize, number> = {
  sm: 20,
  md: 32,
  lg: 48,
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label, style }) => {
  const dim = sizeDimensions[size];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    ...style,
  };

  const spinnerStyle: React.CSSProperties = {
    width: `${dim}px`,
    height: `${dim}px`,
    border: `3px solid rgba(255, 255, 255, 0.08)`,
    borderTopColor: 'var(--accent-primary)',
    borderRadius: '50%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      <div className="spin-animation" style={spinnerStyle} />
      {label && <span style={labelStyle}>{label}</span>}
    </div>
  );
};

export default Spinner;
