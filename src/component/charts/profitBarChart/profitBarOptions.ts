import { SeparadorDecimal } from "@/utils/SeparadorDecimal";

export function profitBarOptions(dataMode: any, totalBalance: any, chartRef: any) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            return `Profit: ${
              dataMode == 0
                ? SeparadorDecimal(value.toFixed(2))
                : ((value * 100) / totalBalance).toFixed(2) + '%'
            }`;
          },
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        titleFont: {
          size: 13,
          weight: '600'
        },
        bodyFont: {
          size: 12,
          weight: '500'
        }
      },
      title: {
        display: false,
        text: 'Monthly Profit',
      },
    },
    scales: {
      x: {
        ticks: {
          display: true,
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 11,
            weight: '500'
          },
          padding: 8,
          maxRotation: 45,
          minRotation: 0
        },
        title: {
          display: false,
          text: 'Date',
        },
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
          lineWidth: 1
        },
        border: {
          display: false
        }
      },
      y: {
        ticks: {
          display: true,
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 11,
            weight: '500'
          },
          padding: 8,
          callback: function(value: number) {
            if (dataMode === 0) {
              return `$${value.toLocaleString()}`;
            } else {
              return `${value.toFixed(1)}%`;
            }
          }
        },
        title: {
          display: true,
          text: dataMode === 0 ? 'Profit ($)' : 'Profit (%)',
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
            weight: '600'
          },
          padding: {
            top: 10,
            bottom: 10
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
          lineWidth: 1
        },
        border: {
          display: false
        },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 4,
          bottomRight: 4,
        },
        borderSkipped: false,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    datasets: [
      {
        backgroundColor: (context: any) => {
          const chart = chartRef.current;
          if (!chart) return null;

          const ctx = chart.ctx;
          const value = context.raw;

          const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

          if (value >= 0) {
            // Enhanced positive gradient
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.9)');
            gradient.addColorStop(0.3, 'rgba(22, 163, 74, 0.8)');
            gradient.addColorStop(0.7, 'rgba(21, 128, 61, 0.7)');
            gradient.addColorStop(1, 'rgba(20, 83, 45, 0.6)');
          } else {
            // Enhanced negative gradient
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
            gradient.addColorStop(0.3, 'rgba(220, 38, 38, 0.8)');
            gradient.addColorStop(0.7, 'rgba(185, 28, 28, 0.7)');
            gradient.addColorStop(1, 'rgba(153, 27, 27, 0.6)');
          }

          return gradient;
        },
        borderWidth: 2,
        borderColor: (context: any) => {
          const value = context.raw;
          return value >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        },
        hoverBackgroundColor: (context: any) => {
          const chart = chartRef.current;
          if (!chart) return null;

          const ctx = chart.ctx;
          const value = context.raw;

          const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

          if (value >= 0) {
            gradient.addColorStop(0, 'rgba(34, 197, 94, 1)');
            gradient.addColorStop(1, 'rgba(22, 163, 74, 0.9)');
          } else {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 1)');
            gradient.addColorStop(1, 'rgba(220, 38, 38, 0.9)');
          }

          return gradient;
        },
        hoverBorderColor: (context: any) => {
          const value = context.raw;
          return value >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)';
        },
        hoverBorderWidth: 3,
      },
    ],
  };
}
