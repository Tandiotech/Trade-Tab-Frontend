import { useEffect, useMemo, useRef, useState } from 'react';
import SelectCurrencyPairs from '@/component/profitSizeCalculator/SelectCurrencys';

const QUICK_PAIR_PRESETS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'XAU/USD', 'US30', 'DAXEUR'];
const LOT_SIZE_PRESETS = ['0.01', '0.1', '0.25', '0.5', '1.0', '2.0'];

const formatWithGrouping = (value: number): string =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const derivePipValue = (pair: string, lotSize: number): number => {
  if (!Number.isFinite(lotSize) || lotSize <= 0) return 0;

  // Indices: 1 point = $1 per contract
  if (pair === 'US30' || pair === 'DAXEUR') {
    return lotSize * 1;
  }

  const tradeSize = lotSize * 100000;

  if (pair === 'XAU/USD') {
    return (0.01 * tradeSize) / 100;
  }

  if (pair.includes('JPY')) {
    return (0.01 * tradeSize) / 100;
  }

  return (0.0001 * tradeSize) / 1;
};

export default function PipCalculator(): JSX.Element {
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');
  const [lotSizeInput, setLotSizeInput] = useState<string>('1.0');
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsTooltipOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const lotSizeValue = useMemo(() => {
    const parsed = Number(lotSizeInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed;
  }, [lotSizeInput]);

  const pipValue = useMemo(() => {
    if (!lotSizeValue) return null;
    const value = derivePipValue(selectedPair, lotSizeValue);
    return Number.isFinite(value) && value > 0 ? value : null;
  }, [lotSizeValue, selectedPair]);

  const getRiskContext = (pair: string): string => {
    if (pair === 'US30' || pair === 'DAXEUR') {
      return 'Indices use whole points (1.0).';
    }
    if (pair === 'XAU/USD' || pair === 'XAG/USD' || pair === 'WTI/USD' || pair === 'BRENT/USD') {
      return 'Commodities use whole points (1.0).';
    }
    if (pair.includes('JPY')) {
      return 'Pairs quoting JPY use a larger pip size (0.01).';
    }
    return 'Most FX pairs use a pip size of 0.0001.';
  };

  return (
    <section className='rounded-3xl border border-white/10 bg-darkblack-800/80 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10'>
      <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-start'>
        <div className='space-y-8'>
          <header className='space-y-3 text-center lg:text-left'>
            <span className='inline-flex items-center gap-2 self-start rounded-full border border-tradetab-lime/40 bg-tradetab-lime/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-tradetab-lime'>
              Pip Insight
            </span>
            <h2 className='text-2xl font-semibold text-white sm:text-3xl'>Pip Value Calculator</h2>
            <p className='mx-auto max-w-2xl text-sm text-gray-300 sm:text-base lg:mx-0'>
              Understand exactly how much each pip move is worth for your position size. Perfect for validating stop-loss distance and profit targets.
            </p>
          </header>

          <div className='space-y-6 rounded-3xl border border-white/10 bg-darkblack-700/70 p-6 shadow-inner sm:p-7'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-200'>Trading pair</label>
                <span className='text-xs text-gray-400'>FX, commodities & indices supported</span>
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
              <div className='flex items-center justify-between'>
                <div>
                  <label className='text-sm font-medium text-gray-200'>Trade size (lots)</label>
                  <p className='text-xs text-gray-400'>Adjust size or pick a preset below.</p>
                </div>
                <div className='relative'>
                  <button
                    ref={buttonRef}
                    type='button'
                    onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                    className='flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-200 transition hover:border-tradetab-lime/40 hover:text-white'
                    aria-haspopup='dialog'
                    aria-expanded={isTooltipOpen}
                  >
                    ℹ️
                  </button>
                  {isTooltipOpen && (
                    <div
                      ref={tooltipRef}
                      className='absolute right-0 top-9 z-10 w-64 rounded-2xl border border-white/10 bg-darkblack-700/90 p-4 text-xs text-gray-200 shadow-xl backdrop-blur'
                    >
                      <p className='font-semibold text-white'>Lot size quick guide</p>
                      <ul className='mt-2 space-y-1 text-gray-300'>
                        <li>• Standard lot = 100,000 units (1.00)</li>
                        <li>• Mini lot = 10,000 units (0.10)</li>
                        <li>• Micro lot = 1,000 units (0.01)</li>
                      </ul>
                      <p className='mt-2 text-[11px] text-gray-400'>
                        Tip: reduce lot size when trading volatile pairs to keep risk consistent.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <input
                type='text'
                inputMode='decimal'
                value={lotSizeInput}
                onChange={event => {
                  const nextValue = event.target.value;
                  if (nextValue.split('.').length > 2) return;
                  setLotSizeInput(nextValue);
                }}
                placeholder='e.g. 0.50'
                className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-base text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
              />
              <div className='flex flex-wrap gap-2'>
                {LOT_SIZE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    type='button'
                    onClick={() => setLotSizeInput(preset)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      lotSizeInput === preset
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
            <p className='font-medium text-white'>Why pip value matters</p>
            <p className='mt-2'>
              Knowing the pip value helps you align stop losses, risk-per-trade, and profit targets across different instruments. Combine this with the position size calculator for a complete risk workflow.
            </p>
          </div>
        </div>

        <aside className='space-y-5 rounded-3xl border border-white/10 bg-darkblack-700/70 p-6 text-center shadow-xl'>
          <div className='space-y-2 border-b border-white/10 pb-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.25em] text-tradetab-lime'>
              Estimated pip value
            </p>
            <h3 className='text-3xl font-bold text-white'>
              {pipValue !== null ? formatWithGrouping(pipValue) : '—'}
            </h3>
            <p className='text-xs text-gray-400'>Per pip move in {selectedPair}</p>
          </div>

          <div className='space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200'>
            <div className='flex items-center justify-between text-xs'>
              <span className='uppercase tracking-[0.2em] text-gray-400'>Lot size</span>
              <span className='font-semibold text-white'>{lotSizeValue ?? '—'} lots</span>
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span className='uppercase tracking-[0.2em] text-gray-400'>Context</span>
              <span className='text-right text-gray-200'>{getRiskContext(selectedPair)}</span>
            </div>
          </div>

          <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-400'>
            * These values assume standard contract sizes. Brokers may quote different pip steps for metals or synthetic instruments—verify specifics before placing trades.
          </div>
        </aside>
      </div>
    </section>
  );
}
