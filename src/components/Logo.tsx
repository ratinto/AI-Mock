import React from 'react';

type LogoProps = {
  text?: string;
};

const Logo: React.FC<LogoProps> = ({ text = 'Abhyas' }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        }}
      />
      <div style={{ fontWeight: 900, letterSpacing: '-0.5px' }}>{text}</div>
    </div>
  );
};

export default Logo;

