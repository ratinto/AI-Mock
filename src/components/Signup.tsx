import React, { useState } from 'react';
import { useServices } from '../app/ServicesProvider';

interface SignupProps {
  onBack: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onBack, onLogin, onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { auth } = useServices();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = name.trim();
    const cleanedEmail = email.trim();
    if (!cleanedName) {
      alert('Please enter your name.');
      return;
    }
    auth.signup(cleanedEmail, cleanedName);
    onSignup();
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
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontWeight: 800 }}>Join AntriView</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Start your technical interview journey today.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
            <input 
              required
              type="text" 
              placeholder="Shreya Narayani"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Create a password"
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

          <button type="submit" className="btn-black" style={{ width: '100%', justifyContent: 'center', height: '48px', marginTop: '12px' }}>
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onLogin(); }} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 700 }}>Log In</a>
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

export default Signup;
