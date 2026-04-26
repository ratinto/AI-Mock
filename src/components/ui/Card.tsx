import React from 'react';

/**
 * Card — Reusable glassmorphism card component.
 *
 * Design Principles:
 *  - DRY: Centralizes the glass card styling used across Dashboard, PersonaLab, History, etc.
 *  - Composition: Accepts any children — highly composable.
 *  - SRP: Only responsible for card container styling.
 *
 * Features:
 *  - Glass effect with blur
 *  - Hover animation
 *  - Optional glow accent color
 *  - Optional onClick for clickable cards
 */

export interface CardProps {
  children: React.ReactNode;
  glowColor?: string;
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  glowColor,
  hoverable = true,
  onClick,
  style,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle: React.CSSProperties = {
    background: glowColor
      ? `radial-gradient(circle at top right, ${glowColor}15, transparent), var(--bg-card)`
      : 'var(--bg-card)',
    border: `1px solid ${
      isHovered && hoverable ? 'rgba(255, 255, 255, 0.15)' : 'var(--border-glass)'
    }`,
    borderRadius: '24px',
    padding: '28px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    transform: isHovered && hoverable ? 'translateY(-2px)' : 'none',
    boxShadow:
      isHovered && hoverable
        ? `0 12px 40px rgba(0, 0, 0, 0.3)${
            glowColor ? `, 0 4px 20px ${glowColor}10` : ''
          }`
        : 'none',
    ...style,
  };

  return (
    <div
      className={className}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default Card;
