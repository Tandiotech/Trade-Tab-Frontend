import { toast } from 'react-toastify';
import axios from 'axios';
import { http } from '@/utils/http_request';
import { FXE_BASE_URL, RUTE_ERRORS_SLACKFXE, RUTE_SYNC_FXE_ACCOUNT } from '@/utils/Rutes';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useProgressBar } from '@/context/ProgressBarContext';
import getUser from '@/utils/getUser';

export function useSyncFXE(accountLogin: string | null) {
  const { setIsSyncing } = useProgressBar();
  const { currentAccount } = useMTAccounts();
  const startSync = async () => {
    if (!accountLogin) {
      toast.error('No valid account login provided.');
      return;
    }
    if (!FXE_BASE_URL) {
      toast.error('FXE sync service is not configured.');
      return;
    }

    setIsSyncing(true);

    try {
      // Llamar a la API con el login en la URL
      const response: any = await axios.post(`${FXE_BASE_URL}/accounts/resync/${encodeURIComponent(accountLogin)}`);

      const res_sync = await http.post(RUTE_SYNC_FXE_ACCOUNT, {
        account: currentAccount,
        trades: response?.data?.trades,
      });
      if (response.status === 200) {
        toast.success('FXE Data Updated');
      } else {
        toast.error(`Error syncing FXE account: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error during FXE sync:', error);
      toast.error(`Error syncing FXE account: ${error.response?.data?.detail || error.message}`);
      // Reporte opcional (solo si configuras VITE_ERRORS_ENDPOINT)
      try {
        const httpStatus = error?.response?.status ?? null;
        const errorMessage = error?.message ?? 'Unknown error';
        const errorDetail = error?.response?.data ?? null;
        const correlationId = crypto?.randomUUID?.() ?? String(Date.now());
        const occurredAt = new Date().toISOString();

        await http.post(RUTE_ERRORS_SLACKFXE, {
          userName: getUser?.userName ?? 'unknown',
          endpoint: `${FXE_BASE_URL}/accounts`,
          serverHost: new URL(FXE_BASE_URL).hostname,
          httpStatus,
          errorMessage,
          errorDetail,
          requestPayload: {
            accountLogin: accountLogin,
          },
          correlationId,
          occurredAt,
        });
      } catch (reportErr) {
        console.error('Could not report FXE error:', reportErr);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return { startSync };
}
