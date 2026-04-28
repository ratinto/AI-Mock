import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Beaker, FileText, History as HistoryIcon, User, Plus, LogOut, Info, Flame, Search, Bell } from 'lucide-react';
import { useServices } from '../app/ServicesProvider';
import InterviewSetup from './InterviewSetup';
import ResumeAI from './ResumeAI';
import History from './History';
import InterviewRoom from './InterviewRoom';
import Report from './Report';
import PersonaLab from './PersonaLab';
import Profile from './Profile';
import AboutUs from './AboutUs';
import type { InterviewConfig, SessionReport } from '../domain/user';

interface TrackCardProps {
  title: string;
  count: string;
  progress: number;
  type: 'dsa' | 'hr' | 'dev';
}

const TrackCard: React.FC<TrackCardProps> = ({ title, count, progress, type }) => (
  <div className={`dash-card track-${type} animate-fade`} style={{ borderTop: 'none' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
      <div className="badge-status">
        {count} Sessions
      </div>
    </div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Technical Proficiency</div>
    <div className="progress-bar" style={{ height: '6px' }}>
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
       <span style={{ color: 'var(--text-main)' }}>Level {Math.max(1, Math.floor(progress / 25) + 1)}</span>
       <span style={{ color: 'var(--text-muted)' }}>{progress}% Mastered</span>
    </div>
  </div>
);

const FeatureBox = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) => (
  <div className="dash-card animate-fade" style={{ display: 'flex', gap: '20px', padding: '24px', cursor: 'pointer' }} onClick={onClick}>
    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-secondary)', color: 'var(--text-main)', height: 'fit-content' }}>
      {icon}
    </div>
    <div>
      <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>{title}</h4>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{desc}</p>
    </div>
  </div>
);

