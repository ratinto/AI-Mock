import React, { useState } from 'react';
import { User, ShieldCheck, Zap, Heart, Star, ChevronRight } from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  role: string;
  personality: string;
  intensity: 'Low' | 'Medium' | 'High';
  icon: React.ReactNode;
  color: string;
}

const PersonaCard = ({ persona, selected, onSelect }: { persona: Persona, selected: boolean, onSelect: () => void }) => (
  <div 
    className="dash-card" 
    onClick={onSelect}
    style={{ 
      borderColor: selected ? '#fff' : 'var(--border-subtle)',
      background: selected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
      transform: selected ? 'scale(1.02)' : 'scale(1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '12px', borderRadius: '12px', background: `${persona.color}22`, color: persona.color }}>
        {persona.icon}
      </div>
      {selected && <div style={{ background: '#fff', color: '#000', padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>SELECTED</div>}
    </div>
    
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{persona.name}</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{persona.role}</p>
    </div>

    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
      "{persona.personality}"
    </div>

    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
       <span style={{ color: 'var(--text-secondary)' }}>Intensity:</span>
       <span style={{ color: persona.intensity === 'High' ? '#ef4444' : persona.intensity === 'Medium' ? '#f59e0b' : '#10b981' }}>{persona.intensity}</span>
    </div>
  </div>
);

const PersonaLab: React.FC = () => {
  const [selectedId, setSelectedId] = useState('1');

  const personas: Persona[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Staff Engineer @ Meta',
      personality: 'Rigorous and detail-oriented. Focuses heavily on optimization and system design trade-offs.',
      intensity: 'High',
      icon: <ShieldCheck size={24} />,
      color: '#3b82f6'
    },
    {
      id: '2',
      name: 'Marcus Bell',
      role: 'Sr. Product Manager',
      personality: 'Encouraging but probing. Interested in your thought process and behavioral alignment.',
      intensity: 'Medium',
      icon: <Heart size={24} />,
      color: '#ec4899'
    },
    {
      id: '3',
      name: 'Ava Novak',
      role: 'Recruiting Lead',
      personality: 'Friendly and direct. Focuses on communication clarity and cultural add.',
      intensity: 'Low',
      icon: <User size={24} />,
      color: '#10b981'
    },
    {
      id: '4',
      name: 'Turbo AI',
      role: 'Speed Mode',
      personality: 'Fast-paced, high-pressure environment simulation. Rapid-fire technical questions.',
      intensity: 'High',
      icon: <Zap size={24} />,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Persona Lab</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Choose who you want to practice with today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {personas.map(p => (
          <PersonaCard 
            key={p.id} 
            persona={p} 
            selected={selectedId === p.id} 
            onSelect={() => setSelectedId(p.id)} 
          />
        ))}
      </div>

      <div className="dash-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>Ready to start with {personas.find(p => p.id === selectedId)?.name}?</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You can always change your interviewer later.</p>
        </div>
        <button className="btn-white" style={{ padding: '14px 32px' }}>
          Select & Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PersonaLab;
