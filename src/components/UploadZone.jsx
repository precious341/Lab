import { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import IllustrationAsset from './IllustrationAsset.jsx';
import { formatFileSize } from '../utils/formatters.js';

export default function UploadZone({
  onFileSelected,
  isProcessing = false,
  progress = { stage: '', percent: 0 },
  error = null,
  selectedFile = null,
}) {
  const inputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0 || isProcessing) return;
    onFileSelected(files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isProcessing) setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (isProcessing) return;
    handleFiles(e.dataTransfer?.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? 'border-[#1D4ED8] bg-[#EFF6FF]'
            : 'border-slate-300 bg-white hover:border-slate-400'
        } ${isProcessing ? 'opacity-80 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        {isProcessing ? (
          <div className="mx-auto flex justify-center">
            <IllustrationAsset
              src="/src/assets/illustrations/processing-lab-scientist.jpg"
              alt="Flat vector illustration of a laboratory scientist examining a medical sample and report tablet"
              fallbackTitle="Processing Laboratory Report"
              className="w-40 rounded-lg object-contain"
            />
          </div>
        ) : (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#1D4ED8]">
            <UploadCloud className="h-6 w-6" aria-hidden="true" />
          </div>
        )}

        <h3 className="mt-4 text-base font-semibold text-[#0F172A]">
          {isProcessing
            ? 'Processing laboratory report'
            : 'Drag and drop your laboratory report here'}
        </h3>
        <p className="mt-1.5 text-sm text-slate-600">
          Supports text-based PDFs, scanned PDFs, JPG, and PNG images up to 20 MB.
        </p>

        {!isProcessing && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1E40AF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              <span>Browse Files</span>
            </button>
          </div>
        )}

        {selectedFile && !error && (
          <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 text-xs text-slate-600">
            <FileText className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate font-medium text-slate-800">{selectedFile.name}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums shrink-0">{formatFileSize(selectedFile.size)}</span>
          </div>
        )}

        {isProcessing && (
          <div className="mx-auto mt-6 max-w-md text-left">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span>{progress.stage || 'Extracting report data...'}</span>
              <span className="font-mono-tabular">{progress.percent || 0}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#1D4ED8] transition-all duration-200"
                style={{ width: `${Math.max(6, Math.min(100, progress.percent || 0))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <p className="font-semibold">Unable to process file</p>
            <p className="mt-0.5 text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
