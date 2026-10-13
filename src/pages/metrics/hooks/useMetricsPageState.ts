import { useMemo } from 'react';
import type { IGrowth, IMetrics, MetricsByDate } from '../interface';

export type MetricsPagePhase = 'boot' | 'shell' | 'kpis' | 'chart' | 'ready';

export type MetricsPageCanShow = {
  header: boolean;
  keyMetrics: boolean;
  chart: boolean;
  performance: boolean;
  winLoss: boolean;
  advanced: boolean;
  recent: boolean;
};

export type UseMetricsPageStateInput = {
  loadingAccounts: boolean;
  loadingMetrics: boolean;
  tradesLoading: boolean;
  isRefreshing: boolean;
  hasAccounts: boolean;
  hasMetricsPayload: boolean;
  hasCachedMetrics: boolean;
  growth: IGrowth;
  chartReady?: boolean;
};

export type UseMetricsPageStateResult = {
  phase: MetricsPagePhase;
  loading: {
    accounts: boolean;
    metrics: boolean;
    trades: boolean;
    any: boolean;
  };
  canShow: MetricsPageCanShow;
  showKeyMetricsSkeleton: boolean;
  showChartSkeleton: boolean;
};

export function useMetricsPageState(input: UseMetricsPageStateInput): UseMetricsPageStateResult {
  const {
    loadingAccounts,
    loadingMetrics,
    tradesLoading,
    isRefreshing,
    hasAccounts,
    hasMetricsPayload,
    hasCachedMetrics,
    growth,
    chartReady = true,
  } = input;

  const metricsBlocking = loadingMetrics && !hasCachedMetrics;
  const hasGrowth = Array.isArray(growth) && growth.length >= 0;

  return useMemo(() => {
    const loading = {
      accounts: loadingAccounts,
      metrics: metricsBlocking,
      trades: tradesLoading,
      any: loadingAccounts || metricsBlocking || tradesLoading,
    };

    const canShow: MetricsPageCanShow = {
      header: !loadingAccounts || hasAccounts,
      keyMetrics: hasMetricsPayload && !metricsBlocking,
      chart: hasMetricsPayload && !metricsBlocking && hasGrowth && chartReady,
      performance: hasMetricsPayload && !metricsBlocking,
      winLoss: hasMetricsPayload && !metricsBlocking,
      advanced: hasMetricsPayload && !metricsBlocking,
      recent: hasMetricsPayload && !metricsBlocking,
    };

    let phase: MetricsPagePhase = 'boot';
    if (loading.accounts && !hasAccounts) {
      phase = 'boot';
    } else if (metricsBlocking) {
      phase = 'shell';
    } else if (!canShow.chart) {
      phase = 'kpis';
    } else if (tradesLoading) {
      phase = 'chart';
    } else {
      phase = 'ready';
    }

    return {
      phase,
      loading,
      canShow,
      showKeyMetricsSkeleton: !canShow.keyMetrics,
      showChartSkeleton: canShow.keyMetrics && !canShow.chart,
    };
  }, [
    loadingAccounts,
    metricsBlocking,
    tradesLoading,
    hasAccounts,
    hasMetricsPayload,
    hasGrowth,
    chartReady,
    hasCachedMetrics,
    isRefreshing,
  ]);
}

export type MetricsPageDataBundle = {
  metrics: IMetrics;
  metricsByDate: MetricsByDate;
  trades: unknown[];
  growth: IGrowth;
};
