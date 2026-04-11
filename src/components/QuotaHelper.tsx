import React from 'react';

const QuotaHelper: React.FC = () => {
  return (
    <div className="dash-card animate-fade" style={{ maxWidth: '900px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Quota Helper</h2>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        Placeholder screen for quota / usage messaging. Wire this up to your real billing/limits later.
      </p>
    </div>
  );
};

export default QuotaHelper;

