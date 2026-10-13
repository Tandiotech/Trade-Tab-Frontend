/** UTC-aligned date helpers for Metrics period filtering */

const ISO_DAY = /^\d{4}-\d{2}-\d{2}/;

export function parseYMD(s: string): Date {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return new Date(NaN);
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0));
}

export function toYMD(d: Date): string {
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

export function toChartDateKey(date: string | Date): string {
  if (typeof date === 'string') {
    const m = date.match(ISO_DAY);
    if (m) return m[0];
  }
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return toYMD(d);
}

export function toUTCStart(ymd: string): string {
  return ymd;
}

export function toUTCEnd(ymd: string): string {
  return ymd;
}

export function formatPeriodLabel(start: string | null, end: string | null): string {
  if (!start || !end) return 'Select period';
  const s = parseYMD(start);
  const e = parseYMD(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 'Select period';

  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  const sLabel = s.toLocaleDateString('en-US', opts);
  const eLabel = e.toLocaleDateString('en-US', {
    ...opts,
    year: s.getUTCFullYear() !== e.getUTCFullYear() ? 'numeric' : undefined,
  });
  const yearSuffix =
    s.getUTCFullYear() === e.getUTCFullYear()
      ? `, ${e.getUTCFullYear()}`
      : `, ${s.getUTCFullYear()} – ${e.getUTCFullYear()}`;

  if (start === end) {
    return `${sLabel}, ${s.getUTCFullYear()}`;
  }
  return `${sLabel} – ${eLabel}${yearSuffix}`;
}

export function isInRange(dayKey: string, start: string, end: string): boolean {
  return dayKey >= start && dayKey <= end;
}

export function monthRangeYMD(year: number, monthIndex: number): { start: string; end: string } {
  const start = toYMD(new Date(Date.UTC(year, monthIndex, 1)));
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const end = toYMD(new Date(Date.UTC(year, monthIndex, lastDay)));
  return { start, end };
}
