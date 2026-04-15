import React from 'react';

interface NavbarProps {
  onStart: () => void;
  onAbout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onStart, onAbout }) => {
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
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onAbout?.();
            }}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            About Us
          </a>
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
