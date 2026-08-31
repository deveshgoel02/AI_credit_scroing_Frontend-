import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AssessmentResultView from '../components/AssessmentResultView'
import { fetchApplicantDetail } from '../services/api'

export default function ApplicantDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setData(null)
    setError(null)
    fetchApplicantDetail(id)
      .then(setData)
      .catch(() => setError('Assessment not found.'))
  }, [id])

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="text-2xl font-bold">{error}</h1>
        <Link to="/dashboard" className="mt-6 inline-flex text-sm font-semibold" style={{ color: 'var(--brand)' }}>
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  if (!data) {
    return <div className="px-5 py-24 text-center text-sm text-[var(--text-muted)]">Loading assessment…</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="mb-8">
        <Link to="/dashboard" className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{data.applicant_name}</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Assessment #{data.assessment_id} · {new Date(data.created_at).toLocaleString()}
        </p>
      </div>
      <AssessmentResultView data={data} />
    </div>
  )
}
