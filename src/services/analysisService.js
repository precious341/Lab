import { findTestDefinition, TEST_DEFINITIONS } from '../data/testDefinitions.js';
import {
  areUnitsCompatible,
  normalizeUnitToken,
  parseNumericValue,
  parseQualitativeValue,
  parseReferenceRange,
} from '../utils/validators.js';

export const COMPARISON_STATUS = {
  WITHIN: 'Within reference range',
  BELOW: 'Below reference range',
  ABOVE: 'Above reference range',
  UNKNOWN: 'Unable to determine',
};

export const RESULT_CLASSIFICATION = {
  NORMAL: 'Normal',
  HIGH: 'High',
  LOW: 'Low',
  CRITICAL: 'Critical',
  PENDING: 'Pending Verification',
  UNKNOWN: 'Unable to determine',
};

function buildWhatResultMeans({
  testName,
  measuredDisplay,
  refDisplay,
  status,
  classification,
  criticalDirection,
  statusReason,
  def,
  userVerified,
}) {
  if (!userVerified || classification === RESULT_CLASSIFICATION.PENDING) {
    return `This extracted measurement for ${testName} (${measuredDisplay}) is awaiting your confirmation before LabBridge assigns a final range classification. Compare the extracted number, unit, and laboratory reference range (${refDisplay}) against your original document and click Confirm Result.`;
  }

  if (classification === RESULT_CLASSIFICATION.CRITICAL) {
    const directionText =
      criticalDirection === 'low' ? 'markedly below' : 'markedly above';
    return `Your ${testName} result (${measuredDisplay}) is ${directionText} the printed reference interval (${refDisplay}) and crosses a recognized critical alert threshold for this measurement. Contact a qualified healthcare professional promptly to verify and review this result.`;
  }

  if (status === COMPARISON_STATUS.WITHIN) {
    return `Your ${testName} result (${measuredDisplay}) falls within the reference interval printed on your laboratory report (${refDisplay}). This indicates the measurement sits inside your laboratory’s expected range for this test.`;
  }

  if (status === COMPARISON_STATUS.ABOVE) {
    const context = def?.aboveRangeMeaning
      ? ` ${def.aboveRangeMeaning}`
      : ' Values above a reference interval can happen for a variety of temporary or physiological reasons.';
    return `Your ${testName} result (${measuredDisplay}) is above the reference interval provided by your laboratory (${refDisplay}).${context}`;
  }

  if (status === COMPARISON_STATUS.BELOW) {
    const context = def?.belowRangeMeaning
      ? ` ${def.belowRangeMeaning}`
      : ' Values below a reference interval can happen for a variety of temporary or physiological reasons.';
    return `Your ${testName} result (${measuredDisplay}) is below the reference interval provided by your laboratory (${refDisplay}).${context}`;
  }

  return (
    statusReason ||
    'There is not enough reference interval or unit information from the uploaded report to compare this measurement safely. Please check your original laboratory printout.'
  );
}

function buildShortDashboardSummary({ testName, status, classification, def }) {
  const shortMeasure = def?.whatItMeasures
    ? def.whatItMeasures.split('.')[0] + '.'
    : 'Review this measurement alongside your original report.';

  if (classification === RESULT_CLASSIFICATION.PENDING) {
    return `Your ${testName} extraction is awaiting confirmation against your original report. ${shortMeasure}`;
  }
  if (classification === RESULT_CLASSIFICATION.CRITICAL) {
    return `Your ${testName} result is markedly outside the laboratory reference interval and reaches a critical alert range. ${shortMeasure} Seek prompt review with a qualified healthcare professional.`;
  }
  if (status === COMPARISON_STATUS.BELOW) {
    return `Your ${testName} result is below the reference interval provided by your laboratory. ${shortMeasure} Discuss this result with your healthcare professional, who can interpret it alongside your other findings.`;
  }
  if (status === COMPARISON_STATUS.ABOVE) {
    return `Your ${testName} result is above the reference interval provided by your laboratory. ${shortMeasure} Discuss this result with your healthcare professional, who can interpret it alongside your medical history.`;
  }
  if (status === COMPARISON_STATUS.WITHIN) {
    return `Your ${testName} result is within the reference interval printed on your laboratory report. ${shortMeasure}`;
  }
  return `Your ${testName} result could not be compared automatically because a valid reference interval or matching unit was not available. Verify the printed range on your original report.`;
}

