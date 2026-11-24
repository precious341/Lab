import {
  AlertOctagon,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
} from 'lucide-react';
import {
  COMPARISON_STATUS,
  RESULT_CLASSIFICATION,
} from '../services/analysisService.js';

export default function StatusBadge({ classification, status }) {
  const key = classification || status;

  if (key === RESULT_CLASSIFICATION.CRITICAL) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800 whitespace-nowrap shrink-0">
        <AlertOctagon className="h-3.5 w-3.5 shrink-0 text-red-700" aria-hidden="true" />
        <span>Critical</span>
      </span>
    );
  }

  if (key === RESULT_CLASSIFICATION.PENDING) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#1D4ED8] whitespace-nowrap shrink-0">
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Pending Verification</span>
      </span>
    );
  }

  if (key === RESULT_CLASSIFICATION.NORMAL || key === COMPARISON_STATUS.WITHIN) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-xs font-medium text-[#15803D] whitespace-nowrap shrink-0">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Normal</span>
      </span>
    );
  }

  if (key === RESULT_CLASSIFICATION.LOW || key === COMPARISON_STATUS.BELOW) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-xs font-medium text-[#B45309] whitespace-nowrap shrink-0">
        <ArrowDownCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Low</span>
      </span>
    );
  }

  if (key === RESULT_CLASSIFICATION.HIGH || key === COMPARISON_STATUS.ABOVE) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-xs font-medium text-[#B45309] whitespace-nowrap shrink-0">
        <ArrowUpCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>High</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0">
      <HelpCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Unable to determine</span>
    </span>
  );
}
