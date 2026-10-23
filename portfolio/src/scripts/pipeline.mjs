const cleanSample = [
  { eventId: 'EVT-001', category: 'vibration', timestamp: '2026-10-22 09:00', reading: 18.4 },
  { eventId: 'EVT-002', category: 'temperature', timestamp: '2026-10-22 09:05', reading: 21.2 },
  { eventId: 'EVT-003', category: 'pressure', timestamp: '2026-10-22 09:10', reading: 7.8 },
  { eventId: 'EVT-004', category: 'vibration', timestamp: '2026-10-22 09:15', reading: 19.1 },
];

const needsAttentionSample = [
  ...cleanSample.slice(0, 2),
  { eventId: 'EVT-003', category: 'pressure', timestamp: '2026-10-22 09:10', reading: 7.8 },
  { eventId: 'EVT-003', category: 'pressure', timestamp: '2026-10-22 09:11', reading: 8.1 },
  { eventId: 'EVT-004', category: '', timestamp: '2026-10-22 09:15', reading: 19.1 },
  { eventId: 'EVT-005', category: 'temperature', timestamp: '2026-10-22 09:20', reading: 'not-a-number' },
];

/**
 * Evaluate a fixed synthetic sample with the selected validation rules.
 * @param {'clean' | 'issues'} sample
 * @param {{missing: boolean; duplicate: boolean; invalid: boolean}} rules
 */
export function evaluatePipeline(sample, rules) {
  const sourceRows = (sample === 'clean' ? cleanSample : needsAttentionSample).map((row) => ({ ...row }));
  const seenIds = new Set();
  const flags = { missing: 0, duplicate: 0, invalid: 0 };
  const accepted = [];

  for (const row of sourceRows) {
    const duplicate = seenIds.has(row.eventId);
    seenIds.add(row.eventId);

    const issues = {
      missing: row.category.trim() === '',
      duplicate,
      invalid: typeof row.reading !== 'number' || !Number.isFinite(row.reading),
    };

    for (const [rule, failed] of Object.entries(issues)) {
      if (failed) flags[rule] += 1;
    }

    if (
      (rules.missing && issues.missing) ||
      (rules.duplicate && issues.duplicate) ||
      (rules.invalid && issues.invalid)
    ) {
      continue;
    }

    accepted.push({
      ...row,
      normalizedCategory: row.category.trim() ? row.category.trim().toUpperCase() : 'UNKNOWN',
      numericReading: typeof row.reading === 'number' && Number.isFinite(row.reading) ? row.reading : null,
      partition: row.timestamp.slice(0, 7),
    });
  }

  return {
    sourceRows,
    acceptedRows: accepted,
    flags,
    rejectedCount: sourceRows.length - accepted.length,
  };
}