/**
 * Evaluates a single test item against ONLY the laboratory-provided reference range.
 * Never fabricates reference ranges or compares incompatible units, and never classifies
 * unverified results as Normal simply because extraction confidence is high.
 */
export function analyzeSingleTest(item) {
  const rawValInput =
    item.rawValue !== undefined && item.rawValue !== ''
      ? String(item.rawValue)
      : item.value !== undefined && item.value !== null
      ? String(item.value)
      : '';
  const numericValue = parseNumericValue(rawValInput);
  const qualValue = numericValue === null ? parseQualitativeValue(rawValInput) : null;
  const parsedRange = parseReferenceRange(item.referenceRange);

  let def = null;
  if (item.matchedDefinitionId) {
    def = TEST_DEFINITIONS.find((d) => d.id === item.matchedDefinitionId) || null;
  }
  if (!def) {
    const found = findTestDefinition(item.rawExtractedName || item.testName);
    def = found?.definition || null;
  }

  let status = COMPARISON_STATUS.UNKNOWN;
  let statusReason = '';

  if (numericValue === null && qualValue === null) {
    status = COMPARISON_STATUS.UNKNOWN;
    statusReason = 'Measured value is missing or could not be parsed safely.';
  } else if (!parsedRange.isValid) {
    status = COMPARISON_STATUS.UNKNOWN;
    statusReason =
      'No valid laboratory reference interval was provided on the report for this test.';
  } else if (item.rangeUnit && item.unit && !areUnitsCompatible(item.unit, item.rangeUnit)) {
    status = COMPARISON_STATUS.UNKNOWN;
    statusReason = `Measured unit (${item.unit}) does not match reference range unit (${item.rangeUnit}).`;
  } else if (parsedRange.type === 'qualitative') {
    if (qualValue) {
      status =
        qualValue.polarity === parsedRange.expectedPolarity
          ? COMPARISON_STATUS.WITHIN
          : COMPARISON_STATUS.ABOVE;
    } else {
      status = COMPARISON_STATUS.UNKNOWN;
      statusReason =
        'Qualitative reference range cannot be compared against a numeric measurement automatically.';
    }
  } else if (numericValue === null) {
    status = COMPARISON_STATUS.UNKNOWN;
    statusReason =
      'Qualitative measurement cannot be compared against a numeric interval automatically.';
  } else {
    if (parsedRange.type === 'interval') {
      if (numericValue < parsedRange.min) {
        status = COMPARISON_STATUS.BELOW;
      } else if (numericValue > parsedRange.max) {
        status = COMPARISON_STATUS.ABOVE;
      } else {
        status = COMPARISON_STATUS.WITHIN;
      }
    } else if (parsedRange.type === 'upper_only') {
      const isWithin = parsedRange.inclusive
        ? numericValue <= parsedRange.max
        : numericValue < parsedRange.max;
      status = isWithin ? COMPARISON_STATUS.WITHIN : COMPARISON_STATUS.ABOVE;
    } else if (parsedRange.type === 'lower_only') {
      const isWithin = parsedRange.inclusive
        ? numericValue >= parsedRange.min
        : numericValue > parsedRange.min;
      status = isWithin ? COMPARISON_STATUS.WITHIN : COMPARISON_STATUS.BELOW;
    }
  }

  let rangePositionPercent = null;
  if (
    numericValue !== null &&
    parsedRange.isValid &&
    parsedRange.type === 'interval' &&
    parsedRange.max > parsedRange.min
  ) {
    const span = parsedRange.max - parsedRange.min;
    const extendedMin = parsedRange.min - span * 0.35;
    const extendedMax = parsedRange.max + span * 0.35;
    const pct = ((numericValue - extendedMin) / (extendedMax - extendedMin)) * 100;
    rangePositionPercent = Math.max(4, Math.min(96, Math.round(pct)));
  }

  let isMarkedlyOut = false;
  if (
    numericValue !== null &&
    parsedRange.isValid &&
    parsedRange.type === 'interval' &&
    parsedRange.max > parsedRange.min
  ) {
    const span = parsedRange.max - parsedRange.min;
    if (numericValue < parsedRange.min - span * 0.35 || numericValue > parsedRange.max + span * 0.35) {
      isMarkedlyOut = true;
    }
  }

  const unitStr = (item.unit || '').trim();
  const normalizedUnit = normalizeUnitToken(unitStr);
  const userVerified = item.userVerified !== false;

  // Critical classification strictly requires verification, unit compatibility,
  // a recognized definition, and a unit-matched test-specific critical threshold.
  let isCritical = false;
  let criticalDirection = null;
  if (
    userVerified &&
    numericValue !== null &&
    normalizedUnit &&
    (!item.rangeUnit || areUnitsCompatible(unitStr, item.rangeUnit)) &&
    def?.criticalThresholds?.[normalizedUnit]
  ) {
    const thresholds = def.criticalThresholds[normalizedUnit];
    if (typeof thresholds.low === 'number' && numericValue <= thresholds.low) {
      isCritical = true;
      criticalDirection = 'low';
      isMarkedlyOut = true;
    } else if (typeof thresholds.high === 'number' && numericValue >= thresholds.high) {
      isCritical = true;
      criticalDirection = 'high';
      isMarkedlyOut = true;
    }
  }

  let classification = RESULT_CLASSIFICATION.UNKNOWN;
  if (!userVerified) {
    classification = RESULT_CLASSIFICATION.PENDING;
  } else if (isCritical) {
    classification = RESULT_CLASSIFICATION.CRITICAL;
  } else if (status === COMPARISON_STATUS.WITHIN) {
    classification = RESULT_CLASSIFICATION.NORMAL;
  } else if (status === COMPARISON_STATUS.ABOVE) {
    classification = RESULT_CLASSIFICATION.HIGH;
  } else if (status === COMPARISON_STATUS.BELOW) {
    classification = RESULT_CLASSIFICATION.LOW;
  } else {
    classification = RESULT_CLASSIFICATION.UNKNOWN;
  }

  const rawExtractedName = (item.rawExtractedName || item.testName || '').trim();
  const fullTestName = def?.canonicalName || item.fullTestName || rawExtractedName || 'Unnamed Test';
  const abbreviation = def?.abbreviation || item.abbreviation || null;

  const refStr = (item.referenceRange || '').trim();
  const measuredDisplay = `${rawValInput || '—'}${unitStr ? ` ${unitStr}` : ''}`.trim();
  const refDisplay = `${refStr || 'Not provided'}${refStr && unitStr ? ` ${unitStr}` : ''}`.trim();

  const requiresManualVerification =
    !userVerified ||
    classification === RESULT_CLASSIFICATION.PENDING ||
    status === COMPARISON_STATUS.UNKNOWN;

  const whatResultMeans = buildWhatResultMeans({
    testName: fullTestName,
    measuredDisplay,
    refDisplay,
    status,
    classification,
    criticalDirection,
    statusReason,
    def,
    userVerified,
  });

  const shortDashboardSummary = buildShortDashboardSummary({
    testName: fullTestName,
    status,
    classification,
    def,
  });

  const explanation = def
    ? {
        matched: true,
        whatItMeasures: def.whatItMeasures,
        whatResultMeans,
        whyItMatters: def.whyItMatters,
        aboveRangeMeaning: def.aboveRangeMeaning,
        belowRangeMeaning: def.belowRangeMeaning,
        balancedTakeaway: def.balancedTakeaway,
        doctorQuestions: def.doctorQuestions || [],
        rangeVariationNote: def.rangeVariationNote,
        urgentGuidanceNote: def.urgentGuidanceNote,
        shortDashboardSummary,
      }
    : {
        matched: false,
        whatItMeasures:
          'LabBridge does not recognize this test name or abbreviation in its built-in medical glossary, so it will not guess its clinical meaning.',
        whatResultMeans,
        whyItMatters:
          'Because laboratories use varied assay names and abbreviations, your ordering clinician is the best person to explain why this measurement was included in your panel.',
        aboveRangeMeaning:
          'Information is insufficient in LabBridge’s built-in glossary to list test-specific causes for elevated readings on this assay.',
        belowRangeMeaning:
          'Information is insufficient in LabBridge’s built-in glossary to list test-specific causes for low readings on this assay.',
        balancedTakeaway:
          'Your exact measurement and laboratory reference interval have been preserved. Verify the abbreviation against your original report and review it with a qualified healthcare professional.',
        doctorQuestions: [
          `What does ${fullTestName} evaluate in my specific health context?`,
          'How does this reading fit alongside the other tests in my report?',
        ],
        rangeVariationNote:
          'Reference intervals are established by each laboratory and can vary by age, biological sex, pregnancy status, and testing method.',
        urgentGuidanceNote:
          'If this result is flagged out of range or you are experiencing new symptoms, contact a qualified healthcare professional.',
        shortDashboardSummary,
      };

  return {
    id: item.id,
    testName: fullTestName,
    fullTestName,
    abbreviation,
    rawExtractedName,
    matchedDefinitionId: def?.id || item.matchedDefinitionId || null,
    canonicalName: def?.canonicalName || fullTestName,
    panel: def?.panel || 'General Laboratory Test',
    value: numericValue,
    rawValue: rawValInput,
    isQualitative: Boolean(qualValue),
    unit: unitStr,
    referenceRange: refStr,
    rangeUnit: item.rangeUnit || unitStr,
    parsedRange,
    status,
    classification,
    isCritical,
    criticalDirection,
    statusReason,
    rangePositionPercent,
    isMarkedlyOut,
    requiresManualVerification,
    userVerified,
    needsReview: Boolean(item.needsReview),
    extractionConfidence: item.extractionConfidence || 'Manual',
    confidenceScore: item.confidenceScore ?? null,
    confidenceReasons: item.confidenceReasons || [],
    ocrLineConfidence: item.ocrLineConfidence ?? null,
    explanation,
  };
}

