import { createWorker } from 'tesseract.js';

/**
 * Runs Tesseract.js OCR on an image File, Blob, URL, or HTMLCanvasElement.
 * Never fabricates output if OCR produces empty text or fails.
 */
export async function runOcrOnSource(source, onProgress) {
  let worker = null;

  try {
    onProgress?.({ stage: 'Initializing OCR engine', percent: 10 });

    worker = await createWorker('eng', 1, {
      logger: (message) => {
        if (message.status === 'recognizing text' && typeof message.progress === 'number') {
          const scaled = 20 + Math.round(message.progress * 70);
          onProgress?.({
            stage: 'Recognizing laboratory report text via OCR',
            percent: scaled,
          });
        }
      },
    });

    const result = await worker.recognize(source);
    const text = (result?.data?.text || '').trim();
    const confidence =
      typeof result?.data?.confidence === 'number'
        ? Math.round(result.data.confidence)
        : null;

    const lines = (result?.data?.lines || []).map((line) => ({
      text: (line.text || '').trim(),
      confidence: typeof line.confidence === 'number' ? Math.round(line.confidence) : confidence,
    }));

    if (!text) {
      throw new Error(
        'OCR completed, but no readable text could be detected. Please try a clearer, higher-resolution image or a text-based PDF.'
      );
    }

    onProgress?.({ stage: 'OCR text recognition complete', percent: 92 });

    return {
      text,
      confidence,
      lines,
      engine: 'tesseract-ocr',
    };
  } finally {
    if (worker) {
      await worker.terminate().catch(() => {});
    }
  }
}

/**
 * Runs OCR across multiple rendered PDF page canvases and merges their lines and confidence scores.
 */
export async function runOcrOnCanvases(canvases, onProgress) {
  if (!Array.isArray(canvases) || canvases.length === 0) {
    throw new Error('No pages available for OCR processing.');
  }

  const allText = [];
  const allLines = [];
  const confidences = [];

  for (let idx = 0; idx < canvases.length; idx++) {
    const pageLabel = `page ${idx + 1} of ${canvases.length}`;
    const res = await runOcrOnSource(canvases[idx], (p) => {
      const base = Math.round((idx / canvases.length) * 40) + 55;
      const slice = Math.round(((p.percent || 50) / 100) * (40 / canvases.length));
      onProgress?.({
        stage: `Running OCR on ${pageLabel}`,
        percent: Math.min(96, base + slice),
      });
    });

    allText.push(res.text);
    allLines.push(...res.lines);
    if (typeof res.confidence === 'number') {
      confidences.push(res.confidence);
    }
  }

  const avgConfidence =
    confidences.length > 0
      ? Math.round(confidences.reduce((sum, c) => sum + c, 0) / confidences.length)
      : null;

  return {
    text: allText.join('\n').trim(),
    confidence: avgConfidence,
    lines: allLines,
    engine: 'tesseract-ocr',
  };
}
