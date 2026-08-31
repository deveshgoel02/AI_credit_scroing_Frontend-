import FeatureCard from './FeatureCard'
import RiskMeter from './RiskMeter'
import ScoreGauge from './ScoreGauge'
import SHAPChart from './SHAPChart'
import { formatPercent } from '../utils/risk'

const RECOMMENDATION_TONE = {
  Eligible: 'var(--status-good)',
  'Eligible with caution': 'var(--status-warning)',
  'Manual review required': 'var(--status-serious)',
  'Do not automatically approve': 'var(--status-critical)',
}

export default function AssessmentResultView({ data }) {
  const tone = RECOMMENDATION_TONE[data.recommendation] || 'var(--text-primary)'

  return (
    <div className="space-y-10">
      <div className="card p-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-around">
          <ScoreGauge score={data.credit_score} riskCategory={data.risk_category} />
          <div className="grid w-full max-w-sm grid-cols-2 gap-4 sm:w-auto">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Estimated Default Probability
              </div>
              <div className="tabular mt-1 text-2xl font-extrabold">
                {formatPercent(data.default_probability)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Interest Tier
              </div>
              <div className="mt-1 text-2xl font-extrabold">{data.interest_tier}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Loan Recommendation
              </div>
              <div className="mt-1 text-xl font-extrabold uppercase" style={{ color: tone }}>
                {data.recommendation}
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{data.recommendation_detail}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <RiskMeter score={data.credit_score} riskCategory={data.risk_category} />
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-3 text-center text-xs font-medium"
        style={{ background: 'color-mix(in srgb, var(--status-warning) 14%, transparent)', color: 'var(--text-secondary)' }}
      >
        ⚠ This is a prototype assessment for demonstration purposes only and does not
        constitute a real lending decision. Model version {data.model_version}.
      </div>

      <div>
        <h2 className="text-xl font-bold">Why was this score generated?</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          SHAP values show how each factor pushed the score up or down relative to the
          model's baseline. This explains the model's prediction, not real-world causality.
        </p>
        <div className="card mt-4 p-5">
          <SHAPChart factors={data.explanations} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--positive)' }}>
            Top Positive Factors
          </h3>
          <div className="space-y-3">
            {data.positive_factors.length ? (
              data.positive_factors.map((f) => <FeatureCard key={f.feature} factor={f} />)
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No positive contributing factors identified.</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--negative)' }}>
            Top Risk Factors
          </h3>
          <div className="space-y-3">
            {data.negative_factors.length ? (
              data.negative_factors.map((f) => <FeatureCard key={f.feature} factor={f} />)
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No negative contributing factors identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
