import { AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import IllustrationAsset from './IllustrationAsset.jsx';
import {
  parseNumericValue,
  parseQualitativeValue,
  parseReferenceRange,
} from '../utils/validators.js';

export default function ReportTable({
  rows,
  onUpdateRow,
  onDeleteRow,
  onAddRow,
  onMarkAllVerified,
}) {
  const unverifiedCount = rows.filter((r) => !r.userVerified).length;

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:px-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#0F172A]">
            Extracted Measurements Review
          </h3>
          <p className="mt-0.5 text-xs text-slate-600">
            Verify or edit every test name, value, unit, and laboratory reference range. Unverified
            rows remain classified as Pending Verification.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 shrink-0">
          {unverifiedCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllVerified}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
              <span>Confirm All ({unverifiedCount})</span>
            </button>
          )}
          <button
            type="button"
            onClick={onAddRow}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Add Test Row</span>
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto flex justify-center">
            <IllustrationAsset
              src="/src/assets/illustrations/empty-search-documents.jpg"
              alt="Flat vector illustration of a character inspecting laboratory report pages with a magnifying glass"
              fallbackTitle="No test rows detected"
              className="w-36 rounded-lg object-contain"
            />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-800">No laboratory test rows detected</p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            You can add tests manually using the Add Test Row button above, or upload a clearer
            copy of your report.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">Test Name</th>
                <th className="px-4 py-3 w-32">Measured Value</th>
                <th className="px-4 py-3 w-28">Unit</th>
                <th className="px-4 py-3 w-44">Lab Reference Range</th>
                <th className="px-4 py-3 w-44">Extraction Confidence</th>
                <th className="px-4 py-3 w-28 text-center">Verified</th>
                <th className="px-4 py-3 w-16 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => {
                const valueValid =
                  parseNumericValue(row.rawValue) !== null ||
                  parseQualitativeValue(row.rawValue) !== null;
                const rangeParsed = parseReferenceRange(row.referenceRange);
                const needsAttention = !row.userVerified || !valueValid || row.needsReview;

                return (
                  <tr
                    key={row.id}
                    className={
                      needsAttention && !row.userVerified
                        ? 'bg-amber-50/50 hover:bg-amber-50/80'
                        : 'hover:bg-slate-50'
                    }
                  >
                    <td className="px-4 py-3 align-top">
                      <input
                        type="text"
                        value={row.testName}
                        onChange={(e) =>
                          onUpdateRow(row.id, {
                            testName: e.target.value,
                            fullTestName: e.target.value,
                            rawExtractedName: row.rawExtractedName || e.target.value,
                            matchedDefinitionId: null,
                          })
                        }
                        placeholder="e.g. Hemoglobin"
                        aria-label="Test name"
                        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-[#0F172A] focus:border-[#1D4ED8] focus:outline-none"
                      />
                      {row.rawExtractedName &&
                        row.rawExtractedName.toLowerCase() !==
                          (row.testName || '').toLowerCase() && (
                          <p className="mt-1 text-[11px] text-slate-500 [overflow-wrap:anywhere]">
                            Extracted as &ldquo;{row.rawExtractedName}&rdquo;
                          </p>
                        )}
                      {row.confidenceReasons?.length > 0 && !row.userVerified && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-800 [overflow-wrap:anywhere]">
                          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span>{row.confidenceReasons[0]}</span>
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <input
                        type="text"
                        value={row.rawValue}
                        onChange={(e) =>
                          onUpdateRow(row.id, {
                            rawValue: e.target.value,
                            value: parseNumericValue(e.target.value),
                          })
                        }
                        placeholder="13.5"
                        aria-label="Measured value"
                        className={`w-full rounded-md border bg-white px-2.5 py-1.5 font-mono-tabular text-sm focus:outline-none ${
                          valueValid
                            ? 'border-slate-300 text-[#0F172A] focus:border-[#1D4ED8]'
                            : 'border-red-400 text-red-700 focus:border-red-600'
                        }`}
                      />
                    </td>

                    <td className="px-4 py-3 align-top">
                      <input
                        type="text"
                        value={row.unit}
                        onChange={(e) =>
                          onUpdateRow(row.id, {
                            unit: e.target.value,
                            rangeUnit: e.target.value,
                          })
                        }
                        placeholder="g/dL"
                        aria-label="Measurement unit"
                        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono-tabular text-sm text-[#0F172A] focus:border-[#1D4ED8] focus:outline-none"
                      />
                    </td>

                    <td className="px-4 py-3 align-top">
                      <input
                        type="text"
                        value={row.referenceRange}
                        onChange={(e) =>
                          onUpdateRow(row.id, { referenceRange: e.target.value })
                        }
                        placeholder="e.g. 12.0 - 15.5"
                        aria-label="Laboratory reference range"
                        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono-tabular text-sm text-[#0F172A] focus:border-[#1D4ED8] focus:outline-none"
                      />
                      {row.referenceRange && !rangeParsed.isValid && (
                        <p className="mt-1 text-[11px] text-amber-700">
                          Use format like 12.0 - 15.5 or &lt; 200
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top pt-4">
                      <div className="text-xs">
                        <span
                          className={`font-semibold ${
                            row.extractionConfidence === 'High'
                              ? 'text-[#15803D]'
                              : row.extractionConfidence === 'Medium'
                              ? 'text-[#B45309]'
                              : row.extractionConfidence === 'Manual'
                              ? 'text-[#1D4ED8]'
                              : 'text-red-700'
                          }`}
                        >
                          {row.extractionConfidence}
                        </span>
                        {typeof row.ocrLineConfidence === 'number' && (
                          <span className="ml-1.5 font-mono-tabular text-slate-500">
                            · OCR {row.ocrLineConfidence}%
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top pt-3.5 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateRow(row.id, { userVerified: !row.userVerified })
                        }
                        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          row.userVerified
                            ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                            : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        {row.userVerified ? 'Verified' : 'Verify'}
                      </button>
                    </td>

                    <td className="px-4 py-3 align-top pt-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteRow(row.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${row.testName || 'test row'}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
}
