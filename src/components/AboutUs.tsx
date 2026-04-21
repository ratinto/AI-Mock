import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

type AboutUsProps = {
  onBack: () => void;
  onStart: () => void;
};

const AboutUs: React.FC<AboutUsProps> = ({ onBack, onStart }) => {
  return (
    <div className="animate-fade" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px', marginBottom: '48px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Our Mission
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-2px', lineHeight: 1 }}>
            Practice smarter.<br />Interview calmer.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '700px' }}>
            AntriView is a minimalist mock-interview workspace built for focused practice. We turn “I hope I’m ready” into a structured plan you can execute with confidence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-white" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={18} /> Back
          </button>
          <button className="btn-black" onClick={onStart}>
            Get Started <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', marginBottom: '32px' }}>
        <div className="dash-card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Philosophy</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '32px' }}>
            We believe interview confidence comes from repeatable practice loops. Our platform is optimized for clarity, speed, and calm—not noise. No fluff, just high-quality simulations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ borderTop: '2px solid var(--text-main)', paddingTop: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>Realistic</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Prompts that feel like the actual interview room.
              </div>
            </div>
            <div style={{ borderTop: '2px solid var(--text-main)', paddingTop: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>Structured</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Sessions designed to build repeatable habits.
              </div>
            </div>
            <div style={{ borderTop: '2px solid var(--text-main)', paddingTop: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>Actionable</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Feedback that translates into immediate steps.
              </div>
            </div>
          </div>
        </div>

        <div className="dash-card" style={{ padding: '40px', background: 'var(--accent-primary)', color: '#fff' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: '#fff' }}>How it works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, opacity: 0.5 }}>01</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>Pick a track</div>
                <div style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Choose from DSA, System Design, or Behavioral—practice with intent.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, opacity: 0.5 }}>02</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>Run a session</div>
                <div style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Timed prompts, clear goals, and a distraction-free flow.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, opacity: 0.5 }}>03</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>Review & iterate</div>
                <div style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.9rem' }}>
                  Use our AI-driven insights to sharpen weaknesses and repeat.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card" style={{ padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '8px' }}>Ready to build your momentum?</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Create a session today and start your journey towards your dream role.
          </div>
        </div>
        <button className="btn-black" onClick={onStart} style={{ padding: '16px 48px' }}>
          Get Started
        </button>
      </div>

      <div style={{ marginTop: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Want to talk? Email us at <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>support@antriview.ai</span>
      </div>
    </div>
  );
};

export default AboutUs;
