import { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import {
  clearAllLabBridgeData,
  getSettings,
  saveSettings,
} from '../services/storageService.js';

export default function Settings() {
  const [form, setForm] = useState({
    displayName: '',
    explanationDepth: 'standard',
    storeSummariesLocally: true,
    autoFlagUncertainOcr: true,
  });
  const [savedNotice, setSavedNotice] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    setForm(getSettings());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSettings(form);
    setSavedNotice(true);
    setClearedNotice(false);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleClearAllData = () => {
    clearAllLabBridgeData();
    setForm(getSettings());
    setShowClearDialog(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 4000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Settings & Privacy
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your profile preferences, educational explanation depth, and local browser data.
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#15803D]">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Preferences saved locally.</span>
        </div>
      )}

      {clearedNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#15803D]">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>All saved reports, activity logs, and preferences have been deleted.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Information */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Profile Information</h2>
          <p className="mt-1 text-xs text-slate-500">
            Stored only in this browser to personalize your dashboard greeting.
          </p>

          <div className="mt-4">
            <label htmlFor="display-name" className="block text-sm font-medium text-slate-800">
              Display Name (optional)
            </label>
            <input
              id="display-name"
              type="text"
              maxLength={60}
              value={form.displayName}
              onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
              placeholder="e.g. Jordan"
              className="mt-1.5 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#1D4ED8] focus:outline-none"
            />
          </div>
        </section>

        {/* Application Preferences */}
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Application Preferences</h2>

          <div className="mt-4 space-y-5">
            <div>
              <label htmlFor="explanation-depth" className="block text-sm font-medium text-slate-800">
                Explanation Detail Level
              </label>
              <select
                id="explanation-depth"
                value={form.explanationDepth}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, explanationDepth: e.target.value }))
                }
                className="mt-1.5 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#1D4ED8] focus:outline-none"
              >
                <option value="standard">Standard (What it measures & why it matters)</option>
                <option value="detailed">
                  Detailed (Includes laboratory range variation notes)
                </option>
              </select>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.storeSummariesLocally}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, storeSummariesLocally: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1D4ED8]"
              />
              <div>
                <span className="block text-sm font-medium text-slate-800">
                  Save analyzed summaries in browser history
                </span>
                <span className="block text-xs text-slate-500">
                  When disabled, analyzed reports can still be viewed and exported to PDF during
                  your session without persisting to My Reports.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.autoFlagUncertainOcr}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, autoFlagUncertainOcr: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1D4ED8]"
              />
              <div>
                <span className="block text-sm font-medium text-slate-800">
                  Require explicit review for uncertain OCR extractions
                </span>
                <span className="block text-xs text-slate-500">
                  Highlights extracted rows with low OCR confidence or missing units/intervals
                  before running comparisons.
                </span>
              </div>
            </label>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
            >
              Save Preferences
            </button>
          </div>
        </section>
      </form>

      {/* Privacy & Architecture Notice */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#1D4ED8]" aria-hidden="true" />
          <h2 className="text-base font-semibold text-[#0F172A]">Privacy &amp; Data Handling</h2>
        </div>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
          <li>
            <strong className="text-slate-800">Local Document Processing:</strong> PDF text
            extraction (PDF.js) and image OCR (Tesseract.js) execute inside your browser.
          </li>
          <li>
            <strong className="text-slate-800">No Permanent Original File Storage:</strong> Original
            uploaded PDFs, JPGs, and PNGs are kept only in temporary memory during extraction and
            are never stored permanently.
          </li>
          <li>
            <strong className="text-slate-800">No Clinical Claims:</strong> LabBridge provides
            educational terminology explanations and reference-interval comparisons only.
          </li>
        </ul>
      </section>

      {/* Data Deletion */}
      <section className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-base font-semibold text-red-900">Data Deletion</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Permanently delete all saved report summaries, activity history, and application settings
          stored in this browser.
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowClearDialog(true)}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 whitespace-nowrap shrink-0"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>Delete All Browser Data</span>
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={showClearDialog}
        title="Delete all local LabBridge data?"
        message="This will permanently clear all saved laboratory report summaries, recent activity, and preferences from this browser. This action cannot be undone."
        confirmLabel="Delete All Data"
        onConfirm={handleClearAllData}
        onCancel={() => setShowClearDialog(false)}
      />
    </div>
  );
}
