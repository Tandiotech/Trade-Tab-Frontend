/**
 * Formats the last password change date to a human-readable string
 * @param {Date|null} lastPasswordChange - Date of last password change
 * @returns {string} - Formatted string (e.g., "Today", "2 days ago", etc.)
 */
export const formatLastPasswordChange = lastPasswordChange => {
  if (!lastPasswordChange) return 'Never changed';

  const now = new Date();
  const diffTime = Math.abs(now - lastPasswordChange);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

/**
 * Determines color class for password age indicator
 * @param {Date|null} lastPasswordChange - Date of last password change
 * @returns {string} - CSS class name for color
 */
export const getPasswordAgeClass = lastPasswordChange => {
  if (!lastPasswordChange) return 'text-yellow-500'; // Never changed

  const now = new Date();
  const diffTime = Math.abs(now - lastPasswordChange);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 90) return 'text-red-500'; // Over 3 months - warning
  if (diffDays > 60) return 'text-orange-500'; // Over 2 months - caution
  return 'text-green-500'; // Recent change - good
};

/**
 * Generates a secure random password
 * @returns {string} - The generated password
 */
export const generateSecurePassword = () => {
  // Define character sets for the password
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?';

  // Combine all character sets
  const allChars = upperChars + lowerChars + numbers + specialChars;

  // Generate a random password of length 12
  let generatedPassword = '';

  // Ensure at least one character from each set
  generatedPassword += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
  generatedPassword += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
  generatedPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
  generatedPassword += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

  // Fill the rest of the password with random characters
  for (let i = 0; i < 8; i++) {
    generatedPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password
  generatedPassword = generatedPassword
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return generatedPassword;
};
