import React, { useMemo, useState, memo, useCallback } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { ITrade } from '@/pages/metrics/interface';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TradeAnalyticsChartProps {
  trades: ITrade[];
  loading?: boolean;
  className?: string;
}

type ChartType = 'profit' | 'winrate' | 'volume' | 'symbols';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
    tension?: number;
  }[];
}

const TradeAnalyticsChart: React.FC<TradeAnalyticsChartProps> = memo(({ 
  trades, 
  loading = false, 
  className = '' 
}) => {
  const [activeChart, setActiveChart] = useState<ChartType>('profit');

  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        profit: { labels: [], datasets: [] },
        winrate: { labels: [], datasets: [] },
        volume: { labels: [], datasets: [] },
        symbols: { labels: [], datasets: [] },
      };
    }

    const validTrades = trades.filter(trade => 
      trade && 
      typeof trade.profit === 'number' && 
      !isNaN(trade.profit) &&
      trade.openTime
    );

    if (validTrades.length === 0) {
      return {
        profit: { labels: [], datasets: [] },
        winrate: { labels: [], datasets: [] },
        volume: { labels: [], datasets: [] },
        symbols: { labels: [], datasets: [] },
      };
    }

    // Sort trades by date
    const sortedTrades = validTrades.sort((a, b) => 
      new Date(a.openTime).getTime() - new Date(b.openTime).getTime()
    );

    // Group trades by date (daily)
    const dailyData = sortedTrades.reduce((acc, trade) => {
      const date = new Date(trade.openTime).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          profit: 0,
          trades: 0,
          wins: 0,
          volume: 0,
        };
      }
      acc[date].profit += trade.profit;
      acc[date].trades += 1;
      acc[date].wins += trade.profit > 0 ? 1 : 0;
      acc[date].volume += trade.volume || 0;
      return acc;
    }, {} as Record<string, { profit: number; trades: number; wins: number; volume: number }>);

    const dates = Object.keys(dailyData).sort();
    const last30Days = dates.slice(-30); // Show last 30 days

    // Profit over time data
    const profitData: ChartData = {
      labels: last30Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Daily Profit',
          data: last30Days.map(date => dailyData[date].profit),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Cumulative Profit',
          data: last30Days.reduce((acc, date, index) => {
            const prevCumulative = index === 0 ? 0 : acc[index - 1];
            acc.push(prevCumulative + dailyData[date].profit);
            return acc;
          }, [] as number[]),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: false,
          tension: 0.4,
        },
      ],
    };

    // Win rate over time data
    const winrateData: ChartData = {
      labels: last30Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Win Rate %',
          data: last30Days.map(date => {
            const dayData = dailyData[date];
            return dayData.trades > 0 ? (dayData.wins / dayData.trades) * 100 : 0;
          }),
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Volume over time data
    const volumeData: ChartData = {
      labels: last30Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Daily Volume',
          data: last30Days.map(date => dailyData[date].volume),
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 1,
        },
      ],
    };

    // Symbol distribution data
    const symbolData = validTrades.reduce((acc, trade) => {
      const symbol = trade.symbol || 'Unknown';
      acc[symbol] = (acc[symbol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSymbols = Object.entries(symbolData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8); // Top 8 symbols

    const symbolsData: ChartData = {
      labels: topSymbols.map(([symbol]) => symbol),
      datasets: [
        {
          label: 'Number of Trades',
          data: topSymbols.map(([, count]) => count),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(14, 165, 233, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(168, 85, 247)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(236, 72, 153)',
            'rgb(14, 165, 233)',
            'rgb(34, 197, 94)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return {
      profit: profitData,
      winrate: winrateData,
      volume: volumeData,
      symbols: symbolsData,
    };
  }, [trades]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  }), []);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
          },
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
      },
    },
  }), []);

  const chartButtons = useMemo(() => [
    { key: 'profit' as ChartType, label: 'Profit Over Time', icon: '📈' },
    { key: 'winrate' as ChartType, label: 'Win Rate Trend', icon: '🎯' },
    { key: 'volume' as ChartType, label: 'Volume Analysis', icon: '📊' },
    { key: 'symbols' as ChartType, label: 'Symbol Distribution', icon: '🥧' },
  ], []);

  const renderChart = useCallback(() => {
    const data = chartData[activeChart];
    
    if (!data || data.labels.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>No data available for {chartButtons.find(b => b.key === activeChart)?.label}</div>
          </div>
        </div>
      );
    }

    switch (activeChart) {
      case 'profit':
        return <Line data={data} options={chartOptions} />;
      case 'winrate':
        return <Line data={data} options={chartOptions} />;
      case 'volume':
        return <Bar data={data} options={chartOptions} />;
      case 'symbols':
        return <Doughnut data={data} options={doughnutOptions} />;
      default:
        return <Line data={data} options={chartOptions} />;
    }
  }, [activeChart, chartData, chartButtons, chartOptions, doughnutOptions]);

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Trading Analytics</h3>
          <div className="text-sm text-slate-400">
            {trades?.length || 0} trades analyzed
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {chartButtons.map((button) => (
            <button
              key={button.key}
              onClick={() => setActiveChart(button.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeChart === button.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span className="mr-2">{button.icon}</span>
              {button.label}
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="h-64 w-full">
          {renderChart()}
        </div>

        {/* Chart Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeChart === 'profit' && (
            <>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs text-slate-400 mb-1">Best Day</div>
                <div className="text-sm font-semibold text-green-400">
                  {chartData.profit.datasets[0]?.data.length > 0 
                    ? Math.max(...chartData.profit.datasets[0].data).toFixed(2)
                    : '0'
                  }
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs text-slate-400 mb-1">Worst Day</div>
                <div className="text-sm font-semibold text-red-400">
                  {chartData.profit.datasets[0]?.data.length > 0 
                    ? Math.min(...chartData.profit.datasets[0].data).toFixed(2)
                    : '0'
                  }
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs text-slate-400 mb-1">Avg Daily</div>
                <div className="text-sm font-semibold text-blue-400">
                  {chartData.profit.datasets[0]?.data.length > 0 
                    ? (chartData.profit.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.profit.datasets[0].data.length).toFixed(2)
                    : '0'
                  }
                </div>
              </div>
            </>
          )}
          
          {activeChart === 'winrate' && (
            <>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs text-slate-400 mb-1">Best Win Rate</div>
                <div className="text-sm font-semibold text-green-400">
                  {chartData.winrate.datasets[0]?.data.length > 0 
                    ? Math.max(...chartData.winrate.datasets[0].data).toFixed(1) + '%'
                    : '0%'
                  }
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs text-slate-400 mb-1">Avg Win Rate</div>
                <div className="text-sm font-semibold text-blue-400">
                  {chartData.winrate.datasets[0]?.data.length > 0 
                    ? (chartData.winrate.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.winrate.datasets[0].data.length).toFixed(1) + '%'
                    : '0%'
                  }
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                <div className="text-xs text-slate-400 mb-1">Consistency</div>
                <div className="text-sm font-semibold text-purple-400">
                  {chartData.winrate.datasets[0]?.data.length > 0 
                    ? (100 - (Math.max(...chartData.winrate.datasets[0].data) - Math.min(...chartData.winrate.datasets[0].data))).toFixed(1) + '%'
                    : '0%'
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

TradeAnalyticsChart.displayName = 'TradeAnalyticsChart';

export default TradeAnalyticsChart;
