import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiBarChartAlt2, BiTrendingUp, BiDollar, BiRefresh } from 'react-icons/bi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import VerticalColumnChart from '../../charts/VerticalColumnsChart';
import MostSuccessfulChart from '../../charts/mostSuccessfulChart/MostSuccessfulChart';
import type { CurrencySummary, MetricData } from '../../../types/metrics';

export interface MostTradedAssetsProps {
  style?: boolean;
  metrics: MetricData;
  TRADES: any[];
}

type PairRow = { asset: string; value: number };

const DUMMY: PairRow[] = [
  { asset: 'USD/JPY', value: 150 },
  { asset: 'EUR/USD', value: 120 },
  { asset: 'GBP/USD', value: 100 },
  { asset: 'AUD/USD', value: 80 },
  { asset: 'USD/CAD', value: 70 },
];

function toPairRows(cs: CurrencySummary[] | undefined): PairRow[] {
  if (!Array.isArray(cs)) return [];
  return cs.map(c => ({
    asset: c?.currency || 'Unknown',
    value: c?.total?.trades || 0,
  }));
}

const MostTradedAssets = (props: MostTradedAssetsProps) => {
  const { metrics, TRADES, style } = props;
  const [mode, setMode] = useState<'cashFlow' | 'mostSuccessful'>('cashFlow');

  const { rows, stats } = useMemo(() => {
    const empty = !metrics || Object.keys(metrics).length === 0;
    const raw = empty ? DUMMY : toPairRows(metrics?.currencySummary);
    const sorted = [...raw].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    if (!sorted.length) return { rows: [] as PairRow[], stats: null };
    const totalTrades = sorted.reduce((s, r) => s + r.value, 0);
    return {
      rows: sorted,
      stats: {
        totalTrades,
        top: sorted[0],
        avgPerAsset: totalTrades / sorted.length,
        count: sorted.length,
      },
    };
  }, [metrics]);

  const titleCls = style ? 'text-lg font-bold lg:text-xl' : 'text-xl font-bold md:text-2xl';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className='flex w-full max-w-full flex-col gap-4 rounded-xl border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.02)] p-4 transition-colors hover:border-[var(--tt-line-2)] md:gap-5 md:p-5'
    >
      <div className='flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='shrink-0 rounded-xl bg-[var(--tt-brand-dim)] p-2 text-[var(--tt-brand)]'>
            <BiBarChartAlt2 className='text-xl' />
          </div>
          <div className='min-w-0'>
            <h2 className={`tt-title text-[var(--tt-fg-0)] ${titleCls}`}>
              {mode === 'cashFlow' ? 'Most Traded Assets' : 'Success rate by pair'}
            </h2>
            <p className='tt-subtitle mt-0.5 text-xs'>
              {mode === 'cashFlow' ? 'Volume by instrument' : 'Win rate by instrument'}
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={() => setMode(m => (m === 'cashFlow' ? 'mostSuccessful' : 'cashFlow'))}
          className='flex shrink-0 items-center gap-2 rounded-lg border border-[var(--tt-line-2)] bg-[var(--tt-bg-2)] px-3 py-2 text-sm font-medium text-[var(--tt-fg-0)] transition hover:border-[var(--tt-brand)]/40 hover:bg-[var(--tt-bg-1)]'
        >
          {mode === 'cashFlow' ? 'Most traded' : 'Most successful'}
          <MdOutlineKeyboardArrowDown
            className={`text-lg transition-transform ${mode === 'mostSuccessful' ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {stats && (
        <div className='grid shrink-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4'>
          {(
            [
              {
                k: 't',
                label: 'Total trades',
                v: stats.totalTrades,
                c: 'text-[var(--tt-fg-0)]',
                I: BiBarChartAlt2,
                ic: 'text-[var(--tt-brand)]',
              },
              {
                k: 'p',
                label: 'Top asset',
                v: stats.top.asset,
                sub: `${stats.top.value} trades`,
                c: 'text-[var(--tt-profit)]',
                I: BiTrendingUp,
                ic: 'text-[var(--tt-profit)]',
              },
              {
                k: 'a',
                label: 'Avg / asset',
                v: stats.avgPerAsset.toFixed(1),
                c: 'text-[var(--tt-fg-0)]',
                I: BiDollar,
                ic: 'text-cyan-400',
              },
              { k: 'n', label: 'Assets', v: stats.count, c: 'text-[var(--tt-fg-0)]', I: BiRefresh, ic: 'text-sky-400' },
            ] as const
          ).map(({ k, label, v, c, I: Icon, ic, ...rest }) => (
            <div
              key={k}
              className='flex flex-col rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)]/80 p-3'
            >
              <div className='mb-1 flex items-center gap-2'>
                <Icon className={`text-sm ${ic}`} />
                <span className='text-[11px] font-medium uppercase tracking-wide text-[var(--tt-fg-3)]'>
                  {label}
                </span>
              </div>
              <p className={`truncate text-base font-bold md:text-lg ${c}`}>{v}</p>
              {'sub' in rest && rest.sub ? (
                <p className='truncate text-xs text-[var(--tt-fg-3)]'>{rest.sub}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Bounded height: list scrolls inside; avoids stretching the whole dashboard row */}
      <div className='relative z-0 h-[min(18rem,36vh)] max-h-[360px] min-h-[200px] w-full sm:h-[min(19rem,38vh)]'>
        <AnimatePresence mode='wait'>
          {mode === 'cashFlow' ? (
            <motion.div
              key='cf'
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className='flex h-full min-h-0 w-full flex-col'
            >
              <VerticalColumnChart currencySummary={rows} />
            </motion.div>
          ) : TRADES.length > 0 ? (
            <motion.div
              key='ms'
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className='flex h-full min-h-0 w-full flex-col'
            >
              <MostSuccessfulChart trades={TRADES} />
            </motion.div>
          ) : (
            <motion.p
              key='empty'
              className='py-8 text-center text-sm text-[var(--tt-fg-3)]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No trades for this view.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MostTradedAssets;
