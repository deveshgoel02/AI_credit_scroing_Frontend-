import { useState } from 'react'
import { ALL_FIELDS, FORM_SECTIONS, defaultFeatureValues } from '../utils/featureSchema'

function fieldToApiValue(field, raw) {
  if (field.type === 'boolean') return raw ? 1 : 0
  const num = Number(raw)
  return Number.isFinite(num) ? num : field.default
}

function ScoreField({ field, value, onChange }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">{field.label}</label>
        <span className="tabular text-sm font-semibold text-[var(--text-primary)]">{value}/100</span>
      </div>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--brand)]"
      />
    </div>
  )
}

function RatioField({ field, value, onChange }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">{field.label}</label>
        <span className="tabular text-sm font-semibold text-[var(--text-primary)]">
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--brand)]"
      />
    </div>
  )
}

function NumberField({ field, value, onChange, prefix, suffix }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{field.label}</label>
      <div className="flex items-center rounded-lg border" style={{ borderColor: 'var(--border-hairline)', background: 'var(--surface-2)' }}>
        {prefix && <span className="pl-3 text-sm text-[var(--text-muted)]">{prefix}</span>}
        <input
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="tabular w-full bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
        />
        {suffix && <span className="pr-3 text-sm text-[var(--text-muted)]">{suffix}</span>}
      </div>
    </div>
  )
}

function BooleanField({ field, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{field.label}</label>
      <div className="flex gap-2">
        {[
          { label: 'No', v: 0 },
          { label: 'Yes', v: 1 },
        ].map((opt) => (
          <button
            type="button"
            key={opt.v}
            onClick={() => onChange(opt.v)}
            className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: value === opt.v ? 'var(--brand)' : 'var(--border-hairline)',
              background: value === opt.v ? 'color-mix(in srgb, var(--brand) 14%, transparent)' : 'var(--surface-2)',
              color: value === opt.v ? 'var(--brand)' : 'var(--text-secondary)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function renderField(field, value, onChange) {
  switch (field.type) {
    case 'score':
      return <ScoreField field={field} value={value} onChange={onChange} />
    case 'ratio':
      return <RatioField field={field} value={value} onChange={onChange} />
    case 'boolean':
      return <BooleanField field={field} value={value} onChange={onChange} />
    case 'currency':
      return <NumberField field={field} value={value} onChange={onChange} prefix="₹" />
    case 'months':
      return <NumberField field={field} value={value} onChange={onChange} suffix="mo" />
    case 'days':
      return <NumberField field={field} value={value} onChange={onChange} suffix="days" />
    default:
      return <NumberField field={field} value={value} onChange={onChange} />
  }
}

export default function ApplicantForm({ initialValues, applicantName, onApplicantNameChange, onSubmit, submitting, error }) {
  const [values, setValues] = useState(() => ({ ...defaultFeatureValues(), ...initialValues }))
  const [validationError, setValidationError] = useState(null)

  function setField(key, val) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    for (const field of ALL_FIELDS) {
      const raw = values[field.key]
      if (raw === '' || raw === null || raw === undefined) {
        setValidationError(`${field.label} is required.`)
        return
      }
      if (field.type !== 'boolean') {
        const num = Number(raw)
        if (Number.isNaN(num) || num < field.min || num > field.max) {
          setValidationError(`${field.label} must be between ${field.min} and ${field.max}.`)
          return
        }
      }
    }
    setValidationError(null)
    const payload = {}
    for (const field of ALL_FIELDS) payload[field.key] = fieldToApiValue(field, values[field.key])
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="card p-5">
        <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
          Applicant Name (optional)
        </label>
        <input
          type="text"
          value={applicantName}
          onChange={(e) => onApplicantNameChange(e.target.value)}
          placeholder="e.g. Priya Sharma"
          maxLength={120}
          className="w-full rounded-lg border px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
          style={{ borderColor: 'var(--border-hairline)', background: 'var(--surface-2)' }}
        />
      </div>

      {FORM_SECTIONS.map((section) => (
        <div key={section.title} className="card p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.key}>{renderField(field, values[field.key], (v) => setField(field.key, v))}</div>
            ))}
          </div>
        </div>
      ))}

      {(validationError || error) && (
        <div
          className="rounded-lg px-4 py-3 text-sm font-medium"
          style={{ background: 'color-mix(in srgb, var(--status-critical) 14%, transparent)', color: 'var(--status-critical)' }}
        >
          {validationError || error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-lg transition-opacity disabled:opacity-60"
        style={{ background: 'var(--brand)' }}
      >
        {submitting ? 'Calculating…' : 'Calculate Credit Score'}
      </button>
    </form>
  )
}
