import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AssessmentResultView from '../components/AssessmentResultView'

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState(location.state?.result || null)

  useEffect(() => {
    if (data) return
    const stored = sessionStorage.getItem('crediai_last_result')
    if (stored) {
      setData(JSON.parse(stored))
    }
  }, [data])

  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="text-2xl font-bold">No assessment found</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Submit the assessment form first to see a credit score result here.
        </p>
        <Link
          to="/assess"
          className="mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white"
          style={{ background: 'var(--brand)' }}
        >
          Go to Assessment
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{data.applicant_name}</h1>
          <p className="text-sm text-[var(--text-secondary)]">Assessment #{data.assessment_id}</p>
        </div>
        <button
          onClick={() => navigate('/assess')}
          className="rounded-lg border px-4 py-2 text-sm font-semibold"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          New Assessment
        </button>
      </div>
      <AssessmentResultView data={data} />
    </div>
  )
}
