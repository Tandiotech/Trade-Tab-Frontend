import { User } from '@/types/User';

/**
 * Legacy utility to get user from localStorage
 * Note: For reactive user state, use useUser() hook from UserContext instead
 * This is kept for backward compatibility with existing code
 */
const getUser = (() => {
  let cachedUser: Partial<User> = {};

  const loadUser = (): Partial<User> => {
    try {
      const userString = localStorage.getItem('user');
      const currentUser = userString ? JSON.parse(userString) : {};
      if (currentUser?.userName !== cachedUser?.userName) {
        cachedUser = currentUser;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      cachedUser = {}; // Reset cached user if parsing fails
    }
    return cachedUser;
  };

  return loadUser();
})();

/**
 * Get user data from localStorage with type safety
 * @returns User object or null if not found
 */
const getUserTyped = (): User | null => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export default getUser;