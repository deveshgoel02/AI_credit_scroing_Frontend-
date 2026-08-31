import { formatFeatureValue, getNarrative } from '../utils/narratives'

export default function FeatureCard({ factor }) {
  const { feature, value, impact, direction } = factor
  const [title, description] = getNarrative(feature, direction)
  const positive = direction === 'positive'
  const color = positive ? 'var(--positive)' : 'var(--negative)'

  return (
    <div
      className="card p-4"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-base" style={{ color }}>
            {positive ? '✓' : '⚠'}
          </span>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
            <div className="mt-2 text-xs text-[var(--text-muted)]">
              {formatFeatureValue(feature, value)}
            </div>
          </div>
        </div>
        <div
          className="tabular shrink-0 rounded-md px-2 py-1 text-xs font-bold"
          style={{
            color,
            backgroundColor: 'color-mix(in srgb, ' + color + ' 14%, transparent)',
          }}
        >
          {impact > 0 ? '+' : ''}
          {impact} pts
        </div>
      </div>
    </div>
  )
}
