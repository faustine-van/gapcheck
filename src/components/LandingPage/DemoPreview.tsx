import './styles/DemoPreview.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const CARDS = [
  { status: 'met'     as const, label: 'Met',     req: 'Written report submitted', suggestion: null },
  { status: 'partial' as const, label: 'Partial', req: 'Circuit diagram included but system architecture diagram is missing', suggestion: null },
  { status: 'missing' as const, label: 'Missing', req: 'Cover page not found', suggestion: 'Add a cover page with your name, student ID, module, and submission date.' },
]

export default function DemoPreview() {
  const sectionRef = useScrollReveal('reveal')
  const windowRef  = useScrollReveal('reveal')

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="demo-section">
      <p className="demo-eyebrow">Sample report</p>
      <h2 className="demo-title">What you'll see after a check</h2>

      <div ref={windowRef as React.RefObject<HTMLDivElement>} className="demo-window">
        <div className="demo-titlebar">
          <span className="demo-dot" />
          <span className="demo-dot" />
          <span className="demo-dot" />
          <span className="demo-filename">report · ee2024-lab3.pdf</span>
        </div>

        <div className="demo-body">
          <div className="demo-score-block">
            <div className="demo-score-left">
              <p className="demo-score-label">Overall score</p>
              <p className="demo-score-num">72%</p>
              <p className="demo-score-sub">8 of 11 requirements met</p>
            </div>
            <div className="demo-score-bar-group">
              <div className="demo-score-bar">
                <div className="demo-bar-seg demo-bar-met"     style={{ flex: 8 }} />
                <div className="demo-bar-seg demo-bar-partial" style={{ flex: 1 }} />
                <div className="demo-bar-seg demo-bar-missing" style={{ flex: 2 }} />
              </div>
              <div className="demo-bar-legend">
                <span>met</span>
                <span>partial</span>
                <span>missing</span>
              </div>
            </div>
          </div>

          <div className="demo-divider" />

          <div className="demo-cards">
            {CARDS.map(card => (
              <div key={card.status} className={`demo-card demo-card--${card.status}`}>
                <span className={`demo-card-label demo-label--${card.status}`}>{card.label}</span>
                <p className="demo-card-req">{card.req}</p>
                {card.suggestion && (
                  <p className="demo-card-suggestion">
                    <span className="demo-suggestion-key">Suggestion</span>
                    {card.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}