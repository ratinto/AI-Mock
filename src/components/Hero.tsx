import React from 'react';

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
      position: 'relative'
    }}>
      {/* AI Advisor Badge */}
      <div className="badge-ai animate-fade" style={{ animationDelay: '0.1s' }}>
        <div className="circle-online"></div>
        Your AI Career Advisor
      </div>

      {/* Main Headline */}
      <h1 className="animate-fade" style={{ 
        fontSize: 'clamp(3rem, 12vw, 9rem)', 
        maxWidth: '1200px',
        marginBottom: '2rem',
        animationDelay: '0.3s'
      }}>
        Career<br />By Design.
      </h1>

      {/* Subheadline */}
      <p className="subheadline animate-fade" style={{ 
        marginBottom: '3rem',
        animationDelay: '0.5s'
      }}>
        Land the job you actually want. AntriView helps you close skill gaps, 
        ace interviews, and make your resume stand out - all in one place.
      </p>

      {/* CTA Button */}
      <div className="animate-fade" style={{ animationDelay: '0.7s' }}>
        <button className="btn-white" onClick={onStart}>
          Get Started Free
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;
