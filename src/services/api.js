import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
})

function unwrapError(error) {
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((d) => `${d.loc?.at(-1)}: ${d.msg}`).join('; ')
  }
  if (typeof detail === 'string') return detail
  return error.message || 'Something went wrong talking to the CrediAI API.'
}

export async function checkHealth() {
  const res = await client.get('/api/health')
  return res.data
}

export async function predictCreditScore(features) {
  try {
    const res = await client.post('/api/predict', features)
    return res.data
  } catch (error) {
    throw new Error(unwrapError(error))
  }
}

export async function fetchApplicants() {
  const res = await client.get('/api/applicants')
  return res.data
}

export async function fetchApplicantDetail(assessmentId) {
  const res = await client.get(`/api/applicants/${assessmentId}`)
  return res.data
}

export async function fetchDashboardStats() {
  const res = await client.get('/api/dashboard')
  return res.data
}

export async function fetchModelMetrics() {
  const res = await client.get('/api/metrics')
  return res.data
}

export async function fetchDemoApplicants() {
  const res = await client.get('/api/demo-applicants')
  return res.data
}

export { API_URL }
