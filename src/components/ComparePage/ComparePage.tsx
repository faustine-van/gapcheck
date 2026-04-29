import { useState } from 'react'
import { compareRequirements } from '../../api/ai'
import type { FileAttachment } from '../../api/ai'
import type { CompareResult } from '../../types'
import InputPanel from './InputPanel'
import ScoreBlock from './ScoreBlock'
import ResultCard from './ResultCard'
import './styles/ComparePage.css'

function estimatePages(file: FileAttachment): string {
  const bytes = Math.ceil((file.base64.length * 3) / 4)
  const kb = bytes / 1024

  if (
    file.mimeType === 'application/pdf' ||
    file.mimeType.includes('word')
  ) {
    const pages = Math.max(1, Math.round(kb / 30))
    return `~${pages} page${pages !== 1 ? 's' : ''}`
  }
  if (file.mimeType.startsWith('image/')) return '1 page'
  if (
    file.mimeType === 'text/plain' ||
    file.mimeType === 'text/markdown'
  ) {
    const pages = Math.max(1, Math.round((kb * 150) / 400))
    return `~${pages} page${pages !== 1 ? 's' : ''}`
  }
  return ''
}

export default function ComparePage() {
  const [reqText, setReqText] = useState('')
  const [subText, setSubText] = useState('')
  const [reqFile, setReqFile] = useState<FileAttachment | null>(null)
  const [subFile, setSubFile] = useState<FileAttachment | null>(null)
  const [result, setResult] = useState<CompareResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasReq = reqText.trim() || reqFile
  const hasSub = subText.trim() || subFile
  const allMet = result?.results.every(r => r.status === 'met')

  const handleCompare = async () => {
    if (!hasReq) return setError('Add your assignment requirements.')
    if (!hasSub) return setError('Add your submitted work.')
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const data = await compareRequirements(
        reqText, subText,
        reqFile ?? undefined,
        subFile ?? undefined,
      )
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="compare-page">
      <div className={`compare-inputs ${result ? 'hidden' : ''}`}>
        <div className="compare-header">
          <h1 className="compare-title">Submission Checker</h1>
          <p className="compare-sub">
            Paste your requirements and your work — we'll tell you what's missing.
          </p>
        </div>

        <div className="compare-grid">
          <InputPanel
            label="Requirements"
            hint="Assignment brief, rubric, or marking criteria"
            placeholder="Paste the assignment instructions here..."
            text={reqText}
            onTextChange={setReqText}
            file={reqFile}
            onFileChange={setReqFile}
            pageEstimate={reqFile ? estimatePages(reqFile) : null}
          />
          <div className="compare-divider"><span>vs</span></div>
          <InputPanel
            label="Your Work"
            hint="Report, README, or description of what you submitted"
            placeholder="Describe what you've submitted or paste your report..."
            text={subText}
            onTextChange={setSubText}
            file={subFile}
            onFileChange={setSubFile}
            pageEstimate={subFile ? estimatePages(subFile) : null}
          />
        </div>

        {error && (
          <div className="compare-error-block">
            <p className="compare-error">{error}</p>
          </div>
        )}

        <div className="compare-actions">
          <button
            className="compare-btn"
            onClick={handleCompare}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check submission'}
          </button>
          {loading && <p className="compare-loading">This takes a few seconds...</p>}
        </div>
      </div>

      {result && (
        <div className="results-section">
          <div className="results-topbar">
            <button className="back-btn" onClick={() => { setResult(null); setError(null) }}>
              Back
            </button>
            <button className="recheck-btn" onClick={handleCompare} disabled={loading}>
              {loading ? 'Checking...' : 'Re-check'}
            </button>
          </div>

          <ScoreBlock result={result} />

          {allMet ? (
            <div className="all-met-banner">
              All requirements met — your submission looks complete.
            </div>
          ) : (
            <div className="results-grid">
              {result.results.map((item, i) => (
                <ResultCard key={i} item={item} />
              ))}
            </div>
          )}

          <button className="reset-btn" onClick={() => {
            setResult(null)
            setReqText(''); setSubText('')
            setReqFile(null); setSubFile(null)
            setError(null)
          }}>
            Start over
          </button>
        </div>
      )}
    </div>
  )
}