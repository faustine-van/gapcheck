import { useState } from 'react'
import { compareRequirements } from '../../api/ai'
import type { FileAttachment } from '../../api/ai'
import type { CompareResult } from '../../types'
import InputPanel from './InputPanel'
import ScoreBlock from './ScoreBlock'
import ResultCard from './ResultCard'
import './ComparePage.css'

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

  const handleCompare = async () => {
    if (!hasReq) return setError('Add your assignment requirements.')
    if (!hasSub) return setError('Add your submitted work.')

    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const data = await compareRequirements(reqText, subText, reqFile ?? undefined, subFile ?? undefined)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setReqText(''); setSubText('')
    setReqFile(null); setSubFile(null)
    setResult(null); setError(null)
  }

  return (
    <div className="compare-page">
      {!result && (
        <>
          <div className="compare-header">
            <h1 className="compare-title">Submission Checker</h1>
            <p className="compare-sub">Paste your requirements and your work — we'll tell you what's missing.</p>
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
            />
            <div className="compare-divider">
              <span>vs</span>
            </div>
            <InputPanel
              label="Your Work"
              hint="Report, README, or description of what you submitted"
              placeholder="Describe what you've submitted or paste your report..."
              text={subText}
              onTextChange={setSubText}
              file={subFile}
              onFileChange={setSubFile}
            />
          </div>

          {error && <p className="compare-error">{error}</p>}

          <div className="compare-actions">
            <button className="compare-btn" onClick={handleCompare} disabled={loading}>
              {loading ? 'Checking...' : 'Check submission'}
            </button>
            {loading && <p className="compare-loading">This takes a few seconds...</p>}
          </div>
        </>
      )}

      {result && (
        <div className="results-section">
          <ScoreBlock result={result} />
          <div className="results-grid">
            {result.results.map((item, i) => <ResultCard key={i} item={item} />)}
          </div>
          <button className="reset-btn" onClick={reset}>Check another submission</button>
        </div>
      )}
    </div>
  )
}