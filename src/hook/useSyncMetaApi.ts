import { useEffect, useState } from 'react';
import useSocket from '../hook/useSocket';
import { useProgressBar } from '@/context/ProgressBarContext';
import { useMetrics } from '@/context/accounts/MetricsProvider';

export function useSyncMetaApi(account: any) {
  const { emitSyncAccountData } = useSocket();
  const { setIsSyncing, notAccount } = useProgressBar();
  const { metricsRefreshed } = useMetrics();
  const [syncedSuccessfully, setSyncedSuccessfully] = useState(false);

  const startSync = () => {
    if (!account || notAccount) {
      return;
    }
    setIsSyncing(true);
    emitSyncAccountData(account);
  };

  useEffect(() => {
    if (notAccount || metricsRefreshed) {
      setIsSyncing(false);
    }

    if (metricsRefreshed) {
      setSyncedSuccessfully(true);
    }
  }, [notAccount, metricsRefreshed, setIsSyncing]);

  return { startSync, syncedSuccessfully };
}
