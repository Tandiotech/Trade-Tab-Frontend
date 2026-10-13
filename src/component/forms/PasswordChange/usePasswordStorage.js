import { useState, useEffect } from 'react';
import { http } from '../../../utils/http_request';

/**
 * Custom hook to manage password change date in local storage
 * @param {Object} userData - User data containing ID
 * @returns {Object} - Last password change date and update function
 */
const usePasswordStorage = userData => {
  const [lastPasswordChange, setLastPasswordChange] = useState(null);

  // Create a unique storage key for this user
  const storageKey = `user_${userData?._id}_last_password_change`;

  useEffect(() => {
    if (!userData?._id) return;

    // Try to get the date from local storage first
    const storedDate = localStorage.getItem(storageKey);

    if (storedDate) {
      // If found in localStorage, use that date
      setLastPasswordChange(new Date(storedDate));
    } else {
      // Otherwise fetch from server
      fetchLastPasswordChange();
    }
  }, [userData]);

  // Fetch the last password change date from the server
  const fetchLastPasswordChange = async () => {
    try {
      // Assuming there's an endpoint to get user details including last password change
      const response = await http.get(`/users/${userData._id}/password-info`);
      if (response.data && response.data.lastPasswordChange) {
        const changeDate = new Date(response.data.lastPasswordChange);
        setLastPasswordChange(changeDate);

        // Save to local storage
        localStorage.setItem(storageKey, changeDate.toISOString());
      }
    } catch (error) {
      console.error('Could not fetch last password change info:', error);
    }
  };

  // Update the last password change date
  const updateLastPasswordChange = (date = new Date()) => {
    setLastPasswordChange(date);
    localStorage.setItem(storageKey, date.toISOString());
  };

  return {
    lastPasswordChange,
    updateLastPasswordChange,
  };
};

export default usePasswordStorage;
