import { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import area_chart_options from './areaChartOptions';
import { useAccountCurrency } from '../../../hook/useAccountCurrency';
import { useMetrics } from '@/context/accounts/MetricsProvider';
import { useDynamicChartGradientsAndMarkers } from '../../../hook/useDynamicChartGradientsAndMarkers';
import { DailyGrowthItem, PerformanceAreaChartProps } from './interface';
import * as React from 'react';
import { densifyWithCarryForward } from '../helpers/densifyWithCarryForward';
import { formatChartLabel, formatChartNumber, toChartDateKey } from './chartLabelUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Simple viewport hook
const useIsMobile = (query = '(max-width: 640px)') => {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, [query]);
  return isMobile;
};

const PerformanceAreaChart: React.FC<PerformanceAreaChartProps> = ({
  dailyGrowth,
  fillParent = false,
  currentFilter,
  startDate,
  endDate,
  tradesBalanceChange = [],
  account,
  equityData = [],
  equityHistory = [],
  proModeActivated = false,
}: any) => {
  const isMobile = useIsMobile();
  const { accounCurrency } = useAccountCurrency(account);
  const { loadingMetrics } = useMetrics();
  const chartRef = useRef<any>(null);

  // Build chart data & labels (unchanged logic except safe-guards)
  const { labels, data, colors, balanceMarkers } = useMemo(() => {
    if (!Array.isArray(dailyGrowth)) {
      return { labels: [], data: [], colors: [], balanceMarkers: [] };
    }
  
    // 1) Filtra por fechas válidas (si quieres, limita con startDate/endDate)
    const validRows = dailyGrowth.filter(item => !Number.isNaN(new Date(item.date).getTime()));

  
    // 2) Densifica con carry-forward (frente puro; no toca backend)
    const filled = densifyWithCarryForward(
      validRows,
      startDate ?? null,
      endDate ?? null
    );
  
    // 3) (opcional) si tienes filtros por métrica, aplícalos sobre filled
    let filteredData: DailyGrowthItem[] = [];
    switch (currentFilter) {
      case 'Profit':
        filteredData = filled.filter(item => item.profit !== undefined);
        break;
      case 'Balance':
        filteredData = filled.filter(item => item.balance !== undefined);
        break;
      case 'Equity':
        filteredData = filled.filter(item => item.balance !== undefined && item.drawdownProfit !== undefined);
        break;
      case 'Drawdown':
        filteredData = filled.filter(item => item.drawdownPercentage !== undefined);
        break;
      case 'Lots':
        filteredData = filled.filter(item => item.lots !== undefined);
        break;
      default:
        filteredData = filled.filter(item => item.totalGains !== undefined);
        break;
    }
  
    // 4) Orden → recorte → reverse (como ya lo haces)
    const sortedData = [...filteredData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const hasMinimumData = sortedData.length >= 20;
    const limitedData = hasMinimumData
      ? sortedData.slice(0, 45)
      : sortedData.slice(0, Math.min(50, sortedData.length));
    const reversedData = limitedData.reverse();
  
    // 5) Labels + valores para la serie
    const labels = reversedData.map(item => formatChartLabel(item.date));
  
    const data = reversedData.map(item => {
      if (currentFilter === 'Profit') return item.profit ?? 0;
      if (currentFilter === 'Balance') return item.balance ?? 0;
      if (currentFilter === 'Equity') {
        if (item.balance && item.drawdownProfit) {
          return ((item.balance - item.drawdownProfit) * 100) / item.balance;
        }
        return 0;
      }
      if (currentFilter === 'Drawdown') return item.drawdownPercentage ?? 0;
      if (currentFilter === 'Lots') return item.lots ?? 0;
      return item.totalGains ?? 0;
    });
  
    const colors = reversedData.map((item, idx) => {
      const value = data[idx];
      const balanceChange = tradesBalanceChange.find(
        (trade: { closeTime?: string; openTime?: string }) => {
          const tradeDay = toChartDateKey(trade.closeTime ?? trade.openTime ?? '');
          return tradeDay && tradeDay === toChartDateKey(item.date);
        }
      );
      if (balanceChange) {
        return balanceChange.profit > 0 ? 'rgb(0, 230, 118)' : 'rgb(255, 82, 82)';
      }
      if (currentFilter === 'Drawdown' && value !== 0) return 'rgb(255, 82, 82)';
      return 'transparent';
    });

    const markerMapByLabel = new Map<
      string,
      { type: 'deposit' | 'withdrawal'; value: number; color: string }
    >();
    for (const trade of tradesBalanceChange) {
      const tradeDate = (trade as { closeTime?: string; openTime?: string }).closeTime
        ?? (trade as { openTime?: string }).openTime;
      const label = formatChartLabel(tradeDate ?? '');
      if (!label) continue;
      markerMapByLabel.set(label, {
        type: trade.profit > 0 ? 'deposit' : 'withdrawal',
        value: trade.profit,
        color: trade.profit > 0 ? 'rgb(0, 230, 118)' : 'rgb(255, 82, 82)',
      });
    }

    const balanceMarkers = Array.from(markerMapByLabel.entries()).map(([x, m]) => ({
      x,
      type: m.type,
      value: m.value,
    }));

    return { labels, data, colors, balanceMarkers, markerMapByLabel };
  }, [dailyGrowth, currentFilter, startDate, endDate, tradesBalanceChange]);
  


  // MOBILE: light downsampling so the chart breathes on tiny screens
  const { labelsFinal, dataFinal, balanceMarkersVisible } = useMemo(() => {
    if (!isMobile) {
      return { labelsFinal: labels, dataFinal: data, balanceMarkersVisible: balanceMarkers };
    }
    if (labels.length <= 40) {
      return { labelsFinal: labels, dataFinal: data, balanceMarkersVisible: balanceMarkers };
    }

    const stride = Math.ceil(labels.length / 40);
    const l: string[] = [];
    const d: number[] = [];
    const labelSet = new Set<string>();
    for (let i = 0; i < labels.length; i += stride) {
      l.push(labels[i]);
      d.push(data[i]);
      labelSet.add(labels[i]);
    }
    if (l[l.length - 1] !== labels[labels.length - 1]) {
      l.push(labels[labels.length - 1]);
      d.push(data[data.length - 1]);
      labelSet.add(labels[labels.length - 1]);
    }
    const visibleMarkers = balanceMarkers.filter(m => labelSet.has(m.x));
    return { labelsFinal: l, dataFinal: d, balanceMarkersVisible: visibleMarkers };
  }, [isMobile, labels, data, balanceMarkers]);

  useDynamicChartGradientsAndMarkers({
    chartRef,
    balanceMarkers: balanceMarkersVisible,
    currentFilter: currentFilter ?? '',
  });

  // --- helpers (keep these once) ---
  const toTimestamp = (t: any): number => {
    if (t == null) return 0;
    if (typeof t === 'number') return t > 1e12 ? t : t * 1000; // ms or sec
    const d = Date.parse(String(t));
    return isNaN(d) ? 0 : d;
  };
  const toNum = (v: any): number => {
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    const n = Number(String(v).replace(/[%\s,]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  // --- normalize drawdown sources ---
  const drawdownMap = useMemo(() => {
    const m = new Map<number, number>();
    if (Array.isArray(equityData)) {
      for (const e of equityData) {
        const ts = Math.floor(toTimestamp(e?.time) / 1000);
        m.set(ts, toNum(e?.floaqtingPnL));
      }
    }
    return m;
  }, [equityData]);

  const getLiveFloatingPnL = (p: any): number => {
    const tsSec = Math.floor(toTimestamp(p?.time) / 1000);

    // 1) array lookup by time
    if (drawdownMap.size) {
      const v = drawdownMap.get(tsSec);
      if (typeof v === 'number' && !isNaN(v)) return v;
    }

    // 2) si equityData es objeto con floatingPnL
    if (equityData && typeof equityData === 'object' && 'floatingPnL' in equityData) {
      return toNum((equityData as any).floatingPnL);
    }

    // 3) equityData como número
    if (typeof equityData === 'number') {
      return toNum(equityData);
    }

    // 4) fallback clásico (balance/equity)
    const bal = toNum(p?.balance);
    const eq = toNum(p?.equity);
    if (bal > 0 && eq >= 0) return ((bal - eq) / bal) * 100;
    return toNum(p?.drawdown);
  };

  // --- pro labels/data ---
  const isPro = proModeActivated && Array.isArray(equityHistory) && equityHistory.length > 0;
  const proLabels = isPro ? equityHistory.map((p: any) => p.time) : [];
  const proData = isPro
    ? equityHistory.map((p: any) => {
        if (currentFilter === 'Balance') return toNum(p?.equity ?? p?.balance ?? 0);
        if (currentFilter === 'Drawdown') {
          // 🔹 si hay floatingPnL lo usamos, si no, fallback a getLiveFloatingPnL
          if (p?.floatingPnL !== undefined) return toNum(p.floatingPnL);
          return getLiveFloatingPnL(p);
        }
        if (currentFilter === 'Equity') return toNum(p?.equity ?? 0);
        return toNum(p?.value ?? p?.equity ?? 0);
      })
    : [];

  // React.useEffect(() => {
  //   if (equityData) {
  //     console.log('Equity Data:', equityData?.drawdown);
  //   }
  // }, [equityData]);

  const chartData = useMemo(() => {
    const labelsToUse = isPro ? proLabels : labelsFinal;
    const dataToUse = isPro ? proData : dataFinal;
    const isDrawdown = currentFilter === 'Drawdown';
    const useGlowLayer = !isDrawdown;

    const lineRgb = isDrawdown ? 'rgb(255, 82, 82)' : 'rgb(0, 230, 118)';
    const glowRgb = isDrawdown ? 'rgba(255, 82, 82, 0.32)' : 'rgba(0, 230, 118, 0.32)';

    const mainDataset: Record<string, unknown> = {
      label: currentFilter || 'Loading Data...',
      data: dataToUse,
      borderColor: lineRgb,
      pointRadius: 0,
      pointHoverRadius: 4,
      borderWidth: 2,
      tension: 0.35,
      fill: true,
      showLine: true,
      spanGaps: true,
      order: useGlowLayer ? 1 : 0,
    };

    const datasets: Record<string, unknown>[] = [];

    if (useGlowLayer) {
      datasets.push({
        label: '_glow',
        data: dataToUse,
        borderColor: glowRgb,
        backgroundColor: 'transparent',
        borderWidth: 6,
        tension: 0.35,
        fill: false,
        showLine: true,
        spanGaps: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 0,
        order: 0,
      });
    }

    datasets.push(mainDataset);

    if (!isPro && labelsToUse.length === labelsFinal.length) {
      const markerByLabel = new Map(
        balanceMarkersVisible.map(m => [m.x, m] as const)
      );
      const hasEvents = labelsFinal.some(l => markerByLabel.has(l));

      if (hasEvents) {
        const eventPointColors = labelsFinal.map(label => {
          const m = markerByLabel.get(label);
          return m ? (m.type === 'deposit' ? 'rgb(0, 230, 118)' : 'rgb(255, 82, 82)') : 'transparent';
        });
        const eventRadii = labelsFinal.map(label => (markerByLabel.has(label) ? 9 : 0));

        datasets.push({
          label: '_balanceEvents',
          data: labelsFinal.map((label, i) => (markerByLabel.has(label) ? dataFinal[i] : null)),
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          pointBackgroundColor: eventPointColors,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: eventPointColors,
          pointHoverBorderColor: '#ffffff',
          pointRadius: eventRadii,
          pointHoverRadius: eventRadii.map(r => (r > 0 ? 12 : 0)),
          showLine: false,
          spanGaps: false,
          order: 2,
        });
      }
    }

    return { labels: labelsToUse, datasets };
  }, [isPro, proLabels, proData, labelsFinal, dataFinal, balanceMarkersVisible, currentFilter]);

  // Utility function to calculate dynamic y-axis range
  const calculateDynamicYAxisRange = (data: number[]) => {
    if (!data || data.length === 0) return { min: 0, max: 100 };

    // Filter out invalid values
    const validData = data.filter(val => typeof val === 'number' && !isNaN(val));
    if (validData.length === 0) return { min: 0, max: 100 };

    const min = Math.min(...validData);
    const max = Math.max(...validData);
    const range = max - min;

    // Handle edge case where all values are the same
    if (range === 0) {
      const centerValue = min;
      return {
        min: centerValue - 0.1,
        max: centerValue + 0.1,
      };
    }

    // If range is very small (less than 1), add more generous padding to make differences visible
    if (range < 1) {
      // For very small ranges, use a minimum padding that's proportional to the range
      const padding = Math.max(range * 0.2, Math.max(range * 0.1, 0.02)); // At least 0.02 padding, or 20% of range
      return {
        min: min - padding,
        max: max + padding,
      };
    }

    // For larger ranges, add 10% padding
    const padding = range * 0.1;
    return {
      min: min - padding,
      max: max + padding,
    };
  };

  // Calculate dynamic y-axis range for current data
  const currentData = isPro ? proData : dataFinal;
  const yAxisRange = calculateDynamicYAxisRange(currentData);

  const hasBalanceMarkersOnChart = balanceMarkersVisible.length > 0;

  const formatYTick = (value: number | string) => {
    const n = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(n)) return String(value);
    if (currentFilter === 'Balance') {
      return `${accounCurrency ?? '$'} ${formatChartNumber(n)}`;
    }
    if (['Gains', 'Drawdown', 'Equity'].includes(currentFilter ?? '')) {
      return `${formatChartNumber(n)}%`;
    }
    return formatChartNumber(n);
  };

  // Base options from your helper
  const baseOptions = area_chart_options(
    currentFilter === 'Balance' ? 1 : 2,
    currentFilter === 'Balance' ? (accounCurrency ?? '$') + ' ' : '',
    balanceMarkersVisible
  );

  // Mobile-polished options (desktop untouched)
  const options: any = useMemo(() => {
    const mobileTweaks = isMobile
      ? {
          maintainAspectRatio: false,
          layout: { padding: 8 },
          animation: { duration: 600, easing: 'easeOutCubic' },
          interaction: { mode: 'nearest', axis: 'x', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...baseOptions.plugins.tooltip,
              backgroundColor: 'rgba(15, 20, 30, 0.95)',
              titleColor: '#ffffff',
              bodyColor: '#f1f5f9',
              borderColor: 'rgba(0, 230, 118, 0.4)',
              borderWidth: 1,
              titleFont: { size: 11, weight: '600' },
              bodyFont: { size: 11, weight: '500' },
              padding: 10,
              displayColors: false,
              filter: (item: {
                chart: { data: { datasets: { label?: string }[] } };
                datasetIndex: number;
              }) => {
                const ds = item.chart?.data?.datasets?.[item.datasetIndex];
                return ds?.label !== '_glow';
              },
              callbacks: {
                label: (ctx: { raw: number }) => formatYTick(ctx.raw),
              },
            },
          },
          elements: {
            point: {
              radius: hasBalanceMarkersOnChart ? undefined : 0,
              hoverRadius: 4,
              hitRadius: 10,
            },
            line: {
              borderWidth: 2,
              tension: 0.35,
            },
          },
          scales: {
            x: {
              ...baseOptions.scales.x,
              ticks: {
                ...baseOptions.scales.x.ticks,
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 6,
                color: 'rgba(255,255,255,0.35)',
                font: { size: 10, weight: '500' },
              },
              grid: {
                ...baseOptions.scales.x.grid,
                color: 'rgba(255,255,255,0.04)',
                lineWidth: 1,
              },
            },
            y: {
              ...baseOptions.scales.y,
              min: currentFilter === 'Drawdown' ? yAxisRange.min : undefined,
              max: currentFilter === 'Drawdown' ? yAxisRange.max : undefined,
              ticks: {
                ...baseOptions.scales.y.ticks,
                color: 'rgba(255,255,255,0.35)',
                font: { size: 10, weight: '500' },
                padding: 6,
                callback: (value: number | string) => formatYTick(value),
              },
              grid: {
                ...baseOptions.scales.y.grid,
                color: 'rgba(255,255,255,0.04)',
                lineWidth: 1,
              },
            },
          },
        }
      : {};

    // Apply dynamic y-axis scaling for Drawdown filter
    const dynamicYAxisConfig =
      currentFilter === 'Drawdown'
        ? {
            scales: {
              ...baseOptions.scales,
              y: {
                ...baseOptions.scales.y,
                min: yAxisRange.min,
                max: yAxisRange.max,
                ticks: {
                  ...baseOptions.scales.y.ticks,
                  callback: (value: number | string) => formatYTick(value),
                },
              },
            },
          }
        : {};

    const tooltipOnlyMainDataset = {
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...baseOptions.plugins.tooltip,
          filter: (item: {
            chart: { data: { datasets: { label?: string }[] } };
            datasetIndex: number;
          }) => {
            const ds = item.chart?.data?.datasets?.[item.datasetIndex];
            return ds?.label !== '_glow';
          },
        },
      },
    };

    return {
      ...baseOptions,
      ...tooltipOnlyMainDataset,
      ...mobileTweaks,
      ...dynamicYAxisConfig,
      scales: {
        ...baseOptions.scales,
        ...(mobileTweaks as { scales?: object }).scales,
        ...(dynamicYAxisConfig as { scales?: object }).scales,
        y: {
          ...baseOptions.scales.y,
          ...(mobileTweaks as { scales?: { y?: object } }).scales?.y,
          ...(dynamicYAxisConfig as { scales?: { y?: object } }).scales?.y,
          ticks: {
            ...baseOptions.scales.y.ticks,
            callback: (value: number | string) => formatYTick(value),
          },
        },
      },
    };
  }, [isMobile, baseOptions, currentFilter, accounCurrency, yAxisRange, hasBalanceMarkersOnChart]);

  const canvasGlowClass =
    !loadingMetrics && currentFilter !== 'Drawdown'
      ? '[&_canvas]:drop-shadow-[0_0_10px_rgba(0,230,118,0.35)]'
      : '';

  return (
    <div
      className={`relative h-full w-full min-h-0 px-1 sm:px-0 transition-[filter] duration-300 ${
        fillParent ? 'max-h-full' : 'sm:min-h-44 lg:min-h-[40vh]'
      } ${canvasGlowClass}`}
    >
      <Line ref={chartRef} data={chartData} options={options} className='!h-full !w-full' />
    </div>
  );
};

export default PerformanceAreaChart;
