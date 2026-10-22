export type EventSeverity = 'info' | 'warning' | 'critical';

export interface EventLogItem {
  id: number;
  title: string;
  detail: string;
  severity: EventSeverity;
  time: string;
}

export interface LiveDashboardData {
  totalCases: number;
  topStateCount: number;
  dominantPercent: number;
  lastUpdated: string;
  pulse: number;
  events: EventLogItem[];
}

export interface LiveCrimeRecord {
  state: string;
  category: string;
  cases: number;
  year: number;
  zone?: string;
}

export interface DatasetSummary {
  label: string;
  year: number;
  totalCases: number;
  uniqueStates: number;
  categories: Array<{ key: string; label: string; total: number }>;
  topState: string;
  source: string;
}

const eventTemplates = [
  {
    title: 'Field intake synchronized',
    detail: 'State-level reporting feed refreshed from the latest incident batch.',
    severity: 'info' as const,
  },
  {
    title: 'Hotspot cluster recalculated',
    detail: 'Spatial risk model updated for the latest convergence window.',
    severity: 'warning' as const,
  },
  {
    title: 'High-risk jurisdiction flagged',
    detail: 'Lagos and Kaduna remain above the internal review threshold.',
    severity: 'critical' as const,
  },
  {
    title: 'Predictive score refreshed',
    detail: 'Model confidence updated after a new validation pass.',
    severity: 'info' as const,
  },
  {
    title: 'Distribution anomaly reviewed',
    detail: 'Property offence mix adjusted to reflect source corrections.',
    severity: 'warning' as const,
  },
];

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function firstDefinedValue(record: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function normalizeCategory(value: string): string {
  const normalized = value.toLowerCase().replace(/[_-]+/g, ' ').trim();

  if (normalized.includes('property')) return 'property';
  if (normalized.includes('person')) return 'persons';
  if (normalized.includes('authority') || normalized.includes('lawful authority') || normalized.includes('lawful_authority')) {
    return 'authority';
  }
  if (normalized.includes('persons')) return 'persons';

  return normalized || 'property';
}

function cleanStateName(value: string): string {
  return value
    .replace(/\s+state$/i, '')
    .replace(/\s+st\.?$/i, '')
    .trim();
}

export function parseCrimeCsv(csvText: string): LiveCrimeRecord[] {
  const trimmed = csvText.trim();
  if (!trimmed) return [];

  const rows = trimmed
    .split(/\r?\n/)
    .map((line) => parseCsvLine(line))
    .filter((row) => row.some((cell) => cell && cell.trim() !== ''));

  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => normalizeHeader(header));
  const records: LiveCrimeRecord[] = [];

  rows.slice(1).forEach((cells) => {
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? '';
    });

    const stateValue = firstDefinedValue(row, ['state', 'state_name', 'state_name_1', 'location', 'jurisdiction']);
    const categoryValue = firstDefinedValue(row, ['category', 'crime_category', 'offence_category', 'crime_type', 'offence_type', 'classification']);
    const casesValue = firstDefinedValue(row, ['cases', 'reported_cases', 'case_count', 'total_cases', 'count', 'reportedcase']);
    const yearValue = firstDefinedValue(row, ['year', 'reporting_year', 'year_reported']);
    const zoneValue = firstDefinedValue(row, ['zone', 'geopolitical_zone', 'region']);

    if (!stateValue || !categoryValue || !casesValue) {
      return;
    }

    const parsedCases = Number(String(casesValue).replace(/[,\s]/g, ''));
    const parsedYear = Number(yearValue || new Date().getFullYear());

    if (!Number.isFinite(parsedCases) || parsedCases <= 0) {
      return;
    }

    records.push({
      state: cleanStateName(stateValue),
      category: normalizeCategory(categoryValue),
      cases: parsedCases,
      year: Number.isFinite(parsedYear) ? parsedYear : new Date().getFullYear(),
      zone: zoneValue || undefined,
    });
  });

  return records.filter((record) => record.state && record.category);
}

