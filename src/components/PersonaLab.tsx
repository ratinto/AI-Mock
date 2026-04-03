import React, { useState } from 'react';
import { User, ShieldCheck, Zap, Heart, ChevronRight, Check, Sparkles } from 'lucide-react';

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
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Marcus Bell',
    role: 'Sr. Product Manager',
    personality: 'Encouraging but probing. Interested in your thought process and behavioral alignment.',
    intensity: 'Medium',
    color: '#ec4899',
  },
  {
    id: '3',
    name: 'Ava Novak',
    role: 'Recruiting Lead',
    personality: 'Friendly and direct. Focuses on communication clarity and cultural add.',
    intensity: 'Low',
    color: '#10b981',
  },
  {
    id: '4',
    name: 'Turbo AI',
    role: 'Speed Mode',
    personality: 'Fast-paced, high-pressure environment simulation. Rapid-fire technical questions.',
    intensity: 'High',
    color: '#f59e0b',
  },
];

const PERSONA_ICONS: Record<string, React.ReactNode> = {
  '1': <ShieldCheck size={24} />,
  '2': <Heart size={24} />,
  '3': <User size={24} />,
  '4': <Zap size={24} />,
};

const STORAGE_KEY = 'antriview_selected_persona';

export function getSelectedPersona(): Persona | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const p = PERSONAS.find(x => x.id === stored);
    if (!p) return null;
    return { ...p, icon: PERSONA_ICONS[p.id] };
  } catch {
    return null;
  }
}

const PersonaCard = ({ persona, selected, onSelect }: { persona: Persona; selected: boolean; onSelect: () => void }) => (
  <div
    className="dash-card"
    onClick={onSelect}
    style={{
      borderColor: selected ? persona.color : 'var(--border-subtle)',
      background: selected ? `${persona.color}11` : 'rgba(255,255,255,0.02)',
      transform: selected ? 'scale(1.02)' : 'scale(1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Selection glow effect */}
    {selected && (
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${persona.color}15, transparent)`,
        pointerEvents: 'none',
      }} />
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '12px', borderRadius: '12px', background: `${persona.color}22`, color: persona.color }}>
        {persona.icon}
      </div>
      {selected && (
        <div style={{
          background: persona.color,
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '100px',
          fontSize: '0.7rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Check size={12} /> SELECTED
        </div>
      )}
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
      <span style={{
        color: persona.intensity === 'High' ? '#ef4444' : persona.intensity === 'Medium' ? '#f59e0b' : '#10b981',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {persona.intensity === 'High' && '🔥'}
        {persona.intensity === 'Medium' && '⚡'}
        {persona.intensity === 'Low' && '🌿'}
        {persona.intensity}
      </span>
    </div>
  </div>
);

interface PersonaLabProps {
  onSelectPersona: (persona: Persona) => void;
}

const PersonaLab: React.FC<PersonaLabProps> = ({ onSelectPersona }) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || '1';
  });
  const [isConfirming, setIsConfirming] = useState(false);

  const personas: Persona[] = PERSONAS.map(p => ({
    ...p,
    icon: PERSONA_ICONS[p.id],
  }));

  const selectedPersona = personas.find(p => p.id === selectedId);

  const handleConfirm = () => {
    if (!selectedPersona) return;
    setIsConfirming(true);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, selectedId);

    // Small delay for visual feedback
    setTimeout(() => {
      onSelectPersona(selectedPersona);
      setIsConfirming(false);
    }, 600);
  };

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

      <div className="dash-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: selectedPersona ? `${selectedPersona.color}08` : undefined,
        borderColor: selectedPersona ? `${selectedPersona.color}30` : undefined,
      }}>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: selectedPersona?.color }} />
            Ready to start with {selectedPersona?.name}?
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {selectedPersona?.personality.split('.')[0]}.
          </p>
        </div>
        <button
          className="btn-white"
          style={{
            padding: '14px 32px',
            opacity: isConfirming ? 0.7 : 1,
            transition: 'all 0.3s ease',
          }}
          disabled={isConfirming}
          onClick={handleConfirm}
        >
          {isConfirming ? (
            <>Confirming...</>
          ) : (
            <>Select & Continue <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonaLab;
