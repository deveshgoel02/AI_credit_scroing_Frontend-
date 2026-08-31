import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RiskBadge from '../components/RiskBadge'
import { fetchDemoApplicants, predictCreditScore } from '../services/api'
import { formatPercent } from '../utils/risk'

function qualitative(value, thresholds) {
  const [low, high] = thresholds
  if (value >= high) return 'Strong'
  if (value >= low) return 'Moderate'
  return 'Weak'
}

export default function FinancialInclusion() {
  const [result, setResult] = useState(null)
  const [features, setFeatures] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const demos = await fetchDemoApplicants()
        const applicantE = demos.find((d) => d.id === 'E')
        if (!applicantE) throw new Error('Demo applicant not found')
        const prediction = await predictCreditScore({
          ...applicantE.features,
          applicant_name: applicantE.applicant_name,
        })
        if (cancelled) return
        setFeatures(applicantE.features)
        setResult(prediction)
      } catch {
        if (!cancelled) setError('Could not load the financial inclusion demo. Is the backend running?')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const paymentReliability = features
    ? qualitative(
        (features.utility_payment_consistency + features.rent_payment_consistency + features.bill_payment_consistency) / 3,
        [60, 85],
      )
    : null
  const incomeStability = features ? qualitative(features.income_stability_score, [50, 75]) : null
  const savingsBehavior = features ? qualitative(features.savings_rate * 100, [8, 18]) : null
  const cashFlow = features ? qualitative(100 - features.cash_flow_volatility * 100, [60, 80]) : null

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-black tracking-tight">Financial Inclusion</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
        Millions of people have little or no traditional credit history but still manage
        money responsibly — paying rent and utilities on time, saving regularly, and
        keeping a stable cash flow. CrediAI evaluates that behavior directly instead of
        requiring a conventional credit file.
      </p>

      {error && <div className="card mt-8 p-6 text-sm text-[var(--text-secondary)]">{error}</div>}

      {!error && !result && (
        <div className="card mt-8 p-10 text-center text-sm text-[var(--text-muted)]">Loading comparison…</div>
      )}

      {result && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Traditional Credit Profile
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-hairline)' }}>
                  <dt className="text-[var(--text-secondary)]">Credit History</dt>
                  <dd className="font-semibold">Limited</dd>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-hairline)' }}>
                  <dt className="text-[var(--text-secondary)]">Previous Loans</dt>
                  <dd className="font-semibold">{features.existing_loans}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--text-secondary)]">Traditional Credit Score</dt>
                  <dd className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Not Available
                  </dd>
                </div>
              </dl>
            </div>

            <div className="card p-6" style={{ borderColor: 'var(--brand)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--brand)' }}>
                CrediAI Alternative Assessment
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ['Payment Reliability', paymentReliability],
                  ['Income Stability', incomeStability],
                  ['Savings Behavior', savingsBehavior],
                  ['Cash Flow', cashFlow],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-hairline)' }}>
                    <dt className="text-[var(--text-secondary)]">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Alternative Credit Score
                  </div>
                  <div className="tabular text-3xl font-black">{result.credit_score}</div>
                </div>
                <RiskBadge category={result.risk_category} />
              </div>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">
                Estimated default probability: {formatPercent(result.default_probability)}
              </p>
            </div>
          </div>

          <div className="card mt-8 p-5 text-sm text-[var(--text-secondary)]">
            This demonstrates that an applicant with no traditional credit history can still
            be evaluated fairly using relevant financial behavior.{' '}
            <strong className="text-[var(--text-primary)]">
              CrediAI does not claim to replace established credit bureaus
            </strong>{' '}
            — it is a complementary signal intended to widen access for people bureaus
            currently cannot score.
          </div>

          <div className="mt-6 text-center">
            <Link to="/assess" className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>
              Try your own thin-file profile →
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
