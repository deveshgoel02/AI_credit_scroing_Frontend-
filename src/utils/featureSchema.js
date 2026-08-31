// Drives ApplicantForm rendering + client-side validation. Ranges mirror the
// backend's Pydantic bounds (schemas.py) so a value accepted here is never
// rejected by the API.

export const FORM_SECTIONS = [
  {
    title: 'Financial Profile',
    fields: [
      { key: 'monthly_income', label: 'Monthly Income', type: 'currency', min: 0, max: 500000, step: 500, default: 35000 },
      { key: 'income_stability_score', label: 'Income Stability', type: 'score', min: 0, max: 100, step: 1, default: 65 },
      { key: 'employment_tenure_months', label: 'Employment Tenure', type: 'months', min: 0, max: 480, step: 1, default: 24 },
      { key: 'monthly_expense_ratio', label: 'Monthly Expense Ratio', type: 'ratio', min: 0, max: 1.5, step: 0.01, default: 0.55 },
      { key: 'savings_rate', label: 'Savings Rate', type: 'ratio', min: -0.5, max: 0.8, step: 0.01, default: 0.12 },
      { key: 'bank_account_age_months', label: 'Bank Account Age', type: 'months', min: 0, max: 480, step: 1, default: 36 },
    ],
  },
  {
    title: 'Payment Behavior',
    fields: [
      { key: 'utility_payment_consistency', label: 'Utility Payment Consistency', type: 'score', min: 0, max: 100, step: 1, default: 80 },
      { key: 'rent_payment_consistency', label: 'Rent Payment Consistency', type: 'score', min: 0, max: 100, step: 1, default: 80 },
      { key: 'bill_payment_consistency', label: 'Bill Payment Consistency', type: 'score', min: 0, max: 100, step: 1, default: 78 },
      { key: 'late_payment_count', label: 'Late Payment Count', type: 'count', min: 0, max: 30, step: 1, default: 3 },
      { key: 'average_payment_delay_days', label: 'Average Payment Delay', type: 'days', min: 0, max: 60, step: 1, default: 5 },
    ],
  },
  {
    title: 'Account Behavior',
    fields: [
      { key: 'transaction_count_monthly', label: 'Monthly Transactions', type: 'count', min: 0, max: 300, step: 1, default: 45 },
      { key: 'average_transaction_amount', label: 'Average Transaction Amount', type: 'currency', min: 0, max: 100000, step: 50, default: 1200 },
      { key: 'recurring_payment_count', label: 'Recurring Payments', type: 'count', min: 0, max: 30, step: 1, default: 4 },
      { key: 'subscription_payment_consistency', label: 'Subscription Consistency', type: 'score', min: 0, max: 100, step: 1, default: 78 },
      { key: 'balance_stability_score', label: 'Balance Stability', type: 'score', min: 0, max: 100, step: 1, default: 62 },
    ],
  },
  {
    title: 'Debt Profile',
    fields: [
      { key: 'existing_loans', label: 'Existing Loans', type: 'count', min: 0, max: 15, step: 1, default: 1 },
      { key: 'loan_repayment_ratio', label: 'Loan Repayment Ratio', type: 'ratio', min: 0, max: 1.2, step: 0.01, default: 0.75 },
      { key: 'debt_to_income_ratio', label: 'Debt-to-Income Ratio', type: 'ratio', min: 0, max: 1.5, step: 0.01, default: 0.35 },
      { key: 'previous_default', label: 'Previous Default', type: 'boolean', default: 0 },
    ],
  },
  {
    title: 'Savings & Cash Flow',
    fields: [
      { key: 'monthly_savings_transactions', label: 'Monthly Savings Transactions', type: 'count', min: 0, max: 30, step: 1, default: 3 },
      { key: 'cash_flow_volatility', label: 'Cash Flow Volatility', type: 'ratio', min: 0, max: 1.5, step: 0.01, default: 0.3 },
      { key: 'emergency_fund_months', label: 'Emergency Fund', type: 'months', min: 0, max: 36, step: 0.5, default: 2 },
    ],
  },
]

export const ALL_FIELDS = FORM_SECTIONS.flatMap((s) => s.fields)

export function defaultFeatureValues() {
  const values = {}
  for (const field of ALL_FIELDS) values[field.key] = field.default
  return values
}
