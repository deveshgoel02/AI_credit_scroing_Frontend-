import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatFeatureValue } from '../utils/narratives'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-hairline)' }}
    >
      <div className="font-semibold text-[var(--text-primary)]">{d.label}</div>
      <div className="mt-0.5 text-[var(--text-secondary)]">
        Value: {formatFeatureValue(d.feature, d.value)}
      </div>
      <div className="tabular font-semibold" style={{ color: d.impact > 0 ? 'var(--positive)' : 'var(--negative)' }}>
        Impact: {d.impact > 0 ? '+' : ''}
        {d.impact} pts
      </div>
    </div>
  )
}

export default function SHAPChart({ factors }) {
  const data = [...factors].sort((a, b) => a.impact - b.impact)
  const height = Math.max(240, data.length * 38)

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 36, left: 8, bottom: 8 }}>
          <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--gridline)' }} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={170}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--gridline)' }}
            tickLine={false}
          />
          <ReferenceLine x={0} stroke="var(--baseline, var(--gridline))" />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--gridline)', opacity: 0.3 }} />
          <Bar dataKey="impact" radius={4} maxBarSize={22}>
            {data.map((d) => (
              <Cell key={d.feature} fill={d.impact > 0 ? 'var(--positive)' : 'var(--negative)'} />
            ))}
            <LabelList
              dataKey="impact"
              position="right"
              formatter={(v) => `${v > 0 ? '+' : ''}${v}`}
              style={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
