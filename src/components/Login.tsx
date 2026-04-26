import React, { useState } from 'react';
import { useServices } from '../app/ServicesProvider';
import GoogleSignInButton from './GoogleSignInButton';

interface LoginProps {
  onBack: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useServices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const result = await auth.loginByEmail(email, password);
      if (result.ok) {
        onLogin();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async (credential: string) => {
    try {
      setIsSubmitting(true);
      await auth.loginWithGoogle(credential);
      onLogin();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Google login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '20px',
      background: 'var(--bg-secondary)'
    }}>
      <div className="dash-card animate-fade" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '48px',
        textAlign: 'center',
        background: '#fff'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontWeight: 800 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to your AntriView workspace.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input 
              required
              type="email" 
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#fff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }} 
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#fff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }} 
            />
          </div>

          <button disabled={isSubmitting} type="submit" className="btn-black" style={{ width: '100%', justifyContent: 'center', height: '48px', marginTop: '8px', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <GoogleSignInButton onCredential={handleGoogle} />

        <div style={{ marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSignup(); }} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 700 }}>Create one</a>
        </div>

        <button 
          onClick={onBack}
          style={{
            marginTop: '32px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
