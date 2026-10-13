import { describe, expect, it } from 'vitest';
import { useMetricsPageState } from '../useMetricsPageState';
import { renderHook } from '@testing-library/react';

describe('useMetricsPageState', () => {
  it('returns boot when loading accounts with no accounts', () => {
    const { result } = renderHook(() =>
      useMetricsPageState({
        loadingAccounts: true,
        loadingMetrics: true,
        tradesLoading: false,
        isRefreshing: false,
        hasAccounts: false,
        hasMetricsPayload: false,
        hasCachedMetrics: false,
        growth: [],
      })
    );
    expect(result.current.phase).toBe('boot');
    expect(result.current.showKeyMetricsSkeleton).toBe(true);
  });

  it('shows KPIs when metrics ready without waiting for trades', () => {
    const { result } = renderHook(() =>
      useMetricsPageState({
        loadingAccounts: false,
        loadingMetrics: false,
        tradesLoading: true,
        isRefreshing: false,
        hasAccounts: true,
        hasMetricsPayload: true,
        hasCachedMetrics: false,
        growth: [{ date: '2026-01-01', profit: 10 }],
      })
    );
    expect(result.current.canShow.keyMetrics).toBe(true);
    expect(result.current.showKeyMetricsSkeleton).toBe(false);
    expect(result.current.canShow.chart).toBe(true);
  });

  it('uses cached metrics without blocking skeleton', () => {
    const { result } = renderHook(() =>
      useMetricsPageState({
        loadingAccounts: false,
        loadingMetrics: true,
        tradesLoading: false,
        isRefreshing: true,
        hasAccounts: true,
        hasMetricsPayload: true,
        hasCachedMetrics: true,
        growth: [],
      })
    );
    expect(result.current.canShow.keyMetrics).toBe(true);
    expect(result.current.showKeyMetricsSkeleton).toBe(false);
  });
});
