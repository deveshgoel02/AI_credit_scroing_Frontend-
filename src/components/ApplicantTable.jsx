import { useNavigate } from 'react-router-dom'
import RiskBadge from './RiskBadge'
import { formatPercent } from '../utils/risk'

export default function ApplicantTable({ rows }) {
  const navigate = useNavigate()

  if (!rows.length) {
    return (
      <div className="card p-10 text-center text-sm text-[var(--text-muted)]">
        No assessments yet. Run an assessment to see it appear here.
      </div>
    )
  }

  return (
    <div className="card scrollbar-thin overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-hairline)' }}>
            {['Applicant', 'Credit Score', 'Risk', 'Default Probability', 'Recommendation', 'Date'].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.assessment_id}
              onClick={() => navigate(`/applicant/${r.assessment_id}`)}
              className="cursor-pointer border-b transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{r.applicant_name}</td>
              <td className="tabular px-4 py-3 font-bold text-[var(--text-primary)]">{r.credit_score}</td>
              <td className="px-4 py-3">
                <RiskBadge category={r.risk_category} size="sm" />
              </td>
              <td className="tabular px-4 py-3 text-[var(--text-secondary)]">{formatPercent(r.default_probability)}</td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">{r.recommendation}</td>
              <td className="px-4 py-3 text-[var(--text-muted)]">{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
