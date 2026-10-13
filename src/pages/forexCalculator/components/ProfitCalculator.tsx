import { useEffect, useMemo, useRef, useState } from 'react';
import SelectCurrencyPairs from '@/component/profitSizeCalculator/SelectCurrencys';

const QUICK_PAIR_PRESETS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'XAU/USD', 'US30', 'DAXEUR'];
const LOT_SIZE_PRESETS = ['0.01', '0.10', '0.25', '0.50', '1.00', '2.00'];

type TradeDirection = 'buy' | 'sell';

interface ProfitResult {
  pips: number;
  pipValue: number;
  profit: number;
  isProfit: boolean;
}

const formatWithGrouping = (value: number, options?: Intl.NumberFormatOptions): string => {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(value);
};

const parseNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const getPipSize = (pair: string): number => {
  if (pair === 'US30' || pair === 'DAXEUR') {
    return 1; // Indices use whole points
  }
  if (pair === 'XAU/USD' || pair === 'XAG/USD' || pair === 'WTI/USD' || pair === 'BRENT/USD') {
    return 1; // Commodities use whole points
  }
  if (pair.includes('JPY')) {
    return 0.01;
  }
  return 0.0001;
};

const computeProfit = ({
  entry,
  exit,
  lotSize,
  pair,
  direction
}: {
  entry: string;
  exit: string;
  lotSize: string;
  pair: string;
  direction: TradeDirection;
}): ProfitResult | null => {
  const entryValue = parseNumber(entry);
  const exitValue = parseNumber(exit);
  const lotValue = parseNumber(lotSize);

  if (entryValue === null || exitValue === null || lotValue === null || lotValue <= 0) {
    return null;
  }

  const pipSize = getPipSize(pair);
  const priceDiff = direction === 'buy' ? exitValue - entryValue : entryValue - exitValue;
  const pips = Math.abs(priceDiff / pipSize);
  
  // Calculate pip value based on pair type
  let pipValue: number;
  if (pair === 'US30' || pair === 'DAXEUR') {
    // Indices: 1 point = $1 per contract
    pipValue = lotValue * 1;
  } else if (pair === 'XAU/USD') {
    // Gold: 1 lot = 100 oz, $1 move = $100 per lot
    pipValue = lotValue * 100;
  } else if (pair === 'XAG/USD') {
    // Silver: 1 lot = 5,000 oz, $1 move = $5,000 per lot
    pipValue = lotValue * 5000;
  } else if (pair === 'WTI/USD' || pair === 'BRENT/USD') {
    // Oil: 1 lot = 1,000 barrels, $1 move = $1,000 per lot
    pipValue = lotValue * 1000;
  } else {
    // Standard forex: 1 lot = $10 per pip
    pipValue = lotValue * 10;
  }
  
  const profit = pips * pipValue * (priceDiff >= 0 ? 1 : -1);

  return {
    pips,
    pipValue,
    profit,
    isProfit: profit >= 0
  };
};

const getPlaceholders = (pair: string, direction: TradeDirection) => {
  if (pair === 'US30') {
    return {
      entry: direction === 'buy' ? '35000.00' : '35100.00',
      exit: direction === 'buy' ? '35100.00' : '35000.00'
    };
  }

  if (pair === 'DAXEUR') {
    return {
      entry: direction === 'buy' ? '16000.00' : '16100.00',
      exit: direction === 'buy' ? '16100.00' : '16000.00'
    };
  }

  if (pair === 'XAU/USD') {
    return {
      entry: direction === 'buy' ? '2025.50' : '2035.25',
      exit: direction === 'buy' ? '2035.25' : '2025.50'
    };
  }

  if (pair.includes('JPY')) {
    return {
      entry: direction === 'buy' ? '148.50' : '149.25',
      exit: direction === 'buy' ? '149.25' : '148.50'
    };
  }

  return {
    entry: direction === 'buy' ? '1.0850' : '1.0950',
    exit: direction === 'buy' ? '1.0950' : '1.0850'
  };
};

