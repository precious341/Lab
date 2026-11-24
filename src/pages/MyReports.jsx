import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, Eye, Search, ShieldCheck, Trash2, Upload } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import IllustrationAsset from '../components/IllustrationAsset.jsx';
import { exportReportToPdf } from '../services/reportService.js';
import { deleteReportById, getReports } from '../services/storageService.js';
import { formatDateTime } from '../utils/formatters.js';

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const filteredReports = reports.filter((report) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (report.title || '').toLowerCase().includes(q) ||
      (report.sourceLabel || '').toLowerCase().includes(q)
    );
  });

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    const updated = deleteReportById(pendingDelete.id);
    setReports(updated);
    setPendingDelete(null);
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">My Reports</h1>
          <p className="mt-1 text-sm text-slate-600">
            View structured summaries of your previously analyzed laboratory reports, download PDF
            handouts, or delete records at any time.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          <span>Upload New Report</span>
        </Link>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-xs text-slate-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
        <span>
          Original uploaded PDF and image files are never permanently stored. Only the structured
          test summaries saved locally in this browser appear here.
        </span>
      </div>

      {/* Search Bar */}
      {reports.length > 0 && (
        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved reports by name or source..."
            aria-label="Search saved reports"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#1D4ED8] focus:outline-none"
          />
        </div>
      )}

      {/* Reports List / Empty State */}
      {reports.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-10 text-center">
          <div className="mx-auto flex justify-center">
            <IllustrationAsset
              src="/src/assets/illustrations/my-reports-empty-folder.jpg"
              alt="Flat vector illustration of a welcoming character holding a medical folder and browsing laboratory documents"
              fallbackTitle="No saved reports yet"
              className="w-52 rounded-lg object-contain"
            />
          </div>
          <h2 className="mt-4 text-base font-semibold text-[#0F172A]">No saved reports yet</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            Upload your first laboratory report to extract measurements, review reference intervals,
            and keep an easy-to-read summary ready whenever you need it.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/upload"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span>Upload Laboratory Report</span>
            </Link>
          </div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-10 text-center">
          <div className="mx-auto flex justify-center">
            <IllustrationAsset
              src="/src/assets/illustrations/empty-search-documents.jpg"
              alt="Flat vector illustration of a character holding a magnifying glass over medical laboratory documents"
              fallbackTitle="No matching reports"
              className="w-40 rounded-lg object-contain"
            />
          </div>
          <p className="mt-4 text-sm font-semibold text-[#0F172A]">
            No reports match “{searchQuery}”
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            Try searching by a different report title or extraction source, or clear the search box
            to see all saved summaries.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-4 inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Single-Column Card View */}
          <div className="space-y-3 md:hidden">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
              >
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/results?reportId=${encodeURIComponent(report.id)}`)
                    }
                    className="text-left text-base font-semibold text-[#0F172A] hover:text-[#1D4ED8] [overflow-wrap:anywhere]"
                  >
                    {report.title}
                  </button>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(report.createdAt)} ·{' '}
                    {report.extractionEngine || report.sourceLabel || 'Uploaded Report'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-2.5 text-xs">
                  <div>
                    <span className="block text-slate-500">Tests</span>
                    <span className="font-mono-tabular font-semibold text-[#0F172A]">
                      {report.summary?.total || 0}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Normal</span>
                    <span className="font-mono-tabular font-semibold text-[#15803D]">
                      {report.summary?.normalCount ?? report.summary?.withinRange ?? 0}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Outside</span>
                    <span className="font-mono-tabular font-semibold text-[#B45309]">
                      {report.summary?.outsideRange || 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/results?reportId=${encodeURIComponent(report.id)}`)
                    }
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3 py-2 text-xs font-medium text-white hover:bg-[#1E40AF]"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Open Interpretation</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => exportReportToPdf(report)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(report)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[740px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="px-5 py-3.5">Report Title</th>
                    <th className="px-4 py-3.5">Analyzed</th>
                    <th className="px-4 py-3.5">Extraction Source</th>
                    <th className="px-4 py-3.5 text-right">Tests</th>
                    <th className="px-4 py-3.5 text-right">Normal</th>
                    <th className="px-4 py-3.5 text-right">Outside</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-[#0F172A]">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/results?reportId=${encodeURIComponent(report.id)}`)
                          }
                          className="text-left hover:text-[#1D4ED8] [overflow-wrap:anywhere]"
                        >
                          {report.title}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600 tabular-nums">
                        {formatDateTime(report.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600">
                        {report.extractionEngine || report.sourceLabel || 'Uploaded Report'}
                      </td>
                      <td className="px-4 py-4 text-right font-mono-tabular text-slate-800">
                        {report.summary?.total || 0}
                      </td>
                      <td className="px-4 py-4 text-right font-mono-tabular text-[#15803D]">
                        {report.summary?.normalCount ?? report.summary?.withinRange ?? 0}
                      </td>
                      <td className="px-4 py-4 text-right font-mono-tabular text-[#B45309]">
                        {report.summary?.outsideRange || 0}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/results?reportId=${encodeURIComponent(report.id)}`)
                            }
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Open</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => exportReportToPdf(report)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(report)}
                            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${report.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete saved report summary?"
        message={`This will permanently remove "${
          pendingDelete?.title || 'this report'
        }" from your browser history. This action cannot be undone.`}
        confirmLabel="Delete Report"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
