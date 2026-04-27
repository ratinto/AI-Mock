import React from 'react';

interface NavbarProps {
  onStart: () => void;
  onAbout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onStart, onAbout }) => {
  return (
    <nav style={{
      width: '100%',
      padding: '24px 60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
      background: 'transparent'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-1.5px', color: '#000' }}>
        AntriView.
      </div>

      {/* Center/Right Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div style={{ display: 'flex', gap: '30px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onAbout?.();
            }}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Resources
          </a>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('features');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Solutions
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('pricing');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Pricing
          </a>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="#" onClick={onStart} style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Sign In</a>
          <button 
            className="btn-black" 
            onClick={onStart}
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
