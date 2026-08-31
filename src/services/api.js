import axios from 'axios'

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Normalise the configured base URL before axios ever sees it.
//
// VITE_API_URL is pasted by hand into the Vercel dashboard, and the two most
// common mistakes both produce a 404 that looks like a backend problem:
//   "https://host.onrender.com/"     -> ".../api/predict"      (fine, but noisy)
//   "https://host.onrender.com/api"  -> ".../api/api/predict"  (404 Not Found)
// Stripping trailing slashes and a trailing "/api" makes all of these work.
const API_URL = RAW_API_URL.trim()
  .replace(/\/+$/, '')
  .replace(/\/api$/, '')

if (import.meta.env.PROD && /localhost|127\.0\.0\.1/.test(API_URL)) {
  // A production build pointing at localhost means VITE_API_URL was never set
  // in the Vercel project (or was added without a redeploy afterwards).
  console.error(
    '[CrediAI] VITE_API_URL is not set for this build. API calls will fail. ' +
      'Set it in Vercel > Settings > Environment Variables, then redeploy.',
  )
}

const client = axios.create({
  baseURL: API_URL,
  timeout: 60000, // Render free tier cold starts can take ~50s on the first request.
})

function unwrapError(error) {
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((d) => `${d.loc?.at(-1)}: ${d.msg}`).join('; ')
  }
  if (typeof detail === 'string') return detail
  if (error?.response?.status === 404) {
    return `No endpoint found at ${API_URL}/api/predict. Check that VITE_API_URL points at the Render backend root.`
  }
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