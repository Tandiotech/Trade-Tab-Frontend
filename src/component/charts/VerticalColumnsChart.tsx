import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DataPoint {
  asset: string;
  value: number;
}

interface VerticalColumnChartProps {
  currencySummary: DataPoint[];
}

const VerticalColumnChart: React.FC<VerticalColumnChartProps> = ({ currencySummary }: any) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chartInstance: Chart | null = null;

  // Ensure currencySummary is always an array
  const safeCurrencySummary = Array.isArray(currencySummary)
    ? [...currencySummary].sort((a: DataPoint, b: DataPoint) => (b.value ?? 0) - (a.value ?? 0))
    : [];

  const rowPx = 32;
  const innerHeight = Math.min(1200, Math.max(240, safeCurrencySummary.length * rowPx));

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Handle empty data case
      if (!safeCurrencySummary || safeCurrencySummary.length === 0) {
        return;
      }

      const labels = safeCurrencySummary.map((item: any) => item.asset);
      const values = safeCurrencySummary.map((item: any) => item.value);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Most Traded Assets',
              data: values,
              backgroundColor: (context: any) => {
                const value = context.raw;

                if (value <= 5) return '#A7F3D0'; // Mint Green (Very Low)
                if (value <= 15) return '#6EE7B7'; // Light Green
                if (value <= 50) return '#34D399'; // Soft Teal
                if (value <= 100) return '#10B981'; // Standard Green
                if (value <= 300) return '#059669'; // Darker Green
                if (value <= 600) return '#047857'; // Forest Green
                if (value <= 1_000) return '#065F46'; // Deep Forest
                if (value <= 2_000) return '#064E3B'; // Dark Emerald
                if (value <= 3_000) return '#03362E'; // Almost Black-Green
                return '#022C22'; // Ultra Dark Green (Extreme Volume)
              },
              borderRadius: 5, // Rounded corners
              barThickness: 18, // Control the bar width
              categoryPercentage: 0.8, // Reduces bar width slightly
              barPercentage: 0.9, // Adds spacing between bars
            },
          ],
        },
        options: {
          indexAxis: 'y', // Horizontal bars
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: context => `${context.raw} trades`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 12 },
                color: '#ffffff',
              },
            },
            y: {
              grid: { display: false },
              ticks: {
                font: { size: 14, weight: 'bold' },
                color: '#ffffff',
                autoSkip: false, // Prevent skipping labels
                maxRotation: 0,
                minRotation: 0,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [safeCurrencySummary]);

  return (
    <div
      className='custom-scrollbar2 h-full max-h-full min-h-0 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)]/40 py-1 pr-1'
    >
      <div className='relative w-full' style={{ height: `${innerHeight}px` }}>
        <canvas ref={chartRef} className='block max-w-full' />
      </div>
    </div>
  );
};

export default VerticalColumnChart;
