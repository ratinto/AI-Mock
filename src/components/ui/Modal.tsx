import React, { useEffect, useCallback } from 'react';

/**
 * Modal — Reusable dialog/overlay component.
 *
 * Design Principles:
 *  - SRP: Manages overlay + centered content + close behavior.
 *  - Composition: Accepts any children to display inside.
 *  - Encapsulation: Handles Escape key and backdrop click internally.
 *
 * Features:
 *  - Backdrop blur overlay
 *  - Fade-in animation
 *  - Close on Escape key
 *  - Close on backdrop click
 *  - Configurable width
 */

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '520px',
}) => {
  // Escape key handler — encapsulated inside the component
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.25s ease forwards',
  };

  const contentStyle: React.CSSProperties = {
    background: '#0a0a0a',
    border: '1px solid var(--border-glass)',
    borderRadius: '24px',
    padding: '32px',
    maxWidth,
    width: '90%',
    maxHeight: '85vh',
    overflowY: 'auto',
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={contentStyle}
        className="animate-fade"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
      >
        {title && (
          <div style={headerStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <button
              style={closeButtonStyle}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
