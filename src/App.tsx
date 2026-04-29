import { useState } from 'react'
import './App.css'
import LandingPage from './components/LandingPage/LandingPage'
import ComparePage from './components/ComparePage/ComparePage'

type View = 'landing' | 'tool'

export default function App() {
  const [view, setView] = useState<View>('landing')

  return (
    <div id="app-wrapper">
      <header id="app-header">
        <div className="header-inner">
          <div className="header-brand" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
            <svg className="logo-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="7" fill="#1a3a5c"/>
              <rect x="7" y="18" width="4" height="8" fill="#4a7fc1" rx="1"/>
              <rect x="13" y="14" width="4" height="12" fill="#4a7fc1" rx="1"/>
              <rect x="19" y="10" width="4" height="16" fill="#4a7fc1" rx="1"/>
              <polyline points="7,16 13,10 19,13 25,7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="app-title">GapCheck</span>
          </div>
          {view === 'landing' && (
            <button className="nav-btn active" onClick={() => setView('tool')}>
              Try it free
            </button>
          )}
          {view === 'tool' && (
            <button className="nav-btn" onClick={() => setView('landing')}>
              Home
            </button>
          )}
        </div>
      </header>

      <main>
        {view === 'landing'
          ? <LandingPage onGetStarted={() => setView('tool')} />
          : <ComparePage />
        }
      </main>

        <footer id="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="7" fill="#1a3a5c"/>
              <rect x="7" y="18" width="4" height="8" fill="#4a7fc1" rx="1"/>
              <rect x="13" y="14" width="4" height="12" fill="#4a7fc1" rx="1"/>
              <rect x="19" y="10" width="4" height="16" fill="#4a7fc1" rx="1"/>
              <polyline points="7,16 13,10 19,13 25,7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="footer-brand-name">GapCheck</span>
            <span className="footer-brand-tag">free</span>
          </div>

          <div className="footer-links">
            
            <a  className="footer-link"
              href="https://github.com/your-username/gapcheck"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="footer-link"
              href="https://console.groq.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Groq
            </a>
          </div>

          <span className="footer-copy">
            © {new Date().getFullYear()} GapCheck
          </span>
          </div>
      </footer>
    </div>
  )
}