import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMode } from '@/context/ModeContext';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requiresAccount?: boolean;
}

/**
 * RouteGuard - Protects routes based on mode and account status
 * - If requiresAccount is true and user has no accounts in Real Mode, redirect to /accounts
 * - In Example Mode, all routes are accessible
 * - MT Accounts route is always accessible
 * - Handles mode changes dynamically
 */
export default function RouteGuard({ children, requiresAccount = true }: RouteGuardProps) {
  const { isExampleMode, isRealMode } = useMode();
  const { accounts, loadingAccounts } = useMTAccounts();
  const location = useLocation();
  const navigate = useNavigate();
  const hasAccounts = Array.isArray(accounts) && accounts.length > 0;

  // Handle mode changes - redirect if switching to Real Mode without accounts
  useEffect(() => {
    // Don't redirect if accounts are loading
    if (loadingAccounts) return;

    // Don't redirect if already on accounts page
    if (location.pathname === '/accounts') return;

    // If switching to Real Mode without accounts, redirect immediately
    if (isRealMode && !hasAccounts && requiresAccount) {
      navigate('/accounts', { replace: true });
    }
  }, [isRealMode, hasAccounts, loadingAccounts, location.pathname, navigate, requiresAccount]);

  // Always allow access to accounts page
  if (location.pathname === '/accounts') {
    return <>{children}</>;
  }

  // If accounts are still loading, show children (will show loading state)
  if (loadingAccounts) {
    return <>{children}</>;
  }

  // In example mode, allow all routes
  if (isExampleMode) {
    return <>{children}</>;
  }

  // If route requires account and user has no accounts, redirect to accounts page
  if (requiresAccount && !hasAccounts) {
    return <Navigate to="/accounts" replace />;
  }

  // Otherwise, allow access
  return <>{children}</>;
}

