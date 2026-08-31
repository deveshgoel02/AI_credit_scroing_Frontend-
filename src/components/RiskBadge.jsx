import { riskColor } from '../utils/risk'

export default function RiskBadge({ category, size = 'md' }) {
  const color = riskColor(category)
  const pad = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${pad}`}
      style={{
        color,
        backgroundColor: 'color-mix(in srgb, ' + color + ' 16%, transparent)',
        border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
      }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {category}
    </span>
  )
}
