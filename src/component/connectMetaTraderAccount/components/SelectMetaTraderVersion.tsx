// SelectMetaTraderVersion.tsx
import { useState, useEffect } from 'react';
import { Shield, Zap, Loader2, CheckCircle, XCircle } from 'lucide-react';
// import axios from 'axios';
import { http } from '@/utils/http_request';
import { RUTE_ERRORS_SLACKFXE, FXE_BASE_URL } from '@/utils/Rutes';
import getUser from '@/utils/getUser';
// import { useAccountState } from '@/context/accounts/useAccountState';

function SelectMetaTraderVersion({ accountType, setAccountType }: any) {
  // const { setFxeApiOnline } = useAccountState();
  const [checkingApi, setCheckingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<'ok' | 'error' | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    const checkApi = async () => {
      if (accountType !== '5') return;

      setCheckingApi(true);
      setApiStatus(null);
      // setFxeApiOnline(null);

      const occurredAt = new Date().toISOString();
      const correlationId =
        (crypto as any).randomUUID?.() || Math.random().toString(36).slice(2, 10);

      try {
        // const res = await axios.get(`${FXE_BASE_URL}/health`, {
        //   timeout: 4000,
        //   signal: ac.signal,
        // });

        // if (res.status === 200 && res.data?.status === 'ok') {
          // setApiStatus('ok');
          // setFxeApiOnline(true);
        // } else {
          // throw new Error(`Unexpected response: ${res.status}`);
        // }
      } catch (error: any) {
        if (ac.signal.aborted) return;
        setApiStatus('error');
        // setFxeApiOnline(false);

        // Reporte a Slack (no bloqueante)
        (async () => {
          try {
            const httpStatus = error?.response?.status ?? 503;
            await http.post(RUTE_ERRORS_SLACKFXE, {
              userName: getUser?.userName ? `platform FXE ${getUser.userName}` : 'unknown',
              endpoint: `${FXE_BASE_URL}/health`,
              serverHost: FXE_BASE_URL ? new URL(FXE_BASE_URL).hostname : 'not-configured',
              httpStatus,
              errorMessage: 'Server down',
              errorDetail: 'Server not reachable',
              requestPayload: { selectedAccountType: accountType },
              correlationId,
              occurredAt,
            });
          } catch {}
        })();
      } finally {
        if (!ac.signal.aborted) setCheckingApi(false);
      }
    };

    checkApi();
    return () => ac.abort();
  }, [accountType]);

  return (

    <div className='space-y-3 mb-4'>
      <div className='text-[11px] font-medium text-gray-400 tracking-wider uppercase flex items-center gap-1.5 mb-2'>
        <Shield className='w-3 h-3' /> Trading Platform
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <button
          type='button'
          onClick={() => setAccountType('4')}
          className={`group relative p-3 rounded-lg border-[1.5px] transition-all duration-200 text-center flex flex-col items-center ${
            accountType === '4'
              ? 'bg-teal-500/10 border-teal-500 text-white'
              : 'bg-darkblack-600 border-gray-700/50 text-gray-300 hover:border-gray-600 hover:bg-darkblack-500'
          }`}
        >
          <div className='text-xl mb-1.5'>🛡</div>
          <div className='text-sm font-semibold mb-1'>MetaTrader 4</div>
          <div className={`text-[10px] leading-relaxed ${accountType === '4' ? 'text-gray-300' : 'text-gray-500'}`}>Classic platform with proven stability</div>
        </button>

        <button
          type='button'
          onClick={() => setAccountType('5')}
          className={`group relative p-3 rounded-lg border-[1.5px] transition-all duration-200 text-center flex flex-col items-center ${
            accountType === '5'
              ? 'bg-teal-500/10 border-teal-500 text-white'
              : 'bg-darkblack-600 border-gray-700/50 text-gray-300 hover:border-gray-600 hover:bg-darkblack-500'
          }`}
        >
          <div className='text-xl mb-1.5'>⚡</div>
          <div className='text-sm font-semibold mb-1'>MetaTrader 5</div>
          <div className={`text-[10px] leading-relaxed ${accountType === '5' ? 'text-gray-300' : 'text-gray-500'}`}>Advanced features & multi-asset</div>
          <div className='inline-block bg-teal-500/10 text-teal-400 border border-teal-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded mt-1.5 tracking-wider'>
            RECOMMENDED
          </div>
        </button>
      </div>

      {accountType === '5' && (
        <div className='flex items-center justify-center gap-1.5 text-[10px] opacity-80 mt-1'>
          {checkingApi && (
            <>
              <Loader2 className='animate-spin w-3 h-3 text-teal-400' />
              <span>Checking API...</span>
            </>
          )}
          {apiStatus === 'ok' && (
            <>
              <CheckCircle className='w-3 h-3 text-green-400' />
              <span>API online</span>
            </>
          )}
          {apiStatus === 'error' && (
            <>
              <XCircle className='w-3 h-3 text-red-400' />
              <span>API offline</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectMetaTraderVersion;
