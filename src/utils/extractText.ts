import type { FileAttachment } from '../api/ai'

// ── PDF extraction ──
async function extractFromPdf(base64: string): Promise<string> {
  const pdfjs = await import('pdfjs-dist')

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  const pdf = await pdfjs.getDocument({ data: bytes }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item: unknown) => {
        const i = item as { str?: string }
        return i.str ?? ''
      })
      .join(' ')
    pages.push(pageText)
  }

  return pages.join('\n\n').trim()
}

// ── Image OCR extraction ──
async function extractFromImage(base64: string, mimeType: string): Promise<string> {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng')
  const imageData = `data:${mimeType};base64,${base64}`
  const { data } = await worker.recognize(imageData)
  await worker.terminate()
  return data.text.trim()
}

// ── Word document extraction ──
async function extractFromDocx(base64: string): Promise<string> {
  const mammoth = await import('mammoth')

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  const result = await mammoth.extractRawText({ arrayBuffer: bytes.buffer })
  return result.value.trim()
}

// ── Plain text / markdown ──
function extractFromText(base64: string): string {
  return atob(base64)
}

// ── Main entry point ──
export async function extractTextFromFile(
  file: FileAttachment
): Promise<string> {
  const { base64, mimeType } = file

  if (mimeType === 'application/pdf') {
    return extractFromPdf(base64)
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return extractFromDocx(base64)
  }

  if (mimeType.startsWith('image/')) {
    return extractFromImage(base64, mimeType)
  }

  if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
    return extractFromText(base64)
  }

  throw new Error(`Unsupported file type: ${mimeType}`)
}