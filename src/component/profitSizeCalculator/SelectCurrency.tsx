import { useMemo, useState } from 'react';
import { currencyFlags } from '@/utils/GlobalVars';

const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'];
const exoticCurrencies = ['TRY', 'BRL', 'MXN', 'ZAR', 'RUB', 'ARS', 'CLP', 'COP'];
const asianCurrencies = ['CNY', 'HKD', 'SGD', 'KRW', 'INR', 'IDR', 'MYR', 'THB'];

const filterCurrencies = (currencies: string[], query: string) =>
  currencies.filter(currency => currency.toLowerCase().includes(query.toLowerCase()));

const getFlag = (currency: string): string => currencyFlags[currency] ?? '';

interface SelectCurrencyProps {
  accountCurrency: string;
  setAccountCurrency: (currency: string) => void;
  label?: string;
  hideLabel?: boolean;
  className?: string;
}

export default function SelectCurrency({
  accountCurrency,
  setAccountCurrency,
  label = 'Account currency',
  hideLabel = false,
  className = ''
}: SelectCurrencyProps) {
  const [search, setSearch] = useState('');

  const filteredMajorCurrencies = useMemo(
    () => filterCurrencies(majorCurrencies, search),
    [search]
  );
  const filteredExoticCurrencies = useMemo(
    () => filterCurrencies(exoticCurrencies, search),
    [search]
  );
  const filteredAsianCurrencies = useMemo(
    () => filterCurrencies(asianCurrencies, search),
    [search]
  );

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      {!hideLabel && (
        <label htmlFor='accountCurrency' className='text-sm font-medium text-gray-200'>
          {label}
        </label>
      )}

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
        {/* <div className='flex w-full flex-1 items-center rounded-2xl border border-white/10 bg-[#050A1D] px-3 py-2 text-white shadow-inner focus-within:border-tradetab-lime/50 focus-within:ring-2 focus-within:ring-tradetab-lime/30'>
          <span className='mr-2 text-xs text-gray-400'>🔍</span>
          <input
            type='search'
            placeholder='Search currency...'
            value={search}
            onChange={event => setSearch(event.target.value)}
            className='w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none'
            aria-label='Search currency'
          />
        </div> */}

        <div className='relative flex w-full flex-1 items-center'>
          <select
            id='accountCurrency'
            value={accountCurrency}
            onChange={event => setAccountCurrency(event.target.value)}
            className='w-full appearance-none rounded-2xl border border-white/10 bg-[#050A1D] px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-tradetab-lime/40 focus:border-tradetab-lime/60 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/30'
            aria-label='Select account currency'
          >
            {filteredMajorCurrencies.length > 0 && (
              <optgroup label='💰 Major'>
                {filteredMajorCurrencies.map(currency => (
                  <option key={currency} value={currency}>
                    {getFlag(currency)} {currency}
                  </option>
                ))}
              </optgroup>
            )}

            {filteredExoticCurrencies.length > 0 && (
              <optgroup label='🌍 Exotic'>
                {filteredExoticCurrencies.map(currency => (
                  <option key={currency} value={currency}>
                    {getFlag(currency)} {currency}
                  </option>
                ))}
              </optgroup>
            )}

            {filteredAsianCurrencies.length > 0 && (
              <optgroup label='🌏 Asian'>
                {filteredAsianCurrencies.map(currency => (
                  <option key={currency} value={currency}>
                    {getFlag(currency)} {currency}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <span className='pointer-events-none absolute right-4 text-xs text-gray-400'>▼</span>
        </div>
      </div>
    </div>
  );
}
