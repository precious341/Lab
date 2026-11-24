import { jsPDF } from 'jspdf';
import { formatDateTime } from '../utils/formatters.js';
import { logActivity } from './storageService.js';

/**
 * Exports an analyzed LabBridge report as a clean, multi-page educational PDF summary.
 */
export function exportReportToPdf(report) {
  if (!report) {
    throw new Error('No report provided for PDF export.');
  }

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const maxWidth = pageWidth - margin * 2;
  let y = 48;

  const ensureSpace = (needed = 60) => {
    if (y + needed > pageHeight - 54) {
      doc.addPage();
      y = 48;
    }
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(29, 78, 216);
  doc.text('LabBridge', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Educational Laboratory Report Summary', margin + 96, y);

  y += 22;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Report title & metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(report.title || 'Laboratory Report Summary', margin, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const metaLine = `Analyzed: ${formatDateTime(report.createdAt)}  |  Source: ${
    report.sourceLabel || 'Uploaded Report'
  }  |  Tests Reviewed: ${report.summary?.total || 0}`;
  doc.text(metaLine, margin, y);
  y += 20;

  // Summary breakdown box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, maxWidth, 42, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  const sum = report.summary || {};
  const normVal = sum.normalCount ?? sum.withinRange ?? 0;
  const lowVal = sum.lowCount ?? sum.belowRange ?? 0;
  const highVal = sum.highCount ?? sum.aboveRange ?? 0;
  const pendVal = sum.pendingVerificationCount ?? 0;
  const critVal = sum.criticalCount ?? 0;
  doc.text(
    `Normal: ${normVal}   |   High: ${highVal}   |   Low: ${lowVal}${
      critVal > 0 ? `   |   Critical: ${critVal}` : ''
    }   |   Pending: ${pendVal}   |   Undetermined: ${sum.unableToDetermine || 0}`,
    margin + 14,
    y + 25
  );
  y += 58;

  // Disclaimer banner
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(253, 230, 138);
  const disclaimerText =
    'Educational Notice: LabBridge explains laboratory terminology and compares your verified values against the reference intervals printed on your report. It does not diagnose medical conditions, prescribe treatment, or replace a qualified healthcare professional. Reference ranges vary by laboratory, age, sex, and clinical context.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, maxWidth - 24);
  const boxHeight = disclaimerLines.length * 12 + 18;
  doc.roundedRect(margin, y, maxWidth, boxHeight, 4, 4, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text(disclaimerLines, margin + 12, y + 16);
  y += boxHeight + 22;

  // Section heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Test Results & Plain-Language Explanations', margin, y);
  y += 16;

  // Test items
  const tests = report.analyzedTests || [];
  tests.forEach((test, index) => {
    const whatLines = doc.splitTextToSize(
      `What is this test: ${test.explanation?.whatItMeasures || ''}`,
      maxWidth - 16
    );
    const meaningLines = doc.splitTextToSize(
      `What your result means: ${test.explanation?.whatResultMeans || ''}`,
      maxWidth - 16
    );
    const whyLines = doc.splitTextToSize(
      `Why it matters: ${test.explanation?.whyItMatters || ''}`,
      maxWidth - 16
    );
    const takeawayLines = doc.splitTextToSize(
      `What to understand: ${test.explanation?.balancedTakeaway || ''}`,
      maxWidth - 16
    );
    const questionText =
      test.explanation?.doctorQuestions?.length > 0
        ? `Questions for your clinician: ${test.explanation.doctorQuestions.join(' | ')}`
        : '';
    const questionLines = questionText ? doc.splitTextToSize(questionText, maxWidth - 16) : [];

    const totalTextLines =
      whatLines.length +
      meaningLines.length +
      whyLines.length +
      takeawayLines.length +
      questionLines.length;
    const estimatedBlockHeight = 56 + totalTextLines * 11.5;

    ensureSpace(estimatedBlockHeight);

    // Top line of test row
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    const displayTitle = test.fullTestName || test.testName;
    const abbrSuffix =
      test.abbreviation && test.abbreviation.toLowerCase() !== displayTitle.toLowerCase()
        ? ` (${test.abbreviation})`
        : '';
    doc.text(`${index + 1}. ${displayTitle}${abbrSuffix}`, margin, y);

    // Status label on right
    const badgeLabel = test.classification || test.status;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    if (badgeLabel === 'Normal' || badgeLabel === 'Within reference range') {
      doc.setTextColor(21, 128, 61);
    } else if (badgeLabel === 'Critical') {
      doc.setTextColor(185, 28, 28);
    } else if (badgeLabel === 'Unable to determine' || badgeLabel === 'Pending Verification') {
      doc.setTextColor(71, 85, 105);
    } else {
      doc.setTextColor(180, 83, 9);
    }
    doc.text(badgeLabel, pageWidth - margin, y, { align: 'right' });

    y += 15;
    doc.setFont('courier', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    const measuredStr = `Measured: ${test.rawValue || test.value} ${test.unit || ''}`.trim();
    const refStr = `Lab Reference Range: ${test.referenceRange || 'Not provided'}`;
    doc.text(`${measuredStr}    |    ${refStr}`, margin + 8, y);

    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(71, 85, 105);

    for (const block of [whatLines, meaningLines, whyLines, takeawayLines, questionLines]) {
      if (block.length > 0) {
        doc.text(block, margin + 8, y);
        y += block.length * 11.5 + 4;
      }
    }
    y += 8;
  });

  // Footer on last page
  ensureSpace(32);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Generated by LabBridge. Discuss any concerning or unexpected results with a qualified healthcare professional.',
    margin,
    y
  );

  const safeFileName = (report.title || 'labbridge-summary')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  doc.save(`${safeFileName || 'labbridge-summary'}.pdf`);
  logActivity(`Exported PDF summary for "${report.title}"`, 'export');
}

/**
 * Generates a real downloadable synthetic PDF File in memory so users/judges can test the
 * PDF.js upload & extraction pipeline directly without needing personal medical records.
 */
export function createSyntheticSamplePdfFile(sampleReport) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 48;
  let y = 54;

  doc.setFont('courier', 'bold');
  doc.setFontSize(12);
  doc.text(sampleReport.title.toUpperCase(), margin, y);
  y += 18;

  doc.setFont('courier', 'normal');
  doc.setFontSize(9.5);
  const lines = sampleReport.rawText.split('\n');
  for (const line of lines) {
    doc.text(line, margin, y);
    y += 16;
  }

  const blob = doc.output('blob');
  const fileName = `${sampleReport.id}.pdf`;
  return new File([blob], fileName, { type: 'application/pdf' });
}
