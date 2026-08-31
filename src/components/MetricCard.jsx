export default function MetricCard({ label, value, sublabel, accent }) {
  return (
    <div className="card p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>
      <div
        className="tabular mt-2 text-3xl font-extrabold"
        style={{ color: accent || 'var(--text-primary)' }}
      >
        {value}
      </div>
      {sublabel && <div className="mt-1 text-sm text-[var(--text-secondary)]">{sublabel}</div>}
    </div>
  )
}
