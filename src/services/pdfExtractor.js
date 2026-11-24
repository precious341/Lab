import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/**
 * Groups PDF.js text items on a page into visual lines using their Y coordinate,
 * then sorts left-to-right by X coordinate to preserve tabular lab report structure.
 */
function reconstructPageLines(items) {
  const rows = [];
  const yTolerance = 3.5;

  for (const item of items) {
    const str = (item.str || '').trim();
    if (!str) continue;

    const x = item.transform?.[4] ?? 0;
    const y = item.transform?.[5] ?? 0;

    let targetRow = rows.find((row) => Math.abs(row.y - y) <= yTolerance);
    if (!targetRow) {
      targetRow = { y, chunks: [] };
      rows.push(targetRow);
    }
    targetRow.chunks.push({ x, str });
  }

  // Sort top-to-bottom (higher PDF Y is higher on the page)
  rows.sort((a, b) => b.y - a.y);

  return rows
    .map((row) => {
      row.chunks.sort((a, b) => a.x - b.x);
      // Preserve visual column spacing using gaps where appropriate
      let line = '';
      let prevX = null;
      for (const chunk of row.chunks) {
        if (prevX !== null) {
          const gap = chunk.x - prevX;
          line += gap > 18 ? '   ' : ' ';
        }
        line += chunk.str;
        prevX = chunk.x + chunk.str.length * 4.5;
      }
      return line.trim();
    })
    .filter(Boolean);
}

/**
 * Extracts text from a PDF File using PDF.js.
 * If the PDF contains minimal or no selectable text (scanned PDF), renders pages to canvases
 * so the caller can pass them through Tesseract OCR.
 */
export async function extractPdfContent(file, onProgress) {
  if (!file) {
    throw new Error('No PDF file provided.');
  }

  onProgress?.({ stage: 'Reading PDF document', percent: 15 });

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  const pageTexts = [];
  let totalMeaningfulChars = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const lines = reconstructPageLines(textContent.items || []);
    const pageText = lines.join('\n');

    totalMeaningfulChars += pageText.replace(/\s+/g, '').length;
    pageTexts.push(pageText);

    const progress = 15 + Math.round((pageNum / numPages) * 45);
    onProgress?.({
      stage: `Extracting text from page ${pageNum} of ${numPages}`,
      percent: progress,
    });
  }

  const combinedText = pageTexts.join('\n').trim();

  // Text-based PDF succeeded
  if (totalMeaningfulChars >= 35) {
    onProgress?.({ stage: 'Text extraction complete', percent: 75 });
    return {
      isScannedPdf: false,
      pageCount: numPages,
      text: combinedText,
      canvases: [],
      engine: 'pdfjs-text',
    };
  }

  // Scanned PDF detected: render up to 5 pages at 2x scale for Tesseract OCR
  const maxOcrPages = Math.min(numPages, 5);
  const canvases = [];

  for (let pageNum = 1; pageNum <= maxOcrPages; pageNum++) {
    onProgress?.({
      stage: `Scanned PDF detected — rendering page ${pageNum} for OCR`,
      percent: 45 + Math.round((pageNum / maxOcrPages) * 15),
    });

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    canvases.push(canvas);
  }

  return {
    isScannedPdf: true,
    pageCount: numPages,
    text: '',
    canvases,
    engine: 'pdfjs-canvas-for-ocr',
  };
}
