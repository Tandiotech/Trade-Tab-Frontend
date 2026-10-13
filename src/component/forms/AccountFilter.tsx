import { useState, useEffect, useRef, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext';
import { useSearchParams, Link } from 'react-router-dom';
// import AnimatedText from '../AnimateText';
import Loading2 from '../loader/Loading2/Loading2';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import { TradesContext } from '@/context/accounts/TradesProvider';

interface Account {
  account_number: number;
  platform: string;
  name: string;
  balance: number;
  currency: string;
}

interface AccountFilterProps {
  options: Account[];
}

export default function AccountFilter({ options }: AccountFilterProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [hoveredAccount, setHoveredAccount] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [, setSearchParams] = useSearchParams();
  const { currentAccount, setCurrentAccountNumber, accountsLoading } = useMTAccounts();
  const { resetTrades } = useContext(TradesContext); // 👈 importamos resetTrades
  // Handle account selection
  const handleChange = (selectedValue: any) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('account', selectedValue);
      return newParams;
    });

    setCurrentAccountNumber(selectedValue);

    // 🧩 Resetea trades y fuerza reload
    if (typeof resetTrades === 'function') {
      resetTrades();
    }

    setShowFilter(false);
  };

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter]);

  const toggleFilter = () => setShowFilter(!showFilter);

  if (accountsLoading) {
    return (
      <div className='flex items-center justify-center px-3 py-2'>
        <Loading2 />
      </div>
    );
  }

  if (!currentAccount?.account_number) {
    return (
      <Link
        to='/accounts'
        className='inline-flex max-w-[11rem] items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1.5 text-left text-xs text-amber-100/95 transition hover:border-amber-400/40 hover:bg-amber-500/15 sm:max-w-none sm:px-3 sm:text-sm'
      >
        <span className='truncate font-medium'>No accounts linked</span>
        <span className='shrink-0 text-amber-300/90'>→</span>
      </Link>
    );
  }

  return (
    <div ref={filterRef} className='relative'>
      {/* Account Selector Button */}
      <button
        onClick={toggleFilter}
        className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-darkblack-600/80 to-darkblack-600/60 hover:from-darkblack-600 hover:to-darkblack-500/90 rounded-xl transition-all duration-300 group min-w-0 border border-gray-700/50 hover:border-teal-500/30 shadow-lg hover:shadow-teal-500/10 ${
          showFilter ? 'ring-2 ring-teal-500/30 border-teal-500/50' : ''
        }`}
      >
        <div className='flex flex-col items-start min-w-0 flex-1'>
          <span className='text-white text-xs sm:text-sm font-semibold truncate max-w-full'>
            {currentAccount?.name || 'Select Account'}
          </span>
          <div className='flex items-center gap-2 mt-0.5'>
            <span className='text-gray-400 text-xs truncate'>
              {currentAccount?.account_number || '...'}
            </span>
            <span className='text-gray-500 text-[10px] px-1.5 py-0.5 bg-darkblack-500/50 rounded-md font-medium'>
              {currentAccount?.platform?.toUpperCase() || ''}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          <div className='flex flex-col items-end'>
            <span className='text-teal-400 text-xs sm:text-sm font-bold whitespace-nowrap'>
              {SeparadorDecimal(currentAccount?.balance?.toFixed(2) || 0)}
            </span>
            <span className='text-gray-500 text-[10px]'>{currentAccount?.currency || ''}</span>
          </div>
          <div className={`transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}>
            <ChevronDown className='w-4 h-4 text-gray-400 group-hover:text-teal-400 transition-colors duration-200' />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showFilter && (
        <div 
          className='absolute top-full left-0 sm:left-0 sm:right-auto mt-3 sm:w-[420px] w-[calc(100vw-2rem)] bg-darkblack-700/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden'
          style={{
            animation: 'fadeInDown 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div className='p-4 border-b border-gray-700/50 bg-gradient-to-r from-darkblack-600/50 to-transparent'>
            <div className='flex items-center justify-between'>
              <h3 className='text-white text-sm font-semibold'>Select Account</h3>
              <span className='text-gray-400 text-xs px-2 py-1 bg-darkblack-600/50 rounded-md font-medium'>
                {options.length} {options.length === 1 ? 'account' : 'accounts'}
              </span>
            </div>
          </div>

          {/* Accounts List */}
          <div className='max-h-80 overflow-y-auto custom-scrollbar2'>
            {options.map((account, index) => {
              const isSelected = currentAccount?.account_number === account.account_number;
              const isHovered = hoveredAccount === account.account_number;
              
              return (
                <div
                  key={account.account_number}
                  onClick={() => handleChange(account.account_number.toString())}
                  onMouseEnter={() => setHoveredAccount(account.account_number)}
                  onMouseLeave={() => setHoveredAccount(null)}
                  className={`group/account flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-500/20 via-teal-500/15 to-transparent border-l-4 border-teal-500'
                      : isHovered
                        ? 'bg-darkblack-600/70 border-l-4 border-gray-600'
                        : 'border-l-4 border-transparent hover:bg-darkblack-600/40'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-teal-600 rounded-r-full' />
                  )}

                  {/* Account Number Badge */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-teal-500/20 ring-2 ring-teal-500/30'
                      : isHovered
                        ? 'bg-darkblack-500 ring-1 ring-gray-600'
                        : 'bg-darkblack-500/50'
                  }`}>
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-teal-400'
                          : isHovered
                            ? 'text-white'
                            : 'text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Account Info */}
                  <div className='flex flex-col flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className={`font-semibold text-sm truncate ${
                        isSelected ? 'text-white' : 'text-gray-200'
                      }`}>
                        {account.name}
                      </span>
                      {isSelected && (
                        <span className='flex-shrink-0 px-1.5 py-0.5 bg-teal-500/20 text-teal-400 text-[10px] font-bold rounded-md'>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-gray-400 text-xs font-mono'>{account.account_number}</span>
                      <span className='text-gray-500 text-[10px] px-2 py-0.5 bg-darkblack-600/70 rounded-md font-medium border border-gray-700/50'>
                        {account.platform.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className='flex flex-col items-end flex-shrink-0 min-w-[80px]'>
                    <span className={`text-sm font-bold whitespace-nowrap ${
                      isSelected ? 'text-teal-400' : 'text-teal-400/90'
                    }`}>
                      {SeparadorDecimal(account.balance?.toFixed(2))}
                    </span>
                    <span className='text-gray-500 text-xs mt-0.5'>{account.currency}</span>
                  </div>

                  {/* Hover Arrow Indicator */}
                  {isHovered && !isSelected && (
                    <div className='absolute right-2 opacity-0 group-hover/account:opacity-100 transition-opacity duration-200'>
                      <ChevronDown className='w-4 h-4 text-gray-400 rotate-[-90deg]' />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {/* <div className='p-3 border-t border-gray-700/50 bg-darkblack-600/30'>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-gray-400'>Current balance</span>
              <span className='text-teal-400 font-bold'>
                {SeparadorDecimal(currentAccount?.balance?.toFixed(2) || 0)} {currentAccount?.currency || ''}
              </span>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
