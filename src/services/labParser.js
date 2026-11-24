import { findTestDefinition } from '../data/testDefinitions.js';
import {
  parseNumericValue,
  parseQualitativeValue,
  parseReferenceRange,
} from '../utils/validators.js';

const KNOWN_UNITS = [
  '10^3/uL',
  '10^6/uL',
  '10*3/uL',
  '10*6/uL',
  'x10^9/L',
  'x10^12/L',
  'mL/min/1.73m2',
  'mL/min/1.73 m2',
  'mL/min',
  'mmol/mol',
  'mmol/L',
  'umol/L',
  'pmol/L',
  'nmol/L',
  'mEq/L',
  'mIU/L',
  'uIU/mL',
  'mU/L',
  'mg/dL',
  'ng/dL',
  'ug/dL',
  'ng/mL',
  'pg/mL',
  'ug/L',
  'g/dL',
  'g/L',
  'mg/L',
  'ng/L',
  'K/uL',
  'M/uL',
  '/uL',
  'cells/uL',
  'IU/L',
  'U/L',
  'L/L',
  'kg/m2',
  'kg/m^2',
  'mmHg',
  'fL',
  'pg',
  '%',
];

const IGNORE_LINE_PATTERNS = [
  /^(patient|dob|date of birth|collected|received|reported|physician|doctor|clinic|hospital|laboratory|lab id|mrn|specimen|page\s+\d|printed|report\s+type|test\s+name|test\s+result|component|reference|disclaimer|comments|note:|phone|fax|address)/i,
  /^[-_=*.\s]{3,}$/,
];

