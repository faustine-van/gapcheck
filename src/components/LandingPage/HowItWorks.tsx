import './styles/HowItWorks.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const STEPS = [
  { n: '1', title: 'Paste your requirements', body: 'Add the assignment brief, rubric, or marking criteria.' },
  { n: '2', title: 'Paste your submission',   body: 'Add your report, README, or upload a file directly.' },
  { n: '3', title: 'Get a scored report',      body: "See what's met, partial, or missing — with suggestions." },
]

export default function HowItWorks() {
  const sectionRef = useScrollReveal('reveal')
  const gridRef    = useScrollReveal('reveal-stagger')

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="hiw-section">
      <p className="hiw-label">How it works</p>
      <div ref={gridRef as React.RefObject<HTMLDivElement>} className="hiw-grid">
        {STEPS.map(s => (
          <div key={s.n} className="hiw-card">
            <span className="hiw-num">{s.n}</span>
            <p className="hiw-title">{s.title}</p>
            <p className="hiw-body">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}