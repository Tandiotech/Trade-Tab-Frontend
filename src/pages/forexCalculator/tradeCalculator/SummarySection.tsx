import { formatNumber, calculateRRRatio, getRiskLevelDescription, getPipTerm } from './utils';
import { TradeDirection } from './utils';

interface SummarySectionProps {
  riskPercentage: string | null;
  profitPercentage: string | null;
  estimatedLoss: number | null;
  estimatedProfit: number | null;
  netLoss: number | null;
  netProfit: number | null;
  pipsAtRisk: string | null;
  pipsProfit: string | null;
  pipValueLoss: string | null;
  accountSize: string;
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
  direction: TradeDirection;
  pair: string;
  leverage: string;
  tradingFees: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  riskPercentage,
  profitPercentage,
  estimatedLoss,
  estimatedProfit,
  netLoss,
  netProfit,
  pipsAtRisk,
  pipsProfit,
  pipValueLoss,

  entryPrice,
  stopLoss,
  takeProfit,
  direction,
  pair,
  leverage,
  tradingFees,
}) => {
  // Only render if we have risk/reward data
  if (!riskPercentage || !profitPercentage) {
    return null;
  }

  const pipTerms = getPipTerm(pair);
  const hasFees = parseFloat(tradingFees) > 0;
  const leverageValue = parseFloat(leverage) || 100;

  // Use the values that include fees if fees are provided
  const lossAmount = hasFees && netLoss !== null ? netLoss : estimatedLoss;
  const profitAmount = hasFees && netProfit !== null ? netProfit : estimatedProfit;

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]'>
      <section className='space-y-6 rounded-3xl border border-white/10 bg-darkblack-700/70 p-6 shadow-xl'>
        <header className='space-y-2'>
          <h3 className='text-lg font-semibold text-white'>Trade summary</h3>
          <p className='text-xs text-gray-400'>
            Review risk versus reward before committing capital to the trade.
          </p>
        </header>

        <div className='grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-xs text-gray-300'>
          <div>
            <p className='uppercase tracking-[0.2em] text-red-300'>Risk</p>
            <p className='mt-1 text-lg font-semibold text-red-400'>{riskPercentage}%</p>
          </div>
          <div>
            <p className='uppercase tracking-[0.2em] text-blue-300'>R:R</p>
            <p className='mt-1 text-lg font-semibold text-white'>
              1:{calculateRRRatio(riskPercentage, profitPercentage)}
            </p>
          </div>
          <div>
            <p className='uppercase tracking-[0.2em] text-tradetab-lime'>Reward</p>
            <p className='mt-1 text-lg font-semibold text-tradetab-lime'>{profitPercentage}%</p>
          </div>
        </div>

        <div className='space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
          <div className='flex items-center justify-between text-xs text-gray-400'>
            <span>Account risk exposure</span>
            <span>{riskPercentage}%</span>
          </div>
          <div className='h-2 rounded-full bg-gray-800'>
            <div
              className='h-2 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400'
              style={{ width: `${Math.min(parseFloat(riskPercentage) * 2, 100)}%` }}
            />
          </div>
          <p className='text-xs text-gray-500'>
            {getRiskLevelDescription(parseFloat(riskPercentage))} risk relative to account balance.
          </p>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200'>
            <div>
              <p className='text-xs text-gray-400'>Potential loss</p>
              <p className='font-semibold text-red-300'>
                ${formatNumber(lossAmount || 0)}
                {hasFees && <span className='text-xs text-gray-400'> (after fees)</span>}
              </p>
            </div>
            <p className='text-xs text-red-200'>Risk {riskPercentage}%</p>
          </div>

          <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200'>
            <div>
              <p className='text-xs text-gray-400'>Potential profit</p>
              <p className='font-semibold text-tradetab-lime'>
                ${formatNumber(profitAmount || 0)}
                {hasFees && <span className='text-xs text-gray-400'> (after fees)</span>}
              </p>
            </div>
            <p className='text-xs text-tradetab-lime'>Reward {profitPercentage}%</p>
          </div>

          <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200'>
            <div>
              <p className='text-xs text-gray-400'>Effective leverage</p>
              <p className='font-semibold text-blue-300'>{leverageValue}:1</p>
            </div>
            {hasFees && (
              <div className='text-right'>
                <p className='text-xs text-gray-400'>Trading fees</p>
                <p className='font-semibold text-yellow-300'>
                  ${formatNumber(parseFloat(tradingFees))}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className='space-y-4 rounded-3xl border border-white/10 bg-darkblack-700/70 p-6 shadow-xl'>
        <header className='text-sm font-medium text-gray-200'>Position view</header>
        <div className='relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050A1D]'>
          <div
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${
              direction === 'buy' ? 'bg-tradetab-lime/80' : 'bg-red-500/80'
            }`}
          >
            {direction === 'buy' ? 'LONG' : 'SHORT'}
          </div>

          <div className='absolute inset-y-0 right-0 flex w-32 flex-col justify-between py-6 pr-4 text-xs'>
            <span className='flex items-center justify-end gap-2 text-tradetab-lime'>
              {pipTerms.plural} target
              <span className='inline-flex items-center justify-center rounded-full border border-tradetab-lime/40 bg-tradetab-lime/10 px-2 py-0.5 text-[10px] text-tradetab-lime'>
                {parseFloat(takeProfit) || 0}
              </span>
            </span>
            <span className='flex items-center justify-end gap-2 text-blue-300'>
              Entry
              <span className='inline-flex items-center justify-center rounded-full border border-blue-400/40 bg-blue-400/10 px-2 py-0.5 text-[10px] text-blue-200'>
                {parseFloat(entryPrice) || 0}
              </span>
            </span>
            <span className='flex items-center justify-end gap-2 text-red-300'>
              {pipTerms.plural} risk
              <span className='inline-flex items-center justify-center rounded-full border border-red-400/40 bg-red-400/10 px-2 py-0.5 text-[10px] text-red-200'>
                {parseFloat(stopLoss) || 0}
              </span>
            </span>
          </div>

          <div className='absolute inset-y-0 left-0 flex w-[calc(100%-8rem)] flex-col justify-between px-6 py-6'>
            <div className='relative h-1/2'>
              <div className='h-full rounded-2xl border border-tradetab-lime/40 bg-tradetab-lime/10' />
              <div className='absolute inset-x-0 bottom-4 flex justify-center text-[10px] uppercase tracking-[0.3em] text-tradetab-lime/80'>
                Profit zone
              </div>
            </div>
            <div className='h-px w-full bg-blue-400/30' />
            <div className='relative h-1/2'>
              <div className='h-full rounded-2xl border border-red-400/50 bg-red-500/10' />
              <div className='absolute inset-x-0 top-4 flex justify-center text-[10px] uppercase tracking-[0.3em] text-red-300/80'>
                Risk zone
              </div>
            </div>
          </div>
        </div>

        <div className='grid gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-gray-300'>
          <div className='flex items-center justify-between'>
            <span>{pipTerms.plural} at risk</span>
            <span className='text-red-300'>{pipsAtRisk}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>{pipTerms.plural} potential</span>
            <span className='text-tradetab-lime'>{pipsProfit}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>{pipTerms.singular} value</span>
            <span className='text-blue-300'>${pipValueLoss}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Direction</span>
            <span className='text-gray-200'>{direction === 'buy' ? 'Long bias' : 'Short bias'}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SummarySection;
