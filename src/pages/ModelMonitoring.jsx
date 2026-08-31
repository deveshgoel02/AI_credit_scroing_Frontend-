import { useEffect, useState } from 'react'
import FeatureImportanceChart from '../components/FeatureImportanceChart'
import HistogramChart from '../components/HistogramChart'
import MetricCard from '../components/MetricCard'
import { fetchModelMetrics } from '../services/api'

export default function ModelMonitoring() {
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchModelMetrics()
      .then(setMetrics)
      .catch(() => setError('Model metrics unavailable. Train the model first.'))
  }, [])

  if (error) {
    return <div className="px-5 py-24 text-center text-sm text-[var(--text-muted)]">{error}</div>
  }
  if (!metrics) {
    return <div className="px-5 py-24 text-center text-sm text-[var(--text-muted)]">Loading model metrics…</div>
  }

  const predDist = metrics.prediction_distribution.map((count, i) => ({
    range: `${(i * 10).toFixed(0)}-${((i + 1) * 10).toFixed(0)}%`,
    count,
  }))

  const cm = metrics.confusion_matrix

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-3xl font-black tracking-tight">Model Performance</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Evaluated on a held-out 20% test split ({metrics.n_test} applicants) after training on{' '}
        {metrics.n_train}. Model version {metrics.model_version}.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="ROC-AUC" value={metrics.metrics.roc_auc.toFixed(3)} />
        <MetricCard label="Accuracy" value={metrics.metrics.accuracy.toFixed(3)} />
        <MetricCard label="Precision" value={metrics.metrics.precision.toFixed(3)} />
        <MetricCard label="Recall" value={metrics.metrics.recall.toFixed(3)} />
        <MetricCard label="F1 Score" value={metrics.metrics.f1_score.toFixed(3)} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Prediction Distribution</h3>
          <p className="mb-2 text-xs text-[var(--text-secondary)]">
            Count of test-set applicants by predicted default probability band.
          </p>
          <HistogramChart data={predDist} />
        </div>
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Feature Importance</h3>
          <p className="mb-2 text-xs text-[var(--text-secondary)]">
            Top factors the model relies on most, in aggregate across all predictions.
          </p>
          <FeatureImportanceChart items={metrics.feature_importance} />
        </div>
      </div>

      <div className="mt-6 card p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Confusion Matrix (test set)</h3>
        <div className="grid max-w-md grid-cols-3 gap-2 text-center text-sm">
          <div />
          <div className="font-semibold text-[var(--text-muted)]">Predicted: No Default</div>
          <div className="font-semibold text-[var(--text-muted)]">Predicted: Default</div>

          <div className="font-semibold text-[var(--text-muted)]">Actual: No Default</div>
          <div className="tabular rounded-lg p-3 font-bold" style={{ background: 'color-mix(in srgb, var(--status-good) 14%, transparent)' }}>
            {cm.true_negative}
          </div>
          <div className="tabular rounded-lg p-3 font-bold" style={{ background: 'color-mix(in srgb, var(--status-warning) 14%, transparent)' }}>
            {cm.false_positive}
          </div>

          <div className="font-semibold text-[var(--text-muted)]">Actual: Default</div>
          <div className="tabular rounded-lg p-3 font-bold" style={{ background: 'color-mix(in srgb, var(--status-warning) 14%, transparent)' }}>
            {cm.false_negative}
          </div>
          <div className="tabular rounded-lg p-3 font-bold" style={{ background: 'color-mix(in srgb, var(--status-good) 14%, transparent)' }}>
            {cm.true_positive}
          </div>
        </div>
      </div>

      <div
        className="mt-8 rounded-xl px-4 py-3 text-xs text-[var(--text-secondary)]"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-hairline)' }}
      >
        These metrics reflect performance on a held-out slice of the synthetic training
        dataset only. In a real deployment, model performance should be continuously
        monitored against live outcomes, and re-evaluated for drift and fairness across
        applicant segments.
      </div>
    </div>
  )
}
