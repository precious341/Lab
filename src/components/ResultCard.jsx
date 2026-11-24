import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  HelpCircle,
  Info,
  MessageSquareQuote,
} from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import {
  COMPARISON_STATUS,
  RESULT_CLASSIFICATION,
} from '../services/analysisService.js';

export default function ResultCard({
  test,
  explanationDepth = 'standard',
  isHighlighted = false,
  onVerifyRow,
  onEditRow,
}) {
  const classification =
    test.classification ||
    (test.userVerified === false
      ? RESULT_CLASSIFICATION.PENDING
      : test.status === COMPARISON_STATUS.WITHIN
      ? RESULT_CLASSIFICATION.NORMAL
      : test.status === COMPARISON_STATUS.HIGH || test.status === COMPARISON_STATUS.ABOVE
      ? RESULT_CLASSIFICATION.HIGH
      : test.status === COMPARISON_STATUS.LOW || test.status === COMPARISON_STATUS.BELOW
      ? RESULT_CLASSIFICATION.LOW
      : RESULT_CLASSIFICATION.UNKNOWN);

  const [expanded, setExpanded] = useState(
    Boolean(isHighlighted || classification === RESULT_CLASSIFICATION.CRITICAL)
  );

  const isCritical = classification === RESULT_CLASSIFICATION.CRITICAL;
  const isPending = classification === RESULT_CLASSIFICATION.PENDING;
  const isNormal = classification === RESULT_CLASSIFICATION.NORMAL;
  const isOutOfRange =
    classification === RESULT_CLASSIFICATION.HIGH ||
    classification === RESULT_CLASSIFICATION.LOW ||
    isCritical;

  const markerColor = isNormal
    ? 'bg-[#16A34A]'
    : isCritical
    ? 'bg-red-600'
    : isOutOfRange
    ? 'bg-[#D97706]'
    : isPending
    ? 'bg-[#1D4ED8]'
    : 'bg-slate-500';

  const exp = test.explanation || {};
  const displayName = test.fullTestName || test.testName;
  const showAbbreviation =
    test.abbreviation &&
    test.abbreviation.toLowerCase() !== displayName.toLowerCase();
  const showRawDiff =
    !showAbbreviation &&
    test.rawExtractedName &&
    test.rawExtractedName.toLowerCase() !== displayName.toLowerCase();

  return (
    <article
      id={`test-${test.id}`}
      className={`min-w-0 rounded-xl border bg-white p-4 sm:p-6 transition-colors ${
        isHighlighted
          ? 'border-[#1D4ED8] ring-2 ring-[#DBEAFE]'
          : isCritical
          ? 'border-red-300'
          : 'border-slate-200'
      }`}
    >
      {/* Header: Full Test Name + Common Abbreviation + Status Badge */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 [overflow-wrap:anywhere]">
            {test.panel}
          </p>
          <h3 className="mt-0.5 text-lg font-semibold leading-snug text-[#0F172A] [overflow-wrap:anywhere]">
            {displayName}
          </h3>
          {showAbbreviation && (
            <p className="mt-0.5 text-xs text-slate-500 [overflow-wrap:anywhere]">
              Common abbreviation: <span className="font-medium text-slate-700">{test.abbreviation}</span>
              {test.rawExtractedName &&
              test.rawExtractedName.toLowerCase() !== displayName.toLowerCase() &&
              test.rawExtractedName.toLowerCase() !== test.abbreviation.toLowerCase()
                ? ` · Extracted as "${test.rawExtractedName}"`
                : ''}
            </p>
          )}
          {showRawDiff && (
            <p className="mt-0.5 text-xs text-slate-500 [overflow-wrap:anywhere]">
              Extracted from report as &ldquo;{test.rawExtractedName}&rdquo;
            </p>
          )}
          {!exp.matched && (
            <p className="mt-1 text-xs font-medium text-amber-800 [overflow-wrap:anywhere]">
              Unfamiliar abbreviation or assay name — verify against your original report
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <StatusBadge classification={classification} status={test.status} />
        </div>
      </div>

      {/* Measured Value, Unit, Reference Range, Extraction & Verification Metadata */}
      <div className="mt-4 grid grid-cols-1 gap-4 border-y border-slate-100 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Measured Result</p>
          <p className="mt-1 font-mono-tabular text-xl font-semibold text-[#0F172A] [overflow-wrap:anywhere]">
            {test.rawValue || test.value || '—'}
            {test.unit ? (
              <span className="ml-1.5 text-sm font-normal text-slate-600">{test.unit}</span>
            ) : (
              <span className="ml-1.5 text-xs font-normal text-slate-400">
                {test.isQualitative ? '' : '(unit not specified)'}
              </span>
            )}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Laboratory Reference Range</p>
          <p className="mt-1 font-mono-tabular text-base font-medium text-slate-800 [overflow-wrap:anywhere]">
            {test.referenceRange || 'Not provided on report'}
            {test.referenceRange && test.unit && !test.isQualitative ? (
              <span className="ml-1.5 text-xs font-normal text-slate-500">{test.unit}</span>
            ) : null}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Extraction Confidence</p>
          <p className="mt-1 text-sm text-slate-700 [overflow-wrap:anywhere]">
            <span
              className={`font-semibold ${
                test.extractionConfidence === 'High'
                  ? 'text-[#15803D]'
                  : test.extractionConfidence === 'Medium'
                  ? 'text-[#B45309]'
                  : test.extractionConfidence === 'Manual'
                  ? 'text-[#1D4ED8]'
                  : 'text-red-700'
              }`}
            >
              {test.extractionConfidence || 'Manual'}
            </span>
            {typeof test.ocrLineConfidence === 'number' && (
              <span className="ml-1.5 font-mono-tabular text-xs text-slate-500">
                (OCR {test.ocrLineConfidence}%)
              </span>
            )}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">Verification Status</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-medium ${
                test.userVerified ? 'text-[#15803D]' : 'text-[#1D4ED8]'
              }`}
            >
              {test.userVerified ? 'Verified' : 'Pending Verification'}
            </span>
            {!test.userVerified && onVerifyRow && (
              <button
                type="button"
                onClick={() => onVerifyRow(test.id)}
                className="inline-flex items-center gap-1 rounded-md border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-xs font-medium text-[#15803D] hover:bg-[#DCFCE7] whitespace-nowrap shrink-0"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Confirm</span>
              </button>
            )}
            {onEditRow && (
              <button
                type="button"
                onClick={() => onEditRow(test.id)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <Edit3 className="h-3 w-3" aria-hidden="true" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Relative Interval Position Indicator */}
      {test.rangePositionPercent !== null && test.parsedRange?.type === 'interval' && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono-tabular">
            <span>Low (&lt; {test.parsedRange.min})</span>
            <span>
              Interval: {test.parsedRange.min} – {test.parsedRange.max}
            </span>
            <span>High (&gt; {test.parsedRange.max})</span>
          </div>
          <div className="relative mt-2 h-2.5 w-full rounded-full bg-slate-100">
            <div
              className="absolute inset-y-0 rounded-full bg-[#DCFCE7] border border-[#BBF7D0]"
              style={{ left: '20.6%', right: '20.6%' }}
            />
            <div
              className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm ${markerColor}`}
              style={{ left: `${test.rangePositionPercent}%` }}
              title={`Measured: ${test.rawValue || test.value} ${test.unit}`}
            />
          </div>
        </div>
      )}

      {test.statusReason && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          <span className="min-w-0 [overflow-wrap:anywhere]">{test.statusReason}</span>
        </div>
      )}

      {isPending && test.confidenceReasons?.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-xs text-slate-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <span className="font-semibold text-[#0F172A]">Confirmation needed: </span>
            <span>{test.confidenceReasons.join(' · ')}</span>
          </div>
        </div>
      )}

      {/* Always-Visible Concise Summary: What It Measures + Result Interpretation */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
          <h4 className="text-xs font-semibold text-[#0F172A]">What this test measures</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700 [overflow-wrap:anywhere]">
            {exp.whatItMeasures}
          </p>
        </div>

        <div
          className={`min-w-0 rounded-lg border p-4 ${
            isCritical
              ? 'border-red-200 bg-red-50/70'
              : isNormal
              ? 'border-[#BBF7D0] bg-[#F0FDF4]/60'
              : isOutOfRange
              ? 'border-[#FDE68A] bg-[#FFFBEB]/60'
              : isPending
              ? 'border-[#BFDBFE] bg-[#EFF6FF]/60'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <h4 className="text-xs font-semibold text-[#0F172A]">Interpretation of your result</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-800 [overflow-wrap:anywhere]">
            {exp.whatResultMeans || exp.shortDashboardSummary}
          </p>
        </div>
      </div>

      {/* Expandable Detailed Explanation & Follow-up Guidance */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="inline-flex w-full sm:w-auto items-center justify-center sm:justify-start gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-slate-100 transition-colors"
        >
          <span>
            {expanded
              ? 'Hide detailed explanation & follow-up guidance'
              : 'Show detailed explanation & follow-up guidance'}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Why this test is important */}
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-slate-800">Why is this test important?</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                {exp.whyItMatters}
              </p>
            </div>

            {/* Above range & Below range meanings */}
            {(exp.aboveRangeMeaning || exp.belowRangeMeaning) && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div
                  className={`min-w-0 rounded-lg border p-3.5 ${
                    test.status === COMPARISON_STATUS.ABOVE
                      ? 'border-[#FDE68A] bg-[#FFFBEB]/50'
                      : 'border-slate-200 bg-slate-50/70'
                  }`}
                >
                  <h4 className="text-xs font-semibold text-slate-800">
                    What does being above the reference range mean?
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                    {exp.aboveRangeMeaning}
                  </p>
                </div>

                <div
                  className={`min-w-0 rounded-lg border p-3.5 ${
                    test.status === COMPARISON_STATUS.BELOW
                      ? 'border-[#FDE68A] bg-[#FFFBEB]/50'
                      : 'border-slate-200 bg-slate-50/70'
                  }`}
                >
                  <h4 className="text-xs font-semibold text-slate-800">
                    What does being below the reference range mean?
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                    {exp.belowRangeMeaning}
                  </p>
                </div>
              </div>
            )}

            {/* Balanced understanding & laboratory range variability */}
            <div className="min-w-0 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                <h4 className="text-xs font-semibold text-slate-800">
                  Balanced context &amp; follow-up guidance
                </h4>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                {exp.balancedTakeaway}
                {(explanationDepth === 'detailed' || exp.rangeVariationNote) && exp.rangeVariationNote
                  ? ` ${exp.rangeVariationNote}`
                  : ''}
              </p>
            </div>

            {/* Questions for clinician */}
            {exp.doctorQuestions?.length > 0 && (
              <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-1.5">
                  <MessageSquareQuote
                    className="h-3.5 w-3.5 text-[#1D4ED8] shrink-0"
                    aria-hidden="true"
                  />
                  <h4 className="text-xs font-semibold text-[#0F172A]">
                    Questions to ask your healthcare professional
                  </h4>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-700 [overflow-wrap:anywhere]">
                  {exp.doctorQuestions.map((question, idx) => (
                    <li key={idx}>{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Urgent / Follow-up Alert Note */}
      {(isCritical || test.isMarkedlyOut || isOutOfRange) && exp.urgentGuidanceNote && (
        <div
          className={`mt-4 flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed ${
            isCritical || test.isMarkedlyOut
              ? 'border-red-200 bg-red-50 text-red-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          <AlertTriangle
            className={`mt-0.5 h-4 w-4 shrink-0 ${
              isCritical || test.isMarkedlyOut ? 'text-red-600' : 'text-amber-600'
            }`}
            aria-hidden="true"
          />
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <span className="font-semibold">
              {isCritical || test.isMarkedlyOut
                ? 'Prompt clinician follow-up advised: '
                : 'Follow-up guidance: '}
            </span>
            <span>{exp.urgentGuidanceNote}</span>
          </div>
        </div>
      )}
    </article>
  );
}
