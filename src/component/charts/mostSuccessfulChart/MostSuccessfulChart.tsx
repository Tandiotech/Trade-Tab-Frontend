import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DataPoint {
  asset: string;
  value: number;
}

interface MostSuccessfulChartProps {
  trades: any[];
}

const MostSuccessfulChart: React.FC<MostSuccessfulChartProps> = ({ trades }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chartInstance: Chart | null = null;

  const calculateSuccessData = (): DataPoint[] => {
    const tradeSummary: { [key: string]: { totalGains: number; count: number } } = {};

    trades.forEach(trade => {
      if (trade.type !== 'DEAL_TYPE_BALANCE') {
        if (!tradeSummary[trade.symbol]) {
          tradeSummary[trade.symbol] = { totalGains: 0, count: 0 };
        }
        if (trade.profit > 0) {
          tradeSummary[trade.symbol].totalGains += 1;
        }
        tradeSummary[trade.symbol].count += 1;
      }
    });

    return Object.keys(tradeSummary).map(symbol => ({
      asset: symbol,
      value: (tradeSummary[symbol].totalGains / tradeSummary[symbol].count) * 100,
    }));
  };

  const successData = calculateSuccessData();

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const labels = successData.map(item => item.asset);
      const values = successData.map(item => item.value);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Average Success Rate',
              data: values,
              backgroundColor: (context: any) => {
                const value = context.raw as number;

                if (value <= 10) return '#FFF7D6'; // Soft Champagne Gold (Very Low)
                if (value <= 20) return '#FFE89E'; // Light Gold
                if (value <= 30) return '#FFD966'; // Medium Gold
                if (value <= 40) return '#FFC733'; // Rich Gold
                if (value <= 50) return '#FFB300'; // Deep Gold
                if (value <= 60) return '#E69C00'; // Amber Gold
                if (value <= 70) return '#CC8500'; // Dark Gold
                if (value <= 80) return '#B37400'; // Bronze-Gold
                if (value <= 90) return '#996300'; // Burnished Gold
                return '#805200'; // Antique Gold (99%)
              },
              borderRadius: 5,
              barThickness: 18,
              categoryPercentage: 0.8,
              barPercentage: 0.9,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.raw.toFixed(2)}%`,
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
                autoSkip: false,
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
  }, [successData]);

  return (
    <div
      className='custom-scrollbar2'
      style={{
        position: 'relative',
        height: '450px',
        width: '100%',
        overflow: 'auto',
      }}
    >
      <div style={{ height: `${Math.max(450, successData.length * 40)}px`, width: '100%' }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default MostSuccessfulChart;
