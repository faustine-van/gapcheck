import './styles/BottomCTA.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

interface Props {
  onGetStarted: () => void
  loading: boolean
}

export default function BottomCTA({ onGetStarted, loading }: Props) {
  const ref = useScrollReveal('reveal')

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="bottom-cta">
      <h2 className="bottom-cta-headline">Stop guessing. Check before you submit.</h2>
      <button className="bottom-cta-btn" onClick={onGetStarted} disabled={loading}>
        {loading ? 'Loading...' : 'Check your submission'}
      </button>
      <p className="bottom-cta-sub">Free. No account needed.</p>
    </section>
  )
}