import { useState, useRef } from 'react'
import { readFileAsBase64, ACCEPTED_TYPES } from '../../api/ai'
import type { FileAttachment } from '../../api/ai'

type Mode = 'type' | 'upload'

interface Props {
  label: string
  hint: string
  placeholder: string
  text: string
  onTextChange: (v: string) => void
  file: FileAttachment | null
  onFileChange: (f: FileAttachment | null) => void
}

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
}: Props) {
  const [mode, setMode] = useState<Mode>('type')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
    if (next === 'type') onFileChange(null)
    else onTextChange('')
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    setError(null)
    setLoading(true)
    setLoadingMsg(loadingLabel(picked.type))
    try {
      onFileChange(await readFileAsBase64(picked))
    } catch {
      setError('Could not read this file. Try another.')
    } finally {
      setLoading(false)
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="input-panel">
      <div className="panel-header">
        <div>
          <p className="panel-label">{label}</p>
          <p className="panel-hint">{hint}</p>
        </div>
        <div className="mode-tabs">
          <button className={`mode-tab ${mode === 'type' ? 'active' : ''}`} onClick={() => switchMode('type')}>Type</button>
          <button className={`mode-tab ${mode === 'upload' ? 'active' : ''}`} onClick={() => switchMode('upload')}>Upload</button>
        </div>
      </div>

      {mode === 'type' && (
        <textarea
          className="panel-textarea"
          rows={10}
          placeholder={placeholder}
          value={text}
          onChange={e => onTextChange(e.target.value)}
        />
      )}

      {mode === 'upload' && (
        <div className="upload-zone">
          {loading && (
            <div className="upload-loading">
              <div className="spinner" />
              <span>{loadingMsg}</span>
            </div>
          )}

          {!loading && !file && (
            <>
              <button className="upload-btn" onClick={() => fileRef.current?.click()}>
                Choose file
              </button>
              <span className="upload-types">PDF · DOCX · JPG · PNG · TXT · MD</span>
              <input ref={fileRef} type="file" accept={ACCEPTED_TYPES} style={{ display: 'none' }} onChange={handleFile} />
              {error && <span className="upload-error">{error}</span>}
            </>
          )}

          {!loading && file && (
            <div className="file-chip">
              <span className="file-chip-name">{file.name}</span>
              <span className="file-chip-type">{fileLabel(file.mimeType)}</span>
              <button className="file-chip-remove" onClick={() => { onFileChange(null); setError(null) }}>Remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}