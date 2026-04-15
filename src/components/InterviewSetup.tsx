import React, { useState } from 'react';
import { ChevronRight, Briefcase, BarChart3, Target } from 'lucide-react';

interface SetupProps {
  onStart: (config: any) => void;
  onBack: () => void;
}

const InterviewSetup: React.FC<SetupProps> = ({ onStart, onBack }) => {
  const [role, setRole] = useState('SDE');
  const [difficulty, setDifficulty] = useState('Medium');
  const [type, setType] = useState('Mixed');

  const roles = ['SDE', 'Data Science', 'Product Manager', 'UX Designer', 'Backend Engineer'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const types = ['DSA', 'System Design', 'HR / Behavioral', 'Mixed'];

  return (
    <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Setup Your Interview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Tailor the session to your target role and goals.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Role Selection */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <Briefcase size={18} /> Target Role
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: role === r ? '#fff' : 'var(--border-subtle)',
                  background: role === r ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: role === r ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: '0.2s'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        {/* Difficulty */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <BarChart3 size={18} /> Difficulty Level
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: difficulty === d ? '#fff' : 'var(--border-subtle)',
                  background: difficulty === d ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: difficulty === d ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: '0.2s'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Interview Type */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <Target size={18} /> Interview Type
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {types.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: type === t ? '#fff' : 'var(--border-subtle)',
                  background: type === t ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: type === t ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textAlign: 'left',
                  transition: '0.2s'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
            Cancel
          </button>
          <button 
            className="btn-white" 
            style={{ padding: '16px 32px' }}
            onClick={() => onStart({ role, difficulty, type })}
          >
            Start Session <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
