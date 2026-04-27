import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Background from './components/Background'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import AboutUs from './components/AboutUs'
import NotFound from './components/NotFound'
import Contact from './components/Contact'
import './App.css'

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar onStart={() => navigate('/login')} onAbout={() => navigate('/about')} />
      <main>
        <Hero onStart={() => navigate('/login')} />
        
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
        <Pricing onStart={() => navigate('/login')} />
        
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
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Company</div>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }} style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} style={{ color: 'inherit', textDecoration: 'none' }}>Support</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}

function About() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar onStart={() => navigate('/login')} onAbout={() => navigate('/about')} />
      <main style={{ paddingTop: '120px', paddingLeft: '60px', paddingRight: '60px' }}>
        <AboutUs onBack={() => navigate('/')} onStart={() => navigate('/login')} />
      </main>
    </>
  )
}

function App() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onBack={() => navigate('/')} onLogin={() => navigate('/dashboard')} onSignup={() => navigate('/signup')} />} />
        <Route path="/signup" element={<Signup onBack={() => navigate('/')} onLogin={() => navigate('/login')} onSignup={() => navigate('/dashboard')} />} />
        <Route path="/dashboard" element={<Dashboard onLogout={() => { sessionStorage.clear(); navigate('/'); }} />} />
        <Route path="/contact" element={<Contact />} />
        {/* Catch-all route — shows 404 for any unmatched URL (Graceful Degradation) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
