import React from 'react';

/**
 * Button — Reusable button component following the Component Pattern.
 *
 * Design Principles:
 *  - SRP: Only handles button rendering + styling variants.
 *  - DRY: One component for all button needs across the app.
 *  - Open/Closed: Easily extensible with new variants without modifying existing ones.
 *
 * Variants:
 *  - primary:   Solid white button (main CTA)
 *  - secondary: Accent gradient button
 *  - outline:   Bordered glass button
 *  - ghost:     No border, subtle hover
 *  - danger:    Red destructive action
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#ffffff',
    color: '#000000',
    border: 'none',
  },
  secondary: {
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    color: '#ffffff',
    border: 'none',
  },
  outline: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    border: '1px solid var(--border-glass)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px' },
  md: { padding: '12px 24px', fontSize: '0.95rem', borderRadius: '14px' },
  lg: { padding: '16px 32px', fontSize: '1.05rem', borderRadius: '16px' },
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  style,
  ...rest
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled || isLoading ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    letterSpacing: '-0.01em',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button style={baseStyle} disabled={disabled || isLoading} {...rest}>
      {isLoading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
          }}
          className="spin-animation"
        />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
};

export default Button;
