import  { useContext } from 'react';
import { TradesContext } from '@/context/accounts/TradesProvider';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useFormattedDates } from '@/hook/useFormattedDates';
import { useMetrics } from '@/context/accounts/MetricsProvider';

/**
 * DataFlowDebug - Debug component to check data flow issues
 */
const DataFlowDebug: React.FC = () => {
  // Check TradesContext directly
  const tradesContext = useContext(TradesContext);

  // Check MTAccounts context
  const mtAccountsContext = useMTAccounts();

  // Check useFormattedDates
  const { dateStartFilter, dateEndFilter } = useFormattedDates({
    initialValues: { startDate: null, endDate: null },
  });

  const currentAccount = mtAccountsContext?.currentAccount;
  const meta_id = currentAccount?.external_id || currentAccount?._id;

  // Get trades from context cache
  const { tradesCache = {}, tradesLoading = false } = tradesContext || {};
  const trades = meta_id ? tradesCache[meta_id] || [] : [];

  // Check metrics context
  const { metricsRefreshed, setMetricsRefreshed, fetchMetrics } = useMetrics();

  const handleTriggerMetricsRefresh = () => {
    if (setMetricsRefreshed) {
      setMetricsRefreshed(true);
    }
  };

  const handleFetchMetrics = () => {
    if (fetchMetrics && meta_id) {
      fetchMetrics(meta_id);
    }
  };

  return (
    <div className='bg-slate-800 rounded-xl border border-slate-700 p-6'>
      <h2 className='text-xl font-semibold text-white mb-4'>Data Flow Debug</h2>

      <div className='space-y-4'>
        <div className='bg-slate-900 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-white mb-2'>TradesContext</h3>
          <pre className='text-slate-300 text-sm overflow-auto max-h-32'>
            {JSON.stringify(tradesContext, null, 2)}
          </pre>
        </div>

        <div className='bg-slate-900 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-white mb-2'>MTAccountsContext</h3>
          <pre className='text-slate-300 text-sm overflow-auto max-h-32'>
            {JSON.stringify(mtAccountsContext, null, 2)}
          </pre>
        </div>

        <div className='bg-slate-900 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-white mb-2'>Date Filters</h3>
          <pre className='text-slate-300 text-sm'>
            {JSON.stringify({ dateStartFilter, dateEndFilter }, null, 2)}
          </pre>
        </div>

        <div className='bg-slate-900 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-white mb-2'>Trades from Context</h3>
          <pre className='text-slate-300 text-sm overflow-auto max-h-32'>
            {JSON.stringify({ tradesCount: trades.length, tradesLoading }, null, 2)}
          </pre>
        </div>

        <div className='bg-slate-900 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-white mb-2'>Summary</h3>
          <div className='text-slate-300 text-sm space-y-1'>
            <p>Meta ID: {meta_id || 'None'}</p>
            <p>Trades Count: {trades?.length || 0}</p>
            <p>Loading: {tradesLoading ? 'Yes' : 'No'}</p>
            <p>Context Available: {tradesContext ? 'Yes' : 'No'}</p>
            <p>Account Available: {currentAccount ? 'Yes' : 'No'}</p>
            <p>Metrics Refreshed: {metricsRefreshed ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className='bg-slate-900 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-white mb-2'>Actions</h3>
          <div className='space-y-2'>
            <button
              onClick={handleTriggerMetricsRefresh}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200'
            >
              Trigger Metrics Refresh
            </button>
            <button
              onClick={handleFetchMetrics}
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ml-2'
            >
              Fetch Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowDebug;
