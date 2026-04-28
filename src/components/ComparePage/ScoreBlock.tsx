import type { CompareResult } from '../../types'

export default function ScoreBlock({ result }: { result: CompareResult }) {
  const met = result.results.filter(r => r.status === 'met').length
  const partial = result.results.filter(r => r.status === 'partial').length
  const missing = result.results.filter(r => r.status === 'missing').length
  const total = result.results.length
  const score = total > 0 ? Math.round(((met + partial * 0.5) / total) * 100) : 0

  return (
    <div className="score-block">
      <div className="score-top">
        <div>
          <p className="score-title">Submission Score</p>
          <p className="score-summary">{result.overallSummary}</p>
        </div>
        <span className="score-pct">{score}%</span>
      </div>
      <div className="score-bar-bg">
        <div className="score-bar-fill" style={{ width: `${score}%` }} />
      </div>
      <div className="score-legend">
        <span style={{ color: 'var(--success)' }}>Met: {met}</span>
        <span style={{ color: 'var(--warning)' }}>Partial: {partial}</span>
        <span style={{ color: 'var(--danger)' }}>Missing: {missing}</span>
      </div>
    </div>
  )
}