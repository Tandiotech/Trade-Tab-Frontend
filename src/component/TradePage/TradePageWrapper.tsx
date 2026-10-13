import TradePage from './TradePage';
import { SafeSection } from '@/lib/utils';
import { ITrade } from '@/pages/metrics/interface';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useFormattedDates } from '@/hook/useFormattedDates';
import { useMetrics } from '@/context/accounts/MetricsProvider';
import { KeyboardShortcutsProvider } from './KeyboardShortcuts';
import { TradePageErrorBoundary } from './ErrorBoundary';
import DataFlowDebug from './DataFlowDebug';
import { useContext } from 'react';
import { TradesContext } from '@/context/accounts/TradesProvider';

/**
 * TradePageWrapper - Integrates the new TradePage with existing data fetching logic
 *
 * This wrapper component:
 * - Fetches trade data using existing hooks
 * - Handles account context and date filtering
 * - Provides error handling and loading states
 * - Wraps the TradePage with necessary context providers
 */
const TradePageWrapper: React.FC = () => {
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
    tradesLoading = providerTradesLoading || providerConnecting;

  } catch (error) {
    console.error('Error with trades context:', error);
    trades = [];
    tradesLoading = false;
  }

  // Ensure trades is always an array
  const safeTrades: ITrade[] = Array.isArray(trades) ? trades : [];

  // Show debug information when no data (not while trades load or MetaApi reconnect runs)
  if (safeTrades.length === 0 && !tradesLoading) {
    return (
      <SafeSection sectionName='TradePageWrapper'>
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4'>
          <div className='container mx-auto max-w-4xl'>
            <div className='bg-slate-800 rounded-xl border border-slate-700 p-8 text-center'>
              <h1 className='text-2xl font-bold text-white mb-4'>TradePage Debug Information</h1>

              <DataFlowDebug />

              <div className='mt-6'>
                <button
                  onClick={() => window.location.reload()}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200'
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </SafeSection>
    );
  }

  return (
    <SafeSection sectionName='TradePageWrapper'>
      <TradePageErrorBoundary>
        <KeyboardShortcutsProvider>
          <TradePage trades={safeTrades} loading={tradesLoading} className='trade-page-wrapper' />
        </KeyboardShortcutsProvider>
      </TradePageErrorBoundary>
    </SafeSection>
  );
};

export default TradePageWrapper;
