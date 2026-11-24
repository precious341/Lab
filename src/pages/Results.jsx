import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  Edit3,
  Search,
  ShieldAlert,
  Sparkles,
  Upload,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import IllustrationAsset from '../components/IllustrationAsset.jsx';
import ReportTable from '../components/ReportTable.jsx';
import ResultCard from '../components/ResultCard.jsx';
import StatCard from '../components/StatCard.jsx';
import {
  analyzeReportTests,
  analyzeSingleTest,
  buildReportInsights,
  RESULT_CLASSIFICATION,
} from '../services/analysisService.js';
import { exportReportToPdf } from '../services/reportService.js';
import {
  getReportById,
  getSettings,
  saveAnalyzedReport,
} from '../services/storageService.js';
import { formatDateTime } from '../utils/formatters.js';
import { DRAFT_STORAGE_KEY } from './UploadReport.jsx';

export default function Results() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const reportIdParam = searchParams.get('reportId');
  const highlightedTestId = searchParams.get('testId');

  const [mode, setMode] = useState('analysis'); // 'analysis' | 'review'
  const [draft, setDraft] = useState(null);
  const [analyzedReport, setAnalyzedReport] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState({ explanationDepth: 'standard' });
  const loggedReportIdsRef = useRef(new Set());

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const buildAndPersistReport = (sourceDraft, { persist = true } = {}) => {
    if (!sourceDraft || !Array.isArray(sourceDraft.rows) || sourceDraft.rows.length === 0) {
      return null;
    }

    const validRows = sourceDraft.rows.filter((r) => r.testName && r.testName.trim());
    if (validRows.length === 0) {
      return null;
    }

    const { analyzedTests, summary, insights } = analyzeReportTests(validRows);
    const processingStatus =
      summary.pendingVerificationCount > 0
        ? `${summary.pendingVerificationCount} Awaiting Verification`
        : 'Verified & Analyzed';

    const record = {
      id: sourceDraft.id || `rep-${Date.now()}`,
      title: sourceDraft.title?.trim() || 'Laboratory Report Summary',
      sourceLabel: sourceDraft.sourceLabel || 'Uploaded Report',
      extractionEngine: sourceDraft.extractionEngine || 'Extraction',
      ocrConfidence: sourceDraft.ocrConfidence ?? null,
      processingStatus,
      createdAt: sourceDraft.createdAt || new Date().toISOString(),
      analyzedTests,
      summary,
      insights,
    };

    if (persist) {
      const alreadyLogged = loggedReportIdsRef.current.has(record.id);
      saveAnalyzedReport(record, { skipLog: alreadyLogged });
      loggedReportIdsRef.current.add(record.id);
    }

    return record;
  };

  useEffect(() => {
    if (highlightedTestId && mode === 'analysis') {
      const timer = setTimeout(() => {
        const el = document.getElementById(`test-${highlightedTestId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightedTestId, mode, analyzedReport]);

  useEffect(() => {
    if (reportIdParam) {
      const existing = getReportById(reportIdParam);
      if (existing) {
        loggedReportIdsRef.current.add(existing.id);
        const hydratedTests = (existing.analyzedTests || []).map((t) =>
          t.classification && t.explanation?.whatResultMeans ? t : analyzeSingleTest(t)
        );
        const { summary, insights } = analyzeReportTests(hydratedTests);
        const hydratedReport = {
          ...existing,
          analyzedTests: hydratedTests,
          summary: existing.summary?.normalCount !== undefined ? existing.summary : summary,
          insights:
            existing.insights ||
            buildReportInsights(hydratedTests, existing.summary || summary),
        };
        setAnalyzedReport(hydratedReport);
        setDraft({
          id: hydratedReport.id,
          title: hydratedReport.title,
          sourceLabel: hydratedReport.sourceLabel,
          extractionEngine: hydratedReport.extractionEngine,
          ocrConfidence: hydratedReport.ocrConfidence,
          rawText: existing.rawText || '',
          rows: hydratedTests.map((t) => ({
            id: t.id,
            rawExtractedName: t.rawExtractedName || t.testName,
            testName: t.fullTestName || t.testName,
            fullTestName: t.fullTestName || t.testName,
            abbreviation: t.abbreviation || null,
            matchedDefinitionId: t.matchedDefinitionId || null,
            canonicalName: t.canonicalName || t.fullTestName || t.testName,
            rawValue: t.rawValue || String(t.value ?? ''),
            value: t.value,
            isQualitative: Boolean(t.isQualitative),
            unit: t.unit,
            referenceRange: t.referenceRange,
            rangeUnit: t.rangeUnit || t.unit,
            extractionConfidence: t.extractionConfidence || 'Manual',
            confidenceScore: t.confidenceScore ?? null,
            confidenceReasons: t.confidenceReasons || [],
            ocrLineConfidence: t.ocrLineConfidence ?? null,
            needsReview: Boolean(t.needsReview),
            userVerified: t.userVerified !== false,
          })),
          createdAt: hydratedReport.createdAt,
        });
        setMode('analysis');
        return;
      }
    }

    const loadDraft = (incomingDraft) => {
      setDraft(incomingDraft);
      const isManualEmpty =
        incomingDraft.sourceLabel === 'Manual Entry' &&
        incomingDraft.rows.every((r) => !r.testName?.trim());

      if (isManualEmpty || incomingDraft.rows.length === 0) {
        setAnalyzedReport(null);
        setMode('review');
        return;
      }

      const record = buildAndPersistReport(incomingDraft, { persist: true });
      setAnalyzedReport(record);
      setMode('analysis');
    };

    const stateDraft = location.state?.draft;
    if (stateDraft) {
      loadDraft(stateDraft);
      return;
    }

    try {
      const savedDraftRaw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraftRaw) {
        const parsed = JSON.parse(savedDraftRaw);
        loadDraft(parsed);
        return;
      }
    } catch {
      // Ignore sessionStorage errors
    }

    setDraft(null);
    setAnalyzedReport(null);
  }, [reportIdParam, location.state]);

  const syncDraftAndInterpretation = (updater, { reanalyzeNow = false } = {}) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      if (reanalyzeNow) {
        const record = buildAndPersistReport(next, { persist: true });
        if (record) {
          setAnalyzedReport(record);
        }
      }
      return next;
    });
  };

  const handleUpdateRow = (rowId, patch) => {
    setReviewError(null);
    syncDraftAndInterpretation((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)),
    }));
  };

  const handleDeleteRow = (rowId) => {
    syncDraftAndInterpretation((prev) => ({
      ...prev,
      rows: prev.rows.filter((r) => r.id !== rowId),
    }));
  };

  const handleAddRow = () => {
    setReviewError(null);
    const newRow = {
      id: `row-custom-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      rawLine: '',
      rawExtractedName: '',
      testName: '',
      fullTestName: '',
      abbreviation: null,
      matchedDefinitionId: null,
      canonicalName: null,
      rawValue: '',
      value: null,
      isQualitative: false,
      unit: '',
      referenceRange: '',
      rangeUnit: '',
      extractionConfidence: 'Manual',
      confidenceScore: 100,
      confidenceReasons: [],
      ocrLineConfidence: null,
      needsReview: false,
      userVerified: false,
    };
    syncDraftAndInterpretation((prev) => ({
      ...prev,
      rows: [...prev.rows, newRow],
    }));
  };

  const handleMarkAllVerified = () => {
    setReviewError(null);
    syncDraftAndInterpretation(
      (prev) => ({
        ...prev,
        rows: prev.rows.map((r) => ({ ...r, userVerified: true })),
      }),
      { reanalyzeNow: mode === 'analysis' }
    );
  };

  const handleVerifySingleRow = (rowId) => {
    setReviewError(null);
    syncDraftAndInterpretation(
      (prev) => ({
        ...prev,
        rows: prev.rows.map((r) =>
          r.id === rowId ? { ...r, userVerified: true } : r
        ),
      }),
      { reanalyzeNow: true }
    );
  };

  const handleRunAnalysis = () => {
    if (!draft || draft.rows.length === 0) {
      setReviewError('Please add at least one laboratory test row before viewing interpretation.');
      return;
    }

    const unnamedRow = draft.rows.find((r) => !r.testName || !r.testName.trim());
    if (unnamedRow) {
      setReviewError('Every test row must have a test name before interpretation.');
      return;
    }

    setReviewError(null);
    const record = buildAndPersistReport(draft, { persist: true });
    if (record) {
      setAnalyzedReport(record);
      setMode('analysis');
    }
  };

  const filterOptions = useMemo(() => {
    const sum = analyzedReport?.summary || {};
    const options = [
      { id: 'all', label: `All results (${sum.total || 0})` },
      { id: 'normal', label: `Normal (${sum.normalCount || 0})` },
      { id: 'high', label: `High (${sum.highCount || 0})` },
      { id: 'low', label: `Low (${sum.lowCount || 0})` },
      { id: 'pending', label: `Pending verification (${sum.pendingVerificationCount || 0})` },
    ];
    if ((sum.criticalCount || 0) > 0) {
      options.splice(1, 0, { id: 'critical', label: `Critical (${sum.criticalCount})` });
    }
    if ((sum.unableToDetermineCount || 0) > 0) {
      options.push({
        id: 'unknown',
        label: `Unable to determine (${sum.unableToDetermineCount})`,
      });
    }
    return options;
  }, [analyzedReport]);

  const statusChartData = useMemo(() => {
    if (!analyzedReport?.summary) return [];
    const s = analyzedReport.summary;
    const data = [
      { name: 'Normal', count: s.normalCount ?? s.withinRange ?? 0, fill: '#16A34A' },
      { name: 'High', count: s.highCount ?? s.aboveRange ?? 0, fill: '#D97706' },
      { name: 'Low', count: s.lowCount ?? s.belowRange ?? 0, fill: '#EA580C' },
      { name: 'Pending', count: s.pendingVerificationCount ?? 0, fill: '#1D4ED8' },
    ];
    if ((s.criticalCount || 0) > 0) {
      data.push({ name: 'Critical', count: s.criticalCount, fill: '#DC2626' });
    }
    if ((s.unableToDetermineCount ?? s.unableToDetermine ?? 0) > 0) {
      data.push({
        name: 'Undetermined',
        count: s.unableToDetermineCount ?? s.unableToDetermine,
        fill: '#64748B',
      });
    }
    return data;
  }, [analyzedReport]);

  const intervalPositionChartData = useMemo(() => {
    if (!analyzedReport?.analyzedTests) return [];
    return analyzedReport.analyzedTests
      .filter((t) => t.rangePositionPercent !== null)
      .slice(0, 12)
      .map((t) => {
        const labelName = t.fullTestName || t.testName;
        return {
          name: labelName.length > 18 ? `${labelName.slice(0, 16)}…` : labelName,
          fullName: labelName,
          position: t.rangePositionPercent,
          displayValue: `${t.rawValue || t.value} ${t.unit}`.trim(),
          range: t.referenceRange,
          classification: t.classification || t.status,
        };
      });
  }, [analyzedReport]);

  const filteredTests = useMemo(() => {
    if (!analyzedReport?.analyzedTests) return [];
    return analyzedReport.analyzedTests.filter((t) => {
      const cls = t.classification;
      if (statusFilter === 'normal' && cls !== RESULT_CLASSIFICATION.NORMAL) return false;
      if (statusFilter === 'high' && cls !== RESULT_CLASSIFICATION.HIGH) return false;
      if (statusFilter === 'low' && cls !== RESULT_CLASSIFICATION.LOW) return false;
      if (statusFilter === 'critical' && cls !== RESULT_CLASSIFICATION.CRITICAL) return false;
      if (statusFilter === 'pending' && cls !== RESULT_CLASSIFICATION.PENDING) return false;
      if (statusFilter === 'unknown' && cls !== RESULT_CLASSIFICATION.UNKNOWN) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          (t.fullTestName || t.testName || '').toLowerCase().includes(q) ||
          (t.abbreviation || '').toLowerCase().includes(q) ||
          (t.rawExtractedName || '').toLowerCase().includes(q) ||
          (t.panel || '').toLowerCase().includes(q) ||
          (t.explanation?.whatItMeasures || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [analyzedReport, statusFilter, searchTerm]);

  if (!draft) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10 text-center">
        <div className="mx-auto flex justify-center">
          <IllustrationAsset
            src="/src/assets/illustrations/my-reports-empty-folder.jpg"
            alt="Flat vector illustration of a character holding a medical folder and laboratory reports"
            fallbackTitle="No active laboratory report"
            className="w-48 rounded-lg object-contain"
          />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-[#0F172A]">
          No active laboratory report selected
        </h1>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
          Upload a PDF or image report for automatic Smart Result Interpretation, or open a saved
          summary from My Reports.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Link
            to="/upload"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>Upload Report</span>
          </Link>
          <Link
            to="/reports"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <span>View My Reports</span>
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = analyzedReport?.summary?.pendingVerificationCount || 0;
  const criticalCount = analyzedReport?.summary?.criticalCount || 0;

  return (
    <div className="min-w-0 space-y-6">
      {/* Header & Workspace Mode Controls */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-semibold text-[#1D4ED8]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {mode === 'analysis'
                  ? 'Smart Result Interpretation'
                  : 'Extraction Review & Verification'}
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{draft.extractionEngine}</span>
            {typeof draft.ocrConfidence === 'number' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  Overall OCR confidence: {draft.ocrConfidence}%
                </span>
              </>
            )}
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl [overflow-wrap:anywhere]">
            {draft.title}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 shrink-0">
          {mode === 'review' ? (
            <>
              <Link
                to="/upload"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Upload Another</span>
              </Link>
              <button
                type="button"
                onClick={handleRunAnalysis}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>View Smart Interpretation</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMode('review')}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <Edit3 className="h-4 w-4" aria-hidden="true" />
                <span>Review &amp; Edit Table</span>
              </button>
              {pendingCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllVerified}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3.5 py-2 text-sm font-medium text-[#15803D] hover:bg-[#DCFCE7] whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>Confirm All ({pendingCount})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => exportReportToPdf(analyzedReport)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Download PDF Summary</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* STAGE 1: EXTRACTION REVIEW & EDIT TABLE */}
      {mode === 'review' && (
        <div className="space-y-5">
          {typeof draft.ocrConfidence === 'number' && draft.ocrConfidence < 85 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold">OCR Review Recommended</p>
                <p className="mt-0.5 text-xs leading-relaxed">
                  Image OCR reported an average confidence of {draft.ocrConfidence}%. Compare every
                  number, decimal point, unit, and reference range against your original document.
                </p>
              </div>
            </div>
          )}

          {reviewError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
              <span>{reviewError}</span>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-5">
            <label htmlFor="review-report-title" className="block text-xs font-medium text-slate-600">
              Report Title
            </label>
            <input
              id="review-report-title"
              type="text"
              value={draft.title}
              onChange={(e) =>
                syncDraftAndInterpretation((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-1 w-full max-w-lg rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#1D4ED8] focus:outline-none"
            />
          </div>

          <ReportTable
            rows={draft.rows}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
            onAddRow={handleAddRow}
            onMarkAllVerified={handleMarkAllVerified}
          />
        </div>
      )}

      {/* STAGE 2: SMART RESULT INTERPRETATION DASHBOARD */}
      {mode === 'analysis' && analyzedReport && (
        <div className="space-y-6">
          {/* Verification Alert Banner when rows await confirmation */}
          {pendingCount > 0 && (
            <div className="flex flex-col gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 min-w-0">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {pendingCount} extracted result{pendingCount === 1 ? ' is' : 's are'} awaiting
                    confirmation
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                    Measurements with OCR scanning, missing intervals/units, or unfamiliar
                    abbreviations remain classified as Pending Verification—never Normal—until you
                    confirm them against your original document.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setMode('review')}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  Open Review Table
                </button>
                <button
                  type="button"
                  onClick={handleMarkAllVerified}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-[#1D4ED8] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap"
                >
                  Confirm All ({pendingCount})
                </button>
              </div>
            </div>
          )}

          {/* Critical Value Alert Banner */}
          {criticalCount > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
              <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold">
                  {criticalCount} result{criticalCount === 1 ? '' : 's'} crossed a unit-matched
                  critical threshold
                </p>
                <p className="mt-1 text-xs leading-relaxed text-red-800">
                  LabBridge does not diagnose conditions, but values in a critical alert range
                  warrant prompt review with a qualified healthcare professional. If you are
                  experiencing severe symptoms, seek urgent medical care immediately.
                </p>
              </div>
            </div>
          )}

          {/* Markedly out-of-range banner (non-critical but far outside interval) */}
          {analyzedReport.summary.hasMarkedlyOut && criticalCount === 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold">
                  One or more results are substantially outside the printed reference interval
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  Please review these measurements promptly with a qualified healthcare professional.
                  If you are experiencing acute or severe symptoms, seek urgent medical care
                  immediately.
                </p>
              </div>
            </div>
          )}

          {/* Introductory Explanation Card with Clinician Illustration */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="min-w-0 lg:col-span-8">
                <p className="text-xs font-semibold text-[#1D4ED8]">
                  Smart Results Overview
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#0F172A]">
                  How to read your laboratory interpretation
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Recognized abbreviations are expanded to their full laboratory test names with
                  plain-language summaries. Every confirmed value is compared strictly against the
                  reference interval printed on your report—never invented ranges—and you can expand
                  any card for deeper context and questions for your clinician.
                </p>
              </div>
              <div className="flex justify-center lg:col-span-4 lg:justify-end">
                <IllustrationAsset
                  src="/src/assets/illustrations/results-clinician-explaining.jpg"
                  alt="Flat vector illustration of a healthcare professional explaining laboratory test results and charts to a patient"
                  fallbackTitle="Understanding Your Results"
                  className="w-full max-w-[240px] rounded-lg object-contain"
                />
              </div>
            </div>
          </section>

          {/* Smart Results Overview KPI Strip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            <StatCard
              label="Total Tests Extracted"
              value={analyzedReport.summary.total}
              subtitle={`Processed ${formatDateTime(analyzedReport.createdAt)}`}
              tone="blue"
            />
            <StatCard
              label="Normal Results"
              value={analyzedReport.summary.normalCount ?? analyzedReport.summary.withinRange}
              subtitle="Confirmed within lab range"
              tone="green"
            />
            <StatCard
              label="High Results"
              value={analyzedReport.summary.highCount ?? analyzedReport.summary.aboveRange}
              subtitle={
                criticalCount > 0 ? `Plus ${criticalCount} critical alert(s)` : 'Above lab range'
              }
              tone="amber"
            />
            <StatCard
              label="Low Results"
              value={analyzedReport.summary.lowCount ?? analyzedReport.summary.belowRange}
              subtitle="Below lab range"
              tone="amber"
            />
            <StatCard
              label="Awaiting Verification"
              value={analyzedReport.summary.pendingVerificationCount ?? 0}
              subtitle={
                analyzedReport.summary.unableToDetermine > 0
                  ? `${analyzedReport.summary.unableToDetermine} unable to determine`
                  : 'Require confirmation'
              }
              tone={criticalCount > 0 ? 'red' : 'neutral'}
            />
          </div>

          {/* Recharts Visualizations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6 lg:col-span-5">
              <h2 className="text-sm font-semibold text-[#0F172A]">
                Classification Summary
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Breakdown by verified status and confirmation state
              </p>

              <div className="mt-4 h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusChartData}
                    margin={{ top: 10, right: 12, left: -16, bottom: 5 }}
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
                      {statusChartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6 lg:col-span-7">
              <h2 className="text-sm font-semibold text-[#0F172A]">
                Relative Interval Position Overview
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Shaded green band (21%–79%) represents each test’s laboratory reference interval
              </p>

              {intervalPositionChartData.length === 0 ? (
                <div className="flex h-60 items-center justify-center text-center text-xs text-slate-500 px-4">
                  No bounded min–max intervals available to plot on a normalized range chart.
                </div>
              ) : (
                <div className="mt-4 h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={intervalPositionChartData}
                      margin={{ top: 8, right: 16, left: 8, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        ticks={[0, 21, 50, 79, 100]}
                        tickFormatter={(v) =>
                          v === 21 ? 'Min' : v === 79 ? 'Max' : v === 50 ? 'Mid' : ''
                        }
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        axisLine={{ stroke: '#CBD5E1' }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={110}
                        tick={{ fontSize: 11, fill: '#334155' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ReferenceArea
                        x1={20.6}
                        x2={79.4}
                        fill="#DCFCE7"
                        fillOpacity={0.75}
                      />
                      <Tooltip
                        formatter={(_val, _name, props) => [
                          `${props.payload.displayValue} (Ref: ${props.payload.range})`,
                          props.payload.classification,
                        ]}
                        labelFormatter={(_label, payload) =>
                          payload?.[0]?.payload?.fullName || ''
                        }
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E2E8F0',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="position" radius={[0, 4, 4, 0]} barSize={14}>
                        {intervalPositionChartData.map((entry, idx) => (
                          <Cell
                            key={idx}
                            fill={
                              entry.classification === RESULT_CLASSIFICATION.NORMAL
                                ? '#16A34A'
                                : entry.classification === RESULT_CLASSIFICATION.CRITICAL
                                ? '#DC2626'
                                : entry.classification === RESULT_CLASSIFICATION.PENDING
                                ? '#1D4ED8'
                                : '#D97706'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatusFilter(opt.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === opt.id
                      ? 'bg-white text-[#0F172A] shadow-sm'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64 shrink-0">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tests or abbreviations..."
                aria-label="Filter interpreted tests"
                className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#1D4ED8] focus:outline-none"
              />
            </div>
          </div>

          {/* Result Explanation Cards */}
          <div className="space-y-4">
            {filteredTests.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-10 text-center">
                <div className="mx-auto flex justify-center">
                  <IllustrationAsset
                    src="/src/assets/illustrations/empty-search-documents.jpg"
                    alt="Flat vector illustration of a character searching through laboratory test documents with a magnifying glass"
                    fallbackTitle="No matching tests"
                    className="w-40 rounded-lg object-contain"
                  />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#0F172A]">
                  No laboratory tests match your current filter
                </p>
                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                  Switch back to All results or clear the search field to inspect every extracted
                  measurement in this report.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                  className="mt-4 inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredTests.map((test) => (
                <ResultCard
                  key={test.id}
                  test={test}
                  explanationDepth={settings.explanationDepth}
                  isHighlighted={highlightedTestId === test.id}
                  onVerifyRow={handleVerifySingleRow}
                  onEditRow={() => setMode('review')}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Raw Extracted Document Text Inspection (available in both modes when rawText is present) */}
      {draft.rawText && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setShowRawText((v) => !v)}
            className="flex w-full items-center justify-between px-4 sm:px-5 py-3.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <span>Inspect Raw Extracted Document Text</span>
            <span className="text-[#1D4ED8]">{showRawText ? 'Hide' : 'Show'}</span>
          </button>
          {showRawText && (
            <pre className="max-h-72 overflow-auto border-t border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap [overflow-wrap:anywhere]">
              {draft.rawText}
            </pre>
          )}
        </div>
      )}

      {/* Clinical & Educational Safety Footer */}
      {mode === 'analysis' && analyzedReport && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 text-xs leading-relaxed text-slate-600">
          <h2 className="text-sm font-semibold text-[#0F172A]">
            Important Medical &amp; Reference Range Notice
          </h2>
          <p className="mt-2">
            LabBridge provides educational explanations to help you prepare informed questions for
            your clinician. It does not diagnose diseases, recommend medications, or substitute for
            qualified medical advice. Laboratory reference intervals vary by testing facility and
            may differ based on age, biological sex, pregnancy status, hydration, and fasting state.
            Always discuss concerning or out-of-range measurements with a qualified healthcare
            professional.
          </p>
        </section>
      )}
    </div>
  );
}
