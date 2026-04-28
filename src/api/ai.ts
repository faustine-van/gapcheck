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

// ── File reading utility ──
export function readFileAsBase64(file: File): Promise<FileAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve({ base64, mimeType: file.type, name: file.name })
    }
    reader.onerror = () =>
      reject(new Error(`Failed to read file: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

export async function compareRequirements(
  requirements: string,
  submission: string,
  requirementsFile?: FileAttachment,
  submissionFile?: FileAttachment,
): Promise<CompareResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  // Extract text from files if provided
  const reqFileText = requirementsFile
    ? await extractTextFromFile(requirementsFile)
    : ''

  const subFileText = submissionFile
    ? await extractTextFromFile(submissionFile)
    : ''

  // Merge typed text + extracted file text
  const reqContent = [requirements.trim(), reqFileText]
    .filter(Boolean)
    .join('\n\n')

  const subContent = [submission.trim(), subFileText]
    .filter(Boolean)
    .join('\n\n')

  const systemPrompt = `You are an academic submission checker.
Your job is to compare assignment requirements against a student's submitted work and determine if each requirement was fulfilled.

For each distinct requirement you identify, determine:
- "met" → clearly fulfilled in the submission
- "partial" → mentioned or attempted but incomplete
- "missing" → not addressed at all

For partial or missing items provide a short specific suggestion (1 sentence).
For met items, suggestion is an empty string.

You MUST respond ONLY with a valid JSON object. No markdown. No explanation. No extra text. Just raw JSON:
{
  "results": [
    {
      "requirement": "short description of the requirement",
      "status": "met",
      "suggestion": ""
    }
  ],
  "overallSummary": "2 sentence summary of what is good and what needs work"
}`

  const userMessage = `ASSIGNMENT REQUIREMENTS:
${reqContent}

STUDENT SUBMISSION:
${subContent}`

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
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message ?? 'Groq API error')
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content ?? ''

  try {
    return JSON.parse(
      raw.replace(/```json|```/g, '').trim()
    ) as CompareResult
  } catch {
    throw new Error('Failed to parse AI response. Please try again.')
  }
}