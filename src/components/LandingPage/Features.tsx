import './styles/Features.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const FEATURES = [
  { title: 'Scored per requirement',         body: 'Each item is marked met, partial, or missing. Not just a pass/fail.' },
  { title: 'Works with any format',          body: 'PDF, DOCX, images, plain text — paste or drag and drop.' },
  { title: 'Re-check without starting over', body: "Fix what's missing and re-run against the same requirements." },
  { title: 'Export your report',             body: 'Download a clean PDF to share with teammates or your lecturer.' },
]

export default function Features() {
  const sectionRef = useScrollReveal('reveal')
  const gridRef    = useScrollReveal('reveal-stagger')

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="features-section">
      <p className="features-label">What you get</p>
      <div ref={gridRef as React.RefObject<HTMLDivElement>} className="features-grid">
        {FEATURES.map(f => (
          <div key={f.title} className="feature-card">
            <p className="feature-title">{f.title}</p>
            <p className="feature-body">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}