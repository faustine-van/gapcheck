import './App.css'
import ComparePage from './components/ComparePage/ComparePage'

export default function App() {
  return (
    <div id="app-wrapper">
      <header id="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <svg className="logo-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="7" fill="#1a3a5c"/>
              <rect x="7" y="18" width="4" height="8" fill="#4a7fc1" rx="1"/>
              <rect x="13" y="14" width="4" height="12" fill="#4a7fc1" rx="1"/>
              <rect x="19" y="10" width="4" height="16" fill="#4a7fc1" rx="1"/>
              <polyline points="7,16 13,10 19,13 25,7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="app-title">GapCheck</span>
          </div>
        </div>
      </header>

      <main>
        <ComparePage />
      </main>

      <footer id="app-footer">
        GapCheck — built for students
      </footer>
    </div>
  )
}