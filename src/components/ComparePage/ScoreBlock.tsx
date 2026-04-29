import type { CompareResult } from '../../types'
import { exportReport } from './exportReport'
import './styles/ScoreBlock.css'

function scoreColor(score: number) {
  if (score >= 80) return 'var(--success)'
  if (score >= 50) return 'var(--warning)'
  return 'var(--danger)'
}

export default function ScoreBlock({ result }: { result: CompareResult }) {
  const met     = result.results.filter(r => r.status === 'met').length
  const partial = result.results.filter(r => r.status === 'partial').length
  const missing = result.results.filter(r => r.status === 'missing').length
  const total   = result.results.length
  const score   = total > 0 ? Math.round(((met + partial * 0.5) / total) * 100) : 0

  return (
    <div className="score-block">
      <div className="score-top">
        <div>
          <p className="score-title">Submission Score</p>
          <p className="score-summary">{result.overallSummary}</p>
        </div>
        <div className="score-right">
          <span className="score-pct" style={{ color: scoreColor(score) }}>
            {score}%
          </span>
          <button className="export-btn" onClick={() => exportReport(result, score)}>
            Export report
          </button>
        </div>
      </div>
      <div className="score-bar-bg">
        <div
          className="score-bar-fill"
          style={{ width: `${score}%`, background: scoreColor(score) }}
        />
      </div>
      <div className="score-legend">
        <span style={{ color: 'var(--success)' }}>Met: {met}</span>
        <span style={{ color: 'var(--warning)' }}>Partial: {partial}</span>
        <span style={{ color: 'var(--danger)' }}>Missing: {missing}</span>
      </div>
    </div>
  )
}