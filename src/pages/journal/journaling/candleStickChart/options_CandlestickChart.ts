type CandlestickOptionsParams = {
  chartHeight: number;
  openTime: string;
  closeTime: string;
};

export function option_candlestickChart({
  chartHeight,
  openTime,
  closeTime,
}: CandlestickOptionsParams) {
  const tradeStart = new Date(openTime).getTime();
  const tradeEnd = new Date(closeTime).getTime();

  return {
    chart: {
      type: 'candlestick' as const,
      height: chartHeight,
      background: 'transparent',
      foreColor: 'var(--tt-fg-2)',
      fontFamily: 'var(--tt-sans)',
      toolbar: {
        show: true,
        offsetY: -4,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: { enabled: false },
    },
    title: { show: false },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        style: { colors: 'var(--tt-fg-3)', fontSize: '11px' },
      },
      axisBorder: { color: 'var(--tt-line-1)' },
      axisTicks: { color: 'var(--tt-line-1)' },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        style: { colors: 'var(--tt-fg-3)', fontSize: '11px' },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: 'var(--tt-profit)',
          downward: 'var(--tt-loss)',
        },
        wick: { useFillColor: true },
      },
    },
    grid: {
      borderColor: 'var(--tt-line-1)',
      strokeDashArray: 4,
      padding: {
        top: 8,
        right: 12,
        bottom: 16,
        left: 8,
      },
    },
    tooltip: { theme: 'dark' },
    annotations: {
      xaxis: [
        {
          x: tradeStart,
          x2: tradeEnd,
          fillColor: 'oklch(from var(--tt-brand) l c h / 0.12)',
          borderColor: 'oklch(from var(--tt-brand) l c h / 0.35)',
          label: {
            borderColor: 'var(--tt-line-2)',
            style: {
              color: 'var(--tt-fg-0)',
              background: 'var(--tt-bg-2)',
              fontSize: '10px',
            },
            text: 'Trade window',
          },
        },
      ],
    },
  };
}
