import React from 'react';

type AboutUsProps = {
  onBack: () => void;
  onStart: () => void;
};

const AboutUs: React.FC<AboutUsProps> = ({ onBack, onStart }) => {
  return (
    <div className="animate-fade" style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: '28px' }}>
        <div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
            About AntriView
          </div>
          <h1 className="title-xl" style={{ fontSize: '3rem', marginBottom: '10px' }}>
            Practice smarter. Interview calmer.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '820px' }}>
            AntriView is a mock-interview workspace built for focused practice: realistic prompts, structured sessions,
            and feedback that turns “I hope I’m ready” into a plan you can execute.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={onBack}>Back to Home</button>
          <button className="btn-white" onClick={onStart}>Get Started</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '22px' }}>
        <div className="dash-card glass-effect" style={{ padding: '34px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Our mission</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>
            Help candidates build interview confidence through repeatable practice loops: prompt → attempt → feedback → iteration.
            We’re optimizing for clarity, speed, and calm—not noise.
          </p>

          <div style={{ marginTop: '22px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="dash-card" style={{ padding: '18px', borderRadius: '18px' }}>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px' }}>Realistic</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Prompts that feel like the room, not a quiz.
              </div>
            </div>
            <div className="dash-card" style={{ padding: '18px', borderRadius: '18px' }}>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px' }}>Structured</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Sessions designed to build repeatable habits.
              </div>
            </div>
            <div className="dash-card" style={{ padding: '18px', borderRadius: '18px' }}>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px' }}>Actionable</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Feedback that translates into next steps.
              </div>
            </div>
          </div>
        </div>

        <div className="dash-card" style={{ padding: '34px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>How it works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--accent-primary)' }}>1</div>
              <div>
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>Pick a track</div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  DSA, HR, or Development—practice with intent.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--accent-secondary)' }}>2</div>
              <div>
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>Run a mock session</div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  Timed prompts, clear goals, and a distraction-free flow.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>3</div>
              <div>
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>Review & iterate</div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  Use the insights to sharpen weaknesses and repeat.
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--border-glass)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Want to talk? Email <span style={{ color: '#fff', fontWeight: 700 }}>support@antriview.ai</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card glass-effect" style={{ marginTop: '22px', padding: '34px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.35rem', marginBottom: '6px' }}>Ready to start practicing?</div>
          <div style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Create a session, track your progress, and build interview momentum.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={onBack}>Explore Home</button>
          <button className="btn-white" onClick={onStart}>Start Prep</button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

