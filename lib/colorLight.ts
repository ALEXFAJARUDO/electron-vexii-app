const LIGHT: Record<string, string> = {
  '#92400e': '#fbbf24',
  '#15803d': '#4ade80',
  '#7c3aed': '#c4b5fd',
  '#dc2626': '#fca5a5',
  '#0891b2': '#67e8f9',
  '#d97706': '#fcd34d',
  '#f59e0b': '#fde68a',
  '#0d9488': '#5eead4',
  '#f97316': '#fdba74',
  '#eab308': '#fde047',
  '#22c55e': '#86efac',
  '#ef4444': '#fca5a5',
  '#0ea5e9': '#7dd3fc',
  '#6b7280': '#d1d5db',
  '#64748b': '#cbd5e1',
  '#8b5cf6': '#c4b5fd',
  '#a855f7': '#d8b4fe',
  '#ec4899': '#f9a8d4',
  '#6366f1': '#a5b4fc',
  '#b45309': '#fcd34d',
  '#10b981': '#6ee7b7',
  '#16a34a': '#4ade80',
  '#475569': '#94a3b8',
}

export function iconGradient(color: string): string {
  const light = LIGHT[color] ?? color
  return `linear-gradient(to bottom, ${light}, ${color})`
}
