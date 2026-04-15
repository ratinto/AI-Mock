import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Background from './components/Background'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [view, setViewState] = useState<'home' | 'login' | 'signup' | 'dashboard'>(() => {
    return (sessionStorage.getItem('antriview_view') as any) || 'home';
  });

  const setView = (newView: 'home' | 'login' | 'signup' | 'dashboard') => {
    setViewState(newView);
    sessionStorage.setItem('antriview_view', newView);
  };

  const goToLogin = () => setView('login');
  const goToSignup = () => setView('signup');
  const goToHome = () => setView('home');
  const goToDashboard = () => setView('dashboard');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <Background />
      {view === 'home' && (
        <>
          <Navbar onStart={goToLogin} />
          <main>
            <Hero onStart={goToLogin} />
            
            {/* Trusted By Section */}
            <div style={{ 
              padding: '40px 0', 
              borderBottom: '1px solid var(--border-subtle)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              letterSpacing: '2px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Helping candidates at
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '60px', 
                marginTop: '30px', 
                filter: 'grayscale(1) brightness(2)',
                opacity: 0.4,
                fontSize: '1.5rem',
                fontWeight: 800
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
              padding: '80px 20px 40px', 
              textAlign: 'center', 
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '100px',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              <div style={{ marginBottom: '32px', fontWeight: 700, fontSize: '1.5rem', color: '#fff' }}>
                AntriView.
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                <a href="#" onClick={goToHome} style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Support</a>
              </div>
              <p>© 2026 AntriView AI. Powered by Intelligence.</p>
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
    </div>
  )
}

export default App
