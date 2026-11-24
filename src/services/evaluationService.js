import { findTestDefinition } from '../data/testDefinitions.js';
import { SAMPLE_BENCHMARK_REPORTS } from '../data/sampleReportsDataset.js';
import { analyzeSingleTest } from './analysisService.js';
import { parseLaboratoryText } from './labParser.js';
import { normalizeUnitToken } from '../utils/validators.js';

function normalizeNameForEval(name) {
  const def = findTestDefinition(name);
  if (def) return def.definition.id;
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeRangeForEval(rangeStr) {
  return (rangeStr || '')
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Runs the real LabBridge parser and analyzer against the manually verified ground-truth dataset
 * and computes actual measured extraction & classification accuracy metrics.
 */
export function runLiveBenchmarkEvaluation(dataset = SAMPLE_BENCHMARK_REPORTS) {
  let totalGroundTruthTests = 0;
  let testNameMatches = 0;
  let numericExactMatches = 0;
  let unitExactMatches = 0;
  let rangeExactMatches = 0;
  let statusComparisonMatches = 0;

  const caseResults = dataset.map((sample) => {
    const extracted = parseLaboratoryText(sample.rawText, []);
    const rowComparisons = sample.groundTruthTests.map((gt) => {
      totalGroundTruthTests += 1;
      const gtKey = normalizeNameForEval(gt.testName);

      // Find best matching extracted row by canonical test ID or name
      const matched = extracted.find((ex) => {
        const exKey = ex.matchedDefinitionId || normalizeNameForEval(ex.testName);
        return exKey === gtKey;
      });

      const nameOk = Boolean(matched);
      const valueOk = Boolean(matched && matched.value === gt.value);
      const unitOk = Boolean(
        matched && normalizeUnitToken(matched.unit) === normalizeUnitToken(gt.unit)
      );
      const rangeOk = Boolean(
        matched &&
          normalizeRangeForEval(matched.referenceRange) ===
            normalizeRangeForEval(gt.referenceRange)
      );

      let predictedStatus = 'Not extracted';
      let statusOk = false;
      if (matched) {
        const analyzed = analyzeSingleTest(matched);
        predictedStatus = analyzed.status;
        statusOk = predictedStatus === gt.expectedStatus;
      }

      if (nameOk) testNameMatches += 1;
      if (valueOk) numericExactMatches += 1;
      if (unitOk) unitExactMatches += 1;
      if (rangeOk) rangeExactMatches += 1;
      if (statusOk) statusComparisonMatches += 1;

      return {
        groundTruth: gt,
        extracted: matched || null,
        predictedStatus,
        checks: {
          nameOk,
          valueOk,
          unitOk,
          rangeOk,
          statusOk,
        },
      };
    });

    const caseTotal = sample.groundTruthTests.length;
    const casePassed = rowComparisons.filter(
      (r) =>
        r.checks.nameOk &&
        r.checks.valueOk &&
        r.checks.unitOk &&
        r.checks.rangeOk &&
        r.checks.statusOk
    ).length;

    return {
      id: sample.id,
      title: sample.title,
      formatType: sample.formatType,
      description: sample.description,
      totalTests: caseTotal,
      extractedCount: extracted.length,
      fullyMatchedCount: casePassed,
      rowComparisons,
    };
  });

  const pct = (n, d) => (d > 0 ? Number(((n / d) * 100).toFixed(1)) : 0);

  return {
    evaluatedAt: new Date().toISOString(),
    datasetCount: dataset.length,
    totalGroundTruthTests,
    metrics: {
      testNameAccuracy: {
        matched: testNameMatches,
        total: totalGroundTruthTests,
        percent: pct(testNameMatches, totalGroundTruthTests),
      },
      numericValueAccuracy: {
        matched: numericExactMatches,
        total: totalGroundTruthTests,
        percent: pct(numericExactMatches, totalGroundTruthTests),
      },
      unitExtractionAccuracy: {
        matched: unitExactMatches,
        total: totalGroundTruthTests,
        percent: pct(unitExactMatches, totalGroundTruthTests),
      },
      referenceRangeAccuracy: {
        matched: rangeExactMatches,
        total: totalGroundTruthTests,
        percent: pct(rangeExactMatches, totalGroundTruthTests),
      },
      comparisonClassificationAccuracy: {
        matched: statusComparisonMatches,
        total: totalGroundTruthTests,
        percent: pct(statusComparisonMatches, totalGroundTruthTests),
      },
    },
    caseResults,
  };
}
