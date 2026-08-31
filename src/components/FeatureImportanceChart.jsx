import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FEATURE_LABELS } from '../utils/featureLabels'

export default function FeatureImportanceChart({ items }) {
  const data = items.slice(0, 10).map((d) => ({
    label: FEATURE_LABELS[d.feature] || d.feature,
    importance: Number((d.importance * 100).toFixed(1)),
  }))
  const height = Math.max(240, data.length * 32)

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <XAxis type="number" unit="%" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--gridline)' }} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={170}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--gridline)' }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'var(--gridline)', opacity: 0.3 }}
            formatter={(v) => [`${v}%`, 'Relative importance']}
            contentStyle={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="importance" fill="var(--brand)" radius={4} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
