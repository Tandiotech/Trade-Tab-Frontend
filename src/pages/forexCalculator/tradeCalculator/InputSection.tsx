import SelectCurrencyPairs from '@/component/profitSizeCalculator/SelectCurrencys';
import Tooltip from '../common/Tooltip';
import {
  TradeDirection,
  getPlaceholders,
  getDisclaimerText,
  getTooltipContent,
  getLeverageTooltipContent,
} from './utils';

interface InputSectionProps {
  accountSize: string;
  setAccountSize: (value: string) => void;
  entryPrice: string;
  setEntryPrice: (value: string) => void;
  stopLoss: string;
  setStopLoss: (value: string) => void;
  takeProfit: string;
  setTakeProfit: (value: string) => void;
  lotSize: string;
  setLotSize: (value: string) => void;
  direction: TradeDirection;
  setDirection: (value: TradeDirection) => void;
  pair: string;
  setPair: (value: string) => void;
  leverage: string;
  setLeverage: (value: string) => void;
  tradingFees: string;
  setTradingFees: (value: string) => void;
  validationError: string | null;
  isCalculating?: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  accountSize,
  setAccountSize,
  entryPrice,
  setEntryPrice,
  stopLoss,
  setStopLoss,
  takeProfit,
  setTakeProfit,
  lotSize,
  setLotSize,
  direction,
  setDirection,
  pair,
  setPair,
  leverage,
  setLeverage,
  tradingFees,
  setTradingFees,
  validationError,
  isCalculating = false,
}) => {
  const handleQuickSelect = (value: string): void => {
    setLotSize(value);
  };

  const handleQuickSelectLeverage = (value: string): void => {
    setLeverage(value);
  };

  const placeholders = getPlaceholders(pair, direction);
  const disclaimerText = getDisclaimerText(pair);
  const tooltipContent = getTooltipContent(pair);
  const leverageTooltip = getLeverageTooltipContent();
  const feesTooltip =
    'Enter the total trading fees (spread, commissions, swaps) in your account currency. This will be deducted from both profit and loss calculations.';

  return (
    <form
      className='space-y-8 rounded-3xl border border-white/10 bg-darkblack-700/70 p-6 shadow-inner sm:p-7'
      onSubmit={e => e.preventDefault()}
      role='form'
      aria-label='Trade Parameters'
    >
      {isCalculating && (
        <div className='flex items-center gap-2 rounded-2xl border border-tradetab-lime/40 bg-tradetab-lime/10 px-3 py-2 text-xs text-tradetab-lime'>
          <svg
            className='h-4 w-4 animate-spin text-tradetab-lime'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
          Calculating updated metrics…
        </div>
      )}

      {validationError && (
        <div
          className='rounded-2xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-xs text-red-200'
          role='alert'
          aria-live='assertive'
        >
          <span className='font-semibold text-red-300'>Heads up:</span> {validationError}
        </div>
      )}

      <div className='space-y-5'>
        <div className='space-y-2'>
          <label htmlFor='account-size' className='text-sm font-medium text-gray-200'>
            Account size
          </label>
          <input
            id='account-size'
            type='text'
            className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
            value={accountSize}
            onChange={e => setAccountSize(e.target.value)}
            placeholder='e.g. 10,000'
            inputMode='decimal'
            min='0'
          />
          <p className='text-xs text-gray-500'>Use your live balance or the portion allocated to this trade.</p>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <label htmlFor='currency-pair' className='text-sm font-medium text-gray-200'>
              Trading pair
            </label>
            <span className='text-xs text-gray-400'>FX, metals & energy supported</span>
          </div>
          <SelectCurrencyPairs currencyPair={pair} setCurrencyPair={setPair} hideLabel />
        </div>

        <div className='space-y-3' role='radiogroup' aria-labelledby='direction-label'>
          <p id='direction-label' className='text-sm font-medium text-gray-200'>
            Trade direction
          </p>
          <div className='grid grid-cols-2 gap-3'>
            {(['buy', 'sell'] as const).map(d => {
              const isActive = direction === d;
              return (
                <button
                  key={d}
                  type='button'
                  onClick={() => setDirection(d)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tradetab-lime ${
                    isActive
                      ? d === 'buy'
                        ? 'border-tradetab-lime bg-tradetab-lime/20 text-white shadow-[0_0_0_1px_rgba(79,185,130,0.3)]'
                        : 'border-red-400 bg-red-500/20 text-red-100 shadow-[0_0_0_1px_rgba(248,113,113,0.35)]'
                      : 'border-white/10 bg-white/5 text-gray-200 hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10'
                  }`}
                  aria-pressed={isActive}
                  aria-label={`${d} direction`}
                >
                  {d === 'buy' ? 'Buy (Long)' : 'Sell (Short)'}
                </button>
              );
            })}
          </div>
          <p className='text-xs text-gray-400'>
            {direction === 'buy' ? 'Earn when price rises above entry.' : 'Earn when price falls below entry.'}
          </p>
        </div>
      </div>

      <div className='grid gap-5 sm:grid-cols-2'>
        <div className='space-y-2'>
          <label htmlFor='entry-price' className='text-sm font-medium text-gray-200'>
            Entry price
          </label>
          <input
            id='entry-price'
            type='text'
            inputMode='decimal'
            className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
            value={entryPrice}
            onChange={e => setEntryPrice(e.target.value)}
            placeholder={placeholders.entry}
          />
        </div>
        <div className='space-y-2'>
          <label htmlFor='take-profit' className='text-sm font-medium text-gray-200'>
            Take profit
          </label>
          <input
            id='take-profit'
            type='text'
            inputMode='decimal'
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40 ${
              validationError && validationError.includes('Take Profit')
                ? 'border-red-500 focus:border-red-500'
                : 'border-white/10 focus:border-tradetab-lime/60'
            }`}
            value={takeProfit}
            onChange={e => setTakeProfit(e.target.value)}
            placeholder={placeholders.takeProfit}
            aria-invalid={validationError?.includes('Take Profit') ? 'true' : 'false'}
          />
          <p className='text-xs text-gray-400'>
            {direction === 'buy' ? 'Target sits above your entry price.' : 'Target sits below your entry price.'}
          </p>
        </div>
        <div className='space-y-2'>
          <label htmlFor='stop-loss' className='text-sm font-medium text-gray-200'>
            Stop loss
          </label>
          <input
            id='stop-loss'
            type='text'
            inputMode='decimal'
            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40 ${
              validationError && validationError.includes('Stop Loss')
                ? 'border-red-500 focus:border-red-500'
                : 'border-white/10 focus:border-tradetab-lime/60'
            }`}
            value={stopLoss}
            onChange={e => setStopLoss(e.target.value)}
            placeholder={placeholders.stopLoss}
            aria-invalid={validationError?.includes('Stop Loss') ? 'true' : 'false'}
          />
          <p className='text-xs text-gray-400'>
            {direction === 'buy' ? 'Protect capital below entry.' : 'Protect capital above entry.'}
          </p>
        </div>
      </div>

      <div className='space-y-5'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label htmlFor='lot-size' className='text-sm font-medium text-gray-200'>
              Trade size (lots)
            </label>
            <Tooltip content={tooltipContent} id='lot-tooltip'>
              <button
                className='flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-200 transition hover:border-tradetab-lime/40 hover:text-white'
                aria-label='Information about lot sizes'
              >
                ℹ️
              </button>
            </Tooltip>
          </div>
          <input
            id='lot-size'
            type='text'
            inputMode='decimal'
            className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
            value={lotSize}
            onChange={e => setLotSize(e.target.value)}
            placeholder='1.00'
          />
          <div className='flex flex-wrap gap-2' role='group' aria-label='Quick lot size selection'>
            {['0.01', '0.10', '0.50', '1.00', '2.00'].map(value => (
              <button
                key={value}
                type='button'
                onClick={() => handleQuickSelect(value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  lotSize === value
                    ? 'border-tradetab-lime bg-tradetab-lime/20 text-white shadow-[0_0_0_1px_rgba(79,185,130,0.3)]'
                    : 'border-white/10 bg-white/5 text-gray-200 hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className='text-xs text-gray-400'>{disclaimerText}</p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label htmlFor='leverage' className='text-sm font-medium text-gray-200'>
              Leverage
            </label>
            <Tooltip content={leverageTooltip} id='leverage-tooltip'>
              <button
                className='flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-200 transition hover:border-tradetab-lime/40 hover:text-white'
                aria-label='Information about leverage'
              >
                ℹ️
              </button>
            </Tooltip>
          </div>
          <input
            id='leverage'
            type='text'
            inputMode='decimal'
            className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
            value={leverage}
            onChange={e => setLeverage(e.target.value)}
            placeholder='100'
          />
          <div className='flex flex-wrap gap-2' role='group' aria-label='Quick leverage selection'>
            {['50', '100', '200', '500'].map(value => (
              <button
                key={value}
                type='button'
                onClick={() => handleQuickSelectLeverage(value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  leverage === value
                    ? 'border-tradetab-lime bg-tradetab-lime/20 text-white shadow-[0_0_0_1px_rgba(79,185,130,0.3)]'
                    : 'border-white/10 bg-white/5 text-gray-200 hover:border-tradetab-lime/40 hover:bg-tradetab-lime/10'
                }`}
              >
                {value}:1
              </button>
            ))}
          </div>
          <p className='text-xs text-gray-400'>Higher leverage amplifies both gains and losses.</p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label htmlFor='trading-fees' className='text-sm font-medium text-gray-200'>
              Trading fees
            </label>
            <Tooltip content={feesTooltip} id='fees-tooltip'>
              <button
                className='flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-200 transition hover:border-tradetab-lime/40 hover:text-white'
                aria-label='Information about trading fees'
              >
                ℹ️
              </button>
            </Tooltip>
          </div>
          <input
            id='trading-fees'
            type='text'
            inputMode='decimal'
            className='w-full rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm text-white transition focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/40'
            value={tradingFees}
            onChange={e => setTradingFees(e.target.value)}
            placeholder='0'
          />
          <p className='text-xs text-gray-400'>Total spread, commission, and swaps expected for this trade.</p>
        </div>
      </div>

      <p className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-gray-400'>
        Results incorporate the fees above. Always confirm execution costs with your broker before placing the trade.
      </p>
    </form>
  );
};

export default InputSection;