export default function ProfitCalculator(): JSX.Element {
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');
  const [direction, setDirection] = useState<TradeDirection>('buy');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [exitPrice, setExitPrice] = useState<string>('');
  const [lotSize, setLotSize] = useState<string>('1.00');
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        tooltipButtonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !tooltipButtonRef.current.contains(event.target as Node)
      ) {
        setIsTooltipOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const result = useMemo(
    () =>
      computeProfit({
        entry: entryPrice,
        exit: exitPrice,
        lotSize,
        pair: selectedPair,
        direction
      }),
    [entryPrice, exitPrice, lotSize, selectedPair, direction]
  );

  const placeholders = useMemo(
    () => getPlaceholders(selectedPair, direction),
    [selectedPair, direction]
  );

  const directionCopy =
    direction === 'buy'
      ? 'Buying — profit when price rises'
      : 'Selling — profit when price drops';

  return (
    <section className='rounded-3xl border border-white/10 bg-darkblack-800/80 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10'>
      <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-start'>
        <div className='space-y-8'>
          <header className='space-y-3 text-center lg:text-left'>
            <span className='inline-flex items-center gap-2 self-start rounded-full border border-tradetab-lime/40 bg-tradetab-lime/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-tradetab-lime'>
              Outcome Planner
            </span>
            <h2 className='text-2xl font-semibold text-white sm:text-3xl'>
              Profit & Loss Calculator
            </h2>
            <p className='mx-auto max-w-2xl text-sm text-gray-300 sm:text-base lg:mx-0'>
              Model trade outcomes before they happen. Compare entry and exit scenarios by adjusting
              direction, prices, and lot size to understand the potential reward or drawdown.
            </p>
          </header>

          <div className='space-y-6 rounded-3xl border border-white/10 bg-darkblack-700/70 p-6 shadow-inner sm:p-7'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-200'>Trading pair</label>
                <span className='text-xs text-gray-400'>FX, metals & indices supported</span>
              </div>
              <SelectCurrencyPairs
                currencyPair={selectedPair}
                setCurrencyPair={pair => setSelectedPair(pair)}
                hideLabel
              />
              <div className='flex flex-wrap gap-2'>
                {QUICK_PAIR_PRESETS.map(pair => (
                  <button
                    key={pair}
                    type='button'
                    onClick={() => setSelectedPair(pair)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      selectedPair === pair
                        ? 'border-tradetab-lime bg-tradetab-lime/20 text-white shadow-[0_0_0_1px_rgba(79,185,130,0.3)]'
                        : 'border-white/10 bg-white/5 text-gray-200 hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10'
                    }`}
                  >
                    {pair}
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <label className='text-sm font-medium text-gray-200'>Trade direction</label>
              <div className='grid grid-cols-2 gap-3'>
                {(['buy', 'sell'] as TradeDirection[]).map(option => {
                  const isActive = direction === option;
                  return (
                    <button
                      key={option}
                      type='button'
                      onClick={() => setDirection(option)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tradetab-lime ${
                        isActive
                          ? option === 'buy'
                            ? 'border-tradetab-lime bg-tradetab-lime/20 text-white shadow-[0_0_0_1px_rgba(79,185,130,0.3)]'
                            : 'border-red-400 bg-red-500/20 text-red-100 shadow-[0_0_0_1px_rgba(248,113,113,0.35)]'
                          : 'border-white/10 bg-white/5 text-gray-200 hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10'
                      }`}
                    >
                      {option === 'buy' ? 'Buy (Long)' : 'Sell (Short)'}
                    </button>
                  );
                })}
              </div>
              <p className='text-xs text-gray-400'>{directionCopy}</p>
            </div>

            <div className='grid gap-5 sm:grid-cols-2'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-200'>Entry price</label>
                <input
                  type='text'
                  inputMode='decimal'
                  value={entryPrice}
                  onChange={event => {
                    const nextValue = event.target.value;
                    if (nextValue.split('.').length > 2) return;
                    setEntryPrice(nextValue);
                  }}
                  placeholder={placeholders.entry}
                  className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-200'>Exit price</label>
                <input
                  type='text'
                  inputMode='decimal'
                  value={exitPrice}
                  onChange={event => {
                    const nextValue = event.target.value;
                    if (nextValue.split('.').length > 2) return;
                    setExitPrice(nextValue);
                  }}
                  placeholder={placeholders.exit}
                  className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
                />
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-200'>Trade size (lots)</label>
                <div className='relative'>
                  <button
                    ref={tooltipButtonRef}
                    type='button'
                    onClick={() => setIsTooltipOpen(prev => !prev)}
                    className='flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-200 transition hover:border-tradetab-lime/40 hover:text-white'
                    aria-haspopup='dialog'
                    aria-expanded={isTooltipOpen}
                  >
                    ℹ️
                  </button>
                  {isTooltipOpen && (
                    <div
                      ref={tooltipRef}
                      className='absolute right-0 top-9 z-20 w-64 rounded-2xl border border-white/10 bg-darkblack-700/90 p-4 text-xs text-gray-200 shadow-xl backdrop-blur'
                    >
                      <p className='font-semibold text-white'>Lot size quick guide</p>
                      <ul className='mt-2 space-y-1 text-gray-300'>
                        <li>• Standard lot = 100,000 units (1.00)</li>
                        <li>• Mini lot = 10,000 units (0.10)</li>
                        <li>• Micro lot = 1,000 units (0.01)</li>
                      </ul>
                      <p className='mt-2 text-[11px] text-gray-400'>
                        Adjust lot size to keep your risk-per-trade consistent across instruments.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <input
                type='text'
                inputMode='decimal'
                value={lotSize}
                onChange={event => {
                  const nextValue = event.target.value;
                  if (nextValue.split('.').length > 2) return;
                  setLotSize(nextValue);
                }}
                placeholder='1.00'
                className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
              />
              <div className='flex flex-wrap gap-2'>
                {LOT_SIZE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    type='button'
                    onClick={() => setLotSize(preset)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      lotSize === preset
                        ? 'border-tradetab-lime bg-tradetab-lime/20 text-white shadow-[0_0_0_1px_rgba(79,185,130,0.3)]'
                        : 'border-white/10 bg-white/5 text-gray-200 hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='rounded-3xl border border-white/10 bg-darkblack-700/70 p-5 text-sm text-gray-300 shadow-inner'>
            <p className='font-medium text-white'>Tip for scenario planning</p>
            <p className='mt-2'>
              Test both bullish and bearish cases by toggling direction and swapping entry/exit
              levels. Combine these insights with the position size calculator to confirm the trade
              still aligns with your risk policy.
            </p>
          </div>
        </div>

        <aside className='space-y-5 rounded-3xl border border-white/10 bg-darkblack-700/70 p-6 text-center shadow-xl'>
          <div className='space-y-2 border-b border-white/10 pb-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.25em] text-tradetab-lime'>
              Projected outcome
            </p>
            <h3
              className={`text-3xl font-bold ${
                result ? (result.isProfit ? 'text-tradetab-lime' : 'text-red-300') : 'text-white'
              }`}
            >
              {result
                ? `${result.isProfit ? '+' : '-'}${formatWithGrouping(Math.abs(result.profit), {
                    style: 'currency',
                    currency: 'USD'
                  })}`
                : '—'}
            </h3>
            <p className='text-xs text-gray-400'>Excludes fees, swaps, and slippage</p>
          </div>

          <div className='space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200'>
            <div className='flex items-center justify-between text-xs'>
              <span className='uppercase tracking-[0.2em] text-gray-400'>Pair & Direction</span>
              <span className='font-semibold text-white text-right'>
                {selectedPair} • {direction === 'buy' ? 'Long' : 'Short'}
              </span>
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span className='uppercase tracking-[0.2em] text-gray-400'>Pips captured</span>
              <span className='font-semibold text-white'>
                {result ? formatWithGrouping(result.pips, { minimumFractionDigits: 1 }) : '—'}
              </span>
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span className='uppercase tracking-[0.2em] text-gray-400'>Pip value</span>
              <span className='font-semibold text-white'>
                {result
                  ? formatWithGrouping(result.pipValue, {
                      style: 'currency',
                      currency: 'USD'
                    })
                  : '—'}
              </span>
            </div>
          </div>

          {!result && (
            <div className='rounded-2xl border border-tradetab-lime/30 bg-tradetab-lime/10 px-4 py-3 text-xs text-tradetab-lime'>
              Enter entry, exit, and lot size to preview the projected profit or loss for this
              scenario.
            </div>
          )}

          <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-400'>
            * Calculations assume standard FX contract sizes (100,000 units). Check broker docs for
            instrument-specific pip values when trading indices or synthetic products.
          </div>
        </aside>
      </div>
    </section>
  );
}
