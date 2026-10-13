import { toChartDateKey, toYMD } from '@/pages/metrics/utils/metricsDateRange';

export type PeriodPresetId = '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'Max';

export interface PeriodPreset {
  id: PeriodPresetId;
  label: string;
  calc: (anchor: Date, dataStart: Date, dataEnd: Date) => { start: string; end: string };
}

const utcStart = (d: Date) => toYMD(d);
const addDaysUTC = (d: Date, n: number) => {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));
  return x;
};

export const PERIOD_PRESETS: PeriodPreset[] = [
  {
    id: '1M',
    label: '1M',
    calc: anchor => ({
      start: utcStart(addDaysUTC(anchor, -30)),
      end: utcStart(anchor),
    }),
  },
  {
    id: '3M',
    label: '3M',
    calc: anchor => ({
      start: utcStart(new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - 3, anchor.getUTCDate()))),
      end: utcStart(anchor),
    }),
  },
  {
    id: '6M',
    label: '6M',
    calc: anchor => ({
      start: utcStart(new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - 6, anchor.getUTCDate()))),
      end: utcStart(anchor),
    }),
  },
  {
    id: 'YTD',
    label: 'YTD',
    calc: anchor => ({
      start: utcStart(new Date(Date.UTC(anchor.getUTCFullYear(), 0, 1))),
      end: utcStart(anchor),
    }),
  },
  {
    id: '1Y',
    label: '1Y',
    calc: anchor => ({
      start: utcStart(new Date(Date.UTC(anchor.getUTCFullYear() - 1, anchor.getUTCMonth(), anchor.getUTCDate()))),
      end: utcStart(anchor),
    }),
  },
  {
    id: 'Max',
    label: 'Max',
    calc: (_anchor, dataStart, dataEnd) => ({
      start: utcStart(dataStart),
      end: utcStart(dataEnd),
    }),
  },
];

export function getActivePresetId(
  dateStart: string | null,
  dateEnd: string | null,
  anchor: Date,
  dataStart: Date,
  dataEnd: Date
): PeriodPresetId | '' {
  if (!dateStart || !dateEnd) return '';
  const s0 = dateStart;
  const e0 = dateEnd;
  for (const p of PERIOD_PRESETS) {
    const { start, end } = p.calc(anchor, dataStart, dataEnd);
    if (s0 === start && e0 === end) return p.id;
  }
  return '';
}

export function isPresetCovered(
  preset: PeriodPreset,
  anchor: Date,
  dataStart: Date,
  dataEnd: Date
): boolean {
  if (preset.id === 'Max') return true;
  const { start, end } = preset.calc(anchor, dataStart, dataEnd);
  const startKey = toChartDateKey(start);
  const endKey = toChartDateKey(end);
  const minKey = toChartDateKey(dataStart);
  const maxKey = toChartDateKey(dataEnd);
  return startKey >= minKey && endKey <= maxKey;
}

export function getPeriodBoundsFromGrowth(dailyGrowth: { date: string }[] | undefined) {
  if (!dailyGrowth?.length) {
    return {
      minDate: null as Date | null,
      maxDate: null as Date | null,
      availableYears: [] as number[],
      availableMonthsByYear: new Map<number, Set<number>>(),
    };
  }

  let minT = Number.POSITIVE_INFINITY;
  let maxT = Number.NEGATIVE_INFINITY;
  const yearsSet = new Set<number>();
  const monthsByYear = new Map<number, Set<number>>();

  for (const r of dailyGrowth) {
    const key = toChartDateKey(r.date);
    if (!key) continue;
    const t = +new Date(`${key}T12:00:00Z`);
    const year = new Date(t).getUTCFullYear();
    const month = new Date(t).getUTCMonth();

    if (t < minT) minT = t;
    if (t > maxT) maxT = t;
    yearsSet.add(year);
    if (!monthsByYear.has(year)) monthsByYear.set(year, new Set());
    monthsByYear.get(year)!.add(month);
  }

  return {
    minDate: Number.isFinite(minT) ? new Date(minT) : null,
    maxDate: Number.isFinite(maxT) ? new Date(maxT) : null,
    availableYears: Array.from(yearsSet).sort((a, b) => b - a),
    availableMonthsByYear: monthsByYear,
  };
}
