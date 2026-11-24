/**
 * Input validation, reference interval parsing, qualitative parsing, and unit compatibility checks.
 */

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]);

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

const QUALITATIVE_NEGATIVE_TERMS = new Set([
  'negative',
  'neg',
  'non-reactive',
  'nonreactive',
  'not detected',
  'undetected',
  'absent',
  'none',
  'normal',
  'clear',
]);

const QUALITATIVE_POSITIVE_TERMS = new Set([
  'positive',
  'pos',
  'reactive',
  'detected',
  'present',
  'abnormal',
  'trace',
  '1+',
  '2+',
  '3+',
  '4+',
]);

export function validateUploadFile(file) {
  if (!file) {
    return { valid: false, error: 'No file was selected.' };
  }

  const fileName = (file.name || '').toLowerCase();
  const hasAllowedExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const hasAllowedMime = ALLOWED_MIME_TYPES.has((file.type || '').toLowerCase());

  if (!hasAllowedExtension && !hasAllowedMime) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a PDF, JPG, or PNG laboratory report.',
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: 'The selected file appears to be empty (0 bytes).',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File exceeds the 20 MB maximum size limit.',
    };
  }

  const isPdf = fileName.endsWith('.pdf') || file.type === 'application/pdf';
  return {
    valid: true,
    fileType: isPdf ? 'pdf' : 'image',
    error: null,
  };
}

/**
 * Parses a numeric value safely without fabricating numbers from invalid strings.
 * Preserves inequality prefix metadata if present (e.g. "< 0.5", "> 90").
 */
export function parseNumericValue(raw) {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw !== 'string') return null;

  const trimmed = raw.trim().replace(/,/g, '.');
  const match = trimmed.match(/^[<>≤≥]?\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const num = Number(match[1]);
  return Number.isFinite(num) ? num : null;
}

/**
 * Parses a qualitative laboratory result string (e.g., "Negative", "Positive", "Non-Reactive").
 */
export function parseQualitativeValue(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (QUALITATIVE_NEGATIVE_TERMS.has(cleaned)) {
    return { polarity: 'negative', label: raw.trim() };
  }
  if (QUALITATIVE_POSITIVE_TERMS.has(cleaned)) {
    return { polarity: 'positive', label: raw.trim() };
  }
  return null;
}

/**
 * Parses laboratory-provided reference intervals.
 * Supported forms:
 * - "12.0 - 15.5", "12.0–15.5", "12.0 to 15.5", "(12.0 - 15.5)"
 * - "< 200", "<= 5.7", "≤ 100", "> 40", ">= 60", "≥ 60"
 * - Qualitative reference: "Negative", "Non-Reactive", "Not Detected", "Normal"
 */
export function parseReferenceRange(rangeString) {
  if (!rangeString || typeof rangeString !== 'string') {
    return { isValid: false, type: null, min: null, max: null, raw: '' };
  }

  const cleaned = rangeString
    .replace(/^(ref(?:erence)?(?:\s*range|\s*interval)?\s*[:\-]?\s*)/i, '')
    .replace(/[()[\]]/g, '')
    .replace(/[–—]/g, '-')
    .trim();

  if (!cleaned) {
    return { isValid: false, type: null, min: null, max: null, raw: rangeString };
  }

  // Closed interval: min - max or min to max
  const intervalMatch = cleaned.match(
    /^(-?\d+(?:\.\d+)?)\s*(?:-|to)\s*(-?\d+(?:\.\d+)?)$/i
  );
  if (intervalMatch) {
    const min = Number(intervalMatch[1]);
    const max = Number(intervalMatch[2]);
    if (Number.isFinite(min) && Number.isFinite(max) && min <= max) {
      return {
        isValid: true,
        type: 'interval',
        min,
        max,
        raw: rangeString.trim(),
      };
    }
  }

  // Upper bound only: < 200, <= 5.7, ≤ 150
  const upperMatch = cleaned.match(/^(<=|<|≤|less\s+than)\s*(-?\d+(?:\.\d+)?)$/i);
  if (upperMatch) {
    const max = Number(upperMatch[2]);
    const inclusive = upperMatch[1] === '<=' || upperMatch[1] === '≤';
    if (Number.isFinite(max)) {
      return {
        isValid: true,
        type: 'upper_only',
        min: null,
        max,
        inclusive,
        raw: rangeString.trim(),
      };
    }
  }

  // Lower bound only: > 40, >= 60, ≥ 60
  const lowerMatch = cleaned.match(/^(>=|>|≥|greater\s+than)\s*(-?\d+(?:\.\d+)?)$/i);
  if (lowerMatch) {
    const min = Number(lowerMatch[2]);
    const inclusive = lowerMatch[1] === '>=' || lowerMatch[1] === '≥';
    if (Number.isFinite(min)) {
      return {
        isValid: true,
        type: 'lower_only',
        min,
        max: null,
        inclusive,
        raw: rangeString.trim(),
      };
    }
  }

  // Qualitative reference expectation (e.g., "Negative", "Non-Reactive")
  const qual = parseQualitativeValue(cleaned);
  if (qual) {
    return {
      isValid: true,
      type: 'qualitative',
      expectedPolarity: qual.polarity,
      expectedLabel: qual.label,
      min: null,
      max: null,
      raw: rangeString.trim(),
    };
  }

  return { isValid: false, type: null, min: null, max: null, raw: rangeString };
}

/**
 * Normalizes unit strings purely for equivalence checking (never mutating displayed original units).
 */
export function normalizeUnitToken(unit) {
  if (!unit || typeof unit !== 'string') return '';
  return unit
    .trim()
    .toLowerCase()
    .replace(/µ/g, 'u')
    .replace(/μ/g, 'u')
    .replace(/\s+/g, '')
    .replace(/10\*3/g, '10^3')
    .replace(/10\*6/g, '10^6')
    .replace(/k\/ul/g, '10^3/ul')
    .replace(/x10\^9\/l/g, '10^3/ul')
    .replace(/m\/ul/g, '10^6/ul')
    .replace(/x10\^12\/l/g, '10^6/ul')
    .replace(/iu\/l/g, 'u/l')
    .replace(/meq\/l/g, 'mmol/l')
    .replace(/uiu\/ml/g, 'miu/l')
    .replace(/mu\/l/g, 'miu/l');
}

/**
 * Checks if a measured unit is compatible with a reference interval unit (when a separate range unit is specified).
 * Prevents comparing incompatible units such as mg/dL vs mmol/L.
 */
export function areUnitsCompatible(measuredUnit, rangeUnit) {
  if (!rangeUnit) return true;
  if (!measuredUnit) return true;
  return normalizeUnitToken(measuredUnit) === normalizeUnitToken(rangeUnit);
}
