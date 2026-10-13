import { useMemo } from 'react';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { useOnboarding } from '@/context/OnboardingContext';

/**
 * Hook to determine if onboarding should be shown
 * Returns true when:
 * - User has no accounts
 * - Onboarding hasn't been completed
 * - Accounts are not loading
 */
export function useShouldShowOnboarding() {
  const { accounts, loadingAccounts } = useMTAccounts();
  const { hasCompletedOnboarding, isOnboardingActive } = useOnboarding();

  const shouldShow = useMemo(() => {
    // Don't show if already completed
    if (hasCompletedOnboarding) return false;
    
    // Don't show if accounts are still loading
    if (loadingAccounts) return false;
    
    // Show if no accounts exist
    if (!Array.isArray(accounts) || accounts.length === 0) {
      return true;
    }
    
    return false;
  }, [accounts, loadingAccounts, hasCompletedOnboarding]);

  return shouldShow;
}

