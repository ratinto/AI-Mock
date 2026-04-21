import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface PricingProps {
  onStart: () => void;
}

const PricingCard = ({ plan, price, features, isFeatured, onStart }: { plan: string, price: string, features: string[], isFeatured?: boolean, onStart: () => void }) => (
  <div className="animate-fade" style={{ 
    padding: '48px', 
    border: isFeatured ? 'none' : '1px solid var(--border-subtle)',
    borderRadius: '32px',
    textAlign: 'left',
    background: isFeatured ? 'var(--accent-primary)' : '#fff',
    color: isFeatured ? '#fff' : 'var(--text-main)',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    transition: 'all 0.3s ease',
    boxShadow: isFeatured ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
    position: 'relative',
    zIndex: isFeatured ? 2 : 1,
    transform: isFeatured ? 'scale(1.02)' : 'none'
  }}>
    {isFeatured && (
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        background: 'rgba(255,255,255,0.1)',
        padding: '6px 12px',
        borderRadius: '100px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>Popular Choice</div>
    )}
    
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: isFeatured ? '#fff' : 'var(--text-muted)', marginBottom: '8px' }}>{plan}</h3>
      <div style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px' }}>{price}</div>
      {price !== 'Free' && price !== 'Custom' && (
        <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>/ per month</span>
      )}
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
      {features.map((f, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 500 }}>
          <Check size={20} color={isFeatured ? "#fff" : "#000"} strokeWidth={3} />
          {f}
        </div>
      ))}
    </div>

    <button 
      className={isFeatured ? "btn-white" : "btn-black"} 
      onClick={onStart}
      style={{ 
        width: '100%', 
        justifyContent: 'center', 
        height: '56px',
        fontSize: '1rem',
        borderRadius: '16px'
      }}
    >
      {isFeatured ? 'Get Full Access' : 'Start Preparation'}
      <ChevronRight size={18} />
    </button>
  </div>
);

const Pricing: React.FC<PricingProps> = ({ onStart }) => {
  return (
    <section id="pricing" style={{ padding: '120px 60px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-2px' }}>Professional Plans.</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Choose the plan that fits your career stage. Upgrade or downgrade at any time.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        <PricingCard 
          plan="Starter" 
          price="Free" 
          onStart={onStart}
          features={["3 Mock Interviews / mo", "Basic Skill Analysis", "Public Templates", "Access to Resources"]}
        />
        <PricingCard 
          plan="Pro" 
          price="₹1,499" 
          onStart={onStart}
          isFeatured={true}
          features={["Unlimited Mock Interviews", "Deep Behavioral Analytics", "Priority Support", "Private Workspace", "Custom Feedback Reports"]}
        />
        <PricingCard 
          plan="Enterprise" 
          price="Custom" 
          onStart={onStart}
          features={["Team Management", "Custom Role Tracks", "API Access", "Dedicated Mentor", "SSO & Security"]}
        />
      </div>
    </section>
  );
};

export default Pricing;
