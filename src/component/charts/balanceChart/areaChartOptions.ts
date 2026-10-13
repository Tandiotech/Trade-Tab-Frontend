import { SeparadorDecimal } from '../../../utils/SeparadorDecimal';

export default function area_chart_options(
  type = 1,
  toolTipText = '%',
  balanceMarkers = [],
  accounCurrency = ''
) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 20, 30, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#f1f5f9',
        borderColor: 'rgba(0, 230, 118, 0.4)',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 12, weight: '600' as const },
        bodyFont: { size: 12, weight: '500' as const },
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            let value = context.raw;
            const date = context.label; // Get the date from the tooltip context

            // Check if the date matches any balance marker
            const balanceMarker: any = balanceMarkers.find((marker: any) => marker.x === date);

            if (!isNaN(value)) {
              // If it's a deposit or withdrawal, indicate in the tooltip
              if (balanceMarker) {
                const markerType = balanceMarker.type === 'deposit' ? 'Deposit' : 'Withdrawal';
                const balanceChangeValue = balanceMarker.value;

                // Return an array of strings for the tooltip
                return [
                  `${markerType}: ${SeparadorDecimal(balanceChangeValue.toFixed(0))} ${accounCurrency}`,
                  `${SeparadorDecimal(value.toFixed(0))} ${toolTipText}`,
                ];
              }

              // Default case
              return type === 1
                ? `${SeparadorDecimal(value.toFixed(1))} ${toolTipText}`
                : `${value.toFixed(1)}${toolTipText}`;
            }
            return value;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: 'rgba(255, 255, 255, 0.35)',
          maxRotation: 0,
        },
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.04)',
          lineWidth: 1,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.35)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          lineWidth: 1,
          drawBorder: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.35,
        borderWidth: 2,
      },
      point: {
        radius: (context: any) => {
          const index = context.dataIndex;
          const label = context.chart.data.labels[index];
          const balanceMarker: any = balanceMarkers.find((marker: any) => marker.x === label);
          return balanceMarker ? 4 : 0;
        },
        hoverRadius: (context: any) => {
          const index = context.dataIndex;
          const label = context.chart.data.labels[index];
          const balanceMarker: any = balanceMarkers.find((marker: any) => marker.x === label);
          return balanceMarker ? 8 : 4;
        },
      },
    },
  };
}
