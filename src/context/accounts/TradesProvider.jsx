import { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { http } from '../../utils/http_request';
import { RUTE_GET_TRADES, RUTE_CONNECT_ACCOUNT } from '../../utils/Rutes';
import { useMTAccounts } from './MTAccountsContext';
import { useProgressBar } from '../ProgressBarContext';

export const TradesContext = createContext();

/** Dedupe POST /account/connect (React Strict Mode double-mount + parallel effects). */
const connectAccountHttpInflight = new Map();

export const TradesProvider = ({ children }) => {
  const [tradesCache, setTradesCache] = useState({});
  const [tradesLoading, setTradesLoading] = useState(false);
  const [connectingAccount, setConnectingAccount] = useState(false);

  const { currentAccount } = useMTAccounts();
  const { setAccountIsBeenDeploying, setShowProgressBar, setProgress, setProgressMessage } =
    useProgressBar();

  // Para evitar loops infinitos solo reconectas si lo decide el backend.
  const alreadyConnectedRef = useRef(new Set());

  /**
   * 🔌 Connect the account (only when necessary)
   */
  const connectAccount = useCallback(async accountId => {
    try {
      const dedupeKey = String(accountId);

      let promise = connectAccountHttpInflight.get(dedupeKey);
      if (!promise) {
        promise = http.post(RUTE_CONNECT_ACCOUNT, { account: accountId });
        connectAccountHttpInflight.set(dedupeKey, promise);
        promise.finally(() => connectAccountHttpInflight.delete(dedupeKey));
      }

      const response = await promise;

      if (response?.status === 200) {

        return true;
      }

      console.warn('⚠️ connectAccount failed');
      return false;
    } catch (err) {
      console.error('❌ connectAccount error:', err);
      return false;
    }
  }, []);

  /**
   * 📥 Fetch trades (checks if backend succeeded)
   */
  const fetchTrades = useCallback(async externalId => {
    if (!externalId) return null;

    try {

      const response = await http.post(RUTE_GET_TRADES, {
        account_mt_id: externalId,
      });

      // Si trae trades
      if (response.status === 200 && Array.isArray(response.data.data)) {
        const trades = response.data.data;

        setTradesCache(prev => ({
          ...prev,
          [externalId]: trades,
        }));

        return { ok: true, trades };
      }

      // Si la cuenta existe pero no hay trades
      if (response.status === 204) {

        return { ok: false, reason: 'NO_TRADES' };
      }

      return { ok: false, reason: 'UNKNOWN' };
    } catch (err) {
      console.error('❌ fetchTrades error:', err);
      return { ok: false, reason: 'ERROR' };
    }
  }, []);

  /**
   * 🔄 MAIN LOGIC
   * Solo conecta la cuenta si trades NO existen o el backend lo pide.
   */
  useEffect(() => {
    const run = async () => {
      const accountId = currentAccount?._id;
      const externalId = currentAccount?.external_id;

      if (!accountId || !externalId) {
        setTradesLoading(false);
        return;
      }

      // Si ya tenemos trades, no hacemos nada
      if (tradesCache[externalId]) {

        setTradesLoading(false);
        return;
      }

      setTradesLoading(true);

      // Primero intentamos cargar trades desde el backend (sin reconectar)
      const result = await fetchTrades(externalId);

      if (result.ok) {
        // Ya hay trades → no conectar
        setTradesLoading(false);
        return;
      }

      const dedupeKey = String(accountId);
      // NO hay trades o error → intentar conectar solo si no lo hicimos antes
      if (!alreadyConnectedRef.current.has(dedupeKey)) {

        alreadyConnectedRef.current.add(dedupeKey);

        setConnectingAccount(true);
        setShowProgressBar(true);
        setAccountIsBeenDeploying(true);
        setProgress(18);
        setProgressMessage(
          'Connecting account: MetaApi deploy → broker → RPC (same as new account setup, may take 1–2 min)…'
        );

        let connected = false;
        try {
          connected = await connectAccount(accountId);
        } finally {
          setConnectingAccount(false);
          setAccountIsBeenDeploying(false);
          setShowProgressBar(false);
          setProgress(0);
          setProgressMessage('Initializing connection...');
        }

        if (connected) {

          await fetchTrades(externalId);
        }
      }

      setTradesLoading(false);
    };

    run();
  }, [currentAccount, tradesCache, fetchTrades, connectAccount]);

  return (
    <TradesContext.Provider
      value={{
        tradesCache,
        tradesLoading,
        connectingAccount,
        fetchTrades,
      }}
    >
      {children}
    </TradesContext.Provider>
  );
};
