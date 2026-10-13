import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/User';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

/**
 * UserProvider - Manages user state from localStorage
 * Provides reactive access to user data across the application
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user from localStorage
   */
  const loadUser = useCallback(() => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString);
        setUserState(userData);
      } else {
        setUserState(null);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user in both state and localStorage
   */
  const setUser = useCallback((newUser: User | null) => {
    try {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUserState(newUser);
      } else {
        localStorage.removeItem('user');
        setUserState(null);
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, []);

  /**
   * Refresh user data from localStorage
   */
  const refreshUser = useCallback(() => {
    loadUser();
  }, [loadUser]);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Listen for localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadUser]);

  const value: UserContextType = {
    user,
    setUser,
    refreshUser,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Hook to use the UserContext
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// export default UserProvider;

