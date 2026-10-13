import { BiSync } from 'react-icons/bi';
import { useSyncMetaApi } from '../hook/useSyncMetaApi';
import { useSyncFXE } from '@/hook/useSyncFXE';
import { useMetrics } from '@/context/accounts/MetricsProvider';
import { useProgressBar } from '@/context/ProgressBarContext';
import useSocket from '@/hook/useSocket';
import { useEffect, useState, forwardRef } from 'react';
// import SyncTimer from './SyncTimer';

const ButtonSync = forwardRef<HTMLButtonElement, { currentAccount?: any; metaApiId?: string }>(
  ({ currentAccount, metaApiId }, ref) => {
    const { isSocketActive } = useSocket();
    const { metricsRefreshed } = useMetrics();
    const { isSyncing } = useProgressBar();
    const [syncComplete, setSyncComplete] = useState(false);

    // ✅ Si viene metaApiId, lo agregamos a una nueva variable (sin mutar props)
    const accountToUse = metaApiId ? { ...currentAccount, external_id: metaApiId } : currentAccount;

    const metaApiSync = useSyncMetaApi(accountToUse);
    const fxeSync = useSyncFXE(accountToUse?.external_id);
    // 🔍 Determinar si la cuenta usa MetaApi
    const isMetaApi =
      accountToUse?.platform?.includes('meta') || accountToUse?.platform?.includes('mt');
    const startSync = isMetaApi ? metaApiSync.startSync : fxeSync.startSync;

    // 🔄 Temporizador para mostrar “Sync Complete”
    useEffect(() => {
      if (metricsRefreshed) {
        setSyncComplete(true);
        const timer = setTimeout(() => setSyncComplete(false), 5000);
        return () => clearTimeout(timer);
      }
    }, [metricsRefreshed]);

    return (
      <button
        ref={ref}
        onClick={syncComplete ? undefined : startSync}
        className={`bg-teal-700 max-w-28 text-white w-full ${
          isSyncing ? 'animate-glow' : ''
        } flex h-10 shadow-lg items-center justify-center p-[1.39rem] rounded-md transform transition duration-300 hover:scale-105 hover:bg-teal-700 hover:shadow-2xl active:scale-95 active:shadow-inner ${
          syncComplete || (isMetaApi && isSocketActive) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isMetaApi && isSocketActive}
      >
        {isSyncing ? (
          <span className='flex items-center justify-center whitespace-nowrap p-2'>
            RE-SYNC <BiSync className='ml-2 animate-spin' />
          </span>
        ) : syncComplete ? (
          <span className='text-green-300 font-semibold'>Sync Complete!</span>
        ) : (
          'Sync'
        )}
      </button>
    );
  }
);

export default ButtonSync;
