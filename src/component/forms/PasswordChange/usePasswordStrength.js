import { useState, useEffect } from 'react';

/**
 * Custom hook to evaluate password strength
 * @param {string} password - The password to evaluate
 * @returns {Object} - Password strength data
 */
const usePasswordStrength = password => {
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, // 0-4 where 0 is weakest, 4 is strongest
    label: '', // Text label (Weak, Medium, Strong, etc.)
    color: '', // Color for the strength bar
    requirements: {
      length: false, // At least 8 characters
      numbers: false, // Has numbers
      uppercase: false, // Has uppercase letters
      lowercase: false, // Has lowercase letters
      special: false, // Has special characters
    },
  });

  useEffect(() => {
    if (!password) {
      // Reset strength when password is empty
      setPasswordStrength({
        score: 0,
        label: '',
        color: '',
        requirements: {
          length: false,
          numbers: false,
          uppercase: false,
          lowercase: false,
          special: false,
        },
      });
      return;
    }

    // Check various requirements
    const requirements = {
      length: password.length >= 8,
      numbers: /[0-9]/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    // Count how many requirements are met
    const meetsRequirements = Object.values(requirements).filter(Boolean).length;

    // Set score based on requirements met and password length
    let score = 0;
    if (meetsRequirements >= 4)
      score = 4; // Strong
    else if (meetsRequirements >= 3)
      score = 3; // Good
    else if (meetsRequirements >= 2)
      score = 2; // Medium
    else if (meetsRequirements >= 1) score = 1; // Weak

    // Adjust score down if password is too short, regardless of other criteria
    if (password.length < 6) score = Math.min(score, 1);
    if (password.length < 4) score = 0;

    // Define label and color based on score
    const strengthLabels = ['Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    const strengthColors = ['#FF4136', '#FF851B', '#FFDC00', '#2ECC40', '#3D9970'];

    setPasswordStrength({
      score,
      label: strengthLabels[score],
      color: strengthColors[score],
      requirements,
    });
  }, [password]);

  return passwordStrength;
};

export default usePasswordStrength;
