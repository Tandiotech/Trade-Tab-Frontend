import { User } from '@/types/User';

/**
 * Default maximum accounts allowed if not specified
 */
const DEFAULT_MAX_ACCOUNTS = 5;

/**
 * Maximum allowed value for maxAccountsAllowed (safety check)
 */
const MAX_ACCOUNTS_LIMIT = 1000;

/**
 * Utility functions for managing max accounts logic
 */
export const maxAccountsUtils = {
  /**
   * Get max accounts with default fallback
   * @param user - User object that may contain maxAccountsAllowed
   * @returns The maximum accounts allowed for the user
   */
  getMaxAccounts: (user: User | null | undefined): number => {
    if (!user) return DEFAULT_MAX_ACCOUNTS;

    const maxAccounts = user.maxAccountsAllowed;

    // Validate the value
    if (
      typeof maxAccounts === 'number' &&
      maxAccounts >= 1 &&
      maxAccounts <= MAX_ACCOUNTS_LIMIT
    ) {
      return maxAccounts;
    }

    // Return default if invalid or undefined
    return DEFAULT_MAX_ACCOUNTS;
  },

  /**
   * Check if user can create more accounts
   * @param user - User object
   * @param currentAccountCount - Current number of accounts
   * @returns True if user can create more accounts
   */
  canCreateAccount: (user: User | null | undefined, currentAccountCount: number): boolean => {
    const maxAllowed = maxAccountsUtils.getMaxAccounts(user);
    return currentAccountCount < maxAllowed;
  },

  /**
   * Get remaining account slots
   * @param user - User object
   * @param currentAccountCount - Current number of accounts
   * @returns Number of remaining account slots
   */
  getRemainingAccounts: (user: User | null | undefined, currentAccountCount: number): number => {
    const maxAllowed = maxAccountsUtils.getMaxAccounts(user);
    return Math.max(0, maxAllowed - currentAccountCount);
  },

  /**
   * Format max accounts for display
   * @param maxAccounts - Maximum accounts number
   * @returns Formatted string
   */
  formatMaxAccounts: (maxAccounts: number): string => {
    return `${maxAccounts} account${maxAccounts !== 1 ? 's' : ''}`;
  },

  /**
   * Calculate usage percentage
   * @param user - User object
   * @param currentAccountCount - Current number of accounts
   * @returns Usage percentage (0-100)
   */
  getUsagePercentage: (user: User | null | undefined, currentAccountCount: number): number => {
    const maxAllowed = maxAccountsUtils.getMaxAccounts(user);
    return Math.min(100, (currentAccountCount / maxAllowed) * 100);
  },

  /**
   * Check if user is near the limit (80% or more)
   * @param user - User object
   * @param currentAccountCount - Current number of accounts
   * @returns True if user is near the limit
   */
  isNearLimit: (user: User | null | undefined, currentAccountCount: number): boolean => {
    const maxAllowed = maxAccountsUtils.getMaxAccounts(user);
    return currentAccountCount >= maxAllowed * 0.8;
  },

  /**
   * Check if user is at the limit
   * @param user - User object
   * @param currentAccountCount - Current number of accounts
   * @returns True if user has reached the limit
   */
  isAtLimit: (user: User | null | undefined, currentAccountCount: number): boolean => {
    const maxAllowed = maxAccountsUtils.getMaxAccounts(user);
    return currentAccountCount >= maxAllowed;
  },
};

/**
 * Safe function to get max accounts with error handling
 * @param user - User object (can be null/undefined)
 * @returns Max accounts allowed (defaults to 5)
 */
export const safeGetMaxAccounts = (user: User | null | undefined): number => {
  try {
    return maxAccountsUtils.getMaxAccounts(user);
  } catch (error) {
    console.error('Error reading maxAccountsAllowed:', error);
    return DEFAULT_MAX_ACCOUNTS;
  }
};

// export default maxAccountsUtils;

