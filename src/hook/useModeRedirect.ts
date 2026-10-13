import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMode } from '@/context/ModeContext';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';

/**
 * Hook to handle redirects when mode changes
 * Redirects to /accounts if switching to Real Mode without accounts
 */
export function useModeRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRealMode } = useMode();
  const { accounts, loadingAccounts } = useMTAccounts();
  const hasAccounts = Array.isArray(accounts) && accounts.length > 0;

  useEffect(() => {
    // Don't redirect if accounts are loading
    if (loadingAccounts) return;

    // Don't redirect if already on accounts page
    if (location.pathname === '/accounts') return;

    // If in Real Mode without accounts, redirect to accounts page
    if (isRealMode && !hasAccounts) {
      navigate('/accounts', { replace: true });
    }
  }, [isRealMode, hasAccounts, loadingAccounts, location.pathname, navigate]);
}

