import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Background from './components/Background'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import AboutUs from './components/AboutUs'
import './App.css'

function App() {
  const [view, setViewState] = useState<'home' | 'login' | 'signup' | 'dashboard' | 'about'>(() => {
    return (sessionStorage.getItem('antriview_view') as any) || 'home';
  });

  const setView = (newView: 'home' | 'login' | 'signup' | 'dashboard' | 'about') => {
    setViewState(newView);
    sessionStorage.setItem('antriview_view', newView);
  };

  const goToLogin = () => setView('login');
  const goToSignup = () => setView('signup');
  const goToHome = () => setView('home');
  const goToDashboard = () => setView('dashboard');
  const goToAbout = () => setView('about');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <Background />
      {view === 'home' && (
        <>
          <Navbar onStart={goToLogin} onAbout={goToAbout} />
          <main>
            <Hero onStart={goToLogin} />
            
            {/* Trusted By Section */}
            <div style={{ 
              padding: '60px 0', 
              borderBottom: '1px solid var(--border-subtle)',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              Trusted by candidates at
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '80px', 
                marginTop: '40px', 
                filter: 'grayscale(1) contrast(1.2)',
                opacity: 0.25,
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '-1px'
              }}>
                <span>GOOGLE</span>
                <span>META</span>
                <span>STRIPE</span>
                <span>AIRBNB</span>
              </div>
            </div>

            <Features />
            <Pricing onStart={goToLogin} />
            
            {/* Footer */}
            <footer style={{ 
              padding: '100px 60px 60px', 
              textAlign: 'left', 
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '120px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              maxWidth: '1200px',
              margin: '120px auto 0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
                <div>
                  <div style={{ marginBottom: '24px', fontWeight: 900, fontSize: '1.8rem', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>
                    AntriView.
                  </div>
                  <p style={{ maxWidth: '300px', lineHeight: 1.6, marginBottom: '24px' }}>
                    The premium workspace for focused technical interview preparation.
                  </p>
                  <p>© 2026 AntriView AI. All rights reserved.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '80px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Product</div>
                    <a href="#" onClick={goToHome} style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Company</div>
                    <a href="#" onClick={goToAbout} style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Support</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </>
      )}

      {view === 'login' && (
        <Login onBack={goToHome} onLogin={goToDashboard} onSignup={goToSignup} />
      )}

      {view === 'signup' && (
        <Signup onBack={goToHome} onLogin={goToLogin} onSignup={goToDashboard} />
      )}

      {view === 'dashboard' && (
        <Dashboard onLogout={() => {
          sessionStorage.clear();
          setView('home');
        }} />
      )}

      {view === 'about' && (
        <>
          <Navbar onStart={goToLogin} onAbout={goToAbout} />
          <main style={{ paddingTop: '120px', paddingLeft: '60px', paddingRight: '60px' }}>
            <AboutUs onBack={goToHome} onStart={goToLogin} />
          </main>
        </>
      )}
    </div>
  )
}

export default App
