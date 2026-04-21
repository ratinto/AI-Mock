import React, { useMemo } from 'react';
import { Calendar, Award, Flame, BarChart2, Star, ChevronRight, TrendingUp } from 'lucide-react';
import { useServices } from '../app/ServicesProvider';

const HistoryItem = ({ role, date, score, type }: { role: string, date: string, score: string, type: string }) => (
  <div className="dash-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', marginBottom: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '12px', color: 'var(--text-main)' }}>
        <Calendar size={20} />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{role} Session</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{date} • {type}</div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-1px' }}>{score}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Score</div>
      </div>
      <button className="btn-white" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Review Details</button>
    </div>
  </div>
);

const History: React.FC = () => {
  const { auth } = useServices();
  const currentUser = useMemo(() => auth.getCurrentUser(), [auth]);

  if (!currentUser) return null;

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '8px' }}>Your Progress</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>A complete audit of your interview performance and skill evolution.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
        {/* Main History List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Sessions</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>View All</button>
          </div>
          
          {currentUser.history.length > 0 ? (
            currentUser.history.map((item, idx) => (
              <HistoryItem key={idx} {...item} />
            ))
          ) : (
            <div className="dash-card" style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
              <Award size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No sessions recorded yet.</p>
              <button className="btn-black" style={{ marginTop: '24px' }}>Start First Interview</button>
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
           {/* Streak Card */}
           <div className="dash-card" style={{ background: 'var(--text-main)', color: '#fff', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Flame size={20} />
                <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Daily Momentum</span>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>{currentUser.streak} Days</div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '8px', lineHeight: 1.5 }}>Consistency is the foundation of technical mastery. Keep going!</p>
           </div>

           {/* Topic Chart */}
           <div className="dash-card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <TrendingUp size={16} /> Skill Matrix
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {currentUser.skills.map(topic => (
                  <div key={topic.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{topic.label}</span>
                      <span>{topic.score}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${topic.score}%`, height: '100%', background: 'var(--text-main)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Bookmarks */}
           <div className="dash-card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Star size={16} /> Revision Deck
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                You have <strong>{Math.floor(currentUser.history.length / 2)}</strong> critical questions flagged for revision.
              </p>
              <button className="btn-white" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}>
                Start Revision <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default History;
