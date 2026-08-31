export const RISK_ORDER = [
  'Very Low Risk',
  'Low Risk',
  'Moderate Risk',
  'Elevated Risk',
  'High Risk',
]

export const RISK_COLOR_VAR = {
  'Very Low Risk': '--risk-very-low',
  'Low Risk': '--risk-low',
  'Moderate Risk': '--risk-moderate',
  'Elevated Risk': '--risk-elevated',
  'High Risk': '--risk-high',
}

export function riskColor(category) {
  return `var(${RISK_COLOR_VAR[category] || '--risk-moderate'})`
}

export function riskPosition(score) {
  // 0..1 position of a 300-900 score along the risk meter
  return Math.min(1, Math.max(0, (score - 300) / (900 - 300)))
}

export function formatPercent(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value)
}