/**
 * Generates grounded, non-fabricated educational insights strictly from analyzed test results.
 */
export function buildReportInsights(analyzedTests, summary) {
  const insights = [];
  if (!analyzedTests || analyzedTests.length === 0) return insights;

  const normalCount = summary.normalCount ?? summary.withinRange ?? 0;
  const criticalCount = summary.criticalCount ?? 0;
  const pendingCount = summary.pendingVerificationCount ?? 0;
  const highCount = summary.highCount ?? summary.aboveRange ?? 0;
  const lowCount = summary.lowCount ?? summary.belowRange ?? 0;
  const outsideCount = highCount + lowCount + criticalCount;

  if (criticalCount > 0) {
    const critNames = analyzedTests
      .filter((t) => t.classification === RESULT_CLASSIFICATION.CRITICAL)
      .map((t) => t.fullTestName || t.testName);
    insights.push({
      id: 'insight-critical',
      tone: 'red',
      title: `${criticalCount} critical alert measurement${criticalCount === 1 ? '' : 's'} detected`,
      detail: `${critNames.join(', ')} crossed a unit-matched critical threshold. Contact a qualified healthcare professional promptly to verify and review these results.`,
    });
  }

  if (normalCount > 0) {
    insights.push({
      id: 'insight-within',
      tone: 'green',
      title: `${normalCount} of ${summary.total} tests within printed reference intervals`,
      detail:
        normalCount === summary.total
          ? 'Every verified test in this report sits within the reference interval printed by your laboratory.'
          : 'These verified measurements fell inside the expected intervals provided on your report. Always consider them alongside your overall clinical picture.',
    });
  }

  if (outsideCount > 0 && criticalCount < outsideCount) {
    const outNames = analyzedTests
      .filter(
        (t) =>
          t.classification === RESULT_CLASSIFICATION.HIGH ||
          t.classification === RESULT_CLASSIFICATION.LOW
      )
      .map((t) => t.fullTestName || t.testName);
    insights.push({
      id: 'insight-outside',
      tone: 'amber',
      title: `${outNames.length} result${outNames.length === 1 ? '' : 's'} outside reference intervals`,
      detail: `${outNames.join(', ')} ${
        outNames.length === 1 ? 'was' : 'were'
      } outside your laboratory’s printed range. A single out-of-range result cannot establish a diagnosis on its own—bring these questions to your clinician.`,
    });
  }

  if (pendingCount > 0 || (summary.unableToDetermine || 0) > 0) {
    const verifyCount = pendingCount + (summary.unableToDetermine || 0);
    insights.push({
      id: 'insight-verify',
      tone: 'neutral',
      title: `${verifyCount} measurement${verifyCount === 1 ? '' : 's'} awaiting verification or missing intervals`,
      detail:
        'Results awaiting confirmation, unrecognized abbreviations, or measurements without printed reference intervals should be cross-checked directly against your original laboratory printout.',
    });
  }

  // Educational insight grounded in an actual test present on the report
  const featured =
    analyzedTests.find(
      (t) =>
        (t.classification === RESULT_CLASSIFICATION.CRITICAL ||
          t.classification === RESULT_CLASSIFICATION.HIGH ||
          t.classification === RESULT_CLASSIFICATION.LOW) &&
        t.explanation?.matched
    ) || analyzedTests.find((t) => t.explanation?.matched);

  if (featured) {
    insights.push({
      id: 'insight-education',
      tone: 'blue',
      title: `About ${featured.fullTestName || featured.testName}`,
      detail: `${featured.explanation.whyItMatters} ${featured.explanation.rangeVariationNote}`,
    });
  }

  return insights;
}

