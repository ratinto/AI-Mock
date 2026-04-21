import React from 'react';

const Background: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'var(--bg-main)',
        pointerEvents: 'none'
      }}
    >
      {/* Subtle texture/gradient for depth */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 0% 0%, rgba(0,0,0,0.01) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(0,0,0,0.01) 0%, transparent 50%)',
          opacity: 0.5
        }}
      />
    </div>
  );
};

export default Background;
