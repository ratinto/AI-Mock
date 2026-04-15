import React, { useState, useMemo } from 'react';
import { LayoutGrid, Beaker, FileText, History as HistoryIcon, User, Plus, LogOut, ChevronRight, Info } from 'lucide-react';
import { useServices } from '../app/ServicesProvider';
import InterviewSetup from './InterviewSetup';
import ResumeAI from './ResumeAI';
import History from './History';
import InterviewRoom from './InterviewRoom';
import Report from './Report';
import PersonaLab from './PersonaLab';
import Profile from './Profile';
import AboutUs from './AboutUs';

interface TrackCardProps {
  title: string;
  count: string;
  progress: number;
  type: 'dsa' | 'hr' | 'dev';
}

const TrackCard: React.FC<TrackCardProps> = ({ title, count, progress, type }) => (
  <div className={`dash-card track-${type} animate-fade`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h3>
      <div className="badge-status">
        {count} Sessions
      </div>
    </div>
    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Technical Proficiency</div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
       <span style={{ color: 'var(--accent-primary)' }}>Level 4</span>
       <span style={{ color: 'var(--text-muted)' }}>{progress}% Mastered</span>
    </div>
  </div>
);

const FeatureBox = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) => (
  <div className="dash-card animate-fade" style={{ display: 'flex', gap: '20px', padding: '24px', cursor: 'pointer' }} onClick={onClick}>
    <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', height: 'fit-content' }}>
      {icon}
    </div>
    <div>
      <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.1rem' }}>{title}</h4>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{desc}</p>
    </div>
  </div>
);

type DashboardView = 'overview' | 'persona' | 'resume' | 'history' | 'setup' | 'interview' | 'report' | 'profile' | 'about';

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { auth } = useServices();
  const [activeView, setActiveViewState] = useState<DashboardView>(() => {
    return (sessionStorage.getItem('antriview_dash_view') as any) || 'overview';
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [interviewConfig, setInterviewConfig] = useState<{ role: string, track: 'dsa' | 'hr' | 'dev' }>({ role: 'SDE', track: 'dsa' });

  const currentUser = useMemo(() => auth.getCurrentUser(), [auth, refreshTrigger]);

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

  const setActiveView = (view: DashboardView) => {
    setActiveViewState(view);
    sessionStorage.setItem('antriview_dash_view', view);
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="animate-fade">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '56px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>
                   <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                   User Session Active
                </div>
                <h1 className="title-xl" style={{ marginBottom: '12px' }}>Hello, {displayName}.</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your tailored technical interview roadmap is ready.</p>
              </div>
              <button className="btn-white" onClick={() => setActiveView('setup')}>
                <Plus size={18} /> Start New Prep
              </button>
            </header>

            {/* Premium Onboarding Banner */}
            <div className="dash-card glass-effect" style={{ 
              background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent), rgba(255, 255, 255, 0.02)', 
              borderColor: 'rgba(99, 102, 241, 0.2)',
              marginBottom: '40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '32px 40px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Beaker size={24} color="var(--accent-primary)" /> Welcome to AntriView AI
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '500px' }}>Experience industry-grade interviews with real-time feedback and ATS-optimized resume analysis.</p>
              </div>
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                Quick Tour <ChevronRight size={18} />
              </button>
            </div>

            {/* Primary Tracks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '56px' }}>
              <TrackCard title="DSA Mastery" count={currentUser.stats.dsa.sessions.toString()} progress={currentUser.stats.dsa.progress} type="dsa" />
              <TrackCard title="HR & Behavioral" count={currentUser.stats.hr.sessions.toString()} progress={currentUser.stats.hr.progress} type="hr" />
              <TrackCard title="Development Pro" count={currentUser.stats.dev.sessions.toString()} progress={currentUser.stats.dev.progress} type="dev" />
            </div>

            {/* Unique Features Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Exclusive Labs</h3>
                <FeatureBox 
                  title="AI Persona Selection" 
                  desc="Practice with diverse interviewers, from strict technical leads to friendly HR managers."
                  icon={<Beaker size={26} />}
                  onClick={() => setActiveView('persona')}
                />
                <FeatureBox 
                  title="Resume AI Heatmap" 
                  desc="Deep-scan your resume against top tech company benchmarks and recruiters' expectations."
                  icon={<FileText size={26} />}
                  onClick={() => setActiveView('resume')}
                />
              </div>

              <div className="dash-card glass-effect" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.5px' }}>Strategic Roadmap</h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Focused milestones to reach SDE-2 at Meta.</p>
                </div>
                
                <div style={{ position: 'relative', minHeight: '180px', borderLeft: '2px solid rgba(255,255,255,0.05)', marginLeft: '12px', marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '32px', paddingLeft: '32px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-38px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>Advanced Data Structures</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Milestone • 2w ago</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-38px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--accent-primary)' }}>Distributed Systems Round</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Currently Active • 65% Ready</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-38px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.2)', fontSize: '1.05rem' }}>Final Behavioral Evaluation</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.1)' }}>Upcoming Focus</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'persona':
        return <PersonaLab />;
      case 'resume':
        return <ResumeAI />;
      case 'setup':
        return <InterviewSetup 
          onStart={(config) => { 
            const trackMapping: any = { 'DSA': 'dsa', 'System Design': 'dev', 'HR': 'hr', 'Mixed': 'dsa' };
            setInterviewConfig({ 
              role: config.role, 
              track: trackMapping[config.type] || 'dsa' 
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
        return <InterviewRoom track={interviewConfig.track} role={interviewConfig.role} onEnd={() => setActiveView('report')} />;
      case 'report':
        return <Report onBack={() => setActiveView('overview')} />;
      default:
        return <div>View {activeView} is under construction</div>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="mesh-glow" />
      
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ marginBottom: '40px', paddingLeft: '12px' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.8px', lineHeight: 1.1 }}>
            AntriView <span style={{ color: 'var(--accent-primary)' }}>AI</span>
          </div>
          <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
            Interview prep workspace
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
            <Info size={20} /> About Us
          </button>
          <button className={`nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>
            <User size={20} /> Settings
          </button>
        </nav>

        {/* Improved Profile Section */}
        <div className="dash-card" style={{ padding: '16px', borderRadius: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flexGrow: 1, overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
            </div>
          </div>
        </div>

        <button className="nav-item" style={{ marginTop: '0', color: '#ef4444' }} onClick={onLogout}>
          <LogOut size={20} /> Logout Account
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

