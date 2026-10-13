import { useMemo, useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { profitBarOptions } from './profitBarOptions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonthlyAnalyticsItem {
  date: string;
  value: number;
}

interface ColumnChartProps {
  monthlyAnalytics?: MonthlyAnalyticsItem[];
  totalBalance?: number;
  dataMode?: number;
}

const useIsMobile = (query = '(max-width: 640px)') => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, [query]);
  return isMobile;
};

const ProfitBarChart: React.FC<ColumnChartProps> = ({
  monthlyAnalytics = [],
  totalBalance = 0,
  dataMode = 0,
}) => {
  const chartRef = useRef<any>(null);
  const isMobile = useIsMobile();
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track container width for dynamic bar thickness/spacing
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setContainerWidth(w);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /** Gradients */
  const generateEnhancedGradient = (ctx: CanvasRenderingContext2D, value: number) => {
    // Prefer chartArea height for correct gradient scaling
    const chart = chartRef.current;
    const h = chart?.chartArea ? chart.chartArea.bottom - chart.chartArea.top : ctx.canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, h || ctx.canvas.height);

    if (value >= 0) {
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.9)');
      gradient.addColorStop(0.3, 'rgba(22, 163, 74, 0.8)');
      gradient.addColorStop(0.7, 'rgba(21, 128, 61, 0.7)');
      gradient.addColorStop(1, 'rgba(20, 83, 45, 0.6)');
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
      gradient.addColorStop(0.3, 'rgba(220, 38, 38, 0.8)');
      gradient.addColorStop(0.7, 'rgba(185, 28, 28, 0.7)');
      gradient.addColorStop(1, 'rgba(153, 27, 27, 0.6)');
    }
    return gradient;
  };

  const generateGlowEffect = (ctx: CanvasRenderingContext2D, value: number) => {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
    if (value >= 0) {
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    }
    return gradient;
  };

  const sortedMonthly = useMemo(() => {
    if (!Array.isArray(monthlyAnalytics) || !monthlyAnalytics.length) return [];
    return [...monthlyAnalytics].sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      return Number.isNaN(ta) || Number.isNaN(tb) ? 0 : ta - tb;
    });
  }, [monthlyAnalytics]);

  /** Labels, data, colors */
  const { labels, data, colors } = useMemo(() => {
    const ctx = chartRef.current
      ? (chartRef.current as any).ctx
      : document.createElement('canvas').getContext('2d');

    if (!ctx) return { labels: [] as string[], data: [] as number[], colors: [] as any[] };

    const labels = sortedMonthly.map(item => {
      // Shorter, more compact labels for mobile
      const d = new Date(item.date);
      return d.toLocaleDateString('en-US', {
        month: isMobile ? 'short' : 'short',
        day: isMobile ? 'numeric' : 'numeric',
      });
    });

    const data = sortedMonthly.map(item => item.value);
    const colors = data.map(v => generateEnhancedGradient(ctx!, v));
    return { labels, data, colors };
  }, [sortedMonthly, isMobile]);

  // Dynamic bar sizing: thinner bars on mobile + many points
  const { categoryPercentage, barPercentage, barThickness } = useMemo(() => {
    const n = Math.max(data.length, 1);
    const w = Math.max(containerWidth, 320); // assume min width
    // target 6–10px per bar on mobile, 12–18px on desktop
    const pxPerBar = isMobile ? 8 : 14;
    const suggested = Math.min(Math.floor((w / n) * 0.8), pxPerBar * 2);
    return {
      categoryPercentage: isMobile ? 0.7 : 0.8,
      barPercentage: isMobile ? 0.7 : 0.8,
      barThickness: Math.max(4, Math.min(pxPerBar * 2, suggested)),
    };
  }, [containerWidth, data.length, isMobile]);

  /** Chart data */
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: dataMode === 0 ? 'Profit (Absolute)' : 'Profit (%)',
          data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: isMobile ? 1 : 2,
          borderRadius: isMobile
            ? { topLeft: 6, topRight: 6, bottomLeft: 3, bottomRight: 3 }
            : { topLeft: 8, topRight: 8, bottomLeft: 4, bottomRight: 4 },
          borderSkipped: false,
          categoryPercentage,
          barPercentage,
          barThickness,
          hoverBorderWidth: isMobile ? 2 : 3,
        },
      ],
    }),
    [labels, data, colors, dataMode, isMobile, categoryPercentage, barPercentage, barThickness]
  );

  /** Options (mobile-tuned) */
  const customProfitBarOptions: any = useMemo(() => {
    const baseOptions = profitBarOptions(dataMode, totalBalance, chartRef);

    return {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false, // we control height with Tailwind
      animation: {
        duration: isMobile ? 800 : 1500,
        easing: 'easeInOutQuart',
        onProgress(animation: any) {
          // Lighter shadows on mobile for perf
          const chart = animation.chart;
          const ctx = chart.ctx;
          const dataset = chart.data.datasets[0];
          const meta = chart.getDatasetMeta(0);
          meta.data.forEach((_: any, index: number) => {
            const value = dataset.data[index];
            ctx.shadowColor = value >= 0 ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)';
            ctx.shadowBlur = isMobile ? 4 : 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          });
        },
        onComplete(animation: any) {
          const chart = animation.chart;
          const ctx = chart.ctx;
          ctx.shadowBlur = 0;
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
      scales: {
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.85)',
            font: {
              size: isMobile ? 10 : 11,
              weight: '500',
            },
            maxRotation: isMobile ? 0 : 0,
            autoSkip: true,
            autoSkipPadding: isMobile ? 8 : 12,
            padding: isMobile ? 4 : 8,
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.08)',
            drawBorder: false,
            lineWidth: isMobile ? 0.5 : 1,
            tickLength: 0,
          },
        },
        y: {
          ticks: {
            callback: (value: number) => {
              if (dataMode === 0) {
                // Compact money on mobile
                if (isMobile) {
                  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
                  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
                }
                return `$${value.toLocaleString()}`;
              } else {
                return `${((value * 100) / totalBalance).toFixed(isMobile ? 1 : 2)}%`;
              }
            },
            color: 'rgba(255, 255, 255, 0.85)',
            font: {
              size: isMobile ? 10 : 11,
              weight: '500',
            },
            padding: isMobile ? 4 : 8,
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.08)',
            drawBorder: false,
            lineWidth: isMobile ? 0.5 : 1,
          },
        },
      },
      plugins: {
        ...baseOptions.plugins,
        legend: {
          display: !isMobile, // hide legend on phones
          labels: {
            color: 'rgba(255,255,255,0.9)',
            boxWidth: 12,
            font: { size: 11, weight: '500' },
          },
        },
        tooltip: {
          ...baseOptions.plugins.tooltip,
          backgroundColor: 'rgba(15, 23, 42, 0.96)',
          titleColor: 'rgba(255, 255, 255, 1)',
          bodyColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 2,
          cornerRadius: 12,
          padding: isMobile ? 8 : 12,
          titleFont: { size: isMobile ? 11 : 12, weight: '600' },
          bodyFont: { size: isMobile ? 11 : 12, weight: '500' },
          displayColors: true,
          callbacks: {
            ...baseOptions.plugins.tooltip?.callbacks,
            title(context: any) {
              return `📅 ${context[0].label}`;
            },
            label(context: any) {
              const value = context.raw;
              const isPositive = value >= 0;
              const icon = isPositive ? '📈' : '📉';
              if (dataMode === 0) {
                return `${icon} Profit: $${Math.abs(value).toFixed(isMobile ? 0 : 2)}`;
              } else {
                return `${icon} Change: ${((value * 100) / totalBalance).toFixed(
                  isMobile ? 1 : 2
                )}%`;
              }
            },
          },
        },
      },
    };
  }, [dataMode, totalBalance, chartRef, isMobile]);

  return (
    <div className='w-full h-full px-1 sm:px-2 py-2 sm:py-4 flex justify-center items-center'>
      {/* Responsive height: taller on larger screens */}
      {/* <div ref={containerRef} className='w-full h-56 sm:h-72 md:h-96 relative'> */}
      <div ref={containerRef} className='w-full h-56 sm:h-72 md:h-full relative'>
        <Bar ref={chartRef} data={chartData} options={customProfitBarOptions} />
      </div>
    </div>
  );
};

export default ProfitBarChart;
