/**
 * @deprecated This component has been replaced by TradePageWrapper
 * @see TradePageWrapper - New modern trading dashboard implementation
 *
 * This component is kept for reference but should not be used in new code.
 * The new TradePage provides significantly better performance, UX, and features.
 */

import Loader1 from '@/component/loader/Loader1';
import { SafeSection } from '@/lib/utils';
import { ITrade } from '../interface';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useFormattedDates } from '@/hook/useFormattedDates';
import TableTradesContainer from '@/component/listTab/TableTradesContainer';
import { useContext } from 'react';
import { TradesContext } from '@/context/accounts/TradesProvider';

export const RecentTradesSection: React.FC = () => {
  let trades: ITrade[] = [];
  let tradesLoading = false;

  // obtener cuenta actual del contexto
  let currentAccount;
  try {
    const mtAccountsContext = useMTAccounts();
    currentAccount = mtAccountsContext?.currentAccount || null;
  } catch (error) {
    console.error('Error accessing MTAccounts context:', error);
    currentAccount = null;
  }

  // ✅ Read trades from TradesProvider context
  try {
    const tradesContextData = useContext(TradesContext) || {};
    const { tradesCache = {}, tradesLoading: providerTradesLoading = false } = tradesContextData;
    trades = currentAccount?.external_id ? tradesCache[currentAccount.external_id] || [] : [];
    tradesLoading = providerTradesLoading;
  } catch (error) {
    console.error('Error with trades context:', error);
    trades = [];
    tradesLoading = false;
  }

  const safeTrades: ITrade[] = Array.isArray(trades) ? trades : [];

  return (
    <SafeSection sectionName='RecentTradesSection'>
      <div className='mb-8'>
        {tradesLoading && (
          <div className='text-center py-8'>
            <Loader1 />
            <p className='text-green-500 mt-2'>Loading trades...</p>
          </div>
        )}

        {safeTrades.length > 0 ? (
          <div className='bg-gray-800/30 rounded-xl p-4'>
            <SafeSection sectionName='OpenCloseTrades'>
              <TableTradesContainer
                data={safeTrades}
                currentFilter={'Trades'}
                selectedFilters={[]}
                recordPerPage={10}
              />
            </SafeSection>
          </div>
        ) : (
          !tradesLoading && (
            <div className='text-center py-12 bg-gray-800/30 rounded-xl'>
              <div className='text-gray-400 text-lg mb-2'>No trades found</div>
              <p className='text-gray-500 text-sm'>No trades found for the selected period</p>
            </div>
          )
        )}
      </div>
    </SafeSection>
  );
};
