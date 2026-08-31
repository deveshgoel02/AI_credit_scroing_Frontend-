import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

/**
 * Single-series magnitude histogram (sequential blue) -- used for credit
 * score distribution, default-probability distribution, and prediction
 * distribution on the monitoring page.
 */
export default function HistogramChart({ data, xKey = 'range', yKey = 'count', height = 240 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
          <XAxis
            dataKey={xKey}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--gridline)' }}
            tickLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={46}
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
          <Bar dataKey={yKey} fill="var(--brand)" radius={[4, 4, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
