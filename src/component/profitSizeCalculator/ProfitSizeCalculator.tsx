import { useMemo, useState } from 'react';
import { TbReload } from 'react-icons/tb';
import SelectCurrency from '@/component/profitSizeCalculator/SelectCurrency';
import SelectCurrencyPairs from '@/component/profitSizeCalculator/SelectCurrencys';

const riskPresets = [0.5, 1, 2];
const stopLossPresets = [15, 25, 40];
const balancePresets = [1000, 5000, 10000];

const numericFromInput = (value: string): number | null => {
  const sanitized = value.replace(/[^0-9.]/g, '');
  if (!sanitized || sanitized === '.') return null;
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatWithGrouping = (value: number, options?: Intl.NumberFormatOptions): string => {
  if (!Number.isFinite(value)) return '—';
  const baseOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };

  try {
    return new Intl.NumberFormat('en-US', baseOptions).format(value);
  } catch (error) {
    // Fallback for cases where currency code is not supported
    const { style, currency, currencyDisplay, ...rest } = baseOptions;
    return new Intl.NumberFormat('en-US', rest).format(value);
  }
};

interface PositionSizeCalculatorProps {
  balance?: number;
  accountCurrency?: string;
  className?: string;
}

export default function PositionSizeCalculator({
  balance = 0,
  accountCurrency = 'USD',
  className = ''
}: PositionSizeCalculatorProps) {
  const [selectedAccountCurrency, setSelectedAccountCurrency] = useState<string>(accountCurrency);
  const [currencyPair, setCurrencyPair] = useState<string>('EUR/USD');
  const [accountSizeInput, setAccountSizeInput] = useState<string>(balance ? String(balance) : '');
  const [stopLossInput, setStopLossInput] = useState<string>('30');
  const [riskPercentInput, setRiskPercentInput] = useState<string>('1');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const accountSizeValue = useMemo(() => {
    const parsed = numericFromInput(accountSizeInput);
    if (parsed !== null) return parsed;
    return balance > 0 ? balance : 0;
  }, [accountSizeInput, balance]);

  const stopLossValue = useMemo(() => {
    const parsed = numericFromInput(stopLossInput);
    return parsed !== null ? parsed : 0;
  }, [stopLossInput]);

  const riskPercentValue = useMemo(() => {
    const parsed = numericFromInput(riskPercentInput);
    return parsed !== null ? parsed : 0;
  }, [riskPercentInput]);

  const canCalculate = accountSizeValue > 0 && stopLossValue > 0 && riskPercentValue > 0;

  const calculation = useMemo(() => {
    if (!canCalculate) {
      return null;
    }

    const riskAmount = (accountSizeValue * riskPercentValue) / 100;
    const pipValue = riskAmount / stopLossValue;
    const lotSize = pipValue / 10;

    return {
      lotSize,
      riskAmount,
      pipValue
    };
  }, [accountSizeValue, stopLossValue, riskPercentValue, canCalculate]);

  const handleAccountSizeChange = (value: string) => {
    setHasUserInteracted(true);
    if (value.split('.').length > 2) return;
    setAccountSizeInput(value);
  };

  const handleRiskPercentChange = (value: string) => {
    setHasUserInteracted(true);
    if (value.split('.').length > 2) return;
    setRiskPercentInput(value);
  };

  const handleStopLossChange = (value: string) => {
    setHasUserInteracted(true);
    if (value.split('.').length > 2) return;
    setStopLossInput(value);
  };

  const resetForm = () => {
    setSelectedAccountCurrency(accountCurrency);
    setCurrencyPair('EUR/USD');
    setAccountSizeInput(balance ? String(balance) : '');
    setStopLossInput('30');
    setRiskPercentInput('1');
    setHasUserInteracted(false);
  };

  return (
    <section
      className={`rounded-3xl border border-white/10 bg-darkblack-700/70 p-6 shadow-2xl backdrop-blur sm:p-8 ${className}`}
    >
      <div className='flex flex-col gap-8'>
        <header className='space-y-3 text-center lg:text-left'>
          <span className='inline-flex items-center gap-2 self-start rounded-full border border-tradetab-lime/40 bg-tradetab-lime/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-tradetab-lime'>
            Risk Engine
          </span>
          <h2 className='text-2xl font-semibold text-white sm:text-3xl'>
            Position Size Calculator
          </h2>
          <p className='mx-auto max-w-2xl text-sm text-gray-300 sm:text-base lg:mx-0'>
            Align your lot size with your capital, stop loss, and risk tolerance. Update any field to
            see the impact instantly—no extra clicks required.
          </p>
        </header>

        <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-start'>
          <div className='space-y-7'>
            <div className='grid gap-6 sm:grid-cols-2'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-200'>Account currency</label>
                <div className='rounded-2xl border border-white/10 bg-darkblack-800/80 p-4 shadow-inner'>
                  <SelectCurrency
                    accountCurrency={selectedAccountCurrency}
                    setAccountCurrency={currency => {
                      setHasUserInteracted(true);
                      setSelectedAccountCurrency(currency);
                    }}
                    hideLabel
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-200'>Trading pair</label>
                <div className='rounded-2xl border border-white/10 bg-darkblack-800/80 p-4 shadow-inner'>
                  <SelectCurrencyPairs
                    currencyPair={currencyPair}
                    setCurrencyPair={pair => {
                      setHasUserInteracted(true);
                      setCurrencyPair(pair);
                    }}
                    hideLabel
                  />
                </div>
              </div>
            </div>

            <div className='space-y-5 rounded-3xl border border-white/10 bg-darkblack-800/80 p-5 shadow-inner sm:p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <label className='block text-sm font-medium text-gray-200'>Account size</label>
                  <p className='text-xs text-gray-400'>
                    Enter your live balance or pick a preset to experiment.
                  </p>
                </div>
                {balance > 0 && (
                  <span className='rounded-full bg-tradetab-lime/10 px-3 py-1 text-xs font-semibold text-tradetab-lime'>
                    Current: {formatWithGrouping(balance)}
                  </span>
                )}
              </div>
              <input
                type='text'
                inputMode='decimal'
                value={accountSizeInput}
                onChange={event => handleAccountSizeChange(event.target.value)}
                placeholder='e.g. 5000'
                className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-base text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
              />
              <div className='flex flex-wrap gap-2'>
                {balancePresets.map(preset => (
                  <button
                    key={preset}
                    type='button'
                    className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200 transition hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10 hover:text-white'
                    onClick={() => {
                      setHasUserInteracted(true);
                      setAccountSizeInput(String(preset));
                    }}
                  >
                    {formatWithGrouping(preset, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </button>
                ))}
              </div>
            </div>

            <div className='grid gap-5 sm:grid-cols-2'>
              <div className='space-y-3 rounded-3xl border border-white/10 bg-darkblack-800/80 p-5 shadow-inner'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-gray-200'>Stop loss (pips)</label>
                  <span className='text-xs text-gray-400'>Precision matters</span>
                </div>
                <input
                  type='text'
                  inputMode='decimal'
                  value={stopLossInput}
                  onChange={event => handleStopLossChange(event.target.value)}
                  className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-base text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
                />
                <div className='flex flex-wrap gap-2'>
                  {stopLossPresets.map(preset => (
                    <button
                      key={preset}
                      type='button'
                      className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200 transition hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10 hover:text-white'
                      onClick={() => {
                        setHasUserInteracted(true);
                        setStopLossInput(String(preset));
                      }}
                    >
                      {preset} pips
                    </button>
                  ))}
                </div>
              </div>

              <div className='space-y-3 rounded-3xl border border-white/10 bg-darkblack-800/80 p-5 shadow-inner'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-gray-200'>Risk per trade (%)</label>
                  <span className='text-xs text-gray-400'>Keep it disciplined</span>
                </div>
                <input
                  type='text'
                  inputMode='decimal'
                  value={riskPercentInput}
                  onChange={event => handleRiskPercentChange(event.target.value)}
                  className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-base text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
                />
                <div className='flex flex-wrap gap-2'>
                  {riskPresets.map(preset => (
                    <button
                      key={preset}
                      type='button'
                      className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200 transition hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10 hover:text-white'
                      onClick={() => {
                        setHasUserInteracted(true);
                        setRiskPercentInput(String(preset));
                      }}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-darkblack-800/80 p-4 shadow-inner'>
              <div>
                <p className='text-sm font-medium text-white'>Want to start fresh?</p>
                <p className='text-xs text-gray-400'>
                  Reset the calculator to your defaults and try a new scenario.
                </p>
              </div>
              <button
                type='button'
                onClick={resetForm}
                className='inline-flex items-center gap-2 rounded-full border border-tradetab-lime/50 bg-tradetab-lime/15 px-4 py-2 text-sm font-semibold text-tradetab-lime transition hover:border-tradetab-lime hover:bg-tradetab-lime/25'
              >
                <TbReload size={16} />
                Reset inputs
              </button>
            </div>
          </div>

          <aside className='space-y-5 rounded-3xl border border-white/10 bg-darkblack-800/80 p-6 shadow-xl'>
            <div className='space-y-2 border-b border-white/10 pb-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.25em] text-tradetab-lime'>
                Snapshot
              </p>
              <h3 className='text-xl font-semibold text-white'>Your trade parameters</h3>
              <p className='text-sm text-gray-300'>
                {currencyPair} • Account in {selectedAccountCurrency}
              </p>
            </div>

            {calculation ? (
              <div className='space-y-4'>
                <div className='rounded-3xl border border-tradetab-lime/40 bg-tradetab-lime/15 p-5 text-center shadow-inner'>
                  <p className='text-xs font-semibold uppercase tracking-[0.25em] text-tradetab-lime'>
                    Recommended lot size
                  </p>
                  <p className='mt-2 text-4xl font-bold text-white'>
                    {formatWithGrouping(calculation.lotSize, { minimumFractionDigits: 2 })}
                  </p>
                  <p className='mt-1 text-sm text-gray-200'>standard lots</p>
                </div>

                <div className='grid gap-4'>
                  <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                    <p className='text-xs uppercase tracking-[0.2em] text-gray-400'>Risk amount</p>
                    <p className='mt-1 text-lg font-semibold text-white'>
                      {formatWithGrouping(calculation.riskAmount, {
                        style: 'currency',
                        currency: selectedAccountCurrency
                      })}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {riskPercentValue}% of {formatWithGrouping(accountSizeValue, { style: 'currency', currency: selectedAccountCurrency })}
                    </p>
                  </div>

                  <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                    <p className='text-xs uppercase tracking-[0.2em] text-gray-400'>Value per pip</p>
                    <p className='mt-1 text-lg font-semibold text-white'>
                      {formatWithGrouping(calculation.pipValue, {
                        style: 'currency',
                        currency: selectedAccountCurrency
                      })}
                    </p>
                    <p className='text-xs text-gray-400'>
                      Based on a {stopLossValue} pip stop loss.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-gray-300'>
                <p className='font-medium text-white'>Ready when you are</p>
                <p>
                  Enter your account size, stop loss, and risk percentage to unlock a tailored position
                  size. We will calculate the lot size, risk amount, and pip value instantly.
                </p>
                {!hasUserInteracted && (
                  <p className='rounded-2xl border border-tradetab-lime/30 bg-tradetab-lime/10 px-4 py-3 text-xs text-tradetab-lime'>
                    Tip: try the presets to explore different risk scenarios in seconds.
                  </p>
                )}
              </div>
            )}

            <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-400'>
              * Calculations assume standard FX contract sizes (100,000 units). For metals or CFDs, verify
              contract specifications with your broker.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
