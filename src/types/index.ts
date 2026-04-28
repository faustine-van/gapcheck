export type RequirementStatus = 'met' | 'partial' | 'missing'

export interface RequirementResult {
  requirement: string
  status: RequirementStatus
  suggestion: string
}

export interface CompareResult {
  results: RequirementResult[]
  overallSummary: string
}

export type Page = 'compare'