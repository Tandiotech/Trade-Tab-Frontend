import { useEffect, useState, useRef, useCallback } from 'react';
import { http } from '@/utils/http_request';
import CandlestickChart from './candleStickChart/CandlestickChart';

interface Trade {
  _id?: string;
  symbol: string;
  profit: number;
  pips: number;
  openPrice: number;
  closePrice: number;
  volume: number;
  durationInMinutes: number;
  openTime: string;
  closeTime: string;
}

interface CandleData {
  x: Date;
  y: number[];
}

interface TradeDetailsChartProps {
  trades: Trade[];
}

/** Full Apex chart height (toolbar + plot + x-axis labels) */
export const JOURNAL_CANDLE_CHART_HEIGHT = 400;

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function formatSymbol(symbol: string): string {
  const noTrailingM = symbol.endsWith('m') ? symbol.slice(0, -1) : symbol;
  if (noTrailingM.toUpperCase() === 'GOLD') return 'XAU/USD';
  if (noTrailingM.length === 6) return `${noTrailingM.slice(0, 3)}/${noTrailingM.slice(3)}`;
  return noTrailingM;
}

const TradeDetailsChart: React.FC<TradeDetailsChartProps> = ({ trades }) => {
  const widthRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [interval, setInterval] = useState('1day');

  const measureWidth = useCallback(() => {
    const el = widthRef.current;
    if (!el) return;
    const nextWidth = el.clientWidth;
    if (nextWidth > 0) setWidth(nextWidth);
  }, []);

  useEffect(() => {
    measureWidth();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(measureWidth);
    });

    const el = widthRef.current;
    if (el) resizeObserver.observe(el);

    window.addEventListener('resize', measureWidth);

    return () => {
      if (el) resizeObserver.unobserve(el);
      window.removeEventListener('resize', measureWidth);
    };
  }, [measureWidth]);

  useEffect(() => {
    const fetchData = async () => {
      if (!trades?.length) {
        setChartData([]);
        setLoading(false);
        setFetchError(false);
        return;
      }

      try {
        setLoading(true);
        setFetchError(false);

        const { symbol, openTime, closeTime } = trades[0];
        const formattedSymbol = formatSymbol(symbol);

        const openDate = new Date(openTime);
        const closeDate = new Date(closeTime);
        const extendedStartDate = new Date(openDate.getTime() - 3 * 24 * 60 * 60 * 1000);
        const extendedEndDate = new Date(closeDate.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Market data goes through the backend proxy so the provider key stays server-side.
        const response = await http.get('/market/time-series', {
          params: {
            symbol: formattedSymbol,
            interval,
            start_date: formatDate(extendedStartDate),
            end_date: formatDate(extendedEndDate),
          },
        });

        const apiData = response.data?.values ?? [];

        if (!apiData.length) {
          setChartData([]);
          setLoading(false);
          requestAnimationFrame(measureWidth);
          return;
        }

        const formattedData = apiData
          .map((d: { datetime: string; open: string; high: string; low: string; close: string }) => ({
            x: new Date(d.datetime),
            y: [
              parseFloat(d.open),
              parseFloat(d.high),
              parseFloat(d.low),
              parseFloat(d.close),
            ],
          }))
          .filter((d: CandleData) => !Number.isNaN(d.x.getTime()));

        formattedData.sort((a: CandleData, b: CandleData) => a.x.getTime() - b.x.getTime());
        setChartData(formattedData);
        setLoading(false);
        requestAnimationFrame(measureWidth);
      } catch (error) {
        console.error('Error fetching candlestick data:', error);
        setChartData([]);
        setFetchError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [trades, interval, measureWidth]);

  if (!trades?.length) {
    return null;
  }

  const ready = width > 0;

  return (
    <div className='tt-journal-candle w-full' ref={widthRef}>
      <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--tt-fg-3)]'>
        Market candlestick chart
      </p>

      {!ready && (
        <div
          className='flex items-center justify-center text-sm text-[var(--tt-fg-3)]'
          style={{ height: JOURNAL_CANDLE_CHART_HEIGHT + 44 }}
        >
          Preparing chart…
        </div>
      )}

      {ready && fetchError && !loading && (
        <div
          className='flex items-center justify-center px-4 text-center text-sm text-[var(--tt-fg-3)]'
          style={{ height: JOURNAL_CANDLE_CHART_HEIGHT + 44 }}
        >
          Could not load market data. Try another interval or check your connection.
        </div>
      )}

      {ready && !fetchError && (
        <CandlestickChart
          width={width}
          chartHeight={JOURNAL_CANDLE_CHART_HEIGHT}
          symbol={trades[0].symbol}
          openTime={trades[0].openTime}
          closeTime={trades[0].closeTime}
          chartData={chartData}
          loading={loading}
          interval={interval}
          setInterval={setInterval}
        />
      )}
    </div>
  );
};

export default TradeDetailsChart;
