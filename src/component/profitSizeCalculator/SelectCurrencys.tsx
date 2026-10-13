import { useMemo, useState } from 'react';
import { currencyFlags } from '@/utils/GlobalVars';

interface PairSection {
  id: string;
  label: string;
  pairs: string[];
}

const PAIR_SECTIONS: PairSection[] = [
  {
    id: 'popular',
    label: '💎 Popular pairs',
    pairs: [
      'EUR/USD',
      'USD/JPY',
      'GBP/USD',
      'USD/CHF',
      'AUD/USD',
      'USD/CAD',
      'NZD/USD',
      'EUR/GBP',
      'EUR/JPY',
      'GBP/JPY'
    ]
  },
  {
    id: 'cross',
    label: '🔄 Cross pairs',
    pairs: [
      'GBP/AUD',
      'GBP/CAD',
      'GBP/CHF',
      'EUR/AUD',
      'AUD/CAD',
      'AUD/CHF',
      'AUD/JPY',
      'CAD/JPY',
      'CAD/CHF',
      'CHF/JPY',
      'NZD/JPY',
      'NZD/CAD',
      'NZD/CHF',
      'AUD/NZD'
    ]
  },
  {
    id: 'exotic',
    label: '🌍 Exotic pairs',
    pairs: ['USD/TRY', 'USD/BRL', 'USD/MXN', 'USD/ZAR', 'USD/RUB']
  },
  {
    id: 'asia',
    label: '🌏 Asian pairs',
    pairs: ['USD/CNY', 'USD/HKD', 'USD/SGD']
  },
  {
    id: 'commodities',
    label: '🏆 Commodities',
    pairs: ['XAU/USD', 'XAG/USD', 'WTI/USD', 'BRENT/USD']
  },
  {
    id: 'indices',
    label: '📈 Indices',
    pairs: ['US30', 'DAXEUR']
  }
];

const getFlag = (pair: string): string => {
  // Handle indices that don't have a "/" separator
  if (pair === 'US30' || pair === 'DAXEUR') {
    return '';
  }
  const [base, quote] = pair.split('/');
  return `${currencyFlags[base] ?? ''} ${currencyFlags[quote] ?? ''}`.trim();
};

interface SelectCurrencyPairsProps {
  currencyPair: string;
  setCurrencyPair: (pair: string) => void;
  label?: string;
  hideLabel?: boolean;
  className?: string;
}

export default function SelectCurrencyPairs({
  currencyPair,
  setCurrencyPair,
  label = 'Currency pair or commodity',
  hideLabel = false,
  className = ''
}: SelectCurrencyPairsProps) {
  const [search, setSearch] = useState('');

  const filteredSections = useMemo(() => {
    if (!search.trim()) return PAIR_SECTIONS;
    const query = search.toLowerCase();

    return PAIR_SECTIONS.map(section => ({
      ...section,
      pairs: section.pairs.filter(pair => pair.toLowerCase().includes(query))
    })).filter(section => section.pairs.length > 0);
  }, [search]);

  const sectionsToRender = useMemo(() => {
    const baseSections = filteredSections.length > 0 ? filteredSections : PAIR_SECTIONS;
    const hasSelected = baseSections.some(section => section.pairs.includes(currencyPair));
    if (hasSelected) return baseSections;
    return [
      { id: 'selected', label: '🔁 Current selection', pairs: [currencyPair] },
      ...baseSections
    ];
  }, [filteredSections, currencyPair]);

  const showNoResultsHint = search.trim().length > 0 && filteredSections.length === 0;

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      {!hideLabel && (
        <label htmlFor='currencyPair' className='text-sm font-medium text-gray-200'>
          {label}
        </label>
      )}

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
        {/* <div className='flex w-full flex-1 items-center rounded-2xl border border-white/10 bg-[#050A1D] px-3 py-2 text-white shadow-inner focus-within:border-tradetab-lime/50 focus-within:ring-2 focus-within:ring-tradetab-lime/30'>
          <span className='mr-2 text-xs text-gray-400'>🔍</span>
          <input
            type='search'
            placeholder='Search pair (e.g. EUR/USD)'
            value={search}
            onChange={event => setSearch(event.target.value)}
            className='w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none'
            aria-label='Search currency pair'
          />
        </div> */}

        <div className='relative flex w-full flex-1 items-center'>
          <select
            id='currencyPair'
            value={currencyPair}
            onChange={event => setCurrencyPair(event.target.value)}
            className='w-full appearance-none rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-tradetab-lime/40 focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/30'
            aria-label='Select currency pair'
          >
            {sectionsToRender.map(section => (
              <optgroup key={section.id} label={section.label}>
                {section.pairs.map(pair => (
                  <option key={pair} value={pair}>
                    {getFlag(pair)} {pair}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span className='pointer-events-none absolute right-4 text-xs text-gray-400'>▼</span>
        </div>
      </div>

      {showNoResultsHint && (
        <p className='rounded-2xl border border-tradetab-lime/30 bg-tradetab-lime/10 px-3 py-2 text-xs text-tradetab-lime'>
          No matches found. Showing full list so you can pick a close alternative.
        </p>
      )}
    </div>
  );
}
