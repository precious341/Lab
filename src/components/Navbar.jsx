import { Link, useLocation } from 'react-router-dom';
import { Menu, Upload } from 'lucide-react';

const ROUTE_CONTEXT = {
  '/': { section: 'Overview', title: 'Dashboard' },
  '/upload': { section: 'Workflow', title: 'Upload Laboratory Report' },
  '/results': { section: 'Analysis', title: 'Results Review & Explanations' },
  '/reports': { section: 'History', title: 'My Reports' },
  '/evaluation': { section: 'Benchmark', title: 'Extraction & Accuracy Evaluation' },
  '/settings': { section: 'Preferences', title: 'Settings & Privacy' },
};

export default function Navbar({ onOpenSidebar }) {
  const location = useLocation();
  const context = ROUTE_CONTEXT[location.pathname] || {
    section: 'LabBridge',
    title: 'Laboratory Understanding',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 sm:gap-6 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 lg:hidden shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden sm:inline text-slate-500 whitespace-nowrap shrink-0">
            {context.section}
          </span>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">
            /
          </span>
          <span className="font-semibold text-[#0F172A] truncate">{context.title}</span>
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#1D4ED8] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#1E40AF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0"
        >
          <Upload className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Upload Report</span>
        </Link>
      </div>
    </header>
  );
}
