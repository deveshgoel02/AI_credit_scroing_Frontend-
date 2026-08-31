import { useEffect, useState } from 'react'
import ApplicantTable from '../components/ApplicantTable'
import HistogramChart from '../components/HistogramChart'
import MetricCard from '../components/MetricCard'
import RiskDistributionChart from '../components/RiskDistributionChart'
import { fetchApplicants, fetchDashboardStats } from '../services/api'
import { formatPercent } from '../utils/risk'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchApplicants()])
      .then(([s, r]) => {
        setStats(s)
        setRows(r)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="px-5 py-24 text-center text-sm text-[var(--text-muted)]">Loading dashboard…</div>
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-3xl font-black tracking-tight">Application Dashboard</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Aggregate view across every assessment run in this session.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="Total Applicants" value={stats.total_applicants} />
        <MetricCard label="Average Credit Score" value={stats.average_credit_score || '—'} />
        <MetricCard label="Low Risk %" value={`${stats.low_risk_pct}%`} accent="var(--status-good)" />
        <MetricCard label="High Risk %" value={`${stats.high_risk_pct}%`} accent="var(--status-critical)" />
        <MetricCard
          label="Avg. Default Probability"
          value={stats.total_applicants ? formatPercent(stats.average_default_probability) : '—'}
        />
      </div>

      {stats.total_applicants > 0 ? (
        <>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card p-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Risk Category Distribution</h3>
              <RiskDistributionChart distribution={stats.risk_distribution} />
            </div>
            <div className="card p-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Credit Score Distribution</h3>
              <HistogramChart data={stats.score_distribution} />
            </div>
          </div>

          <div className="mt-6 card p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Default Probability Distribution</h3>
            <HistogramChart data={stats.default_probability_distribution} height={220} />
          </div>
        </>
      ) : (
        <div className="card mt-10 p-10 text-center text-sm text-[var(--text-muted)]">
          Run at least one assessment to populate dashboard charts.
        </div>
      )}

      <div className="mt-10">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">All Applicants</h3>
        <ApplicantTable rows={rows} />
      </div>
    </div>
  )
}
