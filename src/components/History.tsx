import React, { useMemo } from 'react';
import { Calendar, Award, Flame, BarChart2, Star } from 'lucide-react';
import { useServices } from '../app/ServicesProvider';

const HistoryItem = ({ role, date, score, type }: { role: string, date: string, score: string, type: string }) => (
  <div className="dash-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', marginBottom: '12px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
        <Calendar size={20} color="var(--text-secondary)" />
      </div>
      <div>
        <div style={{ fontWeight: 700, marginBottom: '2px' }}>{role} Session</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{date} • {type}</div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>{score}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Score</div>
      </div>
      <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Review</button>
    </div>
  </div>
);

const History: React.FC = () => {
  const { auth } = useServices();
  const currentUser = useMemo(() => auth.getCurrentUser(), [auth]);

  if (!currentUser) return null;

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Your Progress</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Tracking your journey to technical excellence.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        {/* Main History List */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Recent Sessions</h3>
          {currentUser.history.length > 0 ? (
            currentUser.history.map((item, idx) => (
              <HistoryItem key={idx} {...item} />
            ))
          ) : (
            <div className="dash-card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              <Award size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
              <p>No sessions recorded yet. Start your first interview!</p>
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           {/* Streak Card */}
           <div className="dash-card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1))', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Flame size={24} color="#f59e0b" />
                <span style={{ fontWeight: 700 }}>Current Streak</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{currentUser.streak} Days</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Keep it up! Consistency is the key to success.</p>
           </div>

           {/* Topic Chart */}
           <div className="dash-card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={16} /> Skill Breakdown
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentUser.skills.map(topic => (
                  <div key={topic.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{topic.label}</span>
                      <span>{topic.score}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${topic.score}%`, height: '100%', background: topic.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Bookmarks */}
           <div className="dash-card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={16} color="#f59e0b" /> Bookmarked
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                You have {Math.floor(currentUser.history.length / 2)} bookmarked questions for revision.
              </div>
              <button style={{ width: '100%', marginTop: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                Practice Now
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default History;
