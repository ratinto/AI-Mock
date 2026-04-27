import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NotFound — 404 Page Component.
 *
 * System Design Concepts:
 *
 *  1. GRACEFUL DEGRADATION:
 *     - When a user navigates to a non-existent route, they see a helpful
 *       page instead of a blank screen or an ugly default error.
 *
 *  2. USER EXPERIENCE (UX) RESILIENCE:
 *     - Provides clear guidance on how to recover (go home, go back).
 *     - Reduces user frustration and bounce rate.
 *
 *  3. ROUTING COMPLETENESS:
 *     - A catch-all route ensures every possible URL is handled.
 *     - No "dead ends" in the application navigation.
 */

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div className="animate-fade" style={styles.content}>
        {/* Large 404 number */}
        <div style={styles.errorNumber}>
          <span style={styles.four}>4</span>
          <span style={styles.zero}>0</span>
          <span style={styles.four}>4</span>
        </div>

        <h1 style={styles.title}>Page not found</h1>
        <p style={styles.description}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Action buttons */}
        <div style={styles.actions}>
          <button
            onClick={() => navigate('/')}
            style={styles.primaryButton}
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            style={styles.secondaryButton}
          >
            Go Back
          </button>
        </div>

        {/* Decorative dots */}
        <div style={styles.dots}>
          <div style={{ ...styles.dot, background: 'var(--accent-primary, #6366f1)' }} />
          <div style={{ ...styles.dot, background: 'var(--accent-secondary, #ec4899)' }} />
          <div style={{ ...styles.dot, background: '#10b981' }} />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-dark, #050505)',
    padding: '40px 20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
  },
  errorNumber: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  four: {
    fontSize: '8rem',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    lineHeight: 1,
    background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.3) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  zero: {
    fontSize: '8rem',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    lineHeight: 1,
    background: 'linear-gradient(135deg, var(--accent-primary, #6366f1), var(--accent-secondary, #ec4899))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#ffffff',
    marginBottom: '12px',
  },
  description: {
    color: 'var(--text-muted, #8e9093)',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '36px',
  },
  actions: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'center',
    marginBottom: '48px',
  },
  primaryButton: {
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '14px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    border: '1px solid var(--border-glass, rgba(255, 255, 255, 0.08))',
    padding: '12px 28px',
    borderRadius: '14px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    opacity: 0.4,
  },
};

export default NotFound;
