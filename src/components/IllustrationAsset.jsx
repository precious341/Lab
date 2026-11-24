import { useState } from 'react';
import { FileText } from 'lucide-react';

export default function IllustrationAsset({
  src,
  alt,
  className = '',
  fallbackTitle = 'Laboratory Report Overview',
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-[#EFF6FF] to-[#F0FDFA] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1D4ED8] shadow-xs">
          <FileText className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-3 text-xs font-medium text-slate-600">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
