import { SafeSection } from '@/lib/utils';
import { ITrade } from '@/pages/metrics/interface';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useFormattedDates } from '@/hook/useFormattedDates';
import { useMetrics } from '@/context/accounts/MetricsProvider';
import { useMode } from '@/context/ModeContext';
import TradePageMinimal from './TradePageMinimal';
import dummyMetricsData from '@/assets/data/exampleAccount';
import { useContext } from 'react';
import { TradesContext } from '@/context/accounts/TradesProvider';

/**
 * TradePageWrapperSimple - Simplified version to isolate issues
 */
const TradePageWrapperSimple: React.FC = () => {
  let trades: ITrade[] = [];
  let tradesLoading = false;

  // Get current account from context
  let currentAccount;
  try {
    const mtAccountsContext = useMTAccounts();
    currentAccount = mtAccountsContext?.currentAccount || null;

  } catch (error) {
    console.error('Error accessing MTAccounts context:', error);
    currentAccount = null;
  }

  // Get mode context
  const { isExampleMode } = useMode();

  // Get metrics context to trigger data refresh
  const { metricsRefreshed, setMetricsRefreshed, fetchMetrics } = useMetrics();

  // Get date filters (optional, can be adjusted to global logic)
  const { dateStartFilter, dateEndFilter } = useFormattedDates({
    initialValues: { startDate: null, endDate: null },
  });

  // Fetch trades data
  try {
    const tradesContextData = useContext(TradesContext) || {};
    const {
      tradesCache = {},
      tradesLoading: providerTradesLoading = false,
      connectingAccount: providerConnecting = false,
    } = tradesContextData;
    trades = currentAccount?.external_id ? tradesCache[currentAccount.external_id] || [] : [];
    // If no current account, use dummy data only in example mode
    if (currentAccount == null && isExampleMode) {
      trades = dummyMetricsData.tradesArray;
    }
    tradesLoading = providerTradesLoading || providerConnecting;

  } catch (error) {
    console.error('Error with trades hook:', error);
    trades = [];
    tradesLoading = false;
  }

  // Ensure trades is always an array
  const safeTrades: ITrade[] = Array.isArray(trades) ? trades : [];

  // If we have trades data, show the minimal TradePage
  return (
    <SafeSection sectionName='TradePageWrapperSimple'>
      <TradePageMinimal
        trades={safeTrades}
        loading={tradesLoading}
        className='trade-page-minimal'
      />
    </SafeSection>
  );
};

export default TradePageWrapperSimple;
