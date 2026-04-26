import React, { useState } from 'react';
import { ChevronRight, Briefcase, BarChart3, Target, ArrowLeft } from 'lucide-react';
import type { InterviewConfig } from '../domain/user';

interface SetupProps {
  onStart: (config: InterviewConfig) => void;
  onBack: () => void;
}

const InterviewSetup: React.FC<SetupProps> = ({ onStart, onBack }) => {
  const [role, setRole] = useState('SDE');
  const [difficulty, setDifficulty] = useState<InterviewConfig['difficulty']>('Medium');
  const [type, setType] = useState<InterviewConfig['type']>('Mixed');
  const [jobDescription, setJobDescription] = useState('');
  const [timePressure, setTimePressure] = useState(true);
  const [peerMode, setPeerMode] = useState(false);

  const roles = ['SDE', 'Data Science', 'Product Manager', 'UX Designer', 'Backend Engineer'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const types: InterviewConfig['type'][] = ['DSA', 'System Design', 'HR / Behavioral', 'Case Study', 'Mixed'];

  return (
    <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '8px' }}>Setup Session</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Tailor the simulation to your target role and goals.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {/* Role Selection */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-main)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            <Briefcase size={16} /> Target Role
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: role === r ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: role === r ? 'var(--accent-primary)' : '#fff',
                  color: role === r ? '#fff' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: role === r ? 'var(--shadow-md)' : 'none'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-main)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            <Target size={16} /> Job Description Mode
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description to mirror company-specific interview patterns..."
            style={{ width: '100%', minHeight: '140px', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-subtle)', fontSize: '0.95rem', resize: 'vertical' }}
          />
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <button className="btn-white" type="button" onClick={() => setTimePressure((v) => !v)} style={{ justifyContent: 'center' }}>
            {timePressure ? 'Time-Pressure: ON' : 'Time-Pressure: OFF'}
          </button>
          <button className="btn-white" type="button" onClick={() => setPeerMode((v) => !v)} style={{ justifyContent: 'center' }}>
            {peerMode ? 'Peer Practice: ON' : 'Peer Practice: OFF'}
          </button>
        </section>

        {/* Difficulty */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-main)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            <BarChart3 size={16} /> Difficulty Level
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d as InterviewConfig['difficulty'])}
                style={{
                  flex: 1,
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: difficulty === d ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: difficulty === d ? 'var(--accent-primary)' : '#fff',
                  color: difficulty === d ? '#fff' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: difficulty === d ? 'var(--shadow-md)' : 'none'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Interview Type */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-main)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            <Target size={16} /> Focus Track
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {types.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: type === t ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: type === t ? 'var(--accent-primary)' : '#fff',
                  color: type === t ? '#fff' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontSize: '1rem',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: type === t ? 'var(--shadow-md)' : 'none'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={18} /> Cancel
          </button>
          <button 
            className="btn-black" 
            style={{ padding: '16px 48px', fontSize: '1rem' }}
            onClick={() => onStart({
              role,
              difficulty,
              type,
              personaStyle: 'default',
              jobDescription: jobDescription.trim() || undefined,
              timePressure,
              peerMode,
            })}
          >
            Launch Interview <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
