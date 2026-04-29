import { useState, useRef } from 'react'
import { readFileAsBase64, ACCEPTED_TYPES } from '../../api/ai'
import type { FileAttachment } from '../../api/ai'
import './styles/InputPanel.css'
import './styles/UploadZone.css'

type Mode = 'type' | 'upload'

interface Props {
  label: string
  hint: string
  placeholder: string
  text: string
  onTextChange: (v: string) => void
  file: FileAttachment | null
  onFileChange: (f: FileAttachment | null) => void
  pageEstimate?: string | null
}

const ACCEPTED_MIME = ACCEPTED_TYPES.split(',')

function fileLabel(mimeType: string) {
  if (mimeType === 'application/pdf') return 'PDF'
  if (mimeType.startsWith('image/')) return 'Image'
  if (mimeType.includes('word')) return 'Word document'
  return 'Text file'
}

function loadingLabel(mimeType: string) {
  if (mimeType === 'application/pdf') return 'Reading PDF...'
  if (mimeType.startsWith('image/')) return 'Running OCR...'
  if (mimeType.includes('word')) return 'Reading document...'
  return 'Reading file...'
}

export default function InputPanel({
  label, hint, placeholder,
  text, onTextChange,
  file, onFileChange,
  pageEstimate,
}: Props) {
  const [mode, setMode] = useState<Mode>('type')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
    if (next === 'type') onFileChange(null)
    else onTextChange('')
  }

  const processFile = async (picked: File) => {
    if (!ACCEPTED_MIME.includes(picked.type)) {
      setError(`Unsupported file type. Accepted: PDF, DOCX, JPG, PNG, TXT, MD`)
      return
    }
    setError(null)
    setLoading(true)
    setLoadingMsg(loadingLabel(picked.type))
    try {
      onFileChange(await readFileAsBase64(picked))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read this file.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    await processFile(picked)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const picked = e.dataTransfer.files?.[0]
    if (!picked) return
    if (mode !== 'upload') switchMode('upload')
    await processFile(picked)
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragging(false) }

  return (
    <div
      className="input-panel"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="panel-header">
        <div>
          <p className="panel-label">{label}</p>
          <p className="panel-hint">{hint}</p>
        </div>
        <div className="mode-tabs">
          <button
            className={`mode-tab ${mode === 'type' ? 'active' : ''}`}
            onClick={() => switchMode('type')}
          >Type</button>
          <button
            className={`mode-tab ${mode === 'upload' ? 'active' : ''}`}
            onClick={() => switchMode('upload')}
          >Upload</button>
        </div>
      </div>

      {mode === 'type' && (
        <textarea
          className={`panel-textarea ${dragging ? 'drag-over' : ''}`}
          rows={10}
          placeholder={placeholder}
          value={text}
          onChange={e => onTextChange(e.target.value)}
        />
      )}

      {mode === 'upload' && (
        <div className={`upload-zone ${dragging ? 'drag-over' : ''}`}>
          {loading && (
            <div className="upload-loading">
              <div className="spinner" />
              <span>{loadingMsg}</span>
            </div>
          )}

          {!loading && !file && (
            <>
              <p className="drag-hint">Drop a file here</p>
              <span className="upload-or">or</span>
              <button
                className="upload-btn"
                onClick={() => fileRef.current?.click()}
              >
                Choose file
              </button>
              <span className="upload-types">PDF · DOCX · JPG · PNG · TXT · MD</span>
              <span className="upload-limit">PDF and DOCX: max 25 pages</span>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED_TYPES}
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
              {error && <span className="upload-error">{error}</span>}
            </>
          )}

          {!loading && file && (
            <div className="file-chip">
              <span className="file-chip-name">{file.name}</span>
              <span className="file-chip-type">
                {fileLabel(file.mimeType)}
                {pageEstimate ? ` · ${pageEstimate}` : ''}
              </span>
              <button
                className="file-chip-remove"
                onClick={() => { onFileChange(null); setError(null) }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}