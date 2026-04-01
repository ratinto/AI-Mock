import React from 'react';

interface NavbarProps {
  onStart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onStart }) => {
  return (
    <nav style={{
      width: '100%',
      padding: '30px 60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 700 }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #fff, #888)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          fontSize: '0.9rem'
        }}>A</div>
        AntriView
      </div>

      {/* Center/Right Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div style={{ display: 'flex', gap: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#" onClick={onStart} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Sign In</a>
          <button 
            className="btn-outline" 
            onClick={onStart}
            style={{ padding: '8px 24px', fontSize: '0.9rem' }}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
