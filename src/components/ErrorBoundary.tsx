import React, { Component } from 'react';

/**
 * ErrorBoundary — Catches JavaScript errors in the component tree.
 *
 * System Design Concepts:
 *
 *  1. FAULT TOLERANCE:
 *     - Instead of the entire app crashing with a white screen,
 *       ErrorBoundary catches the error and shows a friendly fallback UI.
 *     - The rest of the app remains functional.
 *
 *  2. GRACEFUL DEGRADATION:
 *     - When a component fails, the system "degrades gracefully" —
 *       it continues to work with reduced functionality rather than failing completely.
 *
 *  3. SEPARATION OF CONCERNS:
 *     - Error handling logic is separated from business logic.
 *     - Components don't need to handle their own crash recovery.
 *
 *  4. SINGLE RESPONSIBILITY PRINCIPLE:
 *     - This component ONLY handles error catching and recovery.
 *
 * Usage:
 *   Wrap any part of the component tree:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 * Note: Error boundaries only catch errors during rendering, in lifecycle methods,
 * and in constructors. They do NOT catch errors in event handlers or async code.
 */

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: '',
    };
  }

  /**
   * Lifecycle method — called when a descendant component throws an error.
   * Updates state so the next render shows the fallback UI.
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method — called after an error is caught.
   * Used for logging the error details.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, or a custom logging API.
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    this.setState({
      errorInfo: errorInfo.componentStack || '',
    });
  }

  /** Reset the error state — allows the user to try again */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: '',
    });
  };

  /** Navigate to home page */
  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content} className="animate-fade">
            {/* Error Icon */}
            <div style={styles.iconWrapper}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#errorGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.description}>
              An unexpected error occurred in the application.
              Don't worry — your data is safe.
            </p>

            {/* Error details (collapsible) */}
            {this.state.error && (
              <div style={styles.errorBox}>
                <code style={styles.errorCode}>
                  {this.state.error.message}
                </code>
              </div>
            )}

            {/* Action buttons */}
            <div style={styles.actions}>
              <button
                onClick={this.handleReset}
                style={styles.primaryButton}
              >
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                style={styles.secondaryButton}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Styles for the error fallback UI */
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
    maxWidth: '480px',
  },
  iconWrapper: {
    width: '88px',
    height: '88px',
    borderRadius: '24px',
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#ffffff',
    marginBottom: '12px',
    background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  description: {
    color: 'var(--text-muted, #8e9093)',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.06)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '14px',
    padding: '16px 20px',
    marginBottom: '32px',
    textAlign: 'left',
  },
  errorCode: {
    color: '#ef4444',
    fontSize: '0.82rem',
    fontFamily: "'Fira Code', monospace",
    lineHeight: 1.6,
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'center',
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
};

export default ErrorBoundary;
