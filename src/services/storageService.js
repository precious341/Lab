/**
 * Browser storage service for structured report summaries, user settings, and activity log.
 * Explicitly does NOT permanently store original uploaded PDF or image files by default.
 */

const KEYS = {
  REPORTS: 'labbridge_reports_v1',
  SETTINGS: 'labbridge_settings_v1',
  ACTIVITY: 'labbridge_activity_v1',
};

const DEFAULT_SETTINGS = {
  displayName: '',
  preferredUnitsNote: 'Preserve laboratory report units',
  explanationDepth: 'standard',
  storeSummariesLocally: true,
  autoFlagUncertainOcr: true,
};

function safeRead(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getSettings() {
  const saved = safeRead(KEYS.SETTINGS, {});
  return { ...DEFAULT_SETTINGS, ...saved };
}

export function saveSettings(nextSettings) {
  const merged = { ...getSettings(), ...nextSettings };
  safeWrite(KEYS.SETTINGS, merged);
  logActivity('Updated application preferences', 'settings');
  return merged;
}

export function getReports() {
  const list = safeRead(KEYS.REPORTS, []);
  return Array.isArray(list) ? list : [];
}

export function getReportById(id) {
  const list = getReports();
  return list.find((r) => r.id === id) || null;
}

export function saveAnalyzedReport(reportRecord, { skipLog = false } = {}) {
  const settings = getSettings();
  const list = getReports();
  const nextList = [reportRecord, ...list.filter((r) => r.id !== reportRecord.id)];

  if (settings.storeSummariesLocally) {
    safeWrite(KEYS.REPORTS, nextList);
  }

  if (!skipLog) {
    logActivity(
      `Analyzed "${reportRecord.title}" (${reportRecord.summary.total} tests)`,
      'analysis'
    );
  }

  return reportRecord;
}

export function deleteReportById(id) {
  const list = getReports();
  const target = list.find((r) => r.id === id);
  const nextList = list.filter((r) => r.id !== id);
  safeWrite(KEYS.REPORTS, nextList);

  if (target) {
    logActivity(`Deleted report "${target.title}"`, 'delete');
  }
  return nextList;
}

export function getActivityLog() {
  const log = safeRead(KEYS.ACTIVITY, []);
  return Array.isArray(log) ? log : [];
}

export function logActivity(message, category = 'info') {
  const current = getActivityLog();
  const entry = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    message,
    category,
    timestamp: new Date().toISOString(),
  };
  const trimmed = [entry, ...current].slice(0, 25);
  safeWrite(KEYS.ACTIVITY, trimmed);
  return trimmed;
}

export function clearAllLabBridgeData() {
  try {
    window.localStorage.removeItem(KEYS.REPORTS);
    window.localStorage.removeItem(KEYS.ACTIVITY);
    window.localStorage.removeItem(KEYS.SETTINGS);
  } catch {
    // Ignore storage errors
  }
}

export function computeDashboardStats(reports) {
  const list = Array.isArray(reports) ? reports : getReports();
  return list.reduce(
    (acc, report) => {
      const s = report?.summary || {};
      const normal = s.normalCount ?? s.withinRange ?? 0;
      const high = s.highCount ?? s.aboveRange ?? 0;
      const low = s.lowCount ?? s.belowRange ?? 0;
      const critical = s.criticalCount ?? 0;
      const pending = s.pendingVerificationCount ?? 0;
      const unable = s.unableToDetermineCount ?? s.unableToDetermine ?? 0;

      acc.totalReports += 1;
      acc.totalTests += s.total || 0;
      acc.normalCount += normal;
      acc.highCount += high;
      acc.lowCount += low;
      acc.criticalCount += critical;
      acc.pendingVerificationCount += pending;
      acc.withinRange += normal;
      acc.outsideRange += s.outsideRange ?? high + low + critical;
      acc.unableToDetermine += unable;
      acc.requiringVerification += s.requiringVerification ?? pending + unable;
      return acc;
    },
    {
      totalReports: 0,
      totalTests: 0,
      normalCount: 0,
      highCount: 0,
      lowCount: 0,
      criticalCount: 0,
      pendingVerificationCount: 0,
      withinRange: 0,
      outsideRange: 0,
      unableToDetermine: 0,
      requiringVerification: 0,
    }
  );
}
