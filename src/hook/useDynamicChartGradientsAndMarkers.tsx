import { useEffect } from 'react';
import { useMetrics } from '@/context/accounts/MetricsProvider';

interface UseDynamicChartGradientsAndMarkersProps {
  chartRef: React.RefObject<{ ctx?: CanvasRenderingContext2D; data: { datasets: unknown[] }; update: () => void } | null>;
  balanceMarkers: { x: string; type: string; value: number }[];
  currentFilter: string;
}

/**
 * Applies gradient fill and line color to the chart.
 * Deposit/withdrawal point styling is handled on the dataset in PerformanceAreaChart.
 */
export function useDynamicChartGradientsAndMarkers({
  chartRef,
  balanceMarkers,
  currentFilter,
}: UseDynamicChartGradientsAndMarkersProps) {
  const { loadingMetrics } = useMetrics();
  const hasBalanceMarkers = balanceMarkers.length > 0;

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart?.ctx) return;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

    const mainDatasetIndex = chart.data.datasets.length > 1 ? 1 : 0;
    const ds = chart.data.datasets[mainDatasetIndex] as {
      backgroundColor?: unknown;
      borderColor?: string;
      pointBackgroundColor?: unknown;
      pointBorderColor?: unknown;
      pointHoverBackgroundColor?: unknown;
      pointHoverBorderColor?: unknown;
    };

    if (loadingMetrics) {
      gradient.addColorStop(0, 'rgba(128, 128, 128, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      const isDrawdown = currentFilter === 'Drawdown';
      if (isDrawdown) {
        gradient.addColorStop(0, 'rgba(255, 82, 82, 0.28)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(0, 230, 118, 0.28)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
    }

    if (ds) {
      ds.backgroundColor = gradient;

      if (!hasBalanceMarkers) {
        if (loadingMetrics) {
          const gray = 'rgb(148, 163, 184)';
          ds.borderColor = gray;
          ds.pointBackgroundColor = gray;
          ds.pointBorderColor = gray;
          ds.pointHoverBackgroundColor = gray;
          ds.pointHoverBorderColor = gray;
        } else if (currentFilter === 'Drawdown') {
          const red = 'rgb(255, 82, 82)';
          ds.borderColor = red;
          ds.pointBackgroundColor = red;
          ds.pointBorderColor = red;
          ds.pointHoverBackgroundColor = red;
          ds.pointHoverBorderColor = red;
        } else {
          const green = 'rgb(0, 230, 118)';
          ds.borderColor = green;
          ds.pointBackgroundColor = green;
          ds.pointBorderColor = green;
          ds.pointHoverBackgroundColor = green;
          ds.pointHoverBorderColor = green;
        }
      } else if (!loadingMetrics) {
        const lineColor = currentFilter === 'Drawdown' ? 'rgb(255, 82, 82)' : 'rgb(0, 230, 118)';
        ds.borderColor = lineColor;
      }
    }

    if (chart.data.datasets.length > 1 && chart.data.datasets[0]) {
      const glow = chart.data.datasets[0] as { borderColor?: string };
      if (loadingMetrics) {
        glow.borderColor = 'rgba(148, 163, 184, 0.35)';
      } else if (currentFilter === 'Drawdown') {
        glow.borderColor = 'rgba(255, 82, 82, 0.35)';
      } else {
        glow.borderColor = 'rgba(0, 230, 118, 0.35)';
      }
    }

    chart.update();
  }, [chartRef, balanceMarkers, currentFilter, loadingMetrics, hasBalanceMarkers]);

  return {};
}
