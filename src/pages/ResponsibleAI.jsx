import { useEffect, useState } from 'react'
import FeatureImportanceChart from '../components/FeatureImportanceChart'
import { fetchModelMetrics } from '../services/api'

const PRINCIPLES = [
  {
    title: 'Synthetic data only',
    body: 'Every applicant in this prototype is generated synthetically. No real financial records were used to train or evaluate the model.',
  },
  {
    title: 'Demonstration purposes only',
    body: 'CrediAI is a hackathon/educational prototype. It is not a production lending system and has not been validated for real-world deployment.',
  },
  {
    title: 'Protected characteristics excluded',
    body: 'Race, caste, religion, ethnicity, health status, political affiliation, sexual orientation, and precise location are never used as inputs to the model.',
  },
  {
    title: 'Not a final lending decision',
    body: 'Every prediction should be treated as one input into a broader decision process, not an automated approval or denial.',
  },
  {
    title: 'Alternative data can contain bias',
    body: 'Behavioral and financial data can still correlate with protected characteristics indirectly. Alternative data reduces, but does not eliminate, the risk of biased outcomes.',
  },
  {
    title: 'Human review for high-impact decisions',
    body: 'Elevated and high-risk assessments are routed to "manual review" or "do not auto-approve" rather than being auto-actioned, by design.',
  },
  {
    title: 'Ongoing performance monitoring',
    body: 'Model performance should be tracked continuously after deployment, including for drift and for disparities in outcomes across applicant segments. See the Model Performance page.',
  },
  {
    title: 'Right to understand and challenge',
    body: 'Applicants should be able to see which factors influenced their score and have a path to contest or clarify an assessment. This is why every score ships with a full SHAP explanation.',
  },
]

export default function ResponsibleAI() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    fetchModelMetrics().then(setMetrics).catch(() => setMetrics(null))
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-black tracking-tight">Responsible AI</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Principles guiding how this prototype was built, and what it deliberately does not
        claim to do.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="card p-5">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">{p.title}</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{p.body}</p>
          </div>
        ))}
      </div>

      {metrics && (
        <div className="card mt-10 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide">Feature Reliance (Fairness Monitoring)</h3>
          <p className="mt-1 mb-4 text-xs text-[var(--text-secondary)]">
            Reviewing which features the model relies on most is a basic first check for proxy
            discrimination — a feature that unexpectedly dominates predictions deserves scrutiny
            for whether it correlates with a protected characteristic.
          </p>
          <FeatureImportanceChart items={metrics.feature_importance} />
        </div>
      )}
    </div>
  )
}
