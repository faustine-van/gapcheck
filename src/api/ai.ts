import type { CompareResult } from '../types'
import { extractTextFromFile } from '../utils/extractText'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

export interface FileAttachment {
  base64: string
  mimeType: string
  name: string
}

export const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'text/markdown',
].join(',')

export function readFileAsBase64(file: File): Promise<FileAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve({ base64: result.split(',')[1], mimeType: file.type, name: file.name })
    }
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

function parseGroqError(body: { error?: { message?: string; code?: string } }): string {
  const msg = body?.error?.message ?? ''
  const code = body?.error?.code ?? ''

  if (code === 'rate_limit_exceeded' || msg.includes('rate limit')) {
    return 'Rate limit reached. Wait a moment and try again.'
  }
  if (
    msg.includes('context') ||
    msg.includes('token') ||
    msg.includes('length') ||
    msg.includes('too large')
  ) {
    return 'Your files are too large to process together. Try pasting the key sections instead of uploading the full document.'
  }
  return msg || 'Something went wrong. Please try again.'
}

export async function compareRequirements(
  requirements: string,
  submission: string,
  requirementsFile?: FileAttachment,
  submissionFile?: FileAttachment,
): Promise<CompareResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  const reqFileText  = requirementsFile ? await extractTextFromFile(requirementsFile) : ''
  const subFileText  = submissionFile   ? await extractTextFromFile(submissionFile)   : ''

  const reqContent = [requirements.trim(), reqFileText].filter(Boolean).join('\n\n')
  const subContent = [submission.trim(),   subFileText].filter(Boolean).join('\n\n')

  const systemPrompt = `You are an academic submission checker.
Compare assignment requirements against a student's submitted work and determine if each requirement was fulfilled.

For each distinct requirement identify:
- "met" → clearly fulfilled
- "partial" → attempted but incomplete
- "missing" → not addressed at all

For partial or missing items provide a short specific suggestion (1 sentence).
For met items suggestion is an empty string.

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "results": [
    { "requirement": "...", "status": "met", "suggestion": "" }
  ],
  "overallSummary": "2 sentence summary"
}`

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `REQUIREMENTS:\n${reqContent}\n\nSUBMISSION:\n${subContent}` },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(parseGroqError(body))
  }

  const data = await response.json()
  const raw  = data.choices?.[0]?.message?.content ?? ''

  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim()) as CompareResult
  } catch {
    throw new Error('Failed to parse AI response. Please try again.')
  }
}