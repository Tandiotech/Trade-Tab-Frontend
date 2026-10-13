/** Shared x-axis label format for area chart + deposit/withdrawal markers (UTC-aligned) */
export function formatChartLabel(date: string | Date): string {
  const iso = toChartDateKey(date);
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Calendar day key YYYY-MM-DD (UTC), matches densifyWithCarryForward */
export function toChartDateKey(date: string | Date): string {
  if (typeof date === 'string') {
    const m = date.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
  }
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatChartNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return numberFormatter.format(value);
}

export function formatChartPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return `${percentFormatter.format(value)}%`;
}

/** totalGains in API is a running sum of daily return ratios (e.g. 0.42 = 42%) */
export function formatCumulativeGainRatio(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  const asPercent = Math.abs(value) <= 5 ? value * 100 : value;
  return formatChartPercent(asPercent);
}
