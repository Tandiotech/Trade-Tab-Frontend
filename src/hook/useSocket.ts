import { useRef, useEffect, useCallback } from 'react';
import MetricSocket from '../pages/metrics/socket/metricSocket';
import { INFOUPDATE, SYNCERROR, SYNCTRUE } from '../pages/metrics/socket/socketsMessages';
import { useMetrics } from '../context/accounts/MetricsProvider';
import { useProgressBar } from '../context/ProgressBarContext';
import { useMTAccounts } from '../context/accounts/MTAccountsContext';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'react-toastify';

interface AccountInfo {
  id?: string;
  accountName?: string;
  accountNumber?: string;
  server?: string;
}

export default function useSocket() {
  const {
    setAccountIsFullySync,
    setIsSyncing,
    setShowProgressBar,
    setNotAccount,
    setProgress,
    setProgressMessage,
  } = useProgressBar();

  const { refreshAccounts } = useMTAccounts();
  const { setMetricsRefreshed } = useMetrics();
  const { addNotification, updateNotification, clearNotification } = useNotifications();

  // Ref to track cleanup functions for listeners
  const listenersRef = useRef<(() => void)[]>([]);

  // Cleanup all registered listeners on unmount
  useEffect(() => {
    return () => {
      listenersRef.current.forEach(cleanup => cleanup());
      listenersRef.current = [];
    };
  }, []);

  // Get the singleton instance
  const getSocketInstance = useCallback(() => MetricSocket.getInstance(), []);

  // Helper to register a listener with automatic cleanup tracking
  const registerListener = useCallback((event: string, callback: (data: unknown) => void) => {
    const socket = getSocketInstance();
    const cleanup = socket.registerListener(event, callback);
    listenersRef.current.push(cleanup);
    return cleanup;
  }, [getSocketInstance]);

  /**
   * Sync complete account data
   */
  const emitSyncAccountData = useCallback(async (account: AccountInfo, retries = 3, delay = 2000) => {
    try {
      const socket = getSocketInstance();
      socket.connect();

      // Create "Account Sync Started" notification
      const syncNotifId = addNotification({
        type: 'info',
        title: 'Account Sync Started',
        message: `Syncing trading data for ${account?.accountName ?? account?.accountNumber ?? 'your account'}...`,
        status: 'connecting',
        progress: 10,
        accountName: account?.accountName,
        accountNumber: account?.accountNumber,
        server: account?.server,
        autoClose: false,
      });

      // Clear previous listeners
      socket.off(SYNCTRUE);
      socket.off(SYNCERROR);
      socket.off(INFOUPDATE);

      // Sync complete handler
      socket.on(SYNCTRUE, async (data: unknown) => {

        setProgress(100);
        setProgressMessage('Account fully synchronized!');
        setMetricsRefreshed(true);
        setAccountIsFullySync(true);
        setIsSyncing(false);
        await refreshAccounts();

        updateNotification(syncNotifId, {
          type: 'success',
          status: 'success',
          title: 'Account Ready!',
          message: `${account?.accountName ?? account?.accountNumber ?? 'Your account'} is now connected and ready to use.`,
          progress: 100,
        });

        clearNotification(syncNotifId);

        setTimeout(() => {
          setShowProgressBar(false);
          setProgress(0);
        }, 1500);

        toast.success(`Account ${account?.accountName ?? account?.accountNumber} is ready!`, {
          autoClose: 5000,
          position: 'bottom-right',
        });
      });

      // Sync error handler
      socket.on(SYNCERROR, (data: { reconnect?: boolean; message?: string }) => {
        console.error('Sync error:', data);

        if (data.reconnect) {
          setNotAccount(true);
          setIsSyncing(false);
        }

        updateNotification(syncNotifId, {
          type: 'error',
          status: 'error',
          title: 'Connection Failed',
          message: data?.message ?? 'An error occurred while connecting this account. Please try again.',
          progress: 100,
          error: data?.message,
        });

        toast.error(data?.message ?? 'Error during connection.');
      });

      // Partial update handler
      socket.on(INFOUPDATE, async (data: { updated?: boolean }) => {

        setMetricsRefreshed(true);
        if (data.updated) {
          setProgress(96);
          setProgressMessage('Finalizing synchronization...');
          setIsSyncing(false);
          await refreshAccounts();

          setProgress(100);
          setProgressMessage('Account fully synchronized!');

          updateNotification(syncNotifId, {
            type: 'success',
            status: 'success',
            title: 'Account Ready!',
            message: `${account?.accountName ?? account?.accountNumber ?? 'Your account'} is now connected and ready to use.`,
            progress: 100,
          });
          clearNotification(syncNotifId);

          setTimeout(() => {
            setShowProgressBar(false);
            setProgress(0);
          }, 1500);
        }
      });

      // Emit sync event
      setProgress(62);
      setProgressMessage('Synchronizing trading data...');
      socket.syncAccountData(account);

    } catch (error) {
      console.error('Socket initialization failed:', error);

      if (retries > 0) {
        console.warn(`Retrying in ${delay / 1000}s...`);
        setTimeout(() => emitSyncAccountData(account, retries - 1, delay), delay);
      } else {
        addNotification({
          type: 'error',
          title: 'Sync Initialization Failed',
          message: 'Unable to start synchronization after several attempts.',
          status: 'error',
          progress: 100,
        });
        toast.error('Synchronization failed. Please retry.');
      }
    }
  }, [
    getSocketInstance,
    addNotification,
    updateNotification,
    clearNotification,
    setProgress,
    setProgressMessage,
    setMetricsRefreshed,
    setAccountIsFullySync,
    setIsSyncing,
    setShowProgressBar,
    setNotAccount,
    refreshAccounts,
  ]);

  /**
   * Sync by account ID
   */
  const emitSyncAccount = useCallback(async (accountInfo?: AccountInfo, notifId?: string) => {
    try {
      const socket = getSocketInstance();
      socket.connect();

      // Create notification if not provided
      const syncNotifId =
        notifId ??
        addNotification({
          type: 'info',
          title: 'Account Sync Started',
          message: `Syncing trading data for ${accountInfo?.accountName ?? accountInfo?.accountNumber ?? 'your account'}...`,
          status: 'connecting',
          progress: 10,
          accountName: accountInfo?.accountName,
          accountNumber: accountInfo?.accountNumber,
          server: accountInfo?.server,
          autoClose: false,
        });

      socket.off(SYNCTRUE);
      socket.off(SYNCERROR);
      socket.off(INFOUPDATE);

      socket.on(SYNCTRUE, async (data: unknown) => {

        setProgress(100);
        setProgressMessage('Account fully synchronized!');
        setMetricsRefreshed(true);
        setAccountIsFullySync(true);
        setIsSyncing(false);
        await refreshAccounts();

        updateNotification(syncNotifId, {
          type: 'success',
          status: 'success',
          title: 'Account Ready!',
          message: `${accountInfo?.accountName ?? accountInfo?.accountNumber ?? 'Your account'} is now fully connected and synchronized. You can now start trading!`,
          progress: 100,
        });

        clearNotification(syncNotifId);

        setTimeout(() => {
          setShowProgressBar(false);
          setProgress(0);
        }, 1500);

        toast.success('Account connected and synced successfully!', {
          autoClose: 5000,
          position: 'bottom-right',
        });
      });

      socket.on(SYNCERROR, (data: { reconnect?: boolean; message?: string }) => {
        console.error('Sync error:', data);

        updateNotification(syncNotifId, {
          type: 'error',
          status: 'error',
          title: 'Connection Failed',
          message: data?.message ?? 'Error during account connection. Please try again.',
          progress: 100,
          error: data?.message,
        });

        if (data.reconnect) {
          setNotAccount(true);
          setIsSyncing(false);
        }

        toast.error(data?.message ?? 'Error during connection.');
      });

      socket.on(INFOUPDATE, async (data: { updated?: boolean }) => {

        if (data.updated) {
          setProgress(96);
          setProgressMessage('Finalizing synchronization...');
          setMetricsRefreshed(true);
          setIsSyncing(false);
          await refreshAccounts();

          setProgress(100);
          setProgressMessage('Account fully synchronized!');

          updateNotification(syncNotifId, {
            type: 'success',
            status: 'success',
            title: 'Account Ready!',
            message: `${accountInfo?.accountName ?? accountInfo?.accountNumber ?? 'Your account'} is now connected and synchronized. You can now start trading!`,
            progress: 100,
          });
          clearNotification(syncNotifId);

          setTimeout(() => {
            setShowProgressBar(false);
            setProgress(0);
          }, 1500);
        }
      });

      setProgress(62);
      setProgressMessage('Synchronizing trading data...');
      socket.syncAccount(accountInfo?.id ?? '');

    } catch (error) {
      console.error('Error initializing socket:', error);
      addNotification({
        type: 'error',
        status: 'error',
        title: 'Sync Initialization Failed',
        message: 'Could not start sync. Please try again.',
        progress: 100,
      });
      toast.error('Socket initialization failed.');
    }
  }, [
    getSocketInstance,
    addNotification,
    updateNotification,
    clearNotification,
    setProgress,
    setProgressMessage,
    setMetricsRefreshed,
    setAccountIsFullySync,
    setIsSyncing,
    setShowProgressBar,
    setNotAccount,
    refreshAccounts,
  ]);

  /**
   * Turn on socket manually
   */
  const turnOnSocket = useCallback(() => {
    const socket = getSocketInstance();
    socket.connect();
  }, [getSocketInstance]);

  /**
   * Turn off socket manually
   */
  const turnOffSocket = useCallback(() => {
    const socket = getSocketInstance();
    socket.disconnect();
  }, [getSocketInstance]);

  /**
   * Check if socket is active
   */
  const isSocketActive = useCallback(() => {
    const socket = getSocketInstance();
    return socket.isConnected();
  }, [getSocketInstance]);

  return {
    emitSyncAccount,
    emitSyncAccountData,
    turnOnSocket,
    turnOffSocket,
    isSocketActive: isSocketActive(),
    registerListener,
  };
}
