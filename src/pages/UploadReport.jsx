import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDown, FileText, FlaskConical, Play, ShieldCheck } from 'lucide-react';
import IllustrationAsset from '../components/IllustrationAsset.jsx';
import UploadZone from '../components/UploadZone.jsx';
import { SAMPLE_BENCHMARK_REPORTS } from '../data/sampleReportsDataset.js';
import { extractPdfContent } from '../services/pdfExtractor.js';
import { runOcrOnCanvases, runOcrOnSource } from '../services/ocrService.js';
import { parseLaboratoryText } from '../services/labParser.js';
import { createSyntheticSamplePdfFile } from '../services/reportService.js';
import { validateUploadFile } from '../utils/validators.js';

export const DRAFT_STORAGE_KEY = 'labbridge_active_draft_v1';

export default function UploadReport() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ stage: '', percent: 0 });
  const [error, setError] = useState(null);

  const proceedToReview = ({
    title,
    sourceLabel,
    extractionEngine,
    ocrConfidence,
    rawText,
    extractedRows,
  }) => {
    const draft = {
      id: `rep-${Date.now()}`,
      title: title || 'Laboratory Report',
      sourceLabel,
      extractionEngine,
      ocrConfidence,
      rawText,
      rows: extractedRows,
      createdAt: new Date().toISOString(),
    };

    try {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Fallback via router state if sessionStorage quota exceeded
    }

    navigate('/results', { state: { draft } });
  };

  const handleFileSelected = async (file) => {
    setError(null);
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      setSelectedFile(null);
      setError(validation.error);
      return;
    }

    setSelectedFile(file);
    const defaultTitle =
      reportTitle.trim() || file.name.replace(/\.(pdf|jpg|jpeg|png)$/i, '').replace(/[_-]+/g, ' ');

    setIsProcessing(true);
    setProgress({ stage: 'Preparing document for extraction', percent: 5 });

    try {
      let rawText = '';
      let ocrLines = [];
      let ocrConfidence = null;
      let extractionEngine = '';

      if (validation.fileType === 'pdf') {
        const pdfResult = await extractPdfContent(file, setProgress);
        if (!pdfResult.isScannedPdf) {
          rawText = pdfResult.text;
          extractionEngine = 'PDF.js Text Extraction';
        } else {
          const ocrResult = await runOcrOnCanvases(pdfResult.canvases, setProgress);
          rawText = ocrResult.text;
          ocrLines = ocrResult.lines;
          ocrConfidence = ocrResult.confidence;
          extractionEngine = 'PDF.js + Tesseract.js OCR (Scanned PDF)';
        }
      } else {
        const ocrResult = await runOcrOnSource(file, setProgress);
        rawText = ocrResult.text;
        ocrLines = ocrResult.lines;
        ocrConfidence = ocrResult.confidence;
        extractionEngine = 'Tesseract.js Image OCR';
      }

      setProgress({ stage: 'Parsing test names, values, units, and ranges', percent: 96 });
      const extractedRows = parseLaboratoryText(rawText, ocrLines);

      setProgress({ stage: 'Ready for review', percent: 100 });
      proceedToReview({
        title: defaultTitle,
        sourceLabel: file.name,
        extractionEngine,
        ocrConfidence,
        rawText,
        extractedRows,
      });
    } catch (err) {
      setError(
        err?.message ||
          'Extraction failed. Please verify the file is readable and not password-protected.'
      );
      setIsProcessing(false);
    }
  };

  const handleLoadSyntheticSample = (sample) => {
    const extractedRows = parseLaboratoryText(sample.rawText, []);
    proceedToReview({
      title: `${sample.title}`,
      sourceLabel: 'Synthetic Sample Fixture',
      extractionEngine: 'Synthetic Text Input',
      ocrConfidence: null,
      rawText: sample.rawText,
      extractedRows,
    });
  };

  const handleDownloadSamplePdf = (sample) => {
    const file = createSyntheticSamplePdfFile(sample);
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleStartManualEntry = () => {
    proceedToReview({
      title: reportTitle.trim() || 'Manual Laboratory Entry',
      sourceLabel: 'Manual Entry',
      extractionEngine: 'Manual Entry',
      ocrConfidence: null,
      rawText: '',
      extractedRows: [
        {
          id: `row-manual-${Date.now()}`,
          rawLine: '',
          testName: '',
          matchedDefinitionId: null,
          canonicalName: null,
          rawValue: '',
          value: null,
          unit: '',
          referenceRange: '',
          rangeUnit: '',
          extractionConfidence: 'Manual',
          confidenceScore: 100,
          confidenceReasons: [],
          ocrLineConfidence: null,
          needsReview: false,
          userVerified: false,
        },
      ],
    });
  };

  return (
    <div className="min-w-0 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Upload Laboratory Report
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Upload a text-based PDF, scanned PDF, JPG, or PNG image for automatic Smart Result
            Interpretation, full test name expansion, and review.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartManualEntry}
          disabled={isProcessing}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <FileText className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span>Enter Results Manually</span>
        </button>
      </div>

      {/* Main Upload Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="min-w-0 space-y-5 lg:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            <label htmlFor="report-title-input" className="block text-sm font-medium text-slate-800">
              Report Name (optional)
            </label>
            <input
              id="report-title-input"
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              disabled={isProcessing}
              placeholder="e.g. Annual Wellness Panel — November 2026"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#1D4ED8] focus:outline-none"
            />

            <div className="mt-5">
              <UploadZone
                onFileSelected={handleFileSelected}
                isProcessing={isProcessing}
                progress={progress}
                error={error}
                selectedFile={selectedFile}
              />
            </div>
          </div>
        </div>

        {/* Clear Instructions & Privacy Panel */}
        <aside className="min-w-0 space-y-5 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex justify-center">
              <IllustrationAsset
                src="/src/assets/illustrations/upload-document-laptop.jpg"
                alt="Flat vector illustration of a person uploading a medical laboratory document on a laptop"
                fallbackTitle="Upload Laboratory Document"
                className="w-full max-w-[230px] rounded-lg object-contain"
              />
            </div>
            <h2 className="text-sm font-semibold text-[#0F172A]">How Smart Interpretation Works</h2>
            <ol className="mt-4 space-y-4 text-xs leading-relaxed text-slate-600">
              <li>
                <span className="font-semibold text-slate-800">01. Local Extraction: </span>
                Text-based PDFs are parsed directly with PDF.js. Scanned PDFs, JPGs, and PNGs are
                processed with Tesseract.js OCR inside your browser.
              </li>
              <li>
                <span className="font-semibold text-slate-800">02. Automatic Interpretation: </span>
                Recognized test names, values, units, and laboratory reference ranges are classified
                immediately with plain-language explanations and full test names.
              </li>
              <li>
                <span className="font-semibold text-slate-800">03. Confirmation &amp; Safety: </span>
                OCR lines, missing intervals, or unfamiliar abbreviations are marked Pending
                Verification until you confirm them against your original document.
              </li>
            </ol>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
                <span>
                  Your original PDF or image file is never permanently stored on disk or uploaded to
                  external servers.
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Synthetic Sample Reports for Demonstration & Testing */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
              <h2 className="text-base font-semibold text-[#0F172A]">
                Try Synthetic Sample Reports
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              No personal laboratory file on hand? Test LabBridge with clearly labeled synthetic
              benchmark fixtures—or download one as a real PDF file to test drag-and-drop PDF.js
              extraction.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_BENCHMARK_REPORTS.slice(0, 3).map((sample) => (
            <div
              key={sample.id}
              className="flex min-w-0 flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{sample.formatType}</p>
                <h3 className="mt-1 text-sm font-semibold text-[#0F172A] [overflow-wrap:anywhere]">
                  {sample.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {sample.description}
                </p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleLoadSyntheticSample(sample)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-md bg-[#1D4ED8] px-3 py-2 text-xs font-medium text-white hover:bg-[#1E40AF] disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Interpret Sample</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleDownloadSamplePdf(sample)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