function createRowId(index) {
  return `row-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Extracts a recognized unit token from text, preserving original capitalization where possible.
 */
function extractUnit(segment) {
  if (!segment) return { unit: '', remainder: '' };

  const sortedUnits = [...KNOWN_UNITS].sort((a, b) => b.length - a.length);
  for (const unit of sortedUnits) {
    const escaped = unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Support micro symbol variants in OCR output
    const flexible = escaped.replace(/u/g, '[uµμ]');
    const regex = new RegExp(`(?:^|\\s|\\|)(${flexible})(?=$|\\s|\\||\\(|\\)|,)`, 'i');
    const match = segment.match(regex);
    if (match) {
      const idx = match.index + match[0].indexOf(match[1]);
      const rawUnit = match[1].replace(/[µμ]/g, 'u');
      const remainder = (segment.slice(0, idx) + ' ' + segment.slice(idx + match[1].length)).trim();
      return { unit: rawUnit, remainder };
    }
  }

  return { unit: '', remainder: segment };
}

/**
 * Extracts reference range substring from the trailing segment of a lab line.
 */
function extractReferenceIntervalString(segment) {
  if (!segment) return '';

  const cleaned = segment
    .replace(/\|/g, ' ')
    .replace(/\b(?:high|low|normal|abnormal|critical|ref(?:\.|erence)?(?:\s*range|\s*interval)?)\b[:\-]?/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Closed interval: 12.0 - 15.5, 200 to 900, 0.40–4.50
  const intervalMatch = cleaned.match(
    /(-?\d+(?:[.,]\d+)?\s*(?:-|–|—|to)\s*-?\d+(?:[.,]\d+)?)/i
  );
  if (intervalMatch) {
    return intervalMatch[1].replace(/,/g, '.').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
  }

  // Inequality threshold: < 200, <= 5.7, > 40, >= 60
  const inequalityMatch = cleaned.match(/((?:<=|>=|<|>|≤|≥)\s*-?\d+(?:[.,]\d+)?)/);
  if (inequalityMatch) {
    return inequalityMatch[1].replace(/,/g, '.').replace(/\s+/g, ' ').trim();
  }

  // Qualitative reference interval (e.g., Negative, Non-Reactive, Not Detected, Normal, Clear)
  const qualSegment = segment
    .replace(/\|/g, ' ')
    .replace(/\bref(?:\.|erence)?(?:\s*range|\s*interval)?\b[:\-]?/gi, ' ')
    .replace(/[()[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const qualMatch = qualSegment.match(
    /\b(Negative|Non-Reactive|Nonreactive|Not Detected|Undetected|Absent|None|Normal|Clear)\b/i
  );
  if (qualMatch) {
    return qualMatch[1].trim();
  }

  return '';
}

/**
 * Cleans candidate test name from the prefix before the measured value.
 */
function cleanTestName(rawPrefix) {
  return rawPrefix
    .replace(/\|/g, ' ')
    .replace(/[:\-–]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses a single text line into a structured lab row candidate if it contains a valid test measurement.
 */
function parseLineToCandidate(line, index, ocrLineConfidence = null) {
  const trimmed = (line || '').trim();
  if (!trimmed || trimmed.length < 4) return null;

  if (IGNORE_LINE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return null;
  }

  // Normalize common pipe / colon separators while keeping original text
  const normalized = trimmed.replace(/\s*\|\s*/g, '   ');

  // Primary numeric pattern: <Test Name> <separators or :> <Numeric Value> [Optional H/L flag] <Rest>
  const numericMatch = normalized.match(
    /^([A-Za-z][A-Za-z0-9\s,()./\-+%']{1,60}?)(?:\s{2,}|\s*:\s*|\s+)(-?\d+(?:[.,]\d+)?)(?:\s+(?:H|L|HH|LL|HI|LO|HIGH|LOW|A|\*))?(?=\s|$)(.*)$/i
  );

  // Qualitative pattern fallback: <Test Name> <separators or :> <Negative/Positive/Reactive/...> <Rest>
  const qualMatch = !numericMatch
    ? normalized.match(
        /^([A-Za-z][A-Za-z0-9\s,()./\-+%']{1,60}?)(?:\s{2,}|\s*:\s*|\s+)(Negative|Positive|Non-Reactive|Nonreactive|Reactive|Not Detected|Undetected|Detected|Abnormal|Normal|Trace|Clear|[1-4]\+)(?:\s+(?:H|L|A|\*))?(?=\s|$)(.*)$/i
      )
    : null;

  const activeMatch = numericMatch || qualMatch;
  if (!activeMatch) return null;

  const rawTestName = cleanTestName(activeMatch[1]);
  const rawValueStr = numericMatch ? activeMatch[2].replace(/,/g, '.') : activeMatch[2].trim();
  const trailingText = (activeMatch[3] || '').trim();

  if (!rawTestName || rawTestName.length < 2) return null;
  // Filter out dates, headers, or phone numbers misparsed as values
  if (/^(page|date|time|report|sample|tel|fax|id|age|sex|male|female|status)$/i.test(rawTestName)) {
    return null;
  }
  if (
    numericMatch &&
    /^\d{4}$/.test(rawValueStr) &&
    Number(rawValueStr) > 1900 &&
    Number(rawValueStr) < 2100 &&
    !trailingText
  ) {
    return null;
  }

  const numericValue = numericMatch ? parseNumericValue(rawValueStr) : null;
  const qualValue = qualMatch ? parseQualitativeValue(rawValueStr) : null;
  if (numericValue === null && qualValue === null) return null;

  const { unit, remainder } = extractUnit(trailingText);
  const referenceRange = extractReferenceIntervalString(remainder);

  // Check if test name matches our curated medical dictionary
  const defMatch = findTestDefinition(rawTestName);

  const parsedRange = parseReferenceRange(referenceRange);
  if (numericMatch && !defMatch && !unit && !parsedRange.isValid) {
    return null;
  }
  if (qualMatch && !defMatch && !parsedRange.isValid) {
    return null;
  }

  // Evaluate honest extraction confidence & review flags
  const confidenceReasons = [];
  let confidenceScore = 100;

  if (typeof ocrLineConfidence === 'number' && ocrLineConfidence < 82) {
    confidenceScore -= 30;
    confidenceReasons.push(`OCR confidence is ${ocrLineConfidence}% (below 82% threshold)`);
  } else if (typeof ocrLineConfidence === 'number' && ocrLineConfidence < 92) {
    confidenceScore -= 12;
    confidenceReasons.push(`Moderate OCR confidence (${ocrLineConfidence}%)`);
  }

  if (!referenceRange || !parsedRange.isValid) {
    confidenceScore -= 25;
    confidenceReasons.push('Reference interval missing or unclear on this line');
  }

  if (numericMatch && !unit) {
    confidenceScore -= 20;
    confidenceReasons.push('Measurement unit not detected');
  }

  if (!defMatch) {
    confidenceScore -= 15;
    confidenceReasons.push(
      'Unfamiliar test name or abbreviation — verify meaning and spelling against your original report'
    );
  }

  let extractionConfidence = 'High';
  if (confidenceScore < 65) {
    extractionConfidence = 'Low';
  } else if (confidenceScore < 88) {
    extractionConfidence = 'Medium';
  }

  const needsReview = extractionConfidence !== 'High' || !defMatch;
  const fullTestName = defMatch?.definition?.canonicalName || rawTestName;
  const abbreviation = defMatch?.definition?.abbreviation || null;

  return {
    id: createRowId(index),
    rawLine: trimmed,
    rawExtractedName: rawTestName,
    testName: fullTestName,
    fullTestName,
    abbreviation,
    matchedDefinitionId: defMatch?.definition?.id || null,
    canonicalName: defMatch?.definition?.canonicalName || null,
    rawValue: rawValueStr,
    value: numericValue,
    isQualitative: Boolean(qualValue),
    unit,
    referenceRange,
    rangeUnit: unit,
    extractionConfidence,
    confidenceScore: Math.max(10, confidenceScore),
    confidenceReasons,
    ocrLineConfidence,
    needsReview,
    userVerified: !needsReview && ocrLineConfidence === null,
  };
}

/**
 * Parses full extracted report text (plus optional OCR line confidence metadata)
 * into structured candidate test rows.
 */
export function parseLaboratoryText(rawText, ocrLines = []) {
  if (!rawText || typeof rawText !== 'string') {
    return [];
  }

  const textLines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const candidates = [];

  textLines.forEach((line, index) => {
    const matchedOcrLine = ocrLines.find((ol) => ol.text && line.includes(ol.text.slice(0, 12)));
    const ocrConf = matchedOcrLine?.confidence ?? null;

    const candidate = parseLineToCandidate(line, index, ocrConf);
    if (candidate) {
      candidates.push(candidate);
    }
  });

  return candidates;
}
