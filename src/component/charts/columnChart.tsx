import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { SeparadorDecimal } from '../../utils/SeparadorDecimal';

Chart.register(...registerables);

interface CurrencyAnalytics {
  date: string;
  gains: number;
  profit: number;
}

interface ColumnChartProps {
  monthlyAnalytics: CurrencyAnalytics[];
  dataMode?: number; // 0 para dólares, 1 para porcentajes
}

const ColumnChart: React.FC<ColumnChartProps> = ({ monthlyAnalytics = [], dataMode }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<any>(null);

  useEffect(() => {
    const labels = monthlyAnalytics.map(point =>
      new Date(point.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    );

    // Crear un gradiente para cada barra
    const createGradient = (ctx: CanvasRenderingContext2D, chartArea: any, value: number) => {
      const { top, bottom } = chartArea;
      const gradient = ctx.createLinearGradient(0, top, 0, bottom);

      if (value >= 0) {
        gradient.addColorStop(0, 'lime');
        gradient.addColorStop(1, 'green');
      } else {
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1, 'darkred');
      }

      return gradient;
    };

    const data = {
      labels,
      datasets: [
        {
          label: dataMode === 0 ? 'Profit ($)' : 'Gains (%)',
          data:
            dataMode === 0
              ? monthlyAnalytics.map(point => point.profit)
              : monthlyAnalytics.map(point => point.gains),
          backgroundColor: (context: any) => {
            const { chart, raw } = context;
            const { ctx, chartArea } = chart;

            if (!chartArea) {
              return 'lime'; // Fallback mientras se calcula el tamaño del gráfico
            }

            return createGradient(ctx, chartArea, raw);
          },
          borderRadius: 10,
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              return dataMode === 0
                ? `$${SeparadorDecimal(value.toFixed(2))}`
                : `${value.toFixed(2)}%`;
            },
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(255, 255, 255, 1)',
          },
        },
        y: {
          ticks: {
            callback: (value: any) =>
              dataMode === 0 ? `$${SeparadorDecimal(value.toFixed(0))}` : `${value.toFixed(2)}%`,
            color: 'rgba(255, 255, 255, 1)',
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [monthlyAnalytics, dataMode]);

  return (
    <div style={{ position: 'relative', height: '400px', color: 'white' }}>
      {chartData && chartOptions && <Bar data={chartData} options={chartOptions} />}
    </div>
  );
};

export default ColumnChart;
