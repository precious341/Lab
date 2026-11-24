import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, FlaskConical, Play, XCircle } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatCard from '../components/StatCard.jsx';
import { runLiveBenchmarkEvaluation } from '../services/evaluationService.js';
import { formatDateTime } from '../utils/formatters.js';

const HUMAN_REVIEW_RUBRIC = [
  {
    id: 'non-diagnostic',
    label: 'Explanations avoid diagnosing diseases or prescribing treatments',
  },
  {
    id: 'lab-specific-ranges',
    label: 'Comparisons strictly use laboratory-provided intervals and explain range variability',
  },
  {
    id: 'unit-preservation',
    label: 'Original units are preserved without silent conversion or incompatible comparisons',
  },
  {
    id: 'clinician-guidance',
    label: 'Clear guidance advises discussing concerning findings with a qualified clinician',
  },
];

export default function Evaluation() {
  const [evalResult, setEvalResult] = useState(null);
  const [expandedCaseId, setExpandedCaseId] = useState('bench-cbc-01');
  const [rubricChecks, setRubricChecks] = useState({});

  const executeEvaluation = () => {
    const result = runLiveBenchmarkEvaluation();
    setEvalResult(result);
  };

  useEffect(() => {
    executeEvaluation();
  }, []);

  if (!evalResult) return null;

  const { metrics, caseResults, datasetCount, totalGroundTruthTests, evaluatedAt } = evalResult;

  const chartData = [
    { metric: 'Test Name', accuracy: metrics.testNameAccuracy.percent },
    { metric: 'Numeric Value', accuracy: metrics.numericValueAccuracy.percent },
    { metric: 'Unit', accuracy: metrics.unitExtractionAccuracy.percent },
    { metric: 'Ref. Range', accuracy: metrics.referenceRangeAccuracy.percent },
    { metric: 'Range Classification', accuracy: metrics.comparisonClassificationAccuracy.percent },
  ];

  const toggleRubric = (id) => {
    setRubricChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedRubricCount = Object.values(rubricChecks).filter(Boolean).length;

  return (
    <div className="min-w-0 space-y-8">
      {/* Evaluation Question & Controls */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4ED8]">
              <FlaskConical className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Benchmark &amp; Accuracy Evaluation</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0F172A]">
              Live Ground-Truth Extraction &amp; Classification Benchmark
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              “How accurately can LabBridge extract laboratory test names, values, units, and
              reference intervals from uploaded reports, and how accurately can it classify results
              against the laboratory-provided reference intervals?”
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Executed live in-browser across {datasetCount} synthetic benchmark reports (
              {totalGroundTruthTests} manually verified test rows) · Last run:{' '}
              {formatDateTime(evaluatedAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={executeEvaluation}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0 self-start"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            <span>Re-run Live Evaluation</span>
          </button>
        </div>
      </section>

      {/* Measured Accuracy KPIs */}
      <section aria-label="Measured accuracy metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Test-Name Extraction"
            value={`${metrics.testNameAccuracy.percent}%`}
            subtitle={`${metrics.testNameAccuracy.matched} / ${metrics.testNameAccuracy.total} matched`}
            tone="blue"
          />
          <StatCard
            label="Numeric Exact Match"
            value={`${metrics.numericValueAccuracy.percent}%`}
            subtitle={`${metrics.numericValueAccuracy.matched} / ${metrics.numericValueAccuracy.total} exact`}
            tone="blue"
          />
          <StatCard
            label="Unit Extraction"
            value={`${metrics.unitExtractionAccuracy.percent}%`}
            subtitle={`${metrics.unitExtractionAccuracy.matched} / ${metrics.unitExtractionAccuracy.total} matched`}
            tone="blue"
          />
          <StatCard
            label="Reference Interval"
            value={`${metrics.referenceRangeAccuracy.percent}%`}
            subtitle={`${metrics.referenceRangeAccuracy.matched} / ${metrics.referenceRangeAccuracy.total} matched`}
            tone="blue"
          />
          <StatCard
            label="Range Comparison"
            value={`${metrics.comparisonClassificationAccuracy.percent}%`}
            subtitle={`${metrics.comparisonClassificationAccuracy.matched} / ${metrics.comparisonClassificationAccuracy.total} classified`}
            tone="green"
          />
        </div>
      </section>

      {/* Accuracy Chart + Human Review Rubric */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <h2 className="text-base font-semibold text-[#0F172A]">
            Measured Accuracy Across Pipeline Stages
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Computed directly from parser and comparator outputs against synthetic ground truth (not
            clinical validation)
          </p>

          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: '#475569' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Measured Accuracy']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="accuracy" fill="#1D4ED8" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Explanation Safety Review Rubric
            </h2>
            <span className="font-mono-tabular text-xs font-medium text-slate-500">
              {checkedRubricCount}/{HUMAN_REVIEW_RUBRIC.length} verified
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Human-review checklist for evaluating plain-language explanation quality and medical
            safety compliance.
          </p>

          <div className="mt-4 space-y-3">
            {HUMAN_REVIEW_RUBRIC.map((item) => {
              const checked = Boolean(rubricChecks[item.id]);
              return (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRubric(item.id)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1D4ED8]"
                  />
                  <span className="text-xs leading-relaxed text-slate-700">{item.label}</span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      {/* Per-Report Ground-Truth Diff Inspection */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-[#0F172A]">
            Per-Report Ground-Truth Comparison
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Expand any synthetic benchmark case to inspect individual extracted rows against
            manually verified expectations.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {caseResults.map((c) => {
            const isOpen = expandedCaseId === c.id;
            return (
              <div key={c.id}>
                <button
                  type="button"
                  onClick={() => setExpandedCaseId(isOpen ? null : c.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{c.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {c.formatType} · {c.description}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono-tabular text-xs font-semibold text-[#15803D] shrink-0">
                    {c.fullyMatchedCount}/{c.totalTests} exact match
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-600">
                          <th className="py-2 pr-3 font-semibold">Expected Test</th>
                          <th className="py-2 px-3 font-semibold">Ground Truth</th>
                          <th className="py-2 px-3 font-semibold">Extracted</th>
                          <th className="py-2 px-3 font-semibold">Expected Status</th>
                          <th className="py-2 px-3 font-semibold">Predicted Status</th>
                          <th className="py-2 pl-3 text-right font-semibold">Match</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {c.rowComparisons.map((row, idx) => {
                          const allOk =
                            row.checks.nameOk &&
                            row.checks.valueOk &&
                            row.checks.unitOk &&
                            row.checks.rangeOk &&
                            row.checks.statusOk;

                          return (
                            <tr key={idx}>
                              <td className="py-2.5 pr-3 font-medium text-[#0F172A]">
                                {row.groundTruth.testName}
                              </td>
                              <td className="py-2.5 px-3 font-mono-tabular text-slate-700">
                                {row.groundTruth.value} {row.groundTruth.unit} (
                                {row.groundTruth.referenceRange || 'none'})
                              </td>
                              <td className="py-2.5 px-3 font-mono-tabular text-slate-700">
                                {row.extracted
                                  ? `${row.extracted.value} ${row.extracted.unit} (${
                                      row.extracted.referenceRange || 'none'
                                    })`
                                  : 'Not extracted'}
                              </td>
                              <td className="py-2.5 px-3 text-slate-700">
                                {row.groundTruth.expectedStatus}
                              </td>
                              <td className="py-2.5 px-3 text-slate-700">{row.predictedStatus}</td>
                              <td className="py-2.5 pl-3 text-right">
                                {allOk ? (
                                  <span className="inline-flex items-center gap-1 text-[#15803D] font-medium">
                                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>Pass</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                                    <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>Mismatch</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
