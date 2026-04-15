import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="dash-card animate-fade" style={{ maxWidth: '900px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>About Abhyas</h2>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        Abhyas is an interview-prep experience built around mock practice sessions, structured feedback, and
        a premium UI. This page is a placeholder so your folder structure matches the reference layout.
      </p>
    </div>
  );
};

export default AboutUs;

