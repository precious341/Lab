import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  FileText,
  FlaskConical,
  Settings,
  X,
  ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/upload', label: 'Upload Report', icon: Upload },
  { to: '/reports', label: 'My Reports', icon: FileText },
  { to: '/evaluation', label: 'Evaluation Suite', icon: FlaskConical },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function LabBridgeLogo() {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8] text-white shrink-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 17h16" />
          <path d="M6 17V9a6 6 0 0 1 12 0v8" />
          <path d="M10 17v-4a2 2 0 0 1 4 0v4" />
        </svg>
      </div>
      <span
        className="text-lg font-bold tracking-tight text-[#0F172A]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        LabBridge
      </span>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
      isActive
        ? 'bg-[#EFF6FF] text-[#1D4ED8]'
        : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <NavLink to="/" onClick={onClose} className="focus-visible:outline-none">
            <LabBridgeLogo />
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={linkClass}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-[#1D4ED8] shrink-0" aria-hidden="true" />
              <span>Educational Support Only</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              LabBridge explains lab measurements in plain language. It does not diagnose
              conditions or replace your clinician.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
