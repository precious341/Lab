import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  ArrowRight,
  BookOpen,
  ShieldAlert,
  Clock,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import IllustrationAsset from '../components/IllustrationAsset.jsx';
import {
  analyzeSingleTest,
  buildReportInsights,
  RESULT_CLASSIFICATION,
} from '../services/analysisService.js';
import {
  computeDashboardStats,
  getActivityLog,
  getReports,
  getSettings,
} from '../services/storageService.js';
import { formatDateTime } from '../utils/formatters.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [activity, setActivity] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    setReports(getReports());
    setActivity(getActivityLog());
    setSettings(getSettings());
  }, []);

  const stats = computeDashboardStats(reports);
  const latestReport = reports[0] || null;
  const recentReports = reports.slice(0, 5);
  const recentActivity = activity.slice(0, 5);

  // Hydrate latest report tests so Dashboard & Results always share identical explanations & classifications
  const latestTests = (latestReport?.analyzedTests || []).map((t) =>
    t.classification && t.explanation?.whatResultMeans ? t : analyzeSingleTest(t)
  );

  const attentionResults = latestTests.filter(
    (t) =>
      t.classification === RESULT_CLASSIFICATION.CRITICAL ||
      t.classification === RESULT_CLASSIFICATION.HIGH ||
      t.classification === RESULT_CLASSIFICATION.LOW
  );

  // Prioritize Critical/High/Low results in Understanding Your Results, followed by other tests
  const highlightedExplanations = [
    ...attentionResults,
    ...latestTests.filter(
      (t) =>
        t.classification !== RESULT_CLASSIFICATION.CRITICAL &&
        t.classification !== RESULT_CLASSIFICATION.HIGH &&
        t.classification !== RESULT_CLASSIFICATION.LOW
    ),
  ].slice(0, 3);

  const latestSummary = latestReport?.summary || {};
  const latestNormal = latestSummary.normalCount ?? latestSummary.withinRange ?? 0;
  const latestHigh = latestSummary.highCount ?? latestSummary.aboveRange ?? 0;
  const latestLow = latestSummary.lowCount ?? latestSummary.belowRange ?? 0;
  const latestCritical = latestSummary.criticalCount ?? 0;
  const latestPending = latestSummary.pendingVerificationCount ?? 0;

  const latestInsights = latestReport
    ? latestReport.insights || buildReportInsights(latestTests, latestSummary)
    : [];

  const latestChartData = latestReport
    ? [
        { name: 'Normal', count: latestNormal, fill: '#16A34A' },
        { name: 'High', count: latestHigh, fill: '#D97706' },
        { name: 'Low', count: latestLow, fill: '#EA580C' },
        ...(latestCritical > 0
          ? [{ name: 'Critical', count: latestCritical, fill: '#DC2626' }]
          : []),
        { name: 'Pending', count: latestPending, fill: '#1D4ED8' },
      ]
    : [];

  return (
    <div className="min-w-0 space-y-8">
      {/* Welcome & Primary CTA Hero */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-7">
            <p className="text-xs font-semibold tracking-wide text-[#1D4ED8]">
              Laboratory Report Understanding
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              {settings.displayName
                ? `Welcome back, ${settings.displayName}`
                : 'Understand your laboratory results with clarity'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Upload a PDF or scanned image of your laboratory report. LabBridge extracts each
              measurement, expands recognized abbreviations into full laboratory names, compares
              verified results against your lab’s printed reference ranges, and explains unfamiliar
              terms in plain language.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <Link
                to="/upload"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
              >
                <Upload className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Upload Laboratory Report</span>
              </Link>
              <Link
                to="/evaluation"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <FlaskConical className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
                <span>View Evaluation Suite</span>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <IllustrationAsset
              src="/src/assets/illustrations/dashboard-reviewing-report.jpg"
              alt="Flat vector illustration of a person reviewing a medical laboratory report clipboard with a clinician and laboratory symbols"
              fallbackTitle="Laboratory Report Review"
              className="w-full max-w-[360px] rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      {/* 1. Health Overview (Reactive to real processed report data) */}
      <section aria-label="Health Overview">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-[#0F172A]">Health Overview</h2>
          <span className="text-xs text-slate-500">
            Derived strictly from your processed laboratory reports
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Reports Processed"
            value={stats.totalReports}
            subtitle="Saved in this browser"
            tone="blue"
          />
          <StatCard
            label="Total Tests Extracted"
            value={stats.totalTests}
            subtitle="Across processed reports"
          />
          <StatCard
            label="Normal Results"
            value={stats.normalCount}
            subtitle="Inside lab-printed intervals"
            tone="green"
          />
          <StatCard
            label="High / Low Results"
            value={stats.highCount + stats.lowCount + stats.criticalCount}
            subtitle={`${stats.highCount} high · ${stats.lowCount} low${
              stats.criticalCount > 0 ? ` · ${stats.criticalCount} critical` : ''
            }`}
            tone={stats.criticalCount > 0 ? 'red' : 'amber'}
          />
          <StatCard
            label="Awaiting Verification"
            value={stats.pendingVerificationCount}
            subtitle={
              stats.unableToDetermine > 0
                ? `${stats.unableToDetermine} unable to determine`
                : 'Unverified OCR or intervals'
            }
          />
        </div>
      </section>

      {/* Personalized Sections When User Has Processed Reports */}
      {latestReport ? (
        <>
          {/* 2. Your Latest Report + 5. Health Insights */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1D4ED8]">Your Latest Report</p>
                  <h2 className="mt-1 text-lg font-semibold text-[#0F172A] [overflow-wrap:anywhere]">
                    {latestReport.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Processed {formatDateTime(latestReport.createdAt)} ·{' '}
                    {latestReport.extractionEngine || 'Verified Extraction'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/results?reportId=${encodeURIComponent(latestReport.id)}`)
                  }
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0 self-start"
                >
                  <span>View Smart Interpretation</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 sm:grid-cols-5">
                <div>
                  <p className="text-xs text-slate-500">Extracted</p>
                  <p className="mt-1 font-mono-tabular text-xl font-semibold text-[#0F172A]">
                    {latestSummary.total || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Normal</p>
                  <p className="mt-1 font-mono-tabular text-xl font-semibold text-[#15803D]">
                    {latestNormal}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">High</p>
                  <p className="mt-1 font-mono-tabular text-xl font-semibold text-[#B45309]">
                    {latestHigh}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Low</p>
                  <p className="mt-1 font-mono-tabular text-xl font-semibold text-[#B45309]">
                    {latestLow}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Pending</p>
                  <p className="mt-1 font-mono-tabular text-xl font-semibold text-[#1D4ED8]">
                    {latestPending}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={latestChartData}
                    margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#475569' }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#475569' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E2E8F0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Tests" radius={[4, 4, 0, 0]} maxBarSize={42}>
                      {latestChartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* 5. Health Insights */}
            <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                <h2 className="text-base font-semibold text-[#0F172A]">Health Insights</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Grounded strictly in results from your latest report
              </p>

              <div className="mt-4 space-y-3">
                {latestInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`rounded-lg border p-3.5 ${
                      insight.tone === 'red'
                        ? 'border-red-200 bg-red-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#0F172A] [overflow-wrap:anywhere]">
                      {insight.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                      {insight.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. Results That Need Attention */}
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-2 border-b border-slate-200 px-5 sm:px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Results That Need Attention
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 [overflow-wrap:anywhere]">
                  Measurements outside their laboratory reference intervals in “{latestReport.title}”
                </p>
              </div>
              {attentionResults.length > 0 && (
                <span className="font-mono-tabular text-xs font-medium text-[#B45309] shrink-0">
                  {attentionResults.length} outside interval
                </span>
              )}
            </div>

            {attentionResults.length === 0 ? (
              <div className="flex items-start sm:items-center gap-3 p-5 sm:p-6 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 sm:mt-0 h-5 w-5 shrink-0 text-[#15803D]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-medium text-[#0F172A]">
                    {latestPending > 0
                      ? 'No confirmed out-of-range measurements yet (some rows still await verification)'
                      : 'All compared measurements in your latest report were within printed reference intervals'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Review your full Smart Result Interpretation and share findings with your
                    clinician during routine checkups.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {attentionResults.map((test) => {
                  const displayName = test.fullTestName || test.testName;
                  return (
                    <div
                      key={test.id}
                      className="flex flex-col gap-4 px-5 sm:px-6 py-4 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-sm font-semibold text-[#0F172A] [overflow-wrap:anywhere]">
                            {displayName}
                          </h3>
                          {test.abbreviation &&
                            test.abbreviation.toLowerCase() !== displayName.toLowerCase() && (
                              <span className="text-xs text-slate-500">({test.abbreviation})</span>
                            )}
                          <StatusBadge
                            classification={test.classification}
                            status={test.status}
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-mono-tabular">
                          <span>
                            Measured:{' '}
                            <strong className="text-[#0F172A]">
                              {test.rawValue || test.value} {test.unit}
                            </strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Reference interval: {test.referenceRange || 'Not provided'}{' '}
                            {test.referenceRange && test.unit && !test.isQualitative
                              ? test.unit
                              : ''}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                          {test.explanation?.shortDashboardSummary}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/results?reportId=${encodeURIComponent(
                              latestReport.id
                            )}&testId=${encodeURIComponent(test.id)}`
                          )
                        }
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 self-start lg:self-center"
                      >
                        <span>View Explanation</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 4. Understanding Your Results */}
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="min-w-0 lg:col-span-8">
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Understanding Your Results
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Plain-language highlights from your latest report to help you prepare for a
                  healthcare visit
                </p>

                <div className="mt-4 space-y-3">
                  {highlightedExplanations.map((test) => {
                    const displayName = test.fullTestName || test.testName;
                    return (
                      <div
                        key={test.id}
                        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-semibold text-[#0F172A] [overflow-wrap:anywhere]">
                              {displayName}
                            </span>
                            {test.abbreviation &&
                              test.abbreviation.toLowerCase() !== displayName.toLowerCase() && (
                                <span className="text-slate-500">({test.abbreviation})</span>
                              )}
                            <span className="text-slate-400" aria-hidden="true">
                              ·
                            </span>
                            <span className="font-mono-tabular text-slate-700">
                              {test.rawValue || test.value} {test.unit}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                            {test.explanation?.shortDashboardSummary}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/results?reportId=${encodeURIComponent(
                                latestReport.id
                              )}&testId=${encodeURIComponent(test.id)}`
                            )
                          }
                          className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-[#1D4ED8] hover:bg-slate-100 whitespace-nowrap shrink-0 self-start"
                        >
                          <span>Read Full Explanation</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center lg:col-span-4 lg:justify-end">
                <IllustrationAsset
                  src="/src/assets/illustrations/results-clinician-explaining.jpg"
                  alt="Flat vector illustration of a healthcare professional explaining laboratory test results to a patient"
                  fallbackTitle="Understanding Your Results"
                  className="w-full max-w-[240px] rounded-xl object-contain"
                />
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Upload a report to see personalized insights and explanations
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Once you upload a laboratory report, your Smart Results Overview, results needing
                  attention, and plain-language explanations will appear right here on your
                  dashboard.
                </p>
              </div>
            </div>

            <Link
              to="/upload"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0 self-start sm:self-center"
            >
              <span>Upload or Try Sample</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* 6. Recent Reports + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4">
            <h2 className="text-base font-semibold text-[#0F172A]">Recent Reports</h2>
            {reports.length > 0 && (
              <Link
                to="/reports"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline whitespace-nowrap shrink-0"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>

          {recentReports.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[#0F172A]">
                No laboratory reports analyzed yet
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                Upload your first PDF or scanned image report, or test the workflow using one of
                our synthetic sample reports on the Upload page.
              </p>
              <div className="mt-5 flex justify-center">
                <Link
                  to="/upload"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <span>Go to Upload Report</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col gap-3 px-5 sm:px-6 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/results?reportId=${encodeURIComponent(report.id)}`)}
                      className="text-left text-sm font-semibold text-[#0F172A] hover:text-[#1D4ED8] block max-w-full [overflow-wrap:anywhere]"
                    >
                      {report.title}
                    </button>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{formatDateTime(report.createdAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.processingStatus || 'Verified & Analyzed'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{report.summary?.total || 0} tests</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/results?reportId=${encodeURIComponent(report.id)}`)}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 self-start sm:self-center"
                  >
                    <span>View Report</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="min-w-0 rounded-xl border border-slate-200 bg-white lg:col-span-5">
          <div className="border-b border-slate-200 px-5 sm:px-6 py-4">
            <h2 className="text-base font-semibold text-[#0F172A]">Recent Activity</h2>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-700">No activity recorded yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Actions such as analyzing a report, exporting a PDF, or updating settings appear
                here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {recentActivity.map((item) => (
                <li key={item.id} className="px-5 sm:px-6 py-3.5">
                  <p className="text-sm text-slate-800 [overflow-wrap:anywhere]">{item.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.timestamp)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Health Education Section */}
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-8">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
              <h2 className="text-base font-semibold text-[#0F172A]">
                Understanding Laboratory Reference Ranges
              </h2>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Why ranges vary between laboratories
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Reference intervals depend on the specific analytical instruments, chemical
                  reagents, and calibration populations used by each laboratory. LabBridge always
                  compares against the interval printed on your report rather than guessing
                  universal cutoffs.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Individual factors matter
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Expected values can shift with age, biological sex, pregnancy status, time of
                  day, hydration, recent exercise, and whether you fasted before the blood draw. A
                  value slightly outside a printed range is not automatically a diagnosis.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  When to seek medical advice
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Always review laboratory findings with a qualified healthcare professional. If
                  you experience severe symptoms such as chest pain, difficulty breathing, sudden
                  confusion, or uncontrolled bleeding, seek urgent medical care immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-4 lg:justify-end">
            <IllustrationAsset
              src="/src/assets/illustrations/health-education-guide.jpg"
              alt="Flat vector illustration of a character reading a health education guide alongside laboratory flasks and medical charts"
              fallbackTitle="Health Education Guide"
              className="w-full max-w-[260px] rounded-xl object-contain"
            />
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          <span>
            Privacy note: Uploaded PDFs and images are processed locally in your browser via PDF.js
            and Tesseract.js. Original medical documents are not permanently stored.
          </span>
        </div>
      </section>
    </div>
  );
}
