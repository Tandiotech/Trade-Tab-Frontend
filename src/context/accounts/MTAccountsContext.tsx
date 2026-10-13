import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
  type SetStateAction,
} from 'react';
import { RUTE_GET_ALL_ACCOUNTS_BY_USER, RUTE_DELETE_ACCOUNT } from '../../utils/Rutes';
import { http } from '../../utils/http_request';

/** URL and API use numeric account_number; some UI paths pass strings — normalize here. */
function coerceAccountNumber(value: unknown): number | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// ✅ Define Account structure
interface Account {
  external_id: string;
  _id: string;
  account_number: number;
  platform: string;
  name: string;
  balance: number;
  currency: string;
  broker: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Define Context structure
interface MTAccountsContextType {
  accounts: Account[];
  accountsLoading: boolean;
  isInitialized: boolean; // Flag to track if initial load is complete
  currentAccount: any | null;
  currentAccountNumber: number | null;
  setCurrentAccountNumber: (accountNumber: SetStateAction<number | string | null>) => void;
  refreshAccounts: () => Promise<void>;
  deleteAccount: (external_id: string) => Promise<void>;
  deletingAccount: string | null;
  loadingAccounts: boolean;
  accountSummary: any;
  showWelcome: boolean;
  setShowWelcome: any;
}

interface IAccountSummary {
  totalAccounts: number | null;
  demoAccounts: number;
  realAccounts: number;
  totalBalance: number | null;
  totalDemoBalance: number | null;
  totalRealBalance: number | null;
}

// ✅ Create Context with proper typing
const MTAccountsContext = createContext<MTAccountsContextType | undefined>(undefined);

// Custom Hook for Context
export const useMTAccounts = (): MTAccountsContextType => {
  const context = useContext(MTAccountsContext);
  if (!context) {
    throw new Error('useMTAccounts must be used within an MTAccountContextProvider');
  }
  return context;
};

// ✅ Define Props for Provider
interface MTAccountContextProviderProps {
  children: ReactNode;
}

// ✅ Context Provider with Proper Typing
const MTAccountContextProvider: React.FC<MTAccountContextProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountSummary, setAccountSummary] = useState<IAccountSummary>({
    totalAccounts: null,
    demoAccounts: 0,
    realAccounts: 0,
    totalBalance: null,
    totalDemoBalance: null,
    totalRealBalance: null,
  });
  const [currentAccountNumber, setAccountNumberRaw] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // Track if initial load is complete
  const [deletingAccount, setDeletingAccount] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const setCurrentAccountNumber = useCallback((update: SetStateAction<number | string | null>) => {
    setAccountNumberRaw(prev => {
      const resolved = typeof update === 'function' ? update(prev) : update;
      return coerceAccountNumber(resolved);
    });
  }, []);

  // ✅ Fetch accounts from backend
  const refreshAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await http.get(RUTE_GET_ALL_ACCOUNTS_BY_USER);
      const validAccounts: Account[] = response.data.data.filter(
        (account: Account) => account.external_id
      );

      setAccounts(validAccounts);
      setAccountSummary(
        response.data.summary || {
          totalAccounts: 0,
          demoAccounts: 0,
          realAccounts: 0,
          totalBalance: 0,
          totalDemoBalance: 0,
          totalRealBalance: 0,
        }
      );

      const params = new URLSearchParams(window.location.search);
      const accountParam = params.get('account');

      if (accountParam) {
        const accountNumber = parseInt(accountParam, 10);
        if (validAccounts.some(acc => acc.account_number === accountNumber)) {
          setCurrentAccountNumber(accountNumber);
          return; // ✅ Exit early if valid
        }
      }

      // ✅ Set default account if none selected
      // Use functional update to read current state without dependency
      setCurrentAccountNumber(prev => {
        if (!prev && validAccounts.length > 0) {
          return validAccounts[0].account_number;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccounts([]);
      setAccountSummary({
        totalAccounts: 0,
        demoAccounts: 0,
        realAccounts: 0,
        totalBalance: 0,
        totalDemoBalance: 0,
        totalRealBalance: 0,
      });
    } finally {
      setLoading(false);
      // Mark as initialized after first load completes
      setIsInitialized(true);
    }
  }, [setCurrentAccountNumber]);

  // ✅ Delete an account
  const deleteAccount = useCallback(
    async (external_id: string) => {
      setDeletingAccount(external_id);
      try {
        await http.post(RUTE_DELETE_ACCOUNT, { external_id: external_id });
        await refreshAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      } finally {
        setDeletingAccount(null);
      }
    },
    [refreshAccounts]
  );

  // ✅ Load accounts on mount
  useEffect(() => {
    refreshAccounts();
  }, [refreshAccounts]);

  useEffect(() => {
    if (showWelcome) {
      setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    }
  }, [showWelcome]);

  // ✅ Get current account based on `currentAccountNumber` (numeric compare — see coerceAccountNumber)
  const currentAccount = useMemo(() => {
    if (currentAccountNumber == null || !Number.isFinite(currentAccountNumber)) return null;
    return accounts.find(acc => Number(acc.account_number) === currentAccountNumber) || null;
  }, [accounts, currentAccountNumber]);

  // ✅ Memoize context value to prevent unnecessary re-renders
  const value: MTAccountsContextType = useMemo(
    () => ({
      accounts,
      accountsLoading: loading,
      isInitialized,
      currentAccount,
      currentAccountNumber,
      setCurrentAccountNumber,
      refreshAccounts,
      deleteAccount,
      deletingAccount,
      loadingAccounts: loading,
      accountSummary,
      showWelcome,
      setShowWelcome,
    }),
    [
      accounts,
      loading,
      isInitialized,
      currentAccount,
      currentAccountNumber,
      setCurrentAccountNumber,
      refreshAccounts,
      deleteAccount,
      deletingAccount,
      accountSummary,
      showWelcome,
    ]
  );

  return <MTAccountsContext.Provider value={value}>{children}</MTAccountsContext.Provider>;
};

export default MTAccountContextProvider;
