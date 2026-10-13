import { useEffect, useMemo, useState } from 'react';
import { useMetricsFilterByDates } from '@/pages/metrics/hooks/useMetricsFilterByDates';
import type { IFormattedDates, IMetrics, ITrade, IGrowth, MetricsByDate } from '@/pages/metrics/interface';
import { toChartDateKey } from '@/pages/metrics/utils/metricsDateRange';

/** No `_id` — avoids RequestAccountSyncButton on public routes (no ConnectionJobProvider). */
const DEMO_ACCOUNT = {
  currency: 'USD',
  broker: 'Demo',
} as const;

function getGrowthDateBounds(dailyGrowth: { date: string }[] | undefined) {
  if (!dailyGrowth?.length) return { start: null as string | null, end: null as string | null };
  let start = '';
  let end = '';
  for (const row of dailyGrowth) {
    const key = toChartDateKey(row.date);
    if (!key) continue;
    if (!start || key < start) start = key;
    if (!end || key > end) end = key;
  }
  return { start: start || null, end: end || null };
}

export function useExampleMetricsDemo() {
  const [metrics, setMetrics] = useState<IMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateStartFilter, setDateStartFilter] = useState<string | null>(null);
  const [dateEndFilter, setDateEndFilter] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState('Balance');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    import('@/assets/data/exampleAccount.ts')
      .then(module => {
        if (cancelled) return;
        const data = module.default as IMetrics & { tradesArray?: ITrade[]; dailyGrowth?: IGrowth };
        setMetrics(data);
        const bounds = getGrowthDateBounds(data.dailyGrowth as { date: string }[]);
        setDateStartFilter(bounds.start);
        setDateEndFilter(bounds.end);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load example metrics:', err);
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formattedDates: IFormattedDates = useMemo(
    () => ({
      dateStartFilter,
      dateEndFilter,
      dateStartFilterFormatted: dateStartFilter ?? '',
      dateEndFilterFormatted: dateEndFilter ?? '',
      setDateStartFilter,
      setDateEndFilter,
    }),
    [dateStartFilter, dateEndFilter]
  );

  const safeMetrics: IMetrics = useMemo(
    () => ({
      ...(metrics ?? {}),
      growth: Array.isArray(metrics?.growth) ? metrics.growth : [],
    }),
    [metrics]
  );

  const metricsByDate: MetricsByDate = useMetricsFilterByDates({
    metrics: safeMetrics,
    formattedDates,
  });

  const growth: IGrowth = Array.isArray(metricsByDate?.growth) ? metricsByDate.growth : [];
  const trades: ITrade[] = useMemo(() => {
    const raw = (metrics as { tradesArray?: ITrade[] } | null)?.tradesArray;
    return Array.isArray(raw) ? raw : [];
  }, [metrics]);

  const ready = !loading && !!metrics && !!dateStartFilter && !!dateEndFilter;

  return {
    loading,
    ready,
    metrics: safeMetrics,
    trades,
    growth,
    metricsByDate,
    formattedDates,
    currentFilter,
    setCurrentFilter,
    currentAccount: DEMO_ACCOUNT,
    dateStartFilter,
    dateEndFilter,
  };
}
