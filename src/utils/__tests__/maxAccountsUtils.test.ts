/**
 * Unit tests for maxAccountsUtils
 * 
 * To run these tests:
 * npm test -- maxAccountsUtils.test.ts
 * or
 * npx jest maxAccountsUtils.test.ts
 */

import { maxAccountsUtils, safeGetMaxAccounts } from '../maxAccountsUtils';
import { User } from '@/types/User';

describe('maxAccountsUtils', () => {
  // Mock users for testing
  const createUser = (maxAccounts?: number): User => ({
    userName: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    maxAccountsAllowed: maxAccounts,
  });

  describe('getMaxAccounts', () => {
    it('should return the maxAccountsAllowed when valid', () => {
      const user = createUser(10);
      expect(maxAccountsUtils.getMaxAccounts(user)).toBe(10);
    });

    it('should return default 5 when maxAccountsAllowed is undefined', () => {
      const user = createUser();
      expect(maxAccountsUtils.getMaxAccounts(user)).toBe(5);
    });

    it('should return default 5 when user is null', () => {
      expect(maxAccountsUtils.getMaxAccounts(null)).toBe(5);
    });

    it('should return default 5 when user is undefined', () => {
      expect(maxAccountsUtils.getMaxAccounts(undefined)).toBe(5);
    });

    it('should return default 5 when maxAccountsAllowed is negative', () => {
      const user = createUser(-1);
      expect(maxAccountsUtils.getMaxAccounts(user)).toBe(5);
    });

    it('should return default 5 when maxAccountsAllowed is 0', () => {
      const user = createUser(0);
      expect(maxAccountsUtils.getMaxAccounts(user)).toBe(5);
    });

    it('should return default 5 when maxAccountsAllowed exceeds 1000', () => {
      const user = createUser(9999);
      expect(maxAccountsUtils.getMaxAccounts(user)).toBe(5);
    });

    it('should return default 5 when maxAccountsAllowed is not a number', () => {
      const user = createUser();
      (user as any).maxAccountsAllowed = 'invalid';
      expect(maxAccountsUtils.getMaxAccounts(user)).toBe(5);
    });

    it('should accept 1 as minimum valid value', () => {
      const user = createUser(1);
      expect(maxAccountsUtils.getMaxAccounts(user)).toBe(1);
    });

    it('should accept 1000 as maximum valid value', () => {
      const user = createUser(1000);
      expect(maxAccountsUtils.getMaxAccounts(user)).toBe(1000);
    });
  });

  describe('canCreateAccount', () => {
    it('should return true when under limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.canCreateAccount(user, 3)).toBe(true);
    });

    it('should return false when at limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.canCreateAccount(user, 5)).toBe(false);
    });

    it('should return false when over limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.canCreateAccount(user, 6)).toBe(false);
    });

    it('should return true when 0 accounts and limit is 1', () => {
      const user = createUser(1);
      expect(maxAccountsUtils.canCreateAccount(user, 0)).toBe(true);
    });

    it('should use default limit when user is null', () => {
      expect(maxAccountsUtils.canCreateAccount(null, 3)).toBe(true);
      expect(maxAccountsUtils.canCreateAccount(null, 5)).toBe(false);
    });
  });

  describe('getRemainingAccounts', () => {
    it('should return correct remaining count', () => {
      const user = createUser(10);
      expect(maxAccountsUtils.getRemainingAccounts(user, 3)).toBe(7);
    });

    it('should return 0 when at limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.getRemainingAccounts(user, 5)).toBe(0);
    });

    it('should return 0 when over limit (not negative)', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.getRemainingAccounts(user, 10)).toBe(0);
    });

    it('should return max accounts when count is 0', () => {
      const user = createUser(10);
      expect(maxAccountsUtils.getRemainingAccounts(user, 0)).toBe(10);
    });
  });

  describe('getUsagePercentage', () => {
    it('should return correct percentage', () => {
      const user = createUser(10);
      expect(maxAccountsUtils.getUsagePercentage(user, 5)).toBe(50);
    });

    it('should return 0 when no accounts', () => {
      const user = createUser(10);
      expect(maxAccountsUtils.getUsagePercentage(user, 0)).toBe(0);
    });

    it('should return 100 when at limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.getUsagePercentage(user, 5)).toBe(100);
    });

    it('should cap at 100 when over limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.getUsagePercentage(user, 10)).toBe(100);
    });

    it('should handle decimal percentages', () => {
      const user = createUser(3);
      expect(maxAccountsUtils.getUsagePercentage(user, 1)).toBeCloseTo(33.33, 1);
    });
  });

  describe('isNearLimit', () => {
    it('should return true when at 80% or more', () => {
      const user = createUser(10);
      expect(maxAccountsUtils.isNearLimit(user, 8)).toBe(true);
      expect(maxAccountsUtils.isNearLimit(user, 9)).toBe(true);
      expect(maxAccountsUtils.isNearLimit(user, 10)).toBe(true);
    });

    it('should return false when under 80%', () => {
      const user = createUser(10);
      expect(maxAccountsUtils.isNearLimit(user, 7)).toBe(false);
      expect(maxAccountsUtils.isNearLimit(user, 5)).toBe(false);
      expect(maxAccountsUtils.isNearLimit(user, 0)).toBe(false);
    });

    it('should handle exactly 80%', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.isNearLimit(user, 4)).toBe(true);
    });
  });

  describe('isAtLimit', () => {
    it('should return true when at limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.isAtLimit(user, 5)).toBe(true);
    });

    it('should return true when over limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.isAtLimit(user, 10)).toBe(true);
    });

    it('should return false when under limit', () => {
      const user = createUser(5);
      expect(maxAccountsUtils.isAtLimit(user, 4)).toBe(false);
      expect(maxAccountsUtils.isAtLimit(user, 0)).toBe(false);
    });
  });

  describe('formatMaxAccounts', () => {
    it('should format singular correctly', () => {
      expect(maxAccountsUtils.formatMaxAccounts(1)).toBe('1 account');
    });

    it('should format plural correctly', () => {
      expect(maxAccountsUtils.formatMaxAccounts(5)).toBe('5 accounts');
      expect(maxAccountsUtils.formatMaxAccounts(10)).toBe('10 accounts');
      expect(maxAccountsUtils.formatMaxAccounts(100)).toBe('100 accounts');
    });

    it('should format 0 as plural', () => {
      expect(maxAccountsUtils.formatMaxAccounts(0)).toBe('0 accounts');
    });
  });

  describe('safeGetMaxAccounts', () => {
    it('should return max accounts safely', () => {
      const user = createUser(10);
      expect(safeGetMaxAccounts(user)).toBe(10);
    });

    it('should return default on null user', () => {
      expect(safeGetMaxAccounts(null)).toBe(5);
    });

    it('should return default on undefined user', () => {
      expect(safeGetMaxAccounts(undefined)).toBe(5);
    });

    it('should handle errors gracefully', () => {
      // Create an object that will throw on property access
      const badUser = new Proxy({} as User, {
        get() {
          throw new Error('Access denied');
        },
      });

      // Should not throw, but return default
      expect(() => safeGetMaxAccounts(badUser)).not.toThrow();
      expect(safeGetMaxAccounts(badUser)).toBe(5);
    });
  });
});

