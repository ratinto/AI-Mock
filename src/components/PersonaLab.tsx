import React, { useState } from 'react';
import { User, ShieldCheck, Zap, Heart, ChevronRight, Check, Sparkles, Filter } from 'lucide-react';

export interface Persona {
  id: string;
  name: string;
  role: string;
  personality: string;
  intensity: 'Low' | 'Medium' | 'High';
  icon: React.ReactNode;
  color: string;
}

export const PERSONAS: Omit<Persona, 'icon'>[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Staff Engineer @ Meta',
    personality: 'Rigorous and detail-oriented. Focuses heavily on optimization and system design trade-offs.',
    intensity: 'High',
    color: '#000000',
  },
  {
    id: '2',
    name: 'Marcus Bell',
    role: 'Sr. Product Manager',
    personality: 'Encouraging but probing. Interested in your thought process and behavioral alignment.',
    intensity: 'Medium',
    color: '#374151',
  },
  {
    id: '3',
    name: 'Ava Novak',
    role: 'Recruiting Lead',
    personality: 'Friendly and direct. Focuses on communication clarity and cultural add.',
    intensity: 'Low',
    color: '#6B7280',
  },
  {
    id: '4',
    name: 'Turbo AI',
    role: 'Speed Mode',
    personality: 'Fast-paced, high-pressure environment simulation. Rapid-fire technical questions.',
    intensity: 'High',
    color: '#111827',
  },
];

const PERSONA_ICONS: Record<string, React.ReactNode> = {
  '1': <ShieldCheck size={20} />,
  '2': <Heart size={20} />,
  '3': <User size={20} />,
  '4': <Zap size={20} />,
};

export function getSelectedPersona(): Persona | null {
  // Persona is stored on the user profile in backend. Fallback to default.
  const fallback = PERSONAS[0];
  return fallback ? { ...fallback, icon: PERSONA_ICONS[fallback.id] } : null;
}

const PersonaCard = ({ persona, selected, onSelect }: { persona: Persona; selected: boolean; onSelect: () => void }) => (
  <div
    className="dash-card"
    onClick={onSelect}
    style={{
      borderColor: selected ? 'var(--accent-primary)' : 'var(--border-subtle)',
      background: selected ? 'var(--bg-card)' : 'transparent',
      transform: selected ? 'translateY(-4px)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      padding: '32px',
      boxShadow: selected ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ 
        padding: '10px', 
        borderRadius: '10px', 
        background: selected ? 'var(--accent-primary)' : 'var(--bg-secondary)', 
        color: selected ? '#fff' : 'var(--text-main)',
        transition: 'all 0.2s ease'
      }}>
        {persona.icon}
      </div>
      {selected && (
        <Check size={18} style={{ color: 'var(--accent-primary)' }} strokeWidth={3} />
      )}
    </div>

    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>{persona.name}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{persona.role}</p>
    </div>

    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', fontStyle: 'italic' }}>
      "{persona.personality}"
    </div>

    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      <span style={{ color: 'var(--text-subtle)' }}>Intensity:</span>
      <span style={{
        color: 'var(--text-main)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {persona.intensity}
      </span>
    </div>
  </div>
);

interface PersonaLabProps {
  onSelectPersona: (persona: Persona) => void;
}

const PersonaLab: React.FC<PersonaLabProps> = ({ onSelectPersona }) => {
  const [selectedId, setSelectedId] = useState<string>('1');
  const [isConfirming, setIsConfirming] = useState(false);

  const personas: Persona[] = PERSONAS.map(p => ({
    ...p,
    icon: PERSONA_ICONS[p.id],
  }));

  const selectedPersona = personas.find(p => p.id === selectedId);

  const handleConfirm = () => {
    if (!selectedPersona) return;
    setIsConfirming(true);

    setTimeout(() => {
      onSelectPersona(selectedPersona);
      setIsConfirming(false);
    }, 400);
  };

  return (
    <div className="animate-fade">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '48px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            <Filter size={14} /> Laboratory
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px' }}>Persona Lab</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1.05rem' }}>Select an AI persona to simulate specific interview styles and pressure.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="btn-white" style={{ fontSize: '0.85rem' }}>Reset Defaults</button>
           <button className="btn-black" onClick={handleConfirm} disabled={isConfirming} style={{ padding: '12px 32px' }}>
             {isConfirming ? 'Securing...' : 'Confirm Selection'}
           </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        {personas.map(p => (
          <PersonaCard
            key={p.id}
            persona={p}
            selected={selectedId === p.id}
            onSelect={() => setSelectedId(p.id)}
          />
        ))}
      </div>

      <div className="dash-card" style={{
        marginTop: '48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 40px',
        background: 'var(--text-main)',
        color: '#fff',
        border: 'none',
        borderRadius: '24px'
      }}>
        <div>
          <h3 style={{ fontWeight: 800, marginBottom: '6px', fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={20} />
            Ready to start with {selectedPersona?.name}?
          </h3>
          <p style={{ fontSize: '0.95rem', opacity: 0.7 }}>
            {selectedPersona?.personality.split('.')[0]}. You're practicing at {selectedPersona?.intensity} intensity.
          </p>
        </div>
        <button
          className="btn-white"
          style={{
            padding: '14px 40px',
            background: '#fff',
            color: '#000',
            fontWeight: 800,
            border: 'none'
          }}
          disabled={isConfirming}
          onClick={handleConfirm}
        >
          {isConfirming ? 'Initializing...' : 'Begin Session'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PersonaLab;
