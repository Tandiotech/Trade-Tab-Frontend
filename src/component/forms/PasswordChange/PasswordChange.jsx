import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { http } from '../../../utils/http_request';
import getUser from '../../../utils/getUser';

// Components
import PasswordInput from './PasswordInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import PasswordRequirements from './PasswordRequirements';

// Hooks & Utils
import usePasswordStorage from './usePasswordStorage';
import usePasswordStrength from './usePasswordStrength';
import { formatLastPasswordChange, getPasswordAgeClass, generateSecurePassword } from './utils';

function PasswordChange() {
  // Form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Custom hooks
  const { lastPasswordChange, updateLastPasswordChange } = usePasswordStorage(getUser);
  const passwordStrength = usePasswordStrength(newPassword);

  useEffect(() => {
    setHasPassword(Boolean(getUser?.password));
  }, []);

  // Check if passwords match whenever either field changes
  useEffect(() => {
    if (confirmPassword || newPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true); // Reset if fields are empty
    }
  }, [newPassword, confirmPassword]);

  // Password generator function
  const handleGeneratePassword = () => {
    const generatedPassword = generateSecurePassword();

    // Set both password fields to the generated password
    setNewPassword(generatedPassword);
    setConfirmPassword(generatedPassword);

    // Show a success message
    toast.info('Secure password generated!');
  };

  // Submit the form to the server
  const handleSubmit = async e => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('The new password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    try {
      const response = await http.post('/auth/change-password', {
        userId: getUser._id,
        oldPassword: hasPassword ? oldPassword : null,
        newPassword,
      });

      if (response.data.success) {
        // Update the last password change date to now
        updateLastPasswordChange(new Date());

        toast.success('Password updated successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response.data.message || 'Failed to update password.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mt-6 w-full'>
      {/* Current Password Field (if user has password) */}
      {hasPassword && (
        <div className='flex flex-col justify-center mb-6 w-full'>
          <PasswordInput
            id='old'
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            label='Current Password'
            placeholder='Enter current password'
          />

          {/* Last Password Change Info */}
          <div className='mt-3 text-sm text-bgray-500 dark:text-darkblack-300 flex items-center flex-wrap'>
            <span className='mr-2'>Last password change:</span>
            <span className={`font-medium ${getPasswordAgeClass(lastPasswordChange)}`}>
              {formatLastPasswordChange(lastPasswordChange)}
            </span>
          </div>
        </div>
      )}

      {/* Generate Password Button */}
      <div className='w-full flex justify-end my-4'>
        <div className='border-2 border-[#00B4FF] text-[#00B4FF] flex p-2 sm:p-3 rounded-lg w-fit'>
          <button type='button' onClick={handleGeneratePassword} className='text-xs sm:text-base'>
            Generate Password
          </button>
        </div>
      </div>

      {/* New Password Field */}
      <PasswordInput
        id='new'
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        label='New password'
        placeholder='Enter new password'
        className='mb-6'
      />

      {/* Confirm Password Field */}
      <div className='relative flex flex-col mb-6'>
        <PasswordInput
          id='confirm'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          label='Confirm new password'
          placeholder='Confirm new password'
          error={!passwordsMatch && confirmPassword}
          errorMessage='Passwords do not match'
        />

        {/* Password Strength Meter & Requirements */}
        {newPassword && (
          <div
            className={`
              mt-4
              duration-1000
              ease-in-out
              transition-all
              transform
              ${newPassword ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <PasswordStrengthMeter
              score={passwordStrength.score}
              label={passwordStrength.label}
              color={passwordStrength.color}
            />

            <PasswordRequirements requirements={passwordStrength.requirements} />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          type='submit'
          className='text-sm bg-green-600 hover:bg-success-400 duration-300 text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-100'
          disabled={!passwordsMatch || newPassword.length < 6 || (newPassword && !confirmPassword)}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default PasswordChange;
