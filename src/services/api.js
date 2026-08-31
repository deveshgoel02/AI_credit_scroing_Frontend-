import axios from 'axios'

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// VITE_API_URL is pasted by hand into Vercel, so tolerate the common variants:
// a trailing slash, or a trailing "/api" (which would build .../api/api/predict).
const API_URL = RAW_API_URL.trim()
  .replace(/\/+$/, '')
  .replace(/\/api$/, '')

// Bump this string whenever you change this file. Log it on boot so you can
// tell from the browser console whether the deployed bundle is actually new.
const API_CLIENT_VERSION = 'v3-cold-start'

if (import.meta.env.PROD) {
  console.info(`[CrediAI] api client ${API_CLIENT_VERSION} -> ${API_URL}`)
  if (/localhost|127\.0\.0\.1/.test(API_URL)) {
    console.error(
      '[CrediAI] VITE_API_URL is not set for this build. Set it in Vercel > ' +
        'Settings > Environment Variables, then trigger a new deployment.',
    )
  }
}

// Render free-tier instances sleep after ~15 min idle. Waking one and importing
// pandas/xgboost/shap can take 60-90s, so the first request needs a long fuse.
const COLD_START_TIMEOUT = 90000

const client = axios.create({
  baseURL: API_URL,
  timeout: COLD_START_TIMEOUT,
})

function unwrapError(error) {
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((d) => `${d.loc?.at(-1)}: ${d.msg}`).join('; ')
  }
  if (typeof detail === 'string') return detail
  if (error?.code === 'ECONNABORTED') {
    return 'The backend is still waking up (Render free tier sleeps when idle). Please try once more.'
  }
  if (error?.response?.status === 404) {
    return `No endpoint at ${API_URL}/api/predict. Check VITE_API_URL points at the Render root.`
  }
  return error.message || 'Something went wrong talking to the CrediAI API.'
}

/**
 * Fire-and-forget ping that starts the Render cold boot early, while the user
 * is still filling in the form. Never throws.
 */
export function wakeBackend() {
  client.get('/api/health').catch(() => {})
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
    // A timeout on the first attempt usually means the instance was asleep but
    // is now booting. One retry lands on a warm server.
    if (error?.code === 'ECONNABORTED') {
      try {
        const res = await client.post('/api/predict', features)
        return res.data
      } catch (retryError) {
        throw new Error(unwrapError(retryError))
      }
    }
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

export { API_URL, API_CLIENT_VERSION }