import { useMemo } from 'react';

export type Granularity = 'minute' | 'hour' | 'day' | 'week' | 'month';

export interface SeriesPoint {
  date: string | number | Date; // ISO o timestamp
  value: number;
}

const toDayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const startOfWeek = (d: Date) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};
const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export function pickGranularity(start: Date, end: Date): Granularity {
  const ms = end.getTime() - start.getTime();
  const days = ms / (1000 * 60 * 60 * 24);
  if (days <= 1.2) return 'minute'; // 1D ~ intradía
  if (days <= 7) return 'hour'; // 5D/7D
  if (days <= 180) return 'day'; // 1M–6M
  if (days <= 540) return 'week'; // ~1.5Y
  return 'month'; // > 1.5Y
}

/** simple agregación: suma por bucket (puedes cambiar por promedio/último) */
export function resample(points: SeriesPoint[], granularity: Granularity): SeriesPoint[] {
  const buckets = new Map<string, number>();
  for (const p of points) {
    const d = new Date(p.date);
    let key: string;
    switch (granularity) {
      case 'minute':
        key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
        break;
      case 'hour':
        key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`;
        break;
      case 'day':
        key = toDayKey(d);
        break;
      case 'week':
        key = toDayKey(startOfWeek(d));
        break;
      case 'month':
        key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        break;
    }
    buckets.set(key, (buckets.get(key) ?? 0) + (p.value || 0));
  }
  // regresa clave convertida a fecha estimada
  return Array.from(buckets.entries())
    .map(([k, v]) => {
      let date: Date;
      if (granularity === 'month') {
        const [Y, M] = k.split('-').map(Number);
        date = new Date(Y, M - 1, 1);
      } else if (granularity === 'day' || granularity === 'week') {
        const [Y, M, D] = k.split('-').map(Number);
        date = new Date(Y, M - 1, D);
      } else {
        // minute/hour
        const [ymd, hm] = k.split(' ');
        const [Y, M, D] = ymd.split('-').map(Number);
        const [H, m] = hm.split(':').map(Number);
        date = new Date(Y, M - 1, D, H, m);
      }
      return { date: date.toISOString(), value: v };
    })
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export function useResampledSeries(
  raw: SeriesPoint[] | undefined,
  start: Date | null | undefined,
  end: Date | null | undefined
) {
  return useMemo(() => {
    if (!raw?.length || !start || !end) return { series: [], granularity: 'day' as Granularity };
    const s = new Date(start);
    const e = new Date(end);
    const gran = pickGranularity(s, e);
    // filtra al rango visible
    const windowed = raw.filter(p => {
      const t = +new Date(p.date);
      return t >= +s && t <= +e;
    });
    return { series: resample(windowed, gran), granularity: gran };
  }, [raw, start, end]);
}
