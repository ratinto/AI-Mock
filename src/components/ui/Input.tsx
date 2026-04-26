import React, { useState } from 'react';

/**
 * Input — Reusable form input component.
 *
 * Design Principles:
 *  - SRP: Handles input rendering, label, validation feedback.
 *  - Encapsulation: Internal focus state is managed here, not leaked to parent.
 *  - Composition: Works with any form — login, signup, contact, settings.
 *
 * Features:
 *  - Floating label effect
 *  - Error state with message
 *  - Helper text
 *  - Optional icon
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? 'rgba(239, 68, 68, 0.5)'
    : isFocused
    ? 'rgba(99, 102, 241, 0.5)'
    : 'var(--border-glass)';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: error ? '#ef4444' : isFocused ? 'var(--accent-primary)' : 'var(--text-muted)',
    transition: 'color 0.2s ease',
    letterSpacing: '0.02em',
  };

  const inputWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '14px',
    border: `1px solid ${borderColor}`,
    background: 'rgba(255, 255, 255, 0.03)',
    transition: 'all 0.2s ease',
    boxShadow: isFocused ? `0 0 0 3px rgba(99, 102, 241, 0.1)` : 'none',
  };

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    width: '100%',
    ...style,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: error ? '#ef4444' : 'var(--text-muted)',
    marginTop: '2px',
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={inputWrapperStyle}>
        {icon && (
          <span style={{ color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
            {icon}
          </span>
        )}
        <input
          style={inputStyle}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </div>
      {(error || helperText) && (
        <span style={messageStyle}>{error || helperText}</span>
      )}
    </div>
  );
};

export default Input;
