import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplicantForm from '../components/ApplicantForm'
import { fetchDemoApplicants, predictCreditScore } from '../services/api'
import { defaultFeatureValues } from '../utils/featureSchema'

export default function Assessment() {
  const navigate = useNavigate()
  const [demos, setDemos] = useState([])
  const [applicantName, setApplicantName] = useState('')
  const [initialValues, setInitialValues] = useState(defaultFeatureValues())
  const [resetKey, setResetKey] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDemoApplicants().then(setDemos).catch(() => setDemos([]))
  }, [])

  function loadDemo(demo) {
    setApplicantName(demo.applicant_name)
    setInitialValues(demo.features)
    setResetKey((k) => k + 1)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(features) {
    setSubmitting(true)
    setError(null)
    try {
      const result = await predictCreditScore({ ...features, applicant_name: applicantName || undefined })
      sessionStorage.setItem('crediai_last_result', JSON.stringify(result))
      navigate('/result')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-black tracking-tight">Applicant Assessment</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Enter alternative financial and behavioral data below. All fields are required and
        validated against realistic ranges.
      </p>

      {demos.length > 0 && (
        <div className="card mt-6 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
            Try a demo applicant
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {demos.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => loadDemo(d)}
                title={d.narrative}
                className="rounded-lg border px-3 py-2 text-xs font-semibold transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
                style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-secondary)' }}
              >
                {d.applicant_name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <ApplicantForm
          key={resetKey}
          initialValues={initialValues}
          applicantName={applicantName}
          onApplicantNameChange={setApplicantName}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      </div>
    </div>
  )
}
