export default function StatCard({ label, value, subtitle, tone = 'neutral' }) {
  const valueColorClass =
    tone === 'green'
      ? 'text-[#15803D]'
      : tone === 'amber'
      ? 'text-[#B45309]'
      : tone === 'red'
      ? 'text-[#B91C1C]'
      : tone === 'blue'
      ? 'text-[#1D4ED8]'
      : 'text-[#0F172A]';

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <p className="text-sm font-medium text-slate-600 [overflow-wrap:anywhere]">{label}</p>
      <p
        className={`mt-2 text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums ${valueColorClass}`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {value}
      </p>
      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 [overflow-wrap:anywhere]">{subtitle}</p>
      )}
    </div>
  );
}