export function summarizeDataset(records: LiveCrimeRecord[], fallbackLabel = 'NBS 2017'): DatasetSummary {
  const categoryTotals = new Map<string, number>();
  const stateTotals = new Map<string, number>();

  records.forEach((record) => {
    const key = normalizeCategory(record.category);
    const stateName = cleanStateName(record.state || 'Unknown');
    if (stateName) {
      stateTotals.set(stateName, (stateTotals.get(stateName) ?? 0) + record.cases);
    }
    categoryTotals.set(key, (categoryTotals.get(key) ?? 0) + record.cases);
  });

  const totalCases = Array.from(stateTotals.values()).reduce((sum, value) => sum + value, 0) || records.reduce((sum, record) => sum + record.cases, 0);
  const topState = [...stateTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Unknown';
  const categories = [...categoryTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key, total]) => ({
      key,
      label:
        key === 'property'
          ? 'Offences Against Property'
          : key === 'persons'
            ? 'Offences Against Persons'
            : key === 'authority'
              ? 'Offences Against Lawful Authority'
              : key,
      total,
    }));

  const source = records.length ? 'Uploaded Dataset' : 'National Bureau of Statistics (NBS) Nigeria';

  return {
    label: fallbackLabel,
    year: Math.max(...records.map((record) => record.year), 2017),
    totalCases,
    uniqueStates: stateTotals.size,
    categories,
    topState,
    source,
  };
}

export function buildLiveDashboardDataFromRecords(records: LiveCrimeRecord[], step: number): LiveDashboardData {
  if (!records.length) {
    return buildLiveDashboardData(step);
  }

  const stateTotals = new Map<string, number>();
  const categoryTotals = { property: 0, persons: 0, authority: 0 };

  records.forEach((record) => {
    const stateName = record.state;
    const categoryKey = normalizeCategory(record.category) as keyof typeof categoryTotals;
    const nextValue = (stateTotals.get(stateName) ?? 0) + record.cases;
    stateTotals.set(stateName, nextValue);

    if (categoryTotals[categoryKey] !== undefined) {
      categoryTotals[categoryKey] += record.cases;
    }
  });

  const totalCases = Array.from(stateTotals.values()).reduce((sum, value) => sum + value, 0);
  const topStateCount = Math.max(...stateTotals.values(), 0);
  const dominantCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const dominantPercent = totalCases > 0 ? Number(((dominantCategory ? dominantCategory[1] : 0) / totalCases) * 100) : 0;
  const topState = [...stateTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Lagos';

  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const events = Array.from({ length: 4 }, (_, index) => {
    const template = eventTemplates[(step + index) % eventTemplates.length];
    const timestamp = new Date(Date.now() - (3 - index) * 60 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return {
      id: step * 100 + index,
      time: timestamp,
      title: index === 0 ? `${topState} intake synchronized` : template.title,
      detail:
        index === 0
          ? `${topState} is leading the current live feed with ${topStateCount.toLocaleString()} recorded cases.`
          : template.detail,
      severity: index === 0 ? 'info' as const : template.severity,
    };
  });

  return {
    totalCases,
    topStateCount,
    dominantPercent: Number(dominantPercent.toFixed(1)),
    lastUpdated,
    pulse: step,
    events,
  };
}

export function buildLiveDashboardData(step: number): LiveDashboardData {
  const totalCases = 134663 + ((step * 27) % 420);
  const topStateCount = 24190 + ((step * 17) % 150);
  const dominantPercent = Number((50.9 + ((step * 0.6) % 2.4)).toFixed(1));
  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const events = Array.from({ length: 4 }, (_, index) => {
    const template = eventTemplates[(step + index) % eventTemplates.length];
    const timestamp = new Date(Date.now() - (3 - index) * 60 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return {
      id: step * 100 + index,
      time: timestamp,
      title: template.title,
      detail: template.detail,
      severity: template.severity,
    };
  });

  return {
    totalCases,
    topStateCount,
    dominantPercent,
    lastUpdated,
    pulse: step,
    events,
  };
}