/**
 * Analyzes an entire list of laboratory tests and produces summary statistics and insights.
 */
export function analyzeReportTests(tests) {
  const analyzedTests = (tests || []).map(analyzeSingleTest);

  const normalCount = analyzedTests.filter(
    (t) => t.classification === RESULT_CLASSIFICATION.NORMAL
  ).length;
  const highCount = analyzedTests.filter(
    (t) => t.classification === RESULT_CLASSIFICATION.HIGH
  ).length;
  const lowCount = analyzedTests.filter(
    (t) => t.classification === RESULT_CLASSIFICATION.LOW
  ).length;
  const criticalCount = analyzedTests.filter(
    (t) => t.classification === RESULT_CLASSIFICATION.CRITICAL
  ).length;
  const pendingVerificationCount = analyzedTests.filter(
    (t) => t.classification === RESULT_CLASSIFICATION.PENDING
  ).length;
  const unableToDetermineCount = analyzedTests.filter(
    (t) => t.classification === RESULT_CLASSIFICATION.UNKNOWN
  ).length;

  const summary = {
    total: analyzedTests.length,
    normalCount,
    highCount,
    lowCount,
    criticalCount,
    pendingVerificationCount,
    unableToDetermineCount,
    withinRange: normalCount,
    belowRange: lowCount + analyzedTests.filter((t) => t.isCritical && t.criticalDirection === 'low').length,
    aboveRange: highCount + analyzedTests.filter((t) => t.isCritical && t.criticalDirection === 'high').length,
    unableToDetermine: unableToDetermineCount,
    requiringVerification: pendingVerificationCount + unableToDetermineCount,
    hasMarkedlyOut: analyzedTests.some((t) => t.isMarkedlyOut || t.isCritical),
  };

  summary.outsideRange = summary.belowRange + summary.aboveRange;

  const insights = buildReportInsights(analyzedTests, summary);

  return {
    analyzedTests,
    summary,
    insights,
  };
}
