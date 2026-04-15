import React from 'react';

const FeatureItem = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="animate-fade" style={{ 
    padding: '40px 0', 
    borderTop: '1px solid var(--border-subtle)',
    display: 'grid',
    gridTemplateColumns: '100px 1fr 2fr',
    gap: '40px',
    textAlign: 'left'
  }}>
    <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600 }}>{number}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{title}</div>
    <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>{description}</div>
  </div>
);

const Features: React.FC = () => {
  return (
    <section id="features" style={{ padding: '100px 60px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '80px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Our Approach.</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '500px' }}>
          We combine advanced AI with career psychology to give you a competitive edge.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <FeatureItem 
          number="01" 
          title="Skill Gap Analysis" 
          description="Identify exactly what's holding you back from your next promotion or new role."
        />
        <FeatureItem 
          number="02" 
          title="AI Interview Lab" 
          description="Practice with a human-like AI that adapts to your answers and provides deep behavioral insights."
        />
        <FeatureItem 
          number="03" 
          title="Resume Optimizer" 
          description="Turn your experience into a narrative that recruiters can't ignore using our smart templates."
        />
      </div>
    </section>
  );
};

export default Features;
