import {
  useState,
  useMemo,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { MetricData } from '../../types/metrics';
import { http } from '../../utils/http_request';
import { RUTE_SINGLE_ACCOUNT_METRICS, RUTE_CONNECT_ACCOUNT } from '../../utils/Rutes';
import { useMTAccounts } from './MTAccountsContext';

interface MetricsContextType {
  metricsRefreshed: boolean;
  setMetricsRefreshed: (value: boolean) => void;
  metricsData: MetricData | null;
  fetchMetrics: (accountId: string) => Promise<MetricData | null>;
  loadingMetrics: boolean;
  isRefreshing: boolean;
  hasCachedMetrics: boolean;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export function useMetrics(accountId?: string) {
  const context = useContext(MetricsContext);
  if (!context) {
    return {
      loadingMetrics: false,
      isRefreshing: false,
      hasCachedMetrics: false,
      metricsData: null,
      fetchMetrics: () => Promise.resolve(null),
      metricsRefreshed: false,
      setMetricsRefreshed: () => {},
    };
  }

  useEffect(() => {
    if (accountId) {
      context.fetchMetrics(accountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchMetrics is stable
  }, [accountId]);

  return context;
}

export const MetricsProvider = ({ children }: { children: ReactNode }) => {
  const [metricsRefreshed, setMetricsRefreshed] = useState(false);
  const [metricsData, setMetricsData] = useState<MetricData | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { currentAccount, accounts, accountsLoading, refreshAccounts } = useMTAccounts();

  const cacheRef = useRef<Map<string, MetricData>>(new Map());
  const isFetchingRef = useRef(false);
  const activeAccountIdRef = useRef<string | undefined>(undefined);

  const accountId = currentAccount?._id;
  const hasCachedMetrics = !!(accountId && cacheRef.current.has(accountId));

  useEffect(() => {
    activeAccountIdRef.current = accountId;
    if (!accountId) {
      setMetricsData(null);
      return;
    }
    const cached = cacheRef.current.get(accountId);
    if (cached) {
      setMetricsData(cached);
    }
  }, [accountId]);

  useEffect(() => {
    if (accounts.length === 0 && !accountsLoading) {
      setLoadingMetrics(false);
      setIsRefreshing(false);
    }
  }, [accounts.length, accountsLoading]);

  const fetchMetrics = useCallback(async (targetAccountId: string) => {
    if (isFetchingRef.current) return cacheRef.current.get(targetAccountId) ?? null;

    const cached = cacheRef.current.get(targetAccountId);
    const isStaleRefresh = !!cached;

    isFetchingRef.current = true;
    if (isStaleRefresh) {
      setIsRefreshing(true);
      setLoadingMetrics(false);
    } else {
      setLoadingMetrics(true);
      setIsRefreshing(false);
    }

    try {
      const res = await http.post(RUTE_SINGLE_ACCOUNT_METRICS, { account: targetAccountId });
      const data = res?.data?.data ?? null;
      if (data) {
        cacheRef.current.set(targetAccountId, data);
      }
      if (activeAccountIdRef.current === targetAccountId) {
        setMetricsData(data);
      }
      return data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return cached ?? null;
    } finally {
      setLoadingMetrics(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const triedConnectRef =
      (fetchMetrics as unknown as { _triedConnectRef?: { current: Map<string, boolean> } })
        ._triedConnectRef ?? { current: new Map<string, boolean>() };

    (fetchMetrics as unknown as { _triedConnectRef: typeof triedConnectRef })._triedConnectRef =
      triedConnectRef;

    const run = async () => {
      if (!accountId) return;

      const fetched = await fetchMetrics(accountId);

      const hasMetrics = !!(fetched && Object.keys(fetched).length > 0);
      if (!hasMetrics && !triedConnectRef.current.get(accountId)) {
        triedConnectRef.current.set(accountId, true);
        try {
          const res = await http.post(RUTE_CONNECT_ACCOUNT, { account: accountId });
          if (res?.data?.status === 200) {
            if (refreshAccounts) await refreshAccounts();
            if (mounted) await fetchMetrics(accountId);
          }
        } catch (err) {
          console.warn('Error attempting to connect account for metrics:', err);
        }
      }

      if (metricsRefreshed) {
        setMetricsRefreshed(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [accountId, fetchMetrics, metricsRefreshed, refreshAccounts]);

  const value = useMemo(
    () => ({
      metricsRefreshed,
      setMetricsRefreshed,
      metricsData,
      fetchMetrics,
      loadingMetrics,
      isRefreshing,
      hasCachedMetrics,
    }),
    [metricsRefreshed, metricsData, fetchMetrics, loadingMetrics, isRefreshing, hasCachedMetrics]
  );

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
};
