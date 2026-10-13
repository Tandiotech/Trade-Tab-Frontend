import { formatNumber, getPipTerm } from './utils';

interface ResultsSectionProps {
  estimatedLoss: number | null;
  estimatedProfit: number | null;
  netLoss: number | null;
  netProfit: number | null;
  pipValueLoss: string | null;
  pipValueProfit: string | null;
  pipsAtRisk: string | null;
  pipsProfit: string | null;
  pair: string;
  tradingFees: string;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  estimatedLoss,
  estimatedProfit,
  netLoss,
  netProfit,
  pipValueLoss,
  pipValueProfit,
  pipsAtRisk,
  pipsProfit,
  pair,
  tradingFees,
}) => {
  const pipTerms = getPipTerm(pair);
  const hasFees = parseFloat(tradingFees) > 0;

  return (
    <div
      className='grid gap-4 sm:grid-cols-2'
      role='region'
      aria-label='Trade Results'
    >
      {estimatedLoss !== null && (
        <article
          className='space-y-3 rounded-3xl border border-red-400/40 bg-red-500/15 p-5 text-left shadow-lg backdrop-blur transition hover:border-red-300/60 hover:shadow-red-500/20'
          role='group'
          aria-labelledby='loss-heading'
        >
          <div className='flex items-center justify-between text-xs uppercase tracking-[0.25em] text-red-200'>
            <span id='loss-heading'>Projected loss</span>
            {hasFees && netLoss !== null && <span>Incl. fees</span>}
          </div>
          <p
            className='text-3xl font-bold text-white'
            aria-label={`Loss amount: ${formatNumber(estimatedLoss)} dollars`}
          >
            -${formatNumber(estimatedLoss)}
          </p>
          {hasFees && netLoss !== null && (
            <p className='text-sm text-red-100'>
              Net impact: -${formatNumber(netLoss)} <span className='text-xs'>(after fees)</span>
            </p>
          )}
          <div className='rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-xs text-red-100'>
            <div className='flex items-center justify-between'>
              <span>{pipTerms.plural} at risk</span>
              <span>{pipsAtRisk}</span>
            </div>
            <div className='mt-2 flex items-center justify-between'>
              <span>{pipTerms.singular} value</span>
              <span>${pipValueLoss}</span>
            </div>
          </div>
        </article>
      )}

      {estimatedProfit !== null && (
        <article
          className='space-y-3 rounded-3xl border border-tradetab-lime/40 bg-tradetab-lime/15 p-5 text-left shadow-lg backdrop-blur transition hover:border-tradetab-lime/60 hover:shadow-[0_0_30px_rgba(79,185,130,0.2)]'
          role='group'
          aria-labelledby='profit-heading'
        >
          <div className='flex items-center justify-between text-xs uppercase tracking-[0.25em] text-tradetab-lime'>
            <span id='profit-heading'>Projected profit</span>
            {hasFees && netProfit !== null && <span>Incl. fees</span>}
          </div>
          <p
            className='text-3xl font-bold text-white'
            aria-label={`Profit amount: ${formatNumber(estimatedProfit)} dollars`}
          >
            +${formatNumber(estimatedProfit)}
          </p>
          {hasFees && netProfit !== null && (
            <p className='text-sm text-tradetab-lime/90'>
              Net after fees: +${formatNumber(netProfit)}
            </p>
          )}
          <div className='rounded-2xl border border-tradetab-lime/40 bg-tradetab-lime/10 px-4 py-3 text-xs text-tradetab-lime'>
            <div className='flex items-center justify-between'>
              <span>{pipTerms.plural} potential</span>
              <span>{pipsProfit}</span>
            </div>
            <div className='mt-2 flex items-center justify-between'>
              <span>{pipTerms.singular} value</span>
              <span>${pipValueProfit}</span>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default ResultsSection;