const FeatureVisibilityCard: React.FC<{ title: string; status: 'Live' | 'Beta'; location: string; onClick?: () => void }> = ({ title, status, location, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="dash-card"
    style={{ textAlign: 'left', cursor: 'pointer', padding: '14px 16px', width: '100%' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{title}</div>
      <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '999px', background: status === 'Live' ? '#111' : '#f3f4f6', color: status === 'Live' ? '#fff' : '#111' }}>{status}</span>
    </div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{location}</div>
  </button>
);

type DashboardView = 'overview' | 'persona' | 'resume' | 'history' | 'setup' | 'interview' | 'report' | 'profile' | 'about';

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { auth, profile } = useServices();
  const [activeView, setActiveViewState] = useState<DashboardView>(() => {
    return (sessionStorage.getItem('antriview_dash_view') as any) || 'overview';
  });

  const [bootstrapped, setBootstrapped] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({
    role: 'SDE',
    difficulty: 'Medium',
    type: 'Mixed',
    personaStyle: 'default',
    timePressure: true,
    peerMode: false,
  });
  const [latestReport, setLatestReport] = useState<SessionReport | null>(null);

  const currentUser = useMemo(() => auth.getCurrentUser(), [auth, refreshTrigger]);

  const activePersonaName = currentUser?.selectedPersona ?? 'default';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await auth.hydrateCurrentUser();
      } finally {
        if (!cancelled) {
          setBootstrapped(true);
          setRefreshTrigger((t) => t + 1);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth]);

  if (!bootstrapped) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
        <div className="dash-card" style={{ padding: '28px 32px', fontWeight: 800 }}>Loading your workspace…</div>
      </div>
    );
  }

  if (!currentUser) {
    onLogout();
    return null;
  }

  const displayName = (() => {
    const raw = (currentUser.name ?? '').trim();
    if (raw) return raw.split(/\s+/)[0];
    const email = (currentUser.email ?? '').trim();
    if (email.includes('@')) return email.split('@')[0];
    return 'there';
  })();

  const totalSessions =
    (currentUser.stats?.dsa?.sessions ?? 0) +
    (currentUser.stats?.hr?.sessions ?? 0) +
    (currentUser.stats?.dev?.sessions ?? 0);

  const averageScore = (() => {
    const scores = (currentUser.history ?? [])
      .map((h) => Number(String(h.score ?? '').replace(/[^0-9]/g, '')))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (!scores.length) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  const latestScore = (() => {
    const first = currentUser.history?.[0];
    const n = Number(String(first?.score ?? '').replace(/[^0-9]/g, ''));
    return Number.isFinite(n) ? n : 0;
  })();

  const setActiveView = (view: DashboardView) => {
    setActiveViewState(view);
    sessionStorage.setItem('antriview_dash_view', view);
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="animate-fade">
            {/* Top Bar / Search */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '48px',
              padding: '0 4px'
            }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard</h1>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    style={{ 
                      padding: '10px 40px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-subtle)', 
                      background: '#fff',
                      fontSize: '0.9rem',
                      width: '240px',
                      outline: 'none'
                    }} 
                  />
                </div>
                <button style={{ padding: '10px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: '#fff', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <Bell size={18} />
                </button>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} />
                </div>
              </div>
            </div>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px' }}>Welcome back, {displayName}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Here's what's happening with your interview prep today.</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {currentUser.streak > 0 && (
                  <div className="dash-card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: '#fff',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <Flame size={18} className="streak-flame" style={{ color: '#000' }} />
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{currentUser.streak} Day Streak</span>
                  </div>
                )}
                <button className="btn-black" onClick={() => setActiveView('setup')}>
                  <Plus size={18} /> New Session
                </button>
              </div>
            </header>

            {/* Quick Metrics Grid */}
            <div className="dash-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              <div className="dash-card" style={{ background: '#000', color: '#fff' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '8px' }}>Total Interviews</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalSessions}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#4ADE80' }}>{totalSessions === 0 ? 'Start your first session' : 'Tracked in PostgreSQL'}</div>
              </div>
              <div className="dash-card">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Average Score</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{averageScore ? `${averageScore}%` : '—'}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-subtle)' }}>{averageScore ? 'Across all sessions' : 'No sessions yet'}</div>
              </div>
              <div className="dash-card">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Latest Score</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{latestScore ? `${latestScore}%` : '—'}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-subtle)' }}>{latestScore ? 'Most recent interview' : 'No sessions yet'}</div>
              </div>
              <div className="dash-card">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Persona</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{activePersonaName}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-subtle)' }}>Saved per user</div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <section>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Learning Tracks</h3>
                    <button className="btn-outline" style={{ fontSize: '0.8rem' }}>View All</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <TrackCard title="DSA Mastery" count={currentUser.stats.dsa.sessions.toString()} progress={currentUser.stats.dsa.progress} type="dsa" />
                    <TrackCard title="HR & Behavioral" count={currentUser.stats.hr.sessions.toString()} progress={currentUser.stats.hr.progress} type="hr" />
                    <TrackCard title="Development Pro" count={currentUser.stats.dev.sessions.toString()} progress={currentUser.stats.dev.progress} type="dev" />
                  </div>
                </section>

                <section>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Exclusive Labs</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <FeatureBox 
                      title="AI Persona Selection" 
                      desc="Practice with diverse interviewers, from strict technical leads to friendly managers."
                      icon={<Beaker size={22} />}
                      onClick={() => setActiveView('persona')}
                    />
                    <FeatureBox 
                      title="Resume AI Heatmap" 
                      desc="Deep-scan your resume against top tech company benchmarks and recruiters' expectations."
                      icon={<FileText size={22} />}
                      onClick={() => setActiveView('resume')}
                    />
                  </div>
                </section>

                <section>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Feature Visibility Map</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FeatureVisibilityCard title="Real Voice Interview" status="Live" location="Interview Room mic button" onClick={() => setActiveView('setup')} />
                    <FeatureVisibilityCard title="Non-verbal Cue Analysis" status="Beta" location="Interview Room live metrics panel" onClick={() => setActiveView('setup')} />
                    <FeatureVisibilityCard title="Resume-Based Questions" status="Live" location="Resume AI + Interview Setup" onClick={() => setActiveView('resume')} />
                    <FeatureVisibilityCard title="Job Description Mode" status="Live" location="Setup Session job description box" onClick={() => setActiveView('setup')} />
                    <FeatureVisibilityCard title="Progress Dashboard & Radar" status="Live" location="History + Report metrics" onClick={() => setActiveView('history')} />
                    <FeatureVisibilityCard title="Answer vs Ideal Answer" status="Live" location="Session Report insight comparison" onClick={() => setActiveView('report')} />
                    <FeatureVisibilityCard title="Time-Pressure Mode" status="Live" location="Setup toggle + Interview timer" onClick={() => setActiveView('setup')} />
                    <FeatureVisibilityCard title="Live Coding Simulator" status="Live" location="Interview Room Open Source Editor" onClick={() => setActiveView('setup')} />
                    <FeatureVisibilityCard title="Dynamic Follow-Ups" status="Live" location="Interview Room dynamic follow-up card" onClick={() => setActiveView('setup')} />
                    <FeatureVisibilityCard title="Interview Type Specialization" status="Live" location="Setup Focus Track options" onClick={() => setActiveView('setup')} />
                    <FeatureVisibilityCard title="PDF Report Card" status="Live" location="Report > Download PDF Report" onClick={() => setActiveView('report')} />
                    <FeatureVisibilityCard title="Peer Practice Rooms" status="Beta" location="Setup Peer Practice toggle" onClick={() => setActiveView('setup')} />
                    <FeatureVisibilityCard title="Interviewer Persona Selection" status="Live" location="Persona Lab" onClick={() => setActiveView('persona')} />
                    <FeatureVisibilityCard title="Daily Habit Streak" status="Live" location="Dashboard header + History" onClick={() => setActiveView('history')} />
                  </div>
                </section>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="dash-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px' }}>Strategic Roadmap</h3>
                  
                  <div style={{ position: 'relative', flexGrow: 1, borderLeft: '2px solid var(--border-subtle)', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '32px', paddingLeft: '28px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-34px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-main)' }}></div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Advanced Data Structures</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Verified Milestone • 2w ago</div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-34px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', border: '2px solid var(--text-main)', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}></div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Distributed Systems Round</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Currently Active • 65% Ready</div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-34px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--bg-secondary)' }}></div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-subtle)' }}>Final Behavioral Evaluation</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Upcoming Focus</div>
                    </div>
                  </div>

                  <button className="btn-black" style={{ marginTop: '32px', width: '100%', justifyContent: 'center' }}>
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'persona':
        return (
          <PersonaLab
            onSelectPersona={async (persona) => {
              await profile.updateUser(currentUser.email, { selectedPersona: persona.name });
              setRefreshTrigger((t) => t + 1);
              setActiveView('setup');
            }}
          />
        );
      case 'resume':
        return <ResumeAI />;
      case 'setup':
        return <InterviewSetup 
          onStart={(config) => {
            setInterviewConfig({
              ...config,
              personaStyle: activePersonaName,
            });
            setActiveView('interview'); 
          }} 
          onBack={() => setActiveView('overview')} 
        />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile user={currentUser} onUpdate={() => setRefreshTrigger(t => t + 1)} />;
      case 'about':
        return (
          <AboutUs
            onBack={() => setActiveView('overview')}
            onStart={() => setActiveView('setup')}
          />
        );
      case 'interview':
        return (
          <InterviewRoom
            config={interviewConfig}
            onEnd={(report) => {
              setLatestReport(report);
              setRefreshTrigger(t => t + 1);
              setActiveView('report');
            }}
          />
        );
      case 'report':
        return <Report report={latestReport} onBack={() => setActiveView('overview')} />;
      default:
        return <div>View {activeView} is under construction</div>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-secondary)' }}>
      {/* Sidebar */}
      <aside className="dash-sidebar" style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <div style={{ marginBottom: '48px', padding: '0 8px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-1.5px', color: '#000' }}>
            AntriView.
          </div>
        </div>
        
        <nav style={{ flexGrow: 1 }}>
          <button className={`nav-item ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}>
            <LayoutGrid size={20} /> Dashboard
          </button>
          <button className={`nav-item ${activeView === 'persona' ? 'active' : ''}`} onClick={() => setActiveView('persona')}>
            <Beaker size={20} /> Persona Lab
          </button>
          <button className={`nav-item ${activeView === 'resume' ? 'active' : ''}`} onClick={() => setActiveView('resume')}>
            <FileText size={20} /> Resume AI
          </button>
          <button className={`nav-item ${activeView === 'history' ? 'active' : ''}`} onClick={() => setActiveView('history')}>
            <HistoryIcon size={20} /> History
          </button>
          <button className={`nav-item ${activeView === 'about' ? 'active' : ''}`} onClick={() => setActiveView('about')}>
            <Info size={20} /> Resources
          </button>
          <button className={`nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>
            <User size={20} /> Settings
          </button>
        </nav>

        {/* Improved Profile Section */}
        <div className="dash-card" style={{ padding: '12px', borderRadius: '14px', marginBottom: '12px', boxShadow: 'none', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flexGrow: 1, overflow: 'hidden' }}>
              <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pro Plan</div>
            </div>
          </div>
        </div>

        <button className="nav-item" style={{ marginTop: '0', color: '#ef4444' }} onClick={() => { auth.logout(); onLogout(); }}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dash-content">
        {renderView()}
      </main>
    </div>
  );
};

export default Dashboard;
