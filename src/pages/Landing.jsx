import { Link } from 'react-router-dom'

const FEATURES = [
  {
    title: 'AI Risk Prediction',
    icon: '📈',
    body: 'An XGBoost model trained on alternative financial and behavioral signals estimates default risk in real time.',
  },
  {
    title: 'Explainable Decisions',
    icon: '🔍',
    body: 'Every score comes with a SHAP-powered breakdown of exactly which factors pushed it up or down, and by how many points.',
  },
  {
    title: 'Financial Inclusion',
    icon: '🤝',
    body: 'Applicants with no traditional credit history can still be assessed fairly using rent, utility, and cash-flow behavior.',
  },
]

export default function Landing() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-20 text-center sm:pt-28">
        <div
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide"
          style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)' }}
        >
          Educational Prototype · Synthetic Data
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          Credi<span style={{ color: 'var(--brand)' }}>AI</span>
        </h1>
        <p className="mt-3 text-lg font-semibold text-[var(--text-secondary)] sm:text-xl">
          Alternative AI Credit Scoring
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--text-secondary)]">
          Assess creditworthiness using financial behavior, not just traditional credit
          history.
        </p>
        <Link
          to="/assess"
          className="mt-8 inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg"
          style={{ background: 'var(--brand)' }}
        >
          Start Assessment →
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">See it work on 5 demo applicants</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              From a strong financial profile to a thin-file applicant with no traditional
              credit history.
            </p>
          </div>
          <Link
            to="/assess"
            className="rounded-lg border px-5 py-2.5 text-sm font-semibold"
            style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-primary)' }}
          >
            Try a demo applicant
          </Link>
        </div>
      </section>
    </div>
  )
}
