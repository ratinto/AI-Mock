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
    onSignup(); // Mock signup success
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '20px'
    }}>
      <div className="animate-fade" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '60px 48px',
        border: '1px solid var(--border-subtle)',
        borderRadius: '32px',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', letterSpacing: '-1px' }}>Join AntriView.</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your account and start practicing.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', marginLeft: '4px' }}>Full Name</label>
            <input 
              required
              type="text" 
              placeholder="Shreya Narayani"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                outline: 'none',
                fontSize: '1rem'
              }} 
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', marginLeft: '4px' }}>Email Address</label>
            <input 
              required
              type="email" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                outline: 'none',
                fontSize: '1rem'
              }} 
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', marginLeft: '4px' }}>Password</label>
            <input 
              required
              type="password" 
              placeholder="Create a password"
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                outline: 'none',
                fontSize: '1rem'
              }} 
            />
          </div>

          <button type="submit" className="btn-white" style={{ width: '100%', justifyContent: 'center', height: '54px' }}>
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onLogin(); }} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Log In</a>
        </div>

        <button 
          onClick={onBack}
          style={{
            marginTop: '40px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
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
