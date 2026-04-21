import React from 'react';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 20px',
      position: 'relative',
      background: 'transparent'
    }}>
      {/* AI Advisor Badge */}
      <div className="badge-status animate-fade" style={{ animationDelay: '0.1s', padding: '8px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <div className="circle-online"></div>
        AI Career Advisor Active
      </div>

      {/* Main Headline */}
      <h1 className="animate-fade" style={{ 
        fontSize: 'clamp(3.5rem, 12vw, 8.5rem)', 
        maxWidth: '1200px',
        marginBottom: '1.5rem',
        animationDelay: '0.3s',
        lineHeight: 0.9,
        fontWeight: 900,
        letterSpacing: '-0.05em'
      }}>
        Career<br />By Design.
      </h1>

      {/* Subheadline */}
      <p className="animate-fade" style={{ 
        marginBottom: '3rem',
        animationDelay: '0.5s',
        color: 'var(--text-muted)',
        fontSize: '1.2rem',
        maxWidth: '600px',
        lineHeight: 1.6,
        fontWeight: 500
      }}>
        Land the job you actually want. AntriView helps you close skill gaps, 
        ace interviews, and make your resume stand out.
      </p>

      {/* CTA Button */}
      <div className="animate-fade" style={{ animationDelay: '0.7s', display: 'flex', gap: '16px' }}>
        <button className="btn-black" onClick={onStart} style={{ padding: '16px 40px', fontSize: '1rem' }}>
          Get Started
          <ChevronRight size={20} />
        </button>
        <button className="btn-white" onClick={() => {}} style={{ padding: '16px 40px', fontSize: '1rem' }}>
          View Pricing
        </button>
      </div>
    </section>
  );
};

export default Hero;
