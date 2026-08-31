import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ApplicantDetail from './pages/ApplicantDetail'
import Assessment from './pages/Assessment'
import Dashboard from './pages/Dashboard'
import FinancialInclusion from './pages/FinancialInclusion'
import Landing from './pages/Landing'
import ModelMonitoring from './pages/ModelMonitoring'
import ResponsibleAI from './pages/ResponsibleAI'
import Result from './pages/Result'
import { useEffect } from 'react'
import { wakeBackend } from './services/api'

export default function App() {
  useEffect(() => {
    wakeBackend()
  }, [])
  // ...rest unchanged

export default function App() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/assess" element={<Assessment />} />
          <Route path="/result" element={<Result />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applicant/:id" element={<ApplicantDetail />} />
          <Route path="/financial-inclusion" element={<FinancialInclusion />} />
          <Route path="/monitoring" element={<ModelMonitoring />} />
          <Route path="/responsible-ai" element={<ResponsibleAI />} />
        </Routes>
      </main>
      <footer
        className="border-t px-5 py-6 text-center text-xs text-[var(--text-muted)]"
        style={{ borderColor: 'var(--border-hairline)' }}
      >
        CrediAI is an educational prototype trained on synthetic data. Nothing in this
        application constitutes a real lending decision.
      </footer>
    </div>
  )
}