describe('Integration scenarios', () => {
  it('should handle complete user lifecycle', () => {
    const user = {
      userName: 'trader1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      maxAccountsAllowed: 10,
    };

    // Start with 0 accounts
    expect(maxAccountsUtils.canCreateAccount(user, 0)).toBe(true);
    expect(maxAccountsUtils.getRemainingAccounts(user, 0)).toBe(10);
    expect(maxAccountsUtils.isNearLimit(user, 0)).toBe(false);
    expect(maxAccountsUtils.isAtLimit(user, 0)).toBe(false);

    // Add accounts up to 7 (70%)
    expect(maxAccountsUtils.canCreateAccount(user, 7)).toBe(true);
    expect(maxAccountsUtils.getRemainingAccounts(user, 7)).toBe(3);
    expect(maxAccountsUtils.isNearLimit(user, 7)).toBe(false);
    expect(maxAccountsUtils.isAtLimit(user, 7)).toBe(false);

    // Add accounts up to 8 (80% - near limit)
    expect(maxAccountsUtils.canCreateAccount(user, 8)).toBe(true);
    expect(maxAccountsUtils.getRemainingAccounts(user, 8)).toBe(2);
    expect(maxAccountsUtils.isNearLimit(user, 8)).toBe(true);
    expect(maxAccountsUtils.isAtLimit(user, 8)).toBe(false);

    // Reach limit (100%)
    expect(maxAccountsUtils.canCreateAccount(user, 10)).toBe(false);
    expect(maxAccountsUtils.getRemainingAccounts(user, 10)).toBe(0);
    expect(maxAccountsUtils.isNearLimit(user, 10)).toBe(true);
    expect(maxAccountsUtils.isAtLimit(user, 10)).toBe(true);
  });

  it('should handle restrictive limits', () => {
    const user = {
      userName: 'trader2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      maxAccountsAllowed: 2,
    };

    // With limit of 2, 1 account is already 50%
    expect(maxAccountsUtils.getUsagePercentage(user, 1)).toBe(50);
    
    // 2 accounts is 100% (near limit starts at 80%)
    expect(maxAccountsUtils.isNearLimit(user, 2)).toBe(true);
    expect(maxAccountsUtils.isAtLimit(user, 2)).toBe(true);
  });

  it('should handle premium accounts with high limits', () => {
    const user = {
      userName: 'premium1',
      firstName: 'Premium',
      lastName: 'User',
      email: 'premium@example.com',
      maxAccountsAllowed: 100,
    };

    // Even with 50 accounts, not near limit yet
    expect(maxAccountsUtils.isNearLimit(user, 50)).toBe(false);
    
    // 80 accounts is at 80% threshold
    expect(maxAccountsUtils.isNearLimit(user, 80)).toBe(true);
    
    // Can still create many more
    expect(maxAccountsUtils.getRemainingAccounts(user, 80)).toBe(20);
  });
});

