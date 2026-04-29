import type { CompareResult } from '../../types'
import { buildReportHTML } from './reportTemplate'

export function exportReport(result: CompareResult, score: number) {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(buildReportHTML(result, score, date))
  win.document.close()
  setTimeout(() => win.print(), 400)
}