import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { http } from '@/utils/http_request';
import useCreateAccount from '@/hook/useCreateAccount';
import { useAccountState } from '@/context/accounts/useAccountState';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Clock,
} from 'lucide-react';
import ButtonSync from '../ButtonSync';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useNotifications } from '@/context/NotificationContext';
import { useConnectionJobs } from '@/context/ConnectionJobContext';
import { toast } from 'react-toastify';

interface RequestAccountSyncButtonProps {
  accountId: string;
}

type SyncResponse = {
  data?: {
    account_number: string | number;
    password: string;
    broker_server: string;
    platform: string;
  };
};

type SyncStatus = 'idle' | 'checking' | 'connecting' | 'syncing' | 'success' | 'error';

const RequestAccountSyncButton: React.FC<RequestAccountSyncButtonProps> = ({ accountId }) => {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [metaApiId, setMetaApiId] = useState<string | null>(null);
  const { jobs } = useConnectionJobs();
  const isBackgroundJobActive = Array.from(jobs.values()).some(
    job => job.accountId === accountId && (job.status === 'ACTIVE' || job.status === 'STALLED' || job.status === 'PENDING')
  );
  const [retryCount, setRetryCount] = useState(0);
  const [lastSyncAttempt, setLastSyncAttempt] = useState<number | null>(null);

  const { onSubmitManual } = useCreateAccount();

  const {
    setAccountNumber,
    setAccountType,
    setSelectedServer,
    setAccountName,
    setViewPassword,
    setPassword,
    setIsCompactMode,
    setHandleActive,
  } = useAccountState();

  const { currentAccount } = useMTAccounts();
  const { addNotification } = useNotifications();

  const syncButtonRef = useRef<HTMLButtonElement | null>(null);
  const MAX_RETRIES = 3;
  const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

  // Check if cooldown is active
  const isCooldownActive = useCallback(() => {
    if (!lastSyncAttempt) return false;
    const timeSinceLastAttempt = Date.now() - lastSyncAttempt;
    return timeSinceLastAttempt < COOLDOWN_MS;
  }, [lastSyncAttempt]);

  // Get remaining cooldown time
  const getRemainingCooldown = useCallback(() => {
    if (!lastSyncAttempt) return 0;
    const elapsed = Date.now() - lastSyncAttempt;
    const remaining = Math.max(0, COOLDOWN_MS - elapsed);
    return Math.ceil(remaining / 60000); // Convert to minutes
  }, [lastSyncAttempt]);

  // Reset status after success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setErrorMsg(null);
        setRetryCount(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Looks up the account on the backend, which queries MetaApi with the server-side token.
  const checkAccountExists = async (login: string | number) => {
    try {
      const res = await http.get('/account/metaapi/lookup', { params: { login: String(login) } });
      return res.data.account ?? null;
    } catch (error: any) {
      console.error('Error checking MetaApi account:', error);
      throw new Error(`MetaApi check failed: ${error.message}`);
    }
  };

  // Get user-friendly error message
  const getErrorMessage = (error: any): string => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message;

    if (status === 404) {
      return 'Account not found. Please check the account ID.';
    } else if (status === 401 || status === 403) {
      return 'Authentication failed. Please refresh and try again.';
    } else if (status === 429) {
      return 'Too many requests. Please wait 15 minutes before trying again.';
    } else if (status === 500 || status === 502 || status === 503) {
      return 'Server temporarily unavailable. Our team has been notified.';
    } else if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
      return 'Connection timeout. Please check your internet and try again.';
    } else if (message?.toLowerCase().includes('network')) {
      return 'Network error. Please check your connection.';
    } else if (message) {
      return message;
    }

    return 'An unexpected error occurred. Please try again.';
  };

  // Main sync handler
  const handleSync = async () => {
    // Check cooldown
    if (isCooldownActive()) {
      const remainingMinutes = getRemainingCooldown();
      toast.warning(`Please wait ${remainingMinutes} more minute(s) before retrying.`);
      return;
    }

    setStatus('checking');
    setErrorMsg(null);
    setLastSyncAttempt(Date.now());

    try {
      // Step 1: Fetch account credentials
      const res = await http.get<SyncResponse>(`/account/sync/${accountId}`);
      const data = res?.data?.data;

      if (!data || !data.account_number) {
        throw new Error('Invalid account data received from server');
      }

      const { account_number, password, broker_server, platform } = data;

      // Step 2: Validate data
      if (!broker_server) {
        throw new Error('Broker server information is missing');
      }

      setStatus('connecting');

      // Prepare account data object to pass directly
      const accountData = {
        accountNumber: String(account_number),
        password: String(password),
        selectedServer: String(broker_server),
        accountType: String(platform)?.toLowerCase().includes('4') ? '4' : '5',
        accountName: `${broker_server}-${account_number}`,
      };

      // Also update context state for UI consistency (but don't rely on it for the connection)
      setAccountNumber(accountData.accountNumber);
      setPassword(accountData.password);
      setSelectedServer(accountData.selectedServer);
      setAccountType(accountData.accountType);
      setAccountName(accountData.accountName);
      setViewPassword(false);

      // Step 4: Check if account exists in MetaApi
      const existing = await checkAccountExists(account_number);

      // Step 5: Sync or create account
      setStatus('syncing');

      if (existing) {
        // Re-sync existing account
        setMetaApiId(existing.id);

        addNotification({
          type: 'info',
          title: 'Re-syncing Account',
          message: `Refreshing data for account ${account_number}...`,
          duration: 3000,
          autoClose: true,
        });

        // Trigger sync button click
        setTimeout(() => {
          syncButtonRef.current?.click();
        }, 100);
      } else {
        // Create new account - pass account data directly
        addNotification({
          type: 'info',
          title: 'Connecting New Account',
          message: `Setting up account ${account_number}...`,
          duration: 3000,
          autoClose: true,
        });

        // Pass the account data directly instead of relying on state
        await onSubmitManual(accountData.password, accountData);
      }

      setStatus('success');
      setRetryCount(0);
    } catch (err: any) {
      console.error('Sync error:', err);

      // if (err?.response?.status === 302&& err?.response?.data?.message?.includes('password is missing')) {
      if (err?.response?.status === 302) {
        // Notify support team about server errors
        setStatus('error');
        setIsCompactMode(true);
        setHandleActive(true);
        return;
      }

      const errorMessage = getErrorMessage(err);
      setErrorMsg(errorMessage);
      setStatus('error');

      // Increment retry count
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      // Show notification with retry option
      if (newRetryCount < MAX_RETRIES) {
        addNotification({
          type: 'error',
          title: 'Connection Failed',
          message: errorMessage,
          autoClose: false,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Max Retries Reached',
          message: `${errorMessage}. Please contact support via Telegram if this persists.`,
          autoClose: false,
        });
      }

      // toast.error(errorMessage);
    }
  };

  // Reset error and try again
  const handleRetry = () => {
    setStatus('idle');
    setErrorMsg(null);
    setTimeout(handleSync, 100);
  };

  // Get button content based on status
  const getButtonContent = () => {
    const effectiveStatus = isBackgroundJobActive ? 'syncing' : status;
    switch (effectiveStatus) {
      case 'checking':
        return (
          <>
            <Loader2 className='w-4 h-4 animate-spin' />
            <span className='hidden sm:inline'>Checking...</span>
          </>
        );
      case 'connecting':
        return (
          <>
            <Loader2 className='w-4 h-4 animate-spin' />
            <span className='hidden sm:inline'>Connecting...</span>
          </>
        );
      case 'syncing':
        return (
          <>
            <RefreshCw className='w-4 h-4 animate-spin' />
            <span className='hidden sm:inline'>Syncing...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle2 className='w-4 h-4' />
            <span className='hidden sm:inline'>Connected!</span>
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className='w-4 h-4' />
            <span className='hidden sm:inline'>Failed</span>
          </>
        );
      default:
        return (
          <>
            <RefreshCw className='w-4 h-4' />
            <span className='hidden sm:inline'>Resync</span>
          </>
        );
    }
  };

  // Get button styles
  const getButtonStyles = () => {
    const effectiveStatus = isBackgroundJobActive ? 'syncing' : status;
    const baseStyles = `
      group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2
      rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm
      transition-all duration-300 shadow-lg backdrop-blur-sm
      disabled:cursor-not-allowed disabled:opacity-50
    `;

    switch (effectiveStatus) {
      case 'checking':
      case 'connecting':
      case 'syncing':
        return `${baseStyles} bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-500/50 text-blue-300`;
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-500/30 to-green-600/30 border border-green-500/50 text-green-300`;
      case 'error':
        return `${baseStyles} bg-gradient-to-r from-red-500/30 to-red-600/30 border border-red-500/50 text-red-300`;
      default:
        return `${baseStyles} bg-gradient-to-r from-teal-500/30 to-blue-500/30 border border-teal-500/50 text-white hover:from-teal-500/40 hover:to-blue-500/40 hover:border-teal-400 hover:shadow-teal-500/20`;
    }
  };

  const isLoading = status === 'checking' || status === 'connecting' || status === 'syncing' || isBackgroundJobActive;
  const canRetry = status === 'error' && retryCount < MAX_RETRIES && !isCooldownActive();

  return (
    <div className='flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto'>
      {/* Main sync button */}
      <motion.button
        type='button'
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
        disabled={isLoading || isCooldownActive()}
        onClick={handleSync}
        className={getButtonStyles()}
        title={
          isCooldownActive()
            ? `Please wait ${getRemainingCooldown()} more minutes`
            : 'Connect and sync account'
        }
      >
        {getButtonContent()}
      </motion.button>

      {/* Hidden ButtonSync component for re-sync */}
      <div className='hidden'>
        <ButtonSync
          currentAccount={currentAccount}
          metaApiId={metaApiId ?? undefined}
          ref={syncButtonRef}
        />
      </div>

      {/* Error message with retry */}
      <AnimatePresence mode='wait'>
        {status === 'error' && errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className='flex flex-col sm:flex-row items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/30 backdrop-blur-sm w-full sm:w-auto'
          >
            <div className='flex items-start gap-2 flex-1'>
              <AlertCircle className='w-4 h-4 text-red-400 flex-shrink-0 mt-0.5' />
              <p className='text-xs text-red-300 flex-1'>{errorMsg}</p>
            </div>

            <div className='flex items-center gap-2'>
              {canRetry && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  className='px-3 py-1 rounded-md bg-red-500/30 hover:bg-red-500/40 border border-red-400/50 text-red-200 text-xs font-medium transition-all'
                >
                  Retry ({MAX_RETRIES - retryCount} left)
                </motion.button>
              )}

              {retryCount >= MAX_RETRIES && (
                <motion.a
                  href='https://t.me/tradetab_support'
                  target='_blank'
                  rel='noopener noreferrer'
                  whileHover={{ scale: 1.05 }}
                  className='flex items-center gap-1 px-3 py-1 rounded-md bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/50 text-blue-200 text-xs font-medium transition-all'
                >
                  <span>Get Help</span>
                  <ExternalLink className='w-3 h-3' />
                </motion.a>
              )}

              {isCooldownActive() && (
                <div className='flex items-center gap-1 px-3 py-1 rounded-md bg-orange-500/20 border border-orange-400/30 text-orange-200 text-xs'>
                  <Clock className='w-3 h-3' />
                  <span>{getRemainingCooldown()}m</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestAccountSyncButton;
