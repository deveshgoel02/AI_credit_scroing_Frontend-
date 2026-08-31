import { formatPercent } from './risk'

const PERCENT_FEATURES = new Set([
  'monthly_expense_ratio',
  'savings_rate',
  'loan_repayment_ratio',
  'debt_to_income_ratio',
  'cash_flow_volatility',
])

const SCORE_FEATURES = new Set([
  'income_stability_score',
  'utility_payment_consistency',
  'rent_payment_consistency',
  'bill_payment_consistency',
  'subscription_payment_consistency',
  'balance_stability_score',
])

export function formatFeatureValue(feature, value) {
  if (PERCENT_FEATURES.has(feature)) return formatPercent(value)
  if (SCORE_FEATURES.has(feature)) return `${value}/100`
  if (feature === 'previous_default') return value ? 'Yes' : 'No'
  if (feature === 'monthly_income' || feature === 'average_transaction_amount') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }
  if (feature === 'employment_tenure_months' || feature === 'bank_account_age_months') {
    return `${value} mo`
  }
  if (feature === 'emergency_fund_months' || feature === 'average_payment_delay_days') {
    return `${value}`
  }
  return `${value}`
}

const TEMPLATES = {
  debt_to_income_ratio: {
    positive: ['Low debt-to-income ratio', 'A modest share of your income goes toward debt repayments.'],
    negative: ['High debt-to-income ratio', 'A larger portion of your income is being used for debt repayments.'],
  },
  rent_payment_consistency: {
    positive: ['Strong rent payment history', 'Your rent payment consistency is significantly above the threshold used by the model.'],
    negative: ['Inconsistent rent payments', 'Your rent payment history shows more variability than the model prefers to see.'],
  },
  utility_payment_consistency: {
    positive: ['Reliable utility payments', 'You consistently pay utility bills on time.'],
    negative: ['Inconsistent utility payments', 'Utility payment consistency is lower than the model expects for this risk band.'],
  },
  bill_payment_consistency: {
    positive: ['Consistent bill payments', 'General bill payments are consistently on time.'],
    negative: ['Irregular bill payments', 'General bill payments show a pattern of inconsistency.'],
  },
  income_stability_score: {
    positive: ['Stable income', 'Your income shows strong month-to-month stability.'],
    negative: ['Unstable income', 'Your income fluctuates more than the model prefers to see.'],
  },
  savings_rate: {
    positive: ['Strong savings behavior', 'You save a healthy share of your income each month.'],
    negative: ['Low savings rate', 'A small share of income is being saved each month.'],
  },
  late_payment_count: {
    positive: ['Few late payments', 'You have very few recorded late payments.'],
    negative: ['Frequent late payments', 'Multiple late payments were recorded, which increases estimated risk.'],
  },
  average_payment_delay_days: {
    positive: ['Short payment delays', 'When payments are late, delays tend to be short.'],
    negative: ['Long payment delays', 'Late payments tend to be delayed for a significant number of days.'],
  },
  cash_flow_volatility: {
    positive: ['Stable cash flow', 'Your account balance and cash flow are relatively steady.'],
    negative: ['High cash-flow volatility', 'Your account balance fluctuates significantly month to month.'],
  },
  emergency_fund_months: {
    positive: ['Healthy emergency fund', 'You could cover several months of expenses from savings alone.'],
    negative: ['Limited emergency fund', 'Your savings would cover only a short period of expenses in an emergency.'],
  },
  loan_repayment_ratio: {
    positive: ['Strong loan repayment history', 'You repay a high proportion of what you owe on existing loans.'],
    negative: ['Weak loan repayment history', 'A lower proportion of existing loan obligations has been repaid.'],
  },
  balance_stability_score: {
    positive: ['Stable account balance', 'Your account balance stays within a predictable range.'],
    negative: ['Unstable account balance', 'Your account balance swings more than the model prefers to see.'],
  },
  previous_default: {
    positive: ['No previous default', 'You have no recorded history of default.'],
    negative: ['Previous default on record', 'A previous default was recorded, which materially increases estimated risk.'],
  },
  existing_loans: {
    positive: ['Manageable number of loans', 'You are not carrying an unusually high number of active loans.'],
    negative: ['Multiple existing loans', 'A higher number of concurrent loans increases estimated risk.'],
  },
  monthly_expense_ratio: {
    positive: ['Healthy expense ratio', 'A reasonable share of income is spent relative to what is earned.'],
    negative: ['High expense ratio', 'A large share of income is spent relative to what is earned.'],
  },
  subscription_payment_consistency: {
    positive: ['Consistent subscription payments', 'Recurring subscription payments are handled reliably.'],
    negative: ['Inconsistent subscription payments', 'Recurring subscription payments show some inconsistency.'],
  },
  monthly_savings_transactions: {
    positive: ['Regular saving activity', 'You make frequent deposits into savings.'],
    negative: ['Infrequent saving activity', 'Savings deposits are infrequent.'],
  },
  bank_account_age_months: {
    positive: ['Established bank account', 'Your primary bank account has a long, established history.'],
    negative: ['Newer bank account', 'Your primary bank account is relatively new.'],
  },
  employment_tenure_months: {
    positive: ['Established employment', 'You have a long tenure with your current employment.'],
    negative: ['Shorter employment tenure', 'Your current employment tenure is relatively short.'],
  },
}

export function getNarrative(feature, direction) {
  const entry = TEMPLATES[feature]
  if (entry) return entry[direction]
  const words = feature.replace(/_/g, ' ')
  return direction === 'positive'
    ? [`Favorable ${words}`, `${words[0].toUpperCase()}${words.slice(1)} is contributing positively to this assessment.`]
    : [`Unfavorable ${words}`, `${words[0].toUpperCase()}${words.slice(1)} is contributing negatively to this assessment.`]
}
