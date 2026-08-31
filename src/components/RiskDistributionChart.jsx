import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { RISK_ORDER, riskColor } from '../utils/risk'

export default function RiskDistributionChart({ distribution }) {
  const data = RISK_ORDER.map((category) => ({
    category,
    count: distribution?.[category] || 0,
  }))

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 8 }}>
          <XAxis
            dataKey="category"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--gridline)' }}
            tickLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'var(--gridline)', opacity: 0.3 }}
            contentStyle={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
            {data.map((d) => (
              <Cell key={d.category} fill={riskColor(d.category)} />
            ))}
            <LabelList dataKey="count" position="top" style={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
