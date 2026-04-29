import './styles/Hero.css'

interface Props {
  onGetStarted: () => void
  loading: boolean
}

export default function Hero({ onGetStarted, loading }: Props) {
  return (
    <section className="hero">
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        Free · No account needed
      </div>
      <h1 className="hero-headline">
        Know what's missing before you hand it in
      </h1>
      <p className="hero-sub">
        GapCheck compares your assignment requirements against your submitted work and tells you exactly what's incomplete.
      </p>
      <button className="hero-cta" onClick={onGetStarted} disabled={loading}>
        {loading ? 'Loading...' : 'Try it free →'}
      </button>
    </section>
  )
}