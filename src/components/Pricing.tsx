import React from 'react';

interface PricingProps {
  onStart: () => void;
}

const PricingCard = ({ plan, price, features, isFeatured, onStart }: { plan: string, price: string, features: string[], isFeatured?: boolean, onStart: () => void }) => (
  <div className="animate-fade" style={{ 
    padding: '48px', 
    border: '1px solid var(--border-subtle)',
    borderRadius: '24px',
    textAlign: 'left',
    background: isFeatured ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    transition: '0.3s'
  }}>
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>{plan}</h3>
      <div style={{ fontSize: '3rem', fontWeight: 800 }}>{price}</div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {features.map((f, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {f}
        </div>
      ))}
    </div>

    <button 
      className={isFeatured ? "btn-white" : "btn-outline"} 
      onClick={onStart}
      style={{ width: '100%', marginTop: 'auto', justifyContent: 'center' }}
    >
      Get Started
    </button>
  </div>
);

const Pricing: React.FC<PricingProps> = ({ onStart }) => {
  return (
    <section id="pricing" style={{ padding: '100px 60px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'left', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Fair Pricing.</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '500px' }}>
          Choose the plan that fits your career stage. No hidden fees.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <PricingCard 
          plan="Starter" 
          price="Free" 
          onStart={onStart}
          features={["3 Mock Interviews / mo", "Basic Skill Analysis", "Public Templates"]}
        />
        <PricingCard 
          plan="Pro" 
          price="₹1,499" 
          onStart={onStart}
          isFeatured={true}
          features={["Unlimited Interviews", "Deep Behavioral Analytics", "Priority Support", "Private Workspace"]}
        />
        <PricingCard 
          plan="Enterprise" 
          price="Custom" 
          onStart={onStart}
          features={["Team Management", "Custom Role Tracks", "API Access", "Dedicated Mentor"]}
        />
      </div>
    </section>
  );
};

export default Pricing;
