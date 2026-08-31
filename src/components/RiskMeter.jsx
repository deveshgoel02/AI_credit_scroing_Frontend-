import { RISK_ORDER, riskColor, riskPosition } from '../utils/risk'

const LABELS = ['High', 'Elevated', 'Moderate', 'Low', 'Very Low']

export default function RiskMeter({ score, riskCategory }) {
  const pct = riskPosition(score) * 100

  return (
    <div className="w-full">
      <div className="relative h-3 w-full overflow-hidden rounded-full">
        <div
          className="h-full w-full"
          style={{
            background: `linear-gradient(to right, ${[...RISK_ORDER]
              .reverse()
              .map((r) => riskColor(r))
              .join(', ')})`,
          }}
        />
      </div>
      <div className="relative h-6">
        <div
          className="absolute -top-1 flex -translate-x-1/2 flex-col items-center transition-[left] duration-700 ease-out"
          style={{ left: `${pct}%` }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10">
            <path d="M7 0 L14 10 L0 10 Z" fill="var(--text-primary)" />
          </svg>
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
