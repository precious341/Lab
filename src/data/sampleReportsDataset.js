/**
 * Synthetic benchmark dataset with manually verified ground-truth values.
 * Used exclusively for system extraction/comparison evaluation and optional demo testing.
 * Never presented as real patient records.
 */

export const SAMPLE_BENCHMARK_REPORTS = [
  {
    id: 'bench-cbc-01',
    title: 'Synthetic Complete Blood Count (Standard Tabular)',
    formatType: 'Structured Text PDF Format',
    description:
      'Clean tabular hematology report featuring standard hyphenated ranges and mixed high/normal markers.',
    rawText: `METRO DIAGNOSTICS LABORATORY
Report Type: Complete Blood Count (CBC) - Synthetic Test Fixture
Test Name                 Result      Units       Reference Range
Hemoglobin                11.4        g/dL        12.0 - 15.5
Hematocrit                35.2        %           36.0 - 46.0
WBC                       7.8         10^3/uL     4.5 - 11.0
RBC                       4.15        10^6/uL     4.00 - 5.20
Platelet Count            248         10^3/uL     150 - 400
MCV                       84.8        fL          80.0 - 100.0`,
    groundTruthTests: [
      {
        testName: 'Hemoglobin',
        value: 11.4,
        unit: 'g/dL',
        referenceRange: '12.0 - 15.5',
        expectedStatus: 'Below reference range',
      },
      {
        testName: 'Hematocrit',
        value: 35.2,
        unit: '%',
        referenceRange: '36.0 - 46.0',
        expectedStatus: 'Below reference range',
      },
      {
        testName: 'WBC',
        value: 7.8,
        unit: '10^3/uL',
        referenceRange: '4.5 - 11.0',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'RBC',
        value: 4.15,
        unit: '10^6/uL',
        referenceRange: '4.00 - 5.20',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'Platelet Count',
        value: 248,
        unit: '10^3/uL',
        referenceRange: '150 - 400',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'MCV',
        value: 84.8,
        unit: 'fL',
        referenceRange: '80.0 - 100.0',
        expectedStatus: 'Within reference range',
      },
    ],
  },
  {
    id: 'bench-cmp-02',
    title: 'Synthetic Metabolic & Liver Panel (With H/L Flags)',
    formatType: 'Flagged Clinical Printout',
    description:
      'Comprehensive metabolic panel containing H/L abnormality flags and varied laboratory spacing.',
    rawText: `NORTHVIEW HEALTH LABS - SYNTHETIC BENCHMARK SAMPLE
Test                      Result  Flag   Unit       Reference Interval
Glucose                   114     H      mg/dL      70 - 99
Sodium                    140            mmol/L     136 - 145
Potassium                 4.3            mmol/L     3.5 - 5.1
Creatinine                0.92           mg/dL      0.60 - 1.20
BUN                       16             mg/dL      7 - 20
ALT (SGPT)                54      H      U/L        7 - 45
AST (SGOT)                31             U/L        10 - 40
Total Bilirubin           0.8            mg/dL      0.2 - 1.2`,
    groundTruthTests: [
      {
        testName: 'Glucose',
        value: 114,
        unit: 'mg/dL',
        referenceRange: '70 - 99',
        expectedStatus: 'Above reference range',
      },
      {
        testName: 'Sodium',
        value: 140,
        unit: 'mmol/L',
        referenceRange: '136 - 145',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'Potassium',
        value: 4.3,
        unit: 'mmol/L',
        referenceRange: '3.5 - 5.1',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'Creatinine',
        value: 0.92,
        unit: 'mg/dL',
        referenceRange: '0.60 - 1.20',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'BUN',
        value: 16,
        unit: 'mg/dL',
        referenceRange: '7 - 20',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'ALT (SGPT)',
        value: 54,
        unit: 'U/L',
        referenceRange: '7 - 45',
        expectedStatus: 'Above reference range',
      },
      {
        testName: 'AST (SGOT)',
        value: 31,
        unit: 'U/L',
        referenceRange: '10 - 40',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'Total Bilirubin',
        value: 0.8,
        unit: 'mg/dL',
        referenceRange: '0.2 - 1.2',
        expectedStatus: 'Within reference range',
      },
    ],
  },
  {
    id: 'bench-lipid-03',
    title: 'Synthetic Lipid & Thyroid Panel (Inequality Ranges)',
    formatType: 'Threshold Interval Format',
    description:
      'Tests upper/lower bound threshold parsing (< 100, > 40) alongside decimal endocrine values.',
    rawText: `CLEARWATER CLINICAL REFERENCE - SYNTHETIC TEST
LIPID & THYROID PANEL
Total Cholesterol     214       mg/dL      < 200
LDL Cholesterol       138       mg/dL      < 100
HDL Cholesterol       52        mg/dL      > 40
Triglycerides         120       mg/dL      < 150
TSH                   2.15      mIU/L      0.40 - 4.50
HbA1c                 5.9       %          4.0 - 5.6`,
    groundTruthTests: [
      {
        testName: 'Total Cholesterol',
        value: 214,
        unit: 'mg/dL',
        referenceRange: '< 200',
        expectedStatus: 'Above reference range',
      },
      {
        testName: 'LDL Cholesterol',
        value: 138,
        unit: 'mg/dL',
        referenceRange: '< 100',
        expectedStatus: 'Above reference range',
      },
      {
        testName: 'HDL Cholesterol',
        value: 52,
        unit: 'mg/dL',
        referenceRange: '> 40',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'Triglycerides',
        value: 120,
        unit: 'mg/dL',
        referenceRange: '< 150',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'TSH',
        value: 2.15,
        unit: 'mIU/L',
        referenceRange: '0.40 - 4.50',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'HbA1c',
        value: 5.9,
        unit: '%',
        referenceRange: '4.0 - 5.6',
        expectedStatus: 'Above reference range',
      },
    ],
  },
  {
    id: 'bench-ocr-04',
    title: 'Synthetic Noisy OCR Scan Simulation',
    formatType: 'Scanned Image OCR Text',
    description:
      'Simulates realistic OCR spacing, pipe artifacts, missing units, and colon-delimited ranges.',
    rawText: `CITY MEDICAL CENTER | OUTPATIENT LABS (SYNTHETIC OCR TEST)
Vitamin D, 25-Hydroxy : 22.5 ng/mL (Ref: 30.0 - 100.0)
Vitamin B12 | 410 | pg/mL | 200 to 900
Ferritin  18  ng/mL  15 - 150
CRP       6.4 mg/L   < 5.0
Calcium   9.4 mg/dL  8.6 - 10.2`,
    groundTruthTests: [
      {
        testName: 'Vitamin D, 25-Hydroxy',
        value: 22.5,
        unit: 'ng/mL',
        referenceRange: '30.0 - 100.0',
        expectedStatus: 'Below reference range',
      },
      {
        testName: 'Vitamin B12',
        value: 410,
        unit: 'pg/mL',
        referenceRange: '200 to 900',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'Ferritin',
        value: 18,
        unit: 'ng/mL',
        referenceRange: '15 - 150',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'CRP',
        value: 6.4,
        unit: 'mg/L',
        referenceRange: '< 5.0',
        expectedStatus: 'Above reference range',
      },
      {
        testName: 'Calcium',
        value: 9.4,
        unit: 'mg/dL',
        referenceRange: '8.6 - 10.2',
        expectedStatus: 'Within reference range',
      },
    ],
  },
  {
    id: 'bench-missing-05',
    title: 'Synthetic Incomplete Range & International Units',
    formatType: 'Edge Case & Safety Handling',
    description:
      'Verifies LabBridge never invents missing reference intervals and handles mmol/L units cleanly.',
    rawText: `REGIONAL LAB NETWORK - SYNTHETIC EDGE CASE SAMPLE
Glucose             5.2     mmol/L    3.9 - 5.5
Total Cholesterol   5.6     mmol/L    < 5.2
Free T4             15.2    pmol/L
Uric Acid           6.1     mg/dL     3.5 - 7.2`,
    groundTruthTests: [
      {
        testName: 'Glucose',
        value: 5.2,
        unit: 'mmol/L',
        referenceRange: '3.9 - 5.5',
        expectedStatus: 'Within reference range',
      },
      {
        testName: 'Total Cholesterol',
        value: 5.6,
        unit: 'mmol/L',
        referenceRange: '< 5.2',
        expectedStatus: 'Above reference range',
      },
      {
        testName: 'Free T4',
        value: 15.2,
        unit: 'pmol/L',
        referenceRange: '',
        expectedStatus: 'Unable to determine',
      },
      {
        testName: 'Uric Acid',
        value: 6.1,
        unit: 'mg/dL',
        referenceRange: '3.5 - 7.2',
        expectedStatus: 'Within reference range',
      },
    ],
  },
];
