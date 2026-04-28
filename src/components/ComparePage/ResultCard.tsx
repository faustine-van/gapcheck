import type { RequirementResult } from '../../types'

const STATUS = {
  met:     { label: 'Met',     color: 'var(--success)' },
  partial: { label: 'Partial', color: 'var(--warning)' },
  missing: { label: 'Missing', color: 'var(--danger)'  },
}

export default function ResultCard({ item }: { item: RequirementResult }) {
  const s = STATUS[item.status]
  return (
    <div className="result-card" style={{ borderLeftColor: s.color }}>
      <span className="result-status" style={{ color: s.color }}>{s.label}</span>
      <p className="result-req">{item.requirement}</p>
      {item.suggestion && <p className="result-suggestion">{item.suggestion}</p>}
    </div>
  )
}