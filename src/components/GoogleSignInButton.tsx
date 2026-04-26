import React, { useEffect, useRef } from 'react';

type Props = {
  onCredential: (credential: string) => void;
};

const scriptId = 'google-identity-script';

const GoogleSignInButton: React.FC<Props> = ({ onCredential }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId) return;

    const render = () => {
      if (!window.google || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => {
          if (res.credential) onCredential(res.credential);
        },
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
      });
    };

    const existing = document.getElementById(scriptId);
    if (existing) {
      render();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.body.appendChild(script);
  }, [onCredential, clientId]);

  return (
    <div style={{ marginTop: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{ height: 1, flex: 1, background: 'var(--border-subtle)' }} />
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Or continue with
        </div>
        <div style={{ height: 1, flex: 1, background: 'var(--border-subtle)' }} />
      </div>

      {clientId ? (
        <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }} />
      ) : (
        <button
          type="button"
          className="btn-white"
          onClick={() => alert('Google login is not configured yet. Set VITE_GOOGLE_CLIENT_ID in my-app/.env and restart the dev server.')}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Continue with Google (configure client ID)
        </button>
      )}
    </div>
  );
};

export default GoogleSignInButton;
