import Chart from 'react-apexcharts';
import { option_candlestickChart } from './options_CandlestickChart';

interface CandleData {
  x: Date;
  y: number[];
}

interface CandlestickChartProps {
  width: number;
  chartHeight: number;
  symbol: string;
  openTime: string;
  closeTime: string;
  chartData: CandleData[];
  loading: boolean;
  interval: string;
  setInterval: (interval: string) => void;
}

function formatSymbol(symbol: string): string {
  const noTrailingM = symbol.endsWith('m') ? symbol.slice(0, -1) : symbol;
  if (noTrailingM.toUpperCase() === 'GOLD') return 'XAU/USD';
  if (noTrailingM.length === 6) return `${noTrailingM.slice(0, 3)}/${noTrailingM.slice(3)}`;
  return noTrailingM;
}

const INTERVAL_BAR_HEIGHT = 44;

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  width,
  chartHeight,
  symbol,
  openTime,
  closeTime,
  chartData,
  loading,
  interval,
  setInterval,
}) => {
  const formattedSymbol = formatSymbol(symbol);
  const safeWidth = Math.max(width, 280);
  const safeChartHeight = Math.max(chartHeight, 280);

  return (
    <div
      className='flex w-full flex-col rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)]'
      style={{ width: '100%', maxWidth: safeWidth }}
    >
      <div
        className='flex shrink-0 items-center justify-between gap-2 border-b border-[var(--tt-line-1)] px-3 py-2'
        style={{ minHeight: INTERVAL_BAR_HEIGHT }}
      >
        <div className='min-w-0'>
          <span className='text-xs font-medium text-[var(--tt-fg-2)]'>Interval</span>
          <p className='truncate text-sm font-semibold text-[var(--tt-fg-0)]'>{formattedSymbol}</p>
        </div>
        <select
          id='interval-select'
          value={interval}
          onChange={e => setInterval(e.target.value)}
          className='shrink-0 rounded-md border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] px-2 py-1 text-xs text-[var(--tt-fg-1)] focus:border-[var(--tt-brand)] focus:outline-none'
        >
          <option value='4h'>4 hours</option>
          <option value='1day'>1 day</option>
        </select>
      </div>

      <div
        className='tt-journal-candle__plot relative w-full'
        style={{ height: safeChartHeight, minHeight: safeChartHeight }}
      >
        {loading ? (
          <div className='flex h-full items-center justify-center text-sm text-[var(--tt-fg-3)]'>
            Loading chart…
          </div>
        ) : chartData.length === 0 ? (
          <div className='flex h-full items-center justify-center px-4 text-center text-sm text-[var(--tt-fg-3)]'>
            No market data for this symbol and date range.
          </div>
        ) : (
          <Chart
            options={option_candlestickChart({
              chartHeight: safeChartHeight,
              openTime,
              closeTime,
            })}
            series={[{ data: chartData }]}
            type='candlestick'
            height={safeChartHeight}
            width={safeWidth}
          />
        )}
      </div>
    </div>
  );
};

export default CandlestickChart;
