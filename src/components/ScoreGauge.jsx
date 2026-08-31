import { riskColor, riskPosition } from '../utils/risk'

const SIZE = 260
const STROKE = 20
const R = (SIZE - STROKE) / 2
const CENTER = SIZE / 2
// Semicircle from 180deg (left) to 0deg (right), sweeping through the top.
const CIRCUMFERENCE = Math.PI * R

function arcPath() {
  const startX = CENTER - R
  const startY = CENTER
  const endX = CENTER + R
  const endY = CENTER
  return `M ${startX} ${startY} A ${R} ${R} 0 0 1 ${endX} ${endY}`
}

export default function ScoreGauge({ score, riskCategory, min = 300, max = 900 }) {
  const pct = riskPosition(score)
  const color = riskColor(riskCategory)
  const dashOffset = CIRCUMFERENCE * (1 - pct)

  return (
    <div className="flex flex-col items-center">
      <svg width={SIZE} height={SIZE / 2 + 30} viewBox={`0 0 ${SIZE} ${SIZE / 2 + 30}`}>
        <path
          d={arcPath()}
          fill="none"
          stroke="var(--gridline)"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        <path
          d={arcPath()}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
        />
        <text
          x={CENTER}
          y={CENTER - 6}
          textAnchor="middle"
          className="tabular"
          fontSize="52"
          fontWeight="800"
          fill="var(--text-primary)"
        >
          {score}
        </text>
        <text
          x={CENTER}
          y={CENTER + 22}
          textAnchor="middle"
          fontSize="13"
          fill="var(--text-muted)"
        >
          {min} – {max}
        </text>
      </svg>
      <div
        className="mt-1 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide"
        style={{
          color,
          backgroundColor: 'color-mix(in srgb, ' + color + ' 16%, transparent)',
        }}
      >
        {riskCategory}
      </div>
    </div>
  )
}
